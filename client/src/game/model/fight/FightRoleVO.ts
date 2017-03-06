/**
 * 战斗角色值对象
 * Created by hh on 2017/1/4.
 */
class FightRoleVO{
    public phyAtk:string;
    public phyDef:string;
    public magAtk:string;
    public magDef:string;
    public maxHP:string;
    public id:number;
    public config:RoleConfig;
    public side:number;                             // 边
    public pos:number;                              // 位置
    public turnCount = 0;                           // 轮数
    public starLevel:number = -1;                   // 星级

    public triggerChanceType:string = "a";          // 触发chance类型
    private buffInfo:any = {};                      // 类型 -> [id, count......]
    private dodgeChance:number = 0;
    private blockChance:number = 0;
    private critChance:number = 0;
    public critDamage:number = 0;
    public extraCritRatio:string = "1";             // 额外暴击系数,(装备，情缘等级暴击的影响)

    public constructor(value?:{id:number, pos:number, side:number}){
        this.parse(value);
    }

    public parse(value:{id:number, pos:number, side:number}){
        if (value) {
            this.id = value.id;
            this.pos = value.pos;
            this.side = value.side;
            if (fight.isHero(this.id)) {
                this.config = Config.HeroData[this.id];
            } else {
                this.config = Config.EnemyData[this.id];
            }
            this.critChance = this.config.crit_chance;
            this.critDamage = this.config.crit_damage;
            this.blockChance = this.config.block_chance;
            this.dodgeChance = this.config.dodge_chance;
        }
    }

    public copyProp(vo:HeroVO | MonsterVO){
        this.phyAtk = vo.phyAtk;
        this.phyDef = vo.phyDef;
        this.magAtk = vo.magAtk;
        this.magDef = vo.magDef;
        this.maxHP = vo.maxHP;
        if ("starLevel" in vo) {
            this.starLevel = vo["starLevel"];
        }
        if ("extraCritRatio" in vo) {
            this.extraCritRatio = vo["extraCritRatio"] || "1";
        }
        if (!this._curHP) {
            this._curHP = this.maxHP;
        }
    }

    /**
     * 得到出战顺序
     * @returns {number}
     */
    public get order() {
        return this.config.speed + (3 - this.side) * 10 + (9 - this.pos);
    }

    public turnBegin(){
        if (this.turnCount > 0)
            this.reduceBuff();
        this.turnCount++;
    }

    /**
     * 技能是否激活(修改待测）
     */
    public isSkillActive(skillId:number|string){
        let result = true;
        // 如果新手阶段，则不释放技能
        if (UserProxy.inst.isNoviceLevel())
            return false;

        if (fight.isHero(this.id)) {
            const starOpenList = Config.BaseData[1].value;
            let allSkill = this.config.skill.concat();

            let index = 0;
            for (let i = 0; i < allSkill.length; i++) {
                if (allSkill[i] == skillId) {
                    index = i;
                    break;
                }
            }

            //  开启的数量
            let starIndex = 0;
            for (let i = 0; i < starOpenList.length; i++) {
                if (this.starLevel >= parseInt(starOpenList[i])) {
                    starIndex++;
                }
            }

            result = starIndex > index || index == 0;
        }
        return result;
    }

    /**
     * 要使用的技能
     * @returns {number}
     */
    public getSkillId(){
        let arr = this.config.skill_trigger_order;
        let skillArr = arr.filter((value)=>{return !!value});
        let result:number = skillArr[skillArr.length - 1];
        // let index = (((this.side + this.pos *2) * (this.turnCount)) - 1) % 20;
        if (this.canSelectSkill) {
            const len = skillArr.length;
            for (let i = 0 ; i < len ; ++i) {
                let skillId = skillArr[i];
                let skillInfo = Config.SkillData[skillId];
                if (skillInfo){
                    if (this.isSkillActive(skillId)) {
                        let triggerId:number = skillInfo.trigger_chance;
                        if (Math.random() <= triggerId) {
                            result = skillId;
                            break;
                        }
                    }
                }
            }
        }
        return result;
    }

    // 是否爆击
    public isCri(){
        return Math.random() <= this.critChance;
    }

    // 是否闪避
    public isDodge() {
        if (this.isExistBuff(BuffTypeEnum.HIDE)) {
            return true;
        }
        return Math.random() <= this.dodgeChance;
    }

    // 是否格档
    public isBlock() {
        return Math.random() <= this.blockChance;
    }

    // 是否是boss
    public isBoss(){
        let result = fight.isBoss(this.config.id);
        result = result || this.isExistBuff(BuffTypeEnum.TO_BOSS);
        return result;
    }

    // 能选择技能
    private get canSelectSkill(){
        return !this.isExistBuff(BuffTypeEnum.SEAL_MAGIC);
    }

    // 输出伤害系数
    public get outHurtRatio(){
        return this.getBuffMultiValue(BuffTypeEnum.HURT_OUT);
    }

    // 伤害系数
    public get hurtRatio() {
        return this.getBuffMultiValue(BuffTypeEnum.HURT);
    }

    // 反弹自己伤害系数
    public get backHurtRatio(){
        return this.getBuffPlusValue(BuffTypeEnum.BACK_HURT);
    }

    // 反弹输出伤害系数
    public get backOutHurtRatio(){
        return this.getBuffPlusValue(BuffTypeEnum.BACK_HURT_OUT);
    }

    // 免物攻
    public get freePhysicalAtk(){
        return this.isExistBuff(BuffTypeEnum.FREE_PHYSICAL);
    }

    public static freePhyAtk(buffs:number[]) {
        let result = false;
        let len = buffs ? buffs.length : 0;
        for (let i = 0; i < len; i++) {
            let config:BuffConfig = Config.BuffData[buffs[i]];
            if (config && config.effect == BuffTypeEnum.FREE_PHYSICAL) {
                result = true;
                break;
            }
        }
        return result;
    }

    // 免魔攻
    public get freeMagicAtk(){
        return this.isExistBuff(BuffTypeEnum.FREE_MAGIC);
    }

    public static freeMacAtk(buffs:number[]){
        let result = false;
        let len = buffs ? buffs.length : 0;
        for (let i = 0; i < len; i++) {
            let config:BuffConfig = Config.BuffData[buffs[i]];
            if (config && config.effect == BuffTypeEnum.FREE_MAGIC) {
                result = true;
                break;
            }
        }
        return result;
    }

    // 无敌
    public get isInvincible(){
        return this.isExistBuff(BuffTypeEnum.INVINCIBLE);
    }

    public static isInvincible(buffs:number[]) {
        let result = false;
        let len = buffs ? buffs.length : 0;
        for (let i = 0; i < len; i++) {
            let config:BuffConfig = Config.BuffData[buffs[i]];
            if (config && config.effect == BuffTypeEnum.INVINCIBLE) {
                result = true;
                break;
            }
        }
        return result;
    }

    // 能行动(没有眩晕)
    public get canAction(){
        return !this.isExistBuff(BuffTypeEnum.VERTIGO);
    }

    public static canAction(buffs:number[]){
        let result = true;
        let len = buffs ? buffs.length : 0;
        for (let i = 0; i < len; i++) {
            let config:BuffConfig = Config.BuffData[buffs[i]];
            if (config && config.effect == BuffTypeEnum.VERTIGO) {
                result = false;
                break;
            }
        }
        return result;
    }

    // 回血
    public backBlood() {
        let addHP = BigNum.mul(this.maxHP, this.getBuffPlusValue(BuffTypeEnum.ADD_BLOOD));
        if (!this.isExistBuff(BuffTypeEnum.FORBIDDEN_ADD_BLOOD)) {
            this.curHP = BigNum.add(this._curHP, addHP);
        }
    }

    // 掉血(中毒后)
    public loseBlood(){
        let buffs = this.buffInfo[BuffTypeEnum.POISONING];
        const len = buffs ? buffs.length : 0;
        for (let i = 0; i < len; i++) {
            let hurt = BigNum.sub(buffs[i].magAtk, this.magDef);
            hurt = BigNum.mul(hurt, buffs[i].value);
            if (BigNum.greaterOrEqual(hurt, 0)) {
                this.curHP = BigNum.add(this.curHP, hurt);
            } else {
                fight.recordLog("中毒后，伤害应该大于0", fight.LOG_FIGHT_WARN);
            }
        }
    }

    /**
     * 是否存在buff
     *
     * @param type
     * @returns {boolean}
     */
    public isExistBuff(type:number|string) {
        let result = false;
        if (this.buffInfo[type]) {
            result = this.buffInfo[type].length > 0;
        }
        return result;
    }

    /**
     * 得到buff的加值
     *
     * @param type
     * @returns {number}
     */
    public getBuffPlusValue(type:number|string) {
        let result = 0;
        let buffs = this.buffInfo[type];
        let len = buffs ? buffs.length : 0;
        for (let i = 0; i < len; i++) {
            result += buffs[i].value;
        }
        return result;
    }

    /**
     * 得到buff的乘值
     *
     * @param type
     * @returns {number}
     */
    public getBuffMultiValue(type:number|string) {
        let result = 1;
        let buffs = this.buffInfo[type];
        let len = buffs ? buffs.length : 0;
        for (let i = 0; i < len; i++) {
            result *= buffs[i].value;
        }
        return result;
    }

    /**
     * 给角色施加buff
     *
     * @param buffID  被拖加的buffId
     * @param role  施加者
     */
    public addBuff(buffID:number|string, role?:FightRoleVO){
        let obj:BuffConfig = Config.BuffData[buffID];
        if (obj) {
            let type = obj.effect;
            let value  = obj.value;
            // 如果是boss,并且to_boss为0?
            if (!obj.to_boss) {
                if (this.isExistBuff(BuffTypeEnum.TO_BOSS))
                    return;
            }
            if (type == BuffTypeEnum.PHYSICAL_ATK) {
                this.phyAtk = BigNum.mul(this.phyAtk, value);
            } else if (type == BuffTypeEnum.MAGIC_ATK) {
                this.magAtk = BigNum.mul(this.magAtk, value);
            } else if (type == BuffTypeEnum.PHYSICAL_DEF) {
                this.phyDef = BigNum.mul(this.phyDef, value);
            } else if (type == BuffTypeEnum.MAGIC_DEF){
                this.magDef = BigNum.mul(this.magDef, value);
            } else if (type == BuffTypeEnum.LIFE) {
                this._curHP = BigNum.mul(this._curHP, 1 + value);
                this.maxHP = BigNum.mul(this.maxHP, 1 + value);
            } else if (type == BuffTypeEnum.CHANGE_DODGE) {
                this.dodgeChance = Math.min(this.dodgeChance + value, 1);
            } else if (type == BuffTypeEnum.CHANGE_CRIT) {
                this.critChance = Math.min(this.critChance + value, 1);
            } else if (type == BuffTypeEnum.CHANGE_BLOCK) {
                this.blockChance = Math.min(this.blockChance + value, 1);
            } else if (type == BuffTypeEnum.CHANGE_CRIT_HURT) {
                this.critDamage += value;
            } else if (type == BuffTypeEnum.CHANGE_ATK) {
                this.phyAtk = BigNum.mul(this.phyAtk, value);
                this.magAtk = BigNum.mul(this.magAtk, value);
            } else if (type == BuffTypeEnum.CHANGE_DEF) {
                this.phyDef = BigNum.mul(this.phyDef, value);
                this.magDef = BigNum.mul(this.magDef, value);
            }
            if (!this.buffInfo[type]) {
                this.buffInfo[type] = [];
            }
            if (type == BuffTypeEnum.POISONING) {
                this.buffInfo[type].push({id:obj.id, duration:obj.duration, value:obj.value, magAtk:role.magAtk});
            } else {
                this.buffInfo[type].push({id:obj.id, duration:obj.duration, value:obj.value});
            }
        } else {
            fight.recordLog("没有buffID:" + buffID + "配置", fight.LOG_FIGHT_WARN);
        }
    }

    /**
     * 减去buff
     */
    private reduceBuff() {
        let arr = Object.keys(this.buffInfo);
        for (let i = 0; i < arr.length; i++) {
            let type = arr[i];
            let buffs = this.buffInfo[type];
            for (let j = 0; j < buffs.length; j++) {
                buffs[j].duration--;
                if (buffs[j].duration <= 0) {
                    buffs.splice(j ,1);
                    j--;
                } else {
                    buffs[j].turn++;
                }
            }
        }
    }

    public addDesInfo(obj:FightReportItem | FightReportTargetItem) {
        obj.hp = this.curHP;
        obj.phyAtk = this.phyAtk;
        obj.phyDef = this.phyDef;
        obj.magAtk = this.magAtk;
        obj.magDef = this.magDef;
        obj.id = this.config.id;
        obj.pos = fight.getRolePosDes(this);
        obj.dcri = this.critChance;
        obj.dcirDom = this.critDamage;
        obj.ddodge = this.dodgeChance;
        obj.dblock = this.blockChance;
        obj.buff = [];
        let arr = Object.keys(this.buffInfo);
        for (let i = 0; i < arr.length; i++) {
            let type = arr[i];
            let buffs = this.buffInfo[type];
            for (let j = 0; j < buffs.length; j++) {
                obj.buff.push(buffs[j].id);
            }
        }
    }

    public updateProp(prop:{magAtk:string, magDef:string, maxHP:string, phyAtk:string, phyDef:string, skill?:number}){
        this.magAtk = prop.magAtk;
        this.magDef = prop.magDef;
        this.maxHP = prop.maxHP;
        this.phyAtk = prop.phyAtk;
        this.phyDef = prop.phyDef;
        if ("starLevel" in prop) {
            this.starLevel = prop["starLevel"];
        }
        if ("extraCritRatio" in prop) {
            this.extraCritRatio = prop["extraCritRatio"] || "1";
        }
        if (!this._curHP) {
            this._curHP = this.maxHP;
        }
    }

    protected _curHP:string;
    public get curHP(){
        return this._curHP;
    }

    public set curHP(value:string){
        if (this._curHP != value) {
            this._curHP = value;
            this._curHP = BigNum.clamp(this._curHP, 0, this.maxHP);
        }
    }
}
