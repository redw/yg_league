/**
 * 处理角色的buff行为
 * Created by hh on 17/3/7.
 */
class BuffAction {
    private fightRole:FightRole;

    // buff效果map
    private buffEffMap:any = {};
    private buffIdArr:number[] = [];
    private oldBuffIdArr:number[] = [];

    /**
     * 构造函数
     */
    public constructor(fightRole?:FightRole) {
        this.setFightRole(fightRole);
    }

    public setFightRole(value:FightRole) {
        this.reset();
        this.fightRole = value;
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

    public checkBuff(buffs?:number[]) {
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

    public reset(){
        this.buffIdArr = [];
        this.buffEffMap = {};
        this.oldBuffIdArr = [];
    }

    public dispose(){
        this.reset();
        this.fightRole = null;
    }
}
