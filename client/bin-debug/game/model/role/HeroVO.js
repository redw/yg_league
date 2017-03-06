/**
 * 英雄角色值对象
 * Created by hh on 2017/1/4.
 */
var HeroVO = (function () {
    function HeroVO(value) {
        this.parse(value);
    }
    var d = __define,c=HeroVO,p=c.prototype;
    d(p, "id"
        ,function () {
            return this._id;
        }
        ,function (value) {
            this._id = value;
            this.config = Config.HeroData[value];
        }
    );
    d(p, "phyAtk"
        ,function () {
            var base = this.getBaseValue(this.config.physical_atk);
            if (this.level) {
                return this.getValue(base, 1);
            }
            return base + "";
        }
    );
    d(p, "maxHP"
        ,function () {
            var base = this.getBaseValue(this.config.hp);
            if (this.level) {
                return this.getValue(base, 2);
            }
            return base + "";
        }
    );
    d(p, "phyDef"
        ,function () {
            var base = this.getBaseValue(this.config.physical_def);
            if (this.level) {
                return this.getValue(base, 3);
            }
            return base + "";
        }
    );
    d(p, "magAtk"
        ,function () {
            var base = this.getBaseValue(this.config.magical_atk);
            if (this.level) {
                return this.getValue(base, 1);
            }
            return base + "";
        }
    );
    d(p, "magDef"
        ,function () {
            var base = this.getBaseValue(this.config.magical_def);
            if (this.level) {
                return this.getValue(base, 3);
            }
            return base + "";
        }
    );
    d(p, "critDamge"
        ,function () {
            var base = Number(this.config.crit_damage);
            if (this.level) {
                return this.getValue(base, 4);
            }
            return base + "";
        }
    );
    d(p, "extraCritRatio"
        /**
         * 额外的暴击系数
         * @returns {string}
         */
        ,function () {
            var base = 1;
            if (this.level) {
                return this.getValue(base, 4);
            }
            return base + "";
        }
    );
    p.getBaseValue = function (value) {
        // if (this.level == 0) {
        //     return value;
        // } else {
        var paraA = Config.BaseData[4]["value"];
        var paraB = Config.BaseData[5]["value"];
        var quality = parseInt(this.config.quality);
        var star;
        if (!this.starLevel) {
            star = 1;
        }
        else {
            star = this.starLevel;
        }
        var starData = Config.HeroStarData[star];
        var paraC = parseInt(starData["rank_value_" + quality]);
        var lv;
        if (!this.level) {
            lv = 1;
        }
        else {
            lv = this.level;
        }
        var heroLv = lv;
        var heroEnhanceLv = this.strengthenLevel;
        var lvAdd = Math.pow(paraA, heroLv - 1);
        var enhanceAdd = Math.pow(paraB, heroEnhanceLv);
        var base = value * paraC * lvAdd * enhanceAdd;
        return base;
        // }
    };
    p.getValue = function (base, atkType) {
        if (this.level == 0) {
            return base + "";
        }
        var total;
        var targetArr = [];
        targetArr.push(Number(this.id)); //自己
        targetArr.push(2); //全体
        if (parseInt(this.config.job) == 1 || parseInt(this.config.job) == 5) {
            targetArr.push(6);
        }
        else {
            targetArr.push(7);
        }
        if (parseInt(this.config.quality) == 4) {
            targetArr.push(11);
        }
        if (parseInt(this.config.race) == 3) {
            targetArr.push(3);
            targetArr.push(8);
            targetArr.push(9);
        }
        else if (parseInt(this.config.race) == 4) {
            targetArr.push(4);
            targetArr.push(8);
            targetArr.push(10);
        }
        else if (parseInt(this.config.race) == 5) {
            targetArr.push(5);
            targetArr.push(9);
            targetArr.push(10);
        }
        var addBuff = 1;
        //天赋
        for (var c in UserProxy.inst.heroData.getHeroIds()) {
            var id = UserProxy.inst.heroData.getHeroIds()[c];
            var heroData = UserProxy.inst.heroData.getHeroData(id);
            var talent = Config.TalentData[id];
            for (var a in talent) {
                if (a != "id") {
                    var key = a.replace("effect_", "");
                    var value = talent[a];
                    var target = parseInt(value[1]); //加成目标
                    var nature = parseInt(value[0]); //加成类型
                    var add = parseFloat(value[2]); //加成值
                    if (heroData.level >= parseInt(key) && targetArr.indexOf(target) > -1) {
                        if (atkType == 4) {
                            if (nature == atkType) {
                                if (heroData.strengthenLevel >= parseInt(key)) {
                                    addBuff *= (1 + add * 3);
                                }
                                else {
                                    addBuff *= (1 + add);
                                }
                            }
                        }
                        else {
                            if (nature == 8 || nature == atkType) {
                                if (heroData.strengthenLevel >= parseInt(key)) {
                                    addBuff *= (1 + add * 3);
                                }
                                else {
                                    addBuff *= (1 + add);
                                }
                            }
                        }
                    }
                }
            }
        }
        total = BigNum.mul(base, addBuff);
        // console.log("id:" + this._id + "天赋：" + total);
        //法宝
        var addWeapon = 1;
        for (var c in UserProxy.inst.weaponList) {
            var weaponInfo = UserProxy.inst.weaponList[c];
            var weaponData = Config.WeaponData[c];
            var value1 = weaponData["attr_1"];
            var value2 = weaponData["attr_2"];
            var add1 = parseFloat(value1[2]) * (1 + 0.1 * weaponInfo["lv"]);
            var add2 = 0;
            if (value2) {
                add2 = parseFloat(value2[2]) * (1 + 0.1 * weaponInfo["lv"]);
            }
            var target1 = parseInt(value1[1]); //加成目标
            var target2 = parseInt(value2[1]); //加成目标
            var nature1 = parseInt(value1[0]); //加成类型
            var nature2 = parseInt(value2[0]); //加成类型
            if (targetArr.indexOf(target1) > -1) {
                if (atkType == 4) {
                    if (nature1 == atkType) {
                        addWeapon += add1;
                    }
                }
                else {
                    if (nature1 == 8 || nature1 == atkType) {
                        addWeapon += add1;
                    }
                }
            }
            if (targetArr.indexOf(target2) > -1) {
                if (atkType == 4) {
                    if (nature2 == atkType) {
                        addWeapon += add2;
                    }
                }
                else {
                    if (nature2 == 8 || nature2 == atkType) {
                        addWeapon += add2;
                    }
                }
            }
        }
        total = BigNum.mul(total, addWeapon);
        //套装
        var addSuit = 1;
        var addedSuit = [];
        for (var c in UserProxy.inst.weaponList) {
            var weaponData = Config.WeaponData[c];
            if (weaponData["suit"]) {
                if (addedSuit.indexOf(weaponData["suit"]) > -1) {
                    continue;
                }
                var suitData = Config.WeaponSuit[weaponData["suit"]];
                var suitNum = suitData["suitnum"];
                var count = 0;
                var length = suitData["itemgroup"].length;
                for (var p = 0; p < length; p++) {
                    var weaponId = suitData["itemgroup"][p];
                    var weaponInfo = UserProxy.inst.weaponList[weaponId];
                    if (weaponInfo) {
                        count++;
                    }
                }
                for (var j = 0; j < suitNum.length; j++) {
                    if (count >= parseInt(suitNum[j])) {
                        var suitValue = suitData["attr_" + (j + 1)];
                        var target = parseInt(suitValue[1]); //加成目标
                        var nature = parseInt(suitValue[0]); //加成类型
                        var add = parseFloat(suitValue[2]); //加成值
                        if (targetArr.indexOf(target) > -1) {
                            if (atkType == 4) {
                                if (nature == atkType) {
                                    addSuit *= (1 + add);
                                    break;
                                }
                            }
                            else {
                                if (nature == 8 || nature == atkType) {
                                    addSuit *= (1 + add);
                                    break;
                                }
                            }
                        }
                    }
                }
                addedSuit.push(weaponData["suit"]);
            }
        }
        total = BigNum.mul(total, addSuit);
        //情缘
        var addShip = 1;
        for (var k in UserProxy.inst.relationship) {
            var shipInfo = UserProxy.inst.relationship[k];
            var shipData = Config.FriendshipData[k];
            var parm = shipData["attr_parm"];
            if (shipInfo["lv"]) {
                var shipValue = shipData["attr_1"];
                var target = parseInt(shipValue[1]); //加成目标
                var nature = parseInt(shipValue[0]); //加成类型
                var add = parseFloat(shipValue[2]) * (Math.pow(parm, shipInfo["lv"] - 1)); //加成值
                if (targetArr.indexOf(target) > -1) {
                    if (atkType == 4) {
                        if (nature == atkType) {
                            addShip *= (1 + add);
                        }
                    }
                    else {
                        if (nature == 8 || nature == atkType) {
                            addShip *= (1 + add);
                        }
                    }
                }
            }
        }
        total = BigNum.mul(total, addShip);
        // 添加神器
        var ratio = artifact.getRoleArtifactRatio(this, atkType);
        total = BigNum.mul(total, ratio);
        // console.log("id:" + this._id +"情缘：" + total);
        //
        return total;
    };
    p.parse = function (value) {
        if (value) {
            this.id = value.id;
            this.level = value["lv"] || value.level || 0;
            this.starLevel = value["star"] || value.starLevel || 0;
            this.strengthenLevel = value["enhanceLv"] || value.strengthenLevel || 0;
            this.starPiece = value["starPiece"] || value.starLevel || 0;
            this.skill = value["skill"] || 0;
            this.evolution = value["evolution"] || value.evolution || 0;
        }
    };
    return HeroVO;
}());
egret.registerClass(HeroVO,'HeroVO');
