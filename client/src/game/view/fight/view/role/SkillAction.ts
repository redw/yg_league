/**
 * 处理技能攻击行为,包括被眩晕和没有target等
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
     * 预攻击目标
     * @param skill     技能信息
     * @param targets   攻击目标
     * @param buffs     所有buff
     * @param damage    自身所受伤害
     */
    public preAttack(skill:SkillConfig, targets:{id:number, pos:number}[], buffs:number[], damage:string){
        if (this._isActionComplete) {
            this._isActionComplete = false;
            console.error("攻击时,ActionComplete应该为false");
        }
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
            this.postAttackComplete();
        } else {
            if (fight.needMoveAttack(action)) {
                this.moveAndAttack();
            } else {
                this.startAttackAction();
            }
        }
    }

    /**
     * 攻击目标
     * @param skill     技能信息
     * @param targets   攻击目标
     * @param buffs     所有buff
     * @param damage    自身所受伤害
     */
    public attack(skill:SkillConfig, targets:{id:number, pos:number}[], buffs:number[], damage:string) {
        if (this._isActionComplete) {
            this._isActionComplete = false;
            console.error("攻击时,ActionComplete应该为false");
        }

        this.curSkill = skill;
        this.targets = targets;
        this.buffs = buffs;
        this.damage = damage;

        let action = this.curSkill.action_type;

    }



    // 移动和攻击
    private moveAndAttack() {
        this.fightRole.dispatchEventWith("start_move", true, {x:this.fightRole.x, y:this.fightRole.y});
        let point = fight.getNearFightPoint(this.fightRole.pos, this.targets, this.curSkill);
        let tween = egret.Tween.get(this.fightRole);
        tween.to({x: point.x, y: point.y}, fight.MOVE_TIME);
        tween.call(this.startAttackAction, this);
    }

    // 开始攻击
    private startAttackAction() {
        this.isAttackComplete = false;
        this.fightRole.addEventListener("attack_complete", this.onComplete, this, true);
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
    private onComplete(e:egret.Event) {
        this.isAttackComplete = true;
        this.fightRole.removeEventListener("attack_complete", this.onComplete, this, true);
        this.fightRole.removeEventListener("enter_frame", this.onEnterFrame, this, true);
        if (fight.needRetreat(this.curSkill.action_type)) {
            let tween = egret.Tween.get(this.fightRole);
            let point = fight.getRoleInitPoint(this.fightRole.pos);
            tween.to({x: point.x, y: point.y}, fight.RETREAT_TIME);
            tween.call(() => {
                this.actionComplete()
            }, this);
        } else if (!this.curSkill.scource_effect) {
            this.actionComplete();
        } else if (!this.extraEffCount) {
            this.actionComplete();
        }
    }

    private postAttackComplete(){

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
            if (fight.isMCResourceLoaded(this.curSkill.scource_effect)) {
                if (this.curSkill.action_type == fight.ATTACK_ACTION_MISSLE) {
                    this.fightRole.fireTargets(this.targets, cur, total);
                } else {
                    this.extraEffCount++;
                    let mc = fight.createMovieClip(this.curSkill.scource_effect);
                    if (!this.curSkill.effect_damage_frame || this.curSkill.effect_damage_frame == 1) {
                        this.fightRole.startDamage(1, 1);
                    } else {
                        mc.addEventListener(egret.MovieClipEvent.ENTER_FRAME, this.onEnterFrame1, this);
                    }
                    mc.addEventListener(egret.MovieClipEvent.COMPLETE, this.onComplete1, this);
                    mc.gotoAndPlay(1, 1);

                    if (this.curSkill.action_type == fight.ATTACK_ACTION_BOMB) {
                        this.fightRole.addEff(mc);
                    }

                    if (this.curSkill.action_type == fight.ATTACK_ACTION_AREA) {
                        let offPoint:any = (!!this.curSkill.area_effect_point) ? this.curSkill.area_effect_point.split(","):[0, 0];
                        let side = this.fightRole.side;
                        mc.x = fight.AREA_POS[side - 1].x + (Number(offPoint[0]) || 0);
                        mc.y = fight.AREA_POS[side - 1].y + (Number(offPoint[1]) || 0);
                        this.fightRole.addAreaEff(mc, fight.needFlipped(this.fightRole.pos));
                    }

                    if (this.curSkill.action_type == fight.ATTACK_JUMP_ATTACK2) {
                        mc.x = this.fightRole.x;
                        mc.y = this.fightRole.y;
                        this.fightRole.addContainerEff(mc, fight.needFlipped(this.fightRole.pos));
                    }
                }
            }
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
            if (!this.isTriggerExtraEff && fight.checkFrameEquip(frame, +frames[len - 1]), 1) {
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

    private skillAttackComplete(){
        if (BigNum.greater(this.reportItem.damage || 0, 0)) {
            this.updateRoleHP(this.reportItem.hp, this.reportItem.maxhp);
            this.hit();
        } else {
            this.updateRoleHP(this.reportItem.hp, this.reportItem.maxhp);
            this.idle();
        }
    }

    private actionComplete(){
        this._isActionComplete = true;
        this.fightRole.dispatchEventWith("skill_action_complete", true);
    }

    public reset(){
        this.isTriggerDamage = false;
        this.isTriggerJump = false;
        this._isActionComplete = false;
        this.isAttackComplete = false;
        this.targets = null;
        this.curSkill = null;
    }

    public dispose(){
        this.fightRole = null;
    }
}