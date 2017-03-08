/**
 * 处理角色的buff行为
 * Created by hh on 17/3/7.
 */
var BuffAction = (function () {
    /**
     * 构造函数
     */
    function BuffAction(fightRole) {
        // buff效果map
        this.buffEffMap = {};
        this.buffIdArr = [];
        this.oldBuffIdArr = [];
        this.setFightRole(fightRole);
    }
    var d = __define,c=BuffAction,p=c.prototype;
    p.setFightRole = function (value) {
        this.reset();
        this.fightRole = value;
    };
    p.addBuff = function (item, force) {
        if (force === void 0) { force = false; }
        var isSelf = "target" in item;
        var canAdd = isSelf || force;
        if (canAdd) {
            this.buffIdArr = item.buff.filter(function (value) {
                if (value && Config.BuffData[value])
                    return Config.BuffData[value].id;
            });
            var buffArr = this.buffIdArr || [];
            var keys = Object.keys(this.buffEffMap);
            for (var i = 0; i < buffArr.length; i++) {
                var buffConfig = Config.BuffData[buffArr[i]];
                if (buffConfig) {
                    var type = buffConfig.effect + "";
                    if (!this.buffEffMap[type]) {
                        if (keys.indexOf(type) < 0 && buffConfig.resource && fight.isMCResourceLoaded(buffConfig.resource) && !this.buffEffMap[type]) {
                            var eff = new MCEff(buffConfig.resource, false);
                            var container = this["buffContainer" + buffConfig.point];
                            container.addChild(eff);
                            this.buffEffMap[type] = eff;
                        }
                    }
                }
            }
            var nowBuffIdArr = this.buffIdArr.concat();
            for (var i = 0; i < this.oldBuffIdArr.length; i++) {
                if (this.oldBuffIdArr.indexOf(nowBuffIdArr[i]) >= 0) {
                    nowBuffIdArr.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < nowBuffIdArr.length; i++) {
                var buffConfig = Config.BuffData[nowBuffIdArr[i]];
                if (buffConfig && buffConfig.word) {
                    this.fightRole.flyTxt(buffConfig.word, fight.FONT_SYSTEM);
                }
            }
            this.oldBuffIdArr = this.buffIdArr.concat();
        }
    };
    p.enterAddBuffs = function (buffs) {
        this.buffIdArr = buffs.concat();
        var buffArr = this.buffIdArr || [];
        var keys = Object.keys(this.buffEffMap);
        for (var i = 0; i < buffArr.length; i++) {
            var buffConfig = Config.BuffData[buffArr[i]];
            if (buffConfig) {
                var type = buffConfig.effect + "";
                if (!this.buffEffMap[type]) {
                    if (keys.indexOf(type) < 0 && buffConfig.resource && fight.isMCResourceLoaded(buffConfig.resource) && !this.buffEffMap[type]) {
                        var eff = new MCEff(buffConfig.resource, false);
                        var container = this["buffContainer" + buffConfig.point];
                        container.addChild(eff);
                        this.buffEffMap[type] = eff;
                    }
                }
            }
        }
    };
    p.checkBuff = function (buffs) {
        var keys = Object.keys(this.buffEffMap);
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            var type = keys[i];
            var exist = false;
            var __buffs = buffs || this.buffIdArr;
            for (var j = 0; j < __buffs.length; j++) {
                var buffConfig = Config.BuffData[__buffs[j]];
                if (buffConfig.effect == type) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                var eff = this.buffEffMap[type];
                if (eff) {
                    eff.dispose();
                }
                else {
                    fight.recordLog("buff可能出错了", fight.LOG_FIGHT_WARN);
                }
                delete this.buffEffMap[type];
                len--;
                i--;
            }
        }
    };
    p.reset = function () {
        this.buffIdArr = [];
        this.buffEffMap = {};
        this.oldBuffIdArr = [];
    };
    p.dispose = function () {
        this.reset();
        this.fightRole = null;
    };
    return BuffAction;
}());
egret.registerClass(BuffAction,'BuffAction');
