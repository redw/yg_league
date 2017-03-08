/**
 * 战斗角色
 * Created by hh on 2017/2/7.
 */
class FightRole extends egret.DisplayObjectContainer {
    // 角色在角色层中的排序
    public zIndex:number;
    // 角色的在战斗容器中的位置 边*10+index
    private _pos:number;
    // 角色所在的容器
    private fightContainer:FightContainer = null;

    // 攻击或伤害时使用的技能
    private curSkill:SkillConfig = null;
    // 战斗信息
    private reportItem:FightReportItem = null;
    // 目标对象
    private targets:{id:number, pos:number}[] = null;
    // 正在播放死亡效果
    private isPlayingDie:boolean = false;
    // 是否角色正在播放额外特效
    private isPlayingExtraEff:boolean = false;

    // 角色的配置文件
    private _config:RoleConfig;
    // buff动作
    private buffAction:BuffAction;
    // 技能动作
    private skillAction:SkillAction;
    // 血条
    private lifeBar:RoleHPBar = null;
    // 角色光环
    private haloEff:MCEff;
    // 角色显示对象
    private body:RoleBody = null;
    // 影子
    private shadowBitmap:egret.Bitmap;
    // 作用于身体脚下的buff容器
    private buffContainer0:egret.DisplayObjectContainer = null;
    // 作用于身体中间的buff容器
    private buffContainer1:egret.DisplayObjectContainer = null;
    // 作用于身体头部的buff容器
    private buffContainer2:egret.DisplayObjectContainer = null;
    // 除buff外的效果容器
    private effContainer:egret.DisplayObjectContainer = null;

    public constructor(fightContainer:FightContainer, roleData:{id:number, pos:number}) {
        super();
        this.shadowBitmap = new egret.Bitmap(RES.getRes("role_shadow_png"));
        this.addChild(this.shadowBitmap);

        this.buffContainer0 = new egret.DisplayObjectContainer();
        this.addChild(this.buffContainer0);

        let config:RoleConfig = Config.HeroData[roleData.id] || Config.EnemyData[roleData.id];
        if (config && config.resource && config.resource.indexOf(",") > 0) {
            let resourceArr = config.resource.split(",");
            this.haloEff = new MCEff(resourceArr[1], false);
            let part = +resourceArr[2] || 1;
            this.haloEff.y = part * config.modle_height * -0.5;
            this.haloEff.x = 0;
            this.addChild(this.haloEff);
            this.haloEff.stop();
        }

        this.body = new RoleBody(roleData.id);
        this.addChild(this.body);

        this.buffContainer1 = new egret.DisplayObjectContainer();
        this.addChild(this.buffContainer1);

        this.buffContainer2 = new egret.DisplayObjectContainer();
        this.addChild(this.buffContainer2);

        this.effContainer = new egret.DisplayObjectContainer();
        this.addChild(this.effContainer);

        this.lifeBar = new RoleHPBar(fight.needFlipped((roleData.pos)));
        this.addChild(this.lifeBar);

        this.skillAction = new SkillAction(this);
        this.buffAction = new BuffAction(this);

        this.active(fightContainer, roleData);
    }

    public active(fightContainer:FightContainer, roleData:{id:number, pos:number}) {
        this.visible = true;
        this.fightContainer = fightContainer;
        this._pos = roleData.pos;
        this._config = Config.HeroData[roleData.id] || Config.EnemyData[roleData.id];
        this.updateRoleUI();
        this.idle();
    }

    private updateRoleUI() {
        this.body.flipped = fight.needFlipped(this.pos);
        this.body.reset();

        this.skillAction.reset();
        this.buffAction.reset();
        this.isPlayingDie = false;
        this.isPlayingExtraEff = false;

        let point = this.initPoint;
        this.x = point.x;
        this.y = point.y;

        let shadowScaleSize = this.config.modle_height / 100;
        this.shadowBitmap.scaleX = this.shadowBitmap.scaleY = shadowScaleSize;
        this.shadowBitmap.y = fight.ROLE_SHADOW_OFF * shadowScaleSize;
        this.shadowBitmap.x = this.shadowBitmap.width * -0.5 * shadowScaleSize;

        if (this.haloEff) {
            this.haloEff.start();
        }

        this.buffContainer1.y = -0.5 * this.config.modle_height / 100;
        this.buffContainer2.y = -this.config.modle_height / 100;

        let hp_width:number = 62;
        let hp_height:number = 8;
        this.lifeBar.x = hp_width * -0.5;
        this.lifeBar.y = -(this.config.modle_height) - hp_height - 2;
        this.lifeBar.flipped = fight.needFlipped(this.pos);
        this.lifeBar.reset();
    }

    /**
     * 攻击目标
     * @param data  战斗报告
     * @param delay 延迟
     */
    public fight(data:FightReportItem, delay:number) {
        egret.setTimeout(()=> {
            this.reportItem = data;
            let items = data.target;
            this.updateRoleHP(BigNum.add(data.hp, data.damage || 0), data.maxhp);
            this.buffAction.addBuff(data);
            this.buffAction.checkBuff(data.buff);
            this.body.reset();
            this.targets = [];
            for (let i = 0; i < items.length; i++) {
                let role = this.getRoleByPos(items[i].pos);
                if (role)
                    role.buffAction.checkBuff(items[i].buff);
                let id = items[i].id;
                let pos = +items[i].pos;
                this.targets.push({id: id, pos: pos});
            }
            let skillId = this.reportItem.skillId;
            this.curSkill = Config.SkillData[skillId];
            fight.recordLog(`step:${this.reportItem.index},id:${this.reportItem.id},pos:${this.reportItem.pos},action:${this.curSkill.action_type}`, fight.LOG_FIGHT_INFO);
            this.skillAction.attack(this.curSkill, this.targets, this.reportItem.buff, this.reportItem.damage);
        }, this, delay);
    }

    /**
     * 射击目标
     */
    public fireTargets(targets:{id:number, pos:number}[], cur:number = 1, total:number = 1) {
        let len = this.targets.length;
        let damageEffSource = this.curSkill.scource_effect;
        let index:number = 0;
        let offPoint:any = this.curSkill.shoot_point || [0, 0];
        let scaleX = this.getScaleX();
        let initX = this.x - scaleX * (Number(offPoint[0]) || 0);
        let initY = this.y - this.config.modle_height * 0.5 + (Number(offPoint[1]) || 0);
        for (let i = 0; i < len; i++) {
            let target = targets[i];
            let point = this.initPoint;
            let tox = point.x;
            let toy = point.y - fight.getRoleHeight(target.id) * 0.5;
            let scaleX = fight.needFlipped(target.pos) ? -1 : 1;
            let rotate = Math.atan2(toy - initY, tox - initX) * 180 / Math.PI + ((scaleX == 1) ? 180 : 0);
            let damageEff = new MCEff(damageEffSource, false, scaleX);
            damageEff.rotation = rotate;
            damageEff.x = initX;
            damageEff.y = initY;
            this.fightContainer.showDamageEff(damageEff);
            let time = this.curSkill.missle_time * 1000 * MathUtil.pointDistance(new egret.Point(tox, toy), new egret.Point(initX, initY)) / 100;
            egret.Tween.get(damageEff).to({x: tox, y: toy}, time, fight.bulletEase(time)).call(
                () => {
                    damageEff.dispose();
                    index++;
                    this.isPlayingExtraEff = index < len;
                    this.startDamage(index, len, target, cur / total);
                    if (this.curSkill) {
                        this.fightContainer.startShake(this.curSkill.shake_type);
                    }
                }, this
            );
        }
    }

    /**
     * 加血
     */
    public addHP() {
        if (this.curSkill) {
            let total = this.targets.length;
            if (this.curSkill.target_effect) {
                let current = 0;
                let total = this.targets.length;
                this.isPlayingExtraEff = true;
                for (let i = 0; i < total; i++) {
                    let target = this.targets[i];
                    let fightRole = this.fightContainer.getRoleByPos(target.pos);
                    if (fightRole) {
                        let eff = new MCEff(this.curSkill.target_effect);
                        eff.registerBack(0, (index) => {
                            current++;
                            this.isPlayingExtraEff = current < total;
                            if (this.reportItem) {
                                let off = BigNum.sub(this.reportItem.target[index].hp, fightRole.curHP);
                                if (BigNum.greater(off, 0)) {
                                    fightRole.flyTxt(MathUtil.easyNumber(off), fight.FONT_ADD_HP);
                                }
                                fightRole.updateRoleHP(this.reportItem.target[i].hp, this.reportItem.target[i].maxhp);
                            } else {
                                fight.recordLog(`加血存在问题`, fight.LOG_FIGHT_WARN);
                            }
                            fight.recordLog(`显示加血效果${current}-${total}`, fight.LOG_FIGHT_INFO);
                        }, this, i);
                        fightRole.addChild(eff);
                    } else {
                        current++;
                        this.isPlayingExtraEff = current < total;
                    }
                }
            } else {
                fight.recordLog(`${this.curSkill.id}没配置target_effect`, fight.LOG_FIGHT_WARN);
            }
        } else {
            fight.recordLog(`运行showAddHP时curSkill为null`, fight.LOG_FIGHT_WARN);
        }
    }

    public updateRoleHP(cur:string, max:string) {
        this.maxHP = max;
        this.curHP = cur;
        this.lifeBar.update(this.curHP, this.maxHP);
        this.dispatchEventWith("role_hp_change", true);
    }

    public updateTargets() {
        if (this.reportItem) {
            let len = this.targets ? this.targets.length : 0;
            for (let i = 0; i < len; i++) {
                let role = this.fightContainer.getRoleByPos(this.targets[i].pos);
                let hitInfo = this.reportItem.target[i];
                if (role) {
                    role.updateRoleHP(hitInfo.hp, hitInfo.maxhp);
                }
            }
        }
    }

    public addEff(dis:egret.DisplayObject, part:number = 1, off:egret.Point = null) {
        let position = new egret.Point(0, (0 - part) * this.config.modle_height * 0.5);
        if (off) {
            position.x += off.x;
            position.y += off.y;
        }
        dis.x = position.x;
        dis.y = position.y;
        this.addChild(dis);
    }

    public addAreaEff(mc:egret.MovieClip, flip:boolean) {

    }

    public addContainerEff(mc:egret.MovieClip, flip:boolean) {

    }

    public flyTxt(content:string, fontName:string, scale:number=1){
        this.fightContainer.flyTxt({
            str: content,
            x: this.x,
            y: this.y + this.config.modle_height * -1,
            scale:scale
        }, fontName);
    }

    public showSkillName(id:number) {
        let path = `skillname_${id}`;
        this.fightContainer.showSkillName(path);
    }

    public showFreeSkillEff(eff:egret.DisplayObject, mode:Boolean){
        eff.y = (this.config.modle_height) * -0.5;
        // this.fightContainer.showFreeSkillEff(this, eff, needMode);
    }

    public startDamage(index:number = 1, total:number = 1, role:any = null, ratio:number = 1) {
        if (this.targets.length > 0) {
            fight.playSound(this.curSkill.target_sound);
        }
        for (let i = 0; i < this.targets.length; i++) {
            let target = this.targets[i];
            let fightRole = this.getRoleByPos(target.pos);
            if (fightRole) {
                let point = fightRole.initPoint;
                let model_height = fightRole.config.modle_height;
                if (!role || (target.id == role.id && target.pos == role.pos)) {
                    let hitInfo = this.reportItem.target[i];
                    let damage = BigNum.mul(hitInfo.damage, 1 / total);
                    let damageNum = MathUtil.easyNumber(damage);
                    if (this.curSkill.target_effect_normal) {
                        let eff = new MCEff("hit_normal");
                        eff.y = point.y + (model_height) * -0.5;
                        eff.x = point.x;
                        eff.scaleX = this.getScaleX();
                        this.fightContainer.showDamageEff(eff);
                    }
                    if (this.curSkill.target_effect) {
                        let eff = new MCEff(this.curSkill.target_effect);
                        eff.y = point.y + (model_height) * -0.5;
                        eff.x = point.x;
                        eff.scaleX = this.getScaleX();
                        this.fightContainer.showDamageEff(eff);
                    }
                    if (hitInfo.dodge) {
                        fightRole.flyTxt("闪避", fight.FONT_SYSTEM);
                    } else {
                        if (hitInfo.block) {
                            fightRole.block();
                        } else {
                            fightRole.hit();
                        }
                        if (parseFloat(damageNum) > 0) {
                            if (this.curSkill.damage_type == "physical") {
                                fightRole.flyTxt(damageNum, fight.FONT_PHYSICAL_DAMAGE, this.reportItem.cri ? 1.5 : 1);
                            } else {
                                fightRole.flyTxt(damageNum, fight.FONT_MAGICAL_DAMAGE, this.reportItem.cri ? 1.5 : 1);
                            }
                        } else {
                            if (FightRoleVO.isInvincible(hitInfo.buff)) {
                                fightRole.flyTxt("免伤", fight.FONT_SYSTEM);
                            } else if (FightRoleVO.freeMacAtk(hitInfo.buff)) {
                                fightRole.flyTxt("魔免", fight.FONT_SYSTEM);
                            } else if (FightRoleVO.freePhyAtk(hitInfo.buff)) {
                                fightRole.flyTxt("物免", fight.FONT_SYSTEM);
                            } else {
                                if (this.curSkill.damage_type == "physical") {
                                    damage = BigNum.max(BigNum.div(this.reportItem.phyAtk, 1000), 1);
                                    damageNum = MathUtil.easyNumber(damage);
                                    fightRole.flyTxt(damageNum, fight.FONT_PHYSICAL_DAMAGE, this.reportItem.cri ? 1.5 : 1);
                                } else {
                                    damage = BigNum.max(BigNum.div(this.reportItem.magAtk, 1000), 1);
                                    damageNum = MathUtil.easyNumber(damage);
                                    fightRole.flyTxt(damageNum, fight.FONT_MAGICAL_DAMAGE, this.reportItem.cri ? 1.5 : 1);
                                }
                            }
                        }
                    }
                    if (index >= total) {
                        fightRole.updateRoleHP(hitInfo.hp, hitInfo.maxhp);
                    } else {
                        fightRole.updateRoleHP(BigNum.add(hitInfo.hp, BigNum.mul((total - index) / total * ratio, damage)), hitInfo.maxhp);
                    }
                }
            }
        }
    }

    public onTick() {
        if (this.curSkill) {
            this.checkNextStep();
        }
        this.buffAction.checkBuff();
        this.checkDie();
    }

    private checkDie() {
        if (this.parent && !this.isPlayingDie && this.curHP) {
            if (BigNum.greater(fight.DIE_HP, this.curHP)) {
                this.isPlayingDie = true;
                let dieEff = new RoleDieEff();
                this.lifeBar.setProgress(0);
                dieEff.scaleX = this.side == FightSideEnum.RIGHT_SIDE ? -1 : 1;
                dieEff.x = this.x;
                dieEff.y = this.y;
                this.fightContainer.showDamageEff(dieEff);
                if (this.curSkill) {
                    this.visible = false;
                } else {
                    this.dispatchEventWith("role_die", true, this);
                }
            }
        }
    }

    private checkNextStep() {
        if (!FightRoleVO.canAction(this.reportItem.buff)) {
            if (this.waiting) {
                this.nextStep();
            }
        } else {
            if (this.targets && this.targets.length > 0) {
                let oneStepComplete:boolean = this.waiting && this.skillAction.isActionComplete && !this.isPlayingExtraEff;
                for (let i = 0; i < this.targets.length; i++) {
                    let fightRole = this.fightContainer.getRoleByPos(this.targets[i].pos);
                    oneStepComplete = (oneStepComplete && (!fightRole || (fightRole.waiting)));
                }
                if (oneStepComplete) {
                    this.nextStep();
                }
            }
        }
    }

    private nextStep() {
        fight.recordLog(`第${this.reportItem.index}步完成`, fight.LOG_FIGHT_INFO);
        this.updateRoleHP(this.reportItem.hp, this.reportItem.maxhp);
        this.updateTargets();

        let round = this.reportItem.round;
        this.curSkill = null;
        this.reportItem = null;
        this.targets = [];
        this.dispatchEventWith("role_one_step_complete", true, round);
    }

    public dispose() {
        while (this.effContainer.numChildren) {
            let mcEff:any = this.effContainer.removeChildAt(0);
            if ("dispose" in mcEff) {
                mcEff.dispose();
            }
            mcEff = null;
        }
        for (let i = 0; i < 3; i++) {
            let container = this["buffContainer" + i];
            while (container.numChildren) {
                let mcEff:MCEff = container.removeChildAt(0);
                if (mcEff && "dispose" in mcEff) {
                    mcEff.dispose();
                }
                mcEff = null;
            }
        }
        this.lifeBar.reset();
        this.body.reset();
        if (this.haloEff) {
            this.haloEff.stop();
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.visible = true;
        this.fightContainer = null;
        egret.Tween.removeTweens(this);
        FightRoleFactory.freeRole(this);
    }

    // ------------------------------------------角色行为方法--------------------------------------------
    public idle() {
        this.body.idle();
    }

    public attack(skill:SkillConfig) {
        this.body.attack(skill);
    }

    public hit() {
        this.body.hit();
    }

    public block() {
        this.body.block();
    }

    //------------------------------------------------------------------------------------------------------
    public getScaleX() {
        return fight.needFlipped(this.pos) ? -1 : 1;
    }

    private getRoleByPos(info:any) {
        let pos:number;
        if (typeof info == "number" || typeof info == "string") {
            pos = Number(info);
        } else if ("pos" in info) {
            pos = Number(info["pos"]);
        }
        return this.fightContainer.getRoleByPos(pos);
    }

    public get id() {
        return this._config.id;
    }

    public get config() {
        return this._config;
    }

    public get pos() {
        return this._pos;
    }

    public get side() {
        return Math.floor(this.pos / 10);
    }

    public get posIndex() {
        return this.pos % 10;
    }

    public get flipped() {
        return Math.floor(this.pos / 10) == FightSideEnum.LEFT_SIDE;
    }

    // 角色初始位置
    public get initPoint() {
        return fight.getRoleInitPoint(this.pos);
    }

    public get frameRate() {
        return this.body.frameRate;
    }

    public get waiting() {
        return this.body.waiting
    }

    private _curHP:string;
    public get curHP() {
        return this._curHP;
    }

    public set curHP(value:string) {
        this._curHP = value;
    }

    private _maxHP:string;
    public get maxHP() {
        return this._maxHP;
    }

    public set maxHP(value:string) {
        this._maxHP = value;
    }
}
