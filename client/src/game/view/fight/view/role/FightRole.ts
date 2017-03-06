/**
 * 战斗角色
 * Created by hh on 2017/2/7.
 */
class FightRole extends egret.DisplayObjectContainer {
    // 角色的zIndex,处理角色在角色容器中的顺序
    private _zIndex:number = 0;
    private firedHitMap:any = {};
    private firedBulletCount = 0;

    // buff效果map
    private buffEffMap:any = {};
    private buffIdArr:number[] = [];
    private oldBuffIdArr:number[] = [];

    // 攻击或伤害时使用的技能
    private curSkill:SkillConfig = null;
    // 战斗信息
    private reportItem:FightReportItem = null;
    // 技能动作
    private skillAction:SkillAction;
    // 目标对象
    private targets:{id:number, pos:number}[] = null;

    // 正在播放死亡效果
    private isPlayingDie:boolean = false;
    // 是否角色正在播放额外特效
    private isPlayingExtraEff:boolean = false;

    private _config:RoleConfig;
    private _pos:number;
    // 角色所在的容器
    private fightContainer:FightContainer = null;

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

        this.active(fightContainer, roleData);
    }

    public active(fightContainer:FightContainer, roleData:{id:number, pos:number}) {
        this.fightContainer = fightContainer;
        this._pos = roleData.pos;
        this._config = Config.HeroData[roleData.id] || Config.EnemyData[roleData.id];
        this.updateRoleUI();
        this.idle();
    }

    private updateRoleUI() {
        this.body.reset();
        this.skillAction.reset();
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

        this.body.flipped = fight.needFlipped(this.pos);
        this.body.active();

        this.buffContainer1.y = -0.5 * this.config.modle_height / 100;
        this.buffContainer2.y = -this.config.modle_height / 100;

        let hp_width:number = 62;
        let hp_height:number = 8;
        this.lifeBar.x = hp_width * -0.5;
        this.lifeBar.y = -(this.config.modle_height) - hp_height - 2;
        this.lifeBar.active(fight.needFlipped(this.pos));
    }

    public fight(data:FightReportItem, delay:number) {
        egret.setTimeout(()=>{
            this.reportItem = data;
            let items = data.target;
            this.updateRoleHP(BigNum.add(data.hp, data.damage || 0), data.maxhp);
            this.addBuff(data);
            this.targets = [];
            this.checkBuff(data.buff);
            this.body.reset();
            for (let i = 0; i < items.length; i++) {
                let role = this.fightContainer.getRoleByPos(items[i].pos);
                if (role)
                    role.checkBuff(items[i].buff);
                let id = items[i].id;
                let pos = +items[i].pos;
                this.targets.push({id: id, pos: pos});
            }
            let skillId = this.reportItem.skillId;
            this.curSkill = Config.SkillData[skillId];
            fight.recordLog(`第${this.reportItem.index}步 角色:${this.reportItem.id} 位置:${this.reportItem.pos} 开始${this.curSkill.action_type}`, fight.LOG_FIGHT_INFO);
            if (!FightRoleVO.canAction(data.buff)) {
                this.skillAttackComplete();
            } else {
                if (this.targets.length == 0) {
                    this.nextStep();
                } else {
                    this.showSkillEff();
                }
            }
        }, this, delay);
    }

    private showSkillEff() {
        if (this.curSkill.skill_name) {
            this.fightContainer.showSkillFlyTxt(`skillname_${this.curSkill.skill_name}`);
        }

        let showInfo = (this.curSkill.skill_free_effect || "").split(",");
        let needMode = !!showInfo[1];
        let source = showInfo[0];
        if (source && source != "0") {
            let eff = new MCEff(source);
            eff.registerBack(0, this.doAction, this, null);
            eff.y = (this.config.modle_height) * -0.5;
            this.fightContainer.showFreeSkillEff(this, eff, needMode);
        } else {
            this.doAction();
        }
    }

    private doAction() {
        fight.verifyActiveSkill(this.curSkill);
        if (this.reportItem) {
            this.once("skill_action_complete", this.skillAttackComplete, this);
            this.skillAction.attack(this.curSkill, this.targets);
        } else {
            fight.recordLog(`战斗步骤提前跳过了`, fight.LOG_FIGHT_WARN);
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

    /**
     * 射击目标
     */
    public fireTargets(targets:{id:number, pos:number}[], cur:number=1,total:number=1){
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
            let rotate = Math.atan2(toy - initY, tox - initX) * 180 / Math.PI + ((scaleX == 1) ? 180:0);
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
                            let target = this.targets[index];
                            if (this.reportItem) {
                                let off = BigNum.sub(this.reportItem.target[index].hp, fightRole.curHP);
                                if (BigNum.greater(off, 0)) {
                                    let point = fight.getRoleInitPoint(target.pos);
                                    let model_height = fight.getRoleHeight(target.id);
                                    this.fightContainer.flyTxt({
                                        str: MathUtil.easyNumber(off),
                                        x: point.x,
                                        y: point.y + model_height * -1
                                    }, fight.FONT_ADD_HP);
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

    public addBuff(item:FightReportItem|FightReportTargetItem, force:boolean = false) {
        let isSelf = "target" in item;
        let canAdd = isSelf || force;
        if (canAdd) {
            this.buffIdArr = item.buff.filter((value) => {
                if (value && Config.BuffData[value])
                    return Config.BuffData[value].id;
            });
            let buffArr = this.buffIdArr || [];
            let keys = Object.keys(this.buffEffMap);
            for (let i = 0; i < buffArr.length; i++) {
                let buffConfig = Config.BuffData[buffArr[i]];
                if (buffConfig) {
                    let type = buffConfig.effect + "";
                    if (!this.buffEffMap[type]) {
                        if (keys.indexOf(type) < 0 && buffConfig.resource && fight.isMCResourceLoaded(buffConfig.resource) && !this.buffEffMap[type]) {
                            let eff = new MCEff(buffConfig.resource, false);
                            let container = this["buffContainer" + buffConfig.point];
                            container.addChild(eff);
                            this.buffEffMap[type] = eff;
                        }
                    }
                }
            }

            let nowBuffIdArr = this.buffIdArr.concat();
            for (let i = 0; i < this.oldBuffIdArr.length; i++) {
                if (this.oldBuffIdArr.indexOf(nowBuffIdArr[i]) >= 0) {
                    nowBuffIdArr.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < nowBuffIdArr.length; i++) {
                let buffConfig:BuffConfig = Config.BuffData[nowBuffIdArr[i]];
                if (buffConfig && buffConfig.word && this.fightContainer) {
                    this.fightContainer.flyTxt({
                        str: buffConfig.word,
                        x: this.x,
                        y: this.y + this.config.modle_height * -1
                    }, fight.FONT_SYSTEM)
                }
            }
            this.oldBuffIdArr = this.buffIdArr.concat()
        }
    }

    public enterAddBuffs(buffs:number[]){
        this.buffIdArr = buffs.concat();
        let buffArr = this.buffIdArr || [];
        let keys = Object.keys(this.buffEffMap);
        for (let i = 0; i < buffArr.length; i++) {
            let buffConfig = Config.BuffData[buffArr[i]];
            if (buffConfig) {
                let type = buffConfig.effect + "";
                if (!this.buffEffMap[type]) {
                    if (keys.indexOf(type) < 0 && buffConfig.resource && fight.isMCResourceLoaded(buffConfig.resource) && !this.buffEffMap[type]) {
                        let eff = new MCEff(buffConfig.resource, false);
                        let container = this["buffContainer" + buffConfig.point];
                        container.addChild(eff);
                        this.buffEffMap[type] = eff;
                    }
                }
            }
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
            let len = this.targets ? this.targets.length:0;
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

    public addAreaEff(mc:egret.MovieClip, flip:boolean){

    }

    public addContainerEff(mc:egret.MovieClip, flip:boolean){

    }

    public startDamage(index:number = 1, total:number = 1, role:any=null, ratio:number=1) {
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
                        this.fightContainer.showDamageEff(eff, fightRole.side);
                    }
                    if (this.curSkill.target_effect) {
                        let eff = new MCEff(this.curSkill.target_effect);
                        eff.y = point.y + (model_height) * -0.5;
                        eff.x = point.x;
                        this.fightContainer.showDamageEff(eff, fightRole.side);
                    }
                    if (hitInfo.dodge) {
                        this.fightContainer.flyTxt({
                            str: "闪避",
                            x: point.x,
                            y: point.y + model_height * -1
                        }, fight.FONT_SYSTEM);
                    } else {
                        if (hitInfo.block) {
                            fightRole.block();
                        } else {
                            fightRole.hit();
                        }
                        if (parseFloat(damageNum) > 0) {
                            if (this.curSkill.damage_type == "physical") {
                                this.fightContainer.flyTxt({
                                    str: damageNum,
                                    x: point.x,
                                    y: point.y + model_height * -1,
                                    scale: this.reportItem.cri ? 1.5:1
                                }, fight.FONT_PHYSICAL_DAMAGE);
                            } else {
                                this.fightContainer.flyTxt({
                                    str: damageNum,
                                    x: point.x,
                                    y: point.y + model_height * -1,
                                    scale: this.reportItem.cri ? 1.5:1
                                }, fight.FONT_MAGICAL_DAMAGE);
                            }
                        } else {
                            if (FightRoleVO.isInvincible(hitInfo.buff)) {
                                this.fightContainer.flyTxt({
                                    str: "免伤",
                                    x: point.x,
                                    y: point.y + model_height * -1
                                }, fight.FONT_SYSTEM);
                            } else if (FightRoleVO.freeMacAtk(hitInfo.buff)) {
                                this.fightContainer.flyTxt({
                                    str: "魔免",
                                    x: point.x,
                                    y: point.y + model_height * -1
                                }, fight.FONT_SYSTEM);
                            } else if (FightRoleVO.freePhyAtk(hitInfo.buff)) {
                                this.fightContainer.flyTxt({
                                    str: "物免",
                                    x: point.x,
                                    y: point.y + model_height * -1
                                }, fight.FONT_SYSTEM);
                            } else {
                                if (this.curSkill.damage_type == "physical") {
                                    damage = BigNum.max(BigNum.div(this.reportItem.phyAtk, 1000), 1);
                                    damageNum = MathUtil.easyNumber(damage);
                                    this.fightContainer.flyTxt({
                                        str: damageNum,
                                        x: point.x,
                                        y: point.y + model_height * -1,
                                        scale: this.reportItem.cri ? 1.5:1
                                    }, fight.FONT_PHYSICAL_DAMAGE);
                                } else {
                                    damage = BigNum.max(BigNum.div(this.reportItem.magAtk, 1000), 1);
                                    damageNum = MathUtil.easyNumber(damage);
                                    this.fightContainer.flyTxt({
                                        str: damageNum,
                                        x: point.x,
                                        y: point.y + model_height * -1,
                                        scale: this.reportItem.cri ? 1.5 : 1
                                    }, fight.FONT_MAGICAL_DAMAGE);
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
        this.checkBuff();
        this.checkDie();
    }

    private checkBuff(buffs?:number[]) {
        let keys = Object.keys(this.buffEffMap);
        let len = keys.length;
        for (let i = 0; i < len; i++) {
            let type = keys[i];
            let exist = false;
            let __buffs = buffs || this.buffIdArr;
            for (let j = 0; j < __buffs.length; j++) {
                let buffConfig = Config.BuffData[__buffs[j]];
                if (buffConfig.effect == type) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                let eff:MCEff = this.buffEffMap[type];
                if (eff) {
                    eff.dispose();
                } else {
                    fight.recordLog("buff可能出错了", fight.LOG_FIGHT_WARN);
                }
                delete this.buffEffMap[type];
                len--;
                i--;
            }
        }
    }

    private checkDie() {
        if (this.parent && !this.isPlayingDie && this.curHP) {
            if (BigNum.greater(fight.DIE_HP, this.curHP)) {
                this.isPlayingDie = true;
                let dieEff = new RoleDieEff();
                this.lifeBar.setProgress(0);
                dieEff.scaleX = this.side == FightSideEnum.RIGHT_SIDE ? -1:1;
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
        this.buffIdArr = [];
        this.buffEffMap = {};
        this.oldBuffIdArr = [];

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

    public attack(skill:SkillConfig){
        this.body.attack(skill);
    }

    public hit() {
        this.body.hit();
    }

    public block() {
        this.body.block();
    }

    //------------------------------------------------------------------------------------------------------
    public getScaleX(){
        return fight.needFlipped(this.pos) ? -1: 1;
    }

    private getRoleByPos(info:any){
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

    public get config(){
        return this._config;
    }

    public get pos(){
        return this._pos;
    }

    public get side(){
        return Math.floor(this.pos / 10);
    }

    public get posIndex(){
        return this.pos % 10;
    }

    public get flipped(){
        return Math.floor(this.pos / 10) == FightSideEnum.LEFT_SIDE;
    }

    // 角色初始位置
    public get initPoint(){
        return fight.getRoleInitPoint(this.pos);
    }

    public get frameRate(){
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
