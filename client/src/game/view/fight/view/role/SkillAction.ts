/**
 * 处理角色的攻击行为,包括被眩晕和没有target等
 * Created by hh on 17/2/20.
 */
class SkillAction {
    private fightRole:FightRole;

    private curSkill:SkillConfig;
    private buffs:number[];
    private damage:string;
    private targets:{id:number, pos:number}[];

    private _isActionComplete:boolean = false;
    // 是否攻击完成
    private isAttackComplete:boolean = false;
    // 额外效果的数量
    private extraEffCount:number = 0;

    // 是否触发过跳跃帧(用于校证)
    private isTriggerJump:boolean = false;
    // 是否触发过伤害帧(用于校证)
    private isTriggerDamage:boolean = false;
    // 是否触发过额外效果(用于校证)
    private isTriggerExtraEff:boolean = false;

    /**
     * 构造函数
     */
    public constructor(fightRole:FightRole) {
        this.fightRole = fightRole;
    }

    /**
     * 攻击目标
     * @param skill     技能信息
     * @param targets   攻击目标
     * @param buffs     所有buff
     * @param damage    自身所受伤害
     */
    public attack(skill:SkillConfig, targets:{id:number, pos:number}[], buffs:number[], damage:string){
        this.reset();
        this.curSkill = skill;
        this.targets = targets;
        this.buffs = buffs;
        this.damage = damage;
        fight.verifyActiveSkill(this.curSkill);

        let vertigo = false;
        let len = buffs ? buffs.length : 0;
        for (let i = 0; i < len; i++) {
            let buffConfig:BuffConfig = Config.BuffData[buffs[i]];
            if (buffConfig && buffConfig.effect == BuffTypeEnum.VERTIGO) {
                vertigo = true;
                break;
            }
        }

        if (vertigo) {
            fight.recordLog(`id:${this.fightRole.id},pos:${this.fightRole.pos},action:${this.curSkill.action_type},state:vertigo`, fight.LOG_FIGHT_INFO);
            this.postAttackComplete();
        } else if (this.targets.length == 0) {
            fight.recordLog(`id:${this.fightRole.id},pos:${this.fightRole.pos},action:${this.curSkill.action_type},state:no_target`, fight.LOG_FIGHT_INFO);
            this.actionComplete();
        } else {
            this.fightRole.showSkillName(this.curSkill.skill_name);
            let showInfo = (this.curSkill.skill_free_effect || "").split(",");
            let needMode = !!showInfo[1];
            let source = showInfo[0];
            if (source && source != "0") {
                let eff = new MCEff(source);
                eff.registerBack(0, this.doAction, this, null);
                this.fightRole.showFreeSkillEff(eff, needMode);
            } else {
                this.doAction();
            }
        }
    }

    private doAction(){
        let action = this.curSkill.action_type;
        if (fight.needMoveAttack(action)) {
            this.moveAndAttack();
        } else {
            this.playAttackAction();
        }
    }

    // 移动和攻击
    private moveAndAttack() {
        this.fightRole.dispatchEventWith("start_move", true, {x:this.fightRole.x, y:this.fightRole.y, scaleX:this.fightRole.getScaleX()});
        let point = fight.getNearFightPoint(this.fightRole.pos, this.targets, this.curSkill);
        let tween = egret.Tween.get(this.fightRole);
        tween.to({x: point.x, y: point.y}, fight.MOVE_TIME);
        tween.call(this.playAttackAction, this);
    }

    private playAttackAction() {
        this.fightRole.addEventListener("attack_complete", this.onComplete, this, true);
        this.fightRole.addEventListener("attack_event", this.onAttackEvent, this, true);
        this.fightRole.addEventListener("enter_frame", this.onEnterFrame, this, true);
        this.fightRole.attack(this.curSkill);
    }

    // 检测jump和伤害触发帧
    private onEnterFrame(e:egret.Event) {
        let frame = e.data;
        if (frame == this.curSkill.scource_sound_frame) {
            fight.playSound(this.curSkill.scource_sound);
        }

        if (this.curSkill.jump_frame > 0 && fight.checkFrameEquip(frame, this.curSkill.jump_frame, 1) && !this.isTriggerJump) {
            this.isTriggerJump = true;
            this.triggerJump();
        }

        // 如果配多帧伤害,尽量保证最后一帧能触发
        let frames = String(this.curSkill.damage_frame).split(",");
        let len = frames.length;
        for (let i = 0; i < len; i++) {
            if (fight.checkFrameEquip(frame, +frames[i])) {
                if (i == len - 1) {
                    this.isTriggerDamage = true;
                }
                this.doDamageAction(i + 1, len);
                break;
            }
        }
        if (!this.isTriggerDamage && fight.checkFrameEquip(frame, +frames[len - 1], 1)) {
            this.isTriggerDamage = true;
            this.doDamageAction(len, len);
        }
    }

    // 攻击完成
    private onComplete() {
        this.isAttackComplete = true;
        this.fightRole.removeEventListener("attack_complete", this.onComplete, this, true);
        this.fightRole.removeEventListener("attack_event", this.onAttackEvent, this, true);
        this.fightRole.removeEventListener("enter_frame", this.onEnterFrame, this, true);
        if (fight.needRetreat(this.curSkill.action_type)) {
            let tween = egret.Tween.get(this.fightRole);
            let point = fight.getRoleInitPoint(this.fightRole.pos);
            tween.to({x: point.x, y: point.y}, fight.RETREAT_TIME);
            tween.call(() => {
                this.postAttackComplete()
            }, this);
        } else {
            this.postAttackComplete();
        }
    }

    // 攻击事件
    private onAttackEvent(e:egret.Event) {
        let eventName:string = e.data;
        if (eventName == "jump") {
            this.triggerJump();
        }
        if (eventName == "damage") {
            this.doDamageAction(1, 1);
        } else if (eventName.indexOf("damage") >= 0) {
            let total = eventName.substr(6, 1);
            let cur = eventName.substr(8, 1);
            this.doDamageAction(+cur, +total);
        }
        if (eventName == "weapon") {
            // 处理weapon
        }
    }

    private postAttackComplete(){
        if (BigNum.greater(this.damage || 0, 1)) {
            this.fightRole.hit();
        }
        this.checkComplete();
    }

    // 触发跳跃
    private triggerJump() {
        this.fightRole.dispatchEventWith("start_move");
        let point = new egret.Point();
        if (this.curSkill.action_type == fight.ATTACK_ACTION_JUMP_AREA) {
            let offPoint:any = (!!this.curSkill.area_effect_point) ? this.curSkill.area_effect_point.split(","):[0, 0];
            let side = this.fightRole.side;
            point.x = fight.AREA_POS[side - 1].x + (Number(offPoint[0]) || 0);
            point.y = fight.AREA_POS[side - 1].y + (Number(offPoint[1]) || 0);
        } else {
            point = fight.getNearFightPoint(this.fightRole.pos, this.targets, this.curSkill);
        }
        let tween = egret.Tween.get(this.fightRole);
        let frameCount = +this.curSkill.damage_frame - this.curSkill.jump_frame;
        let frameRate = this.fightRole.frameRate;
        let time = frameCount / frameRate * 1000;
        tween.to({x: point.x, y: point.y}, time);
    }

    // 处理伤害行为
    private doDamageAction(cur:number, total:number) {
        if (this.curSkill.scource_effect) {
            // if (fight.isMCResourceLoaded(this.curSkill.scource_effect)) {
            //     if (this.curSkill.action_type == fight.ATTACK_ACTION_MISSLE) {
            //         this.fightRole.showBulletEff(this.targets, cur, total);
            //     } else if (this.curSkill.action_type == fight.ATTACK_ACTION_BOMB) {
            //         this.fightRole.showBombEff(this.targets, cur, total);
            //     } else if (this.curSkill.action_type == fight.ATTACK_ACTION_AREA) {
            //         this.fightRole.showAreaEff(this.targets, cur, total);
            //     }
            //     else {
            //
            //     }
            // }
        } else {
            this.fightRole.startDamage(cur, total);
        }
    }

    private onEnterFrame1(e:egret.MovieClipEvent) {
        let mc:egret.MovieClip = e.target;
        let frame = mc.currentFrame;
        if (this.curSkill.effect_damage_frame) {
            let frames = String(this.curSkill.effect_damage_frame).split(",");
            let len = frames.length;
            for (let i = 0; i < len; i++) {
                if (fight.checkFrameEquip(frame, +frames[i])) {
                    if (i == len - 1) {
                        this.isTriggerExtraEff = true;
                    }
                    this.fightRole.startDamage(i + 1, len);
                    break;
                }
            }
            if (!this.isTriggerExtraEff && fight.checkFrameEquip(frame, +frames[len - 1], 1)) {
                this.isTriggerExtraEff = true;
                this.fightRole.startDamage(len, len);
            }
        }
    }

    private onComplete1(e:egret.MovieClipEvent) {
        let mc = e.target;
        mc.removeEventListener(egret.MovieClipEvent.ENTER_FRAME, this.onEnterFrame1, this);
        mc.removeEventListener(egret.MovieClipEvent.COMPLETE, this.onComplete1, this);
        this.extraEffCount--;
        this.checkComplete();
    }

    public get isActionComplete(){
        return this._isActionComplete;
    }

    private checkComplete(){
        if (this.isAttackComplete && (this.extraEffCount <= 0)) {
            this.actionComplete();
        }
    }

    private actionComplete(){
        this._isActionComplete = true;
        this.fightRole.dispatchEventWith("skill_action_complete", true);
    }

    public reset(){
        this.isTriggerDamage = false;
        this.isTriggerJump = false;
        this.isTriggerExtraEff = false;
        this._isActionComplete = false;
        this.targets = null;
        this.curSkill = null;
        this.buffs = null;
        this.damage = "0";
        this.extraEffCount = 0;
    }

    public dispose(){
        this.reset();
        this.fightRole = null;
    }
}