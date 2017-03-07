/**
 * 用户方法
 * Created by Administrator on 11/24 0024.
 */
var UserMethod = (function (_super) {
    __extends(UserMethod, _super);
    function UserMethod() {
        _super.apply(this, arguments);
        this.pvp_up_arr = [];
        this.home_up_arr = [];
        this.inviteTime = 0;
        this.helpTime = 0;
        this.handTime = 0;
        this.scenceMoveTime = 0;
        this.aliveTime = 0;
        this.shopMoveTo = 0;
        this.shareHeroId = 0;
        this.showHelpFormation = 0;
        this.settingHeadId = 0;
        this.nowRoleShow = [];
        //红点判断
        this._dailyPointShow = false;
        this._achievePointShow = false;
        this._starPointShow = false;
        this._shipPointShow = false;
        this._drawPointShow = false;
        this._fruitPointShow = false;
        this._fundPointShow = false;
        this._inviteShowPoint = false;
        this._shareShowPoint = false;
        this._invitePoint = false;
        this._actWordShow = false;
        this._actRechargeShow = false;
        this._actCostShow = false;
        this._actOnePayShow = false;
        this._actFestivalShow = false;
        this._mineFullPoint = false;
        this._mineBuildPoint = false;
    }
    var d = __define,c=UserMethod,p=c.prototype;
    d(UserMethod, "inst"
        ,function () {
            if (UserMethod._instance == null) {
                UserMethod._instance = new UserMethod();
            }
            return UserMethod._instance;
        }
    );
    // ************************************************** //
    p.getAddSting = function (addArr, para) {
        var index_1 = parseFloat(addArr[0]);
        var index_2 = parseFloat(addArr[1]);
        var index_3 = para ? para : parseFloat(addArr[2]);
        if (para == 0) {
            index_3 = 0;
        }
        var dec1;
        var dec2;
        switch (index_1) {
            case 1:
                dec2 = "攻击增加";
                break;
            case 2:
                dec2 = "生命增加";
                break;
            case 3:
                dec2 = "防御增加";
                break;
            case 4:
                dec2 = "暴击伤害增加";
                break;
            case 5:
                dec2 = "暴击率增加";
                break;
            case 6:
                dec2 = "闪避率增加";
                break;
            case 7:
                dec2 = "格挡率增加";
                break;
            case 8:
                dec2 = "全属性增加";
                break;
            case 9:
                dec2 = "减少巡山的开启铜钱";
                break;
            case 10:
                dec2 = "减少巡山获得铜钱的时间";
                break;
            case 11:
                dec2 = "减少巡山的升级铜钱";
                break;
            case 12:
                dec2 = "增加巡山获得的铜钱";
                break;
            case 13:
                dec2 = "减少伙伴的升级铜钱";
                break;
            case 14:
                dec2 = "减少闯关怪物血量";
                break;
            case 15:
                dec2 = "减少秘境怪物属性";
                break;
            case 16:
                dec2 = "增加秘境掉落材料倍数";
                break;
            case 17:
                dec2 = "增加轮回获得的仙玉倍数";
                break;
            default:
                dec2 = "";
                break;
        }
        switch (index_2) {
            case 1:
                dec1 = "自己的";
                break;
            case 2:
                dec1 = "全体伙伴的";
                break;
            case 3:
                dec1 = "人族的";
                break;
            case 4:
                dec1 = "妖族的";
                break;
            case 5:
                dec1 = "仙族的";
                break;
            case 6:
                dec1 = "近战的";
                break;
            case 7:
                dec1 = "远程的";
                break;
            case 8:
                dec1 = "人妖两族的";
                break;
            case 9:
                dec1 = "人仙两族的";
                break;
            case 10:
                dec1 = "妖仙两族的";
                break;
            case 11:
                dec1 = "全体彩将的";
                break;
            default:
                dec1 = "";
                break;
        }
        var showStr = dec1 + dec2 + "：";
        if (index_3 * 100 < 1000) {
            showStr += StringUtil.toFixed(index_3 * 100) + "%";
        }
        else {
            showStr += MathUtil.easyNumber(index_3 * 100) + "%";
        }
        return showStr;
    };
    p.getWeaponCostType = function (cost) {
        var costType1 = { "key": -1, "value": 0 };
        var costType2 = { "key": -1, "value": 0 };
        for (var i in cost) {
            if (cost[i] > 0) {
                if (costType1["key"] < 0) {
                    costType1["key"] = i;
                    costType1["value"] = cost[i];
                }
                else {
                    costType2["key"] = i;
                    costType2["value"] = cost[i];
                }
            }
        }
        return [costType1, costType2];
    };
    p.getWeaponCount = function () {
        var count = 0;
        for (var i in UserProxy.inst.weaponList) {
            count++;
        }
        return count;
    };
    /**
     * @returns {number} 0未开启或已结束
     */
    p.activeDay = function () {
        if (!UserProxy.inst.sevenDayBegTime) {
            return 0;
        }
        //补到零点的时间
        var time = new Date();
        time.setTime(UserProxy.inst.sevenDayBegTime * 1000);
        time.setHours(23);
        time.setMinutes(59);
        time.setSeconds(59);
        var todayEnd = Math.floor(time.valueOf() / 1000) + 1; //第一天结束
        for (var i = 1; i < 8; i++) {
            if (todayEnd >= UserProxy.inst.server_time) {
                return i;
            }
            todayEnd += 86400;
        }
        return 0;
    };
    p.activeDayEndTime = function () {
        if (!UserProxy.inst.sevenDayBegTime) {
            return 0;
        }
        //补到零点的时间
        var time = new Date();
        time.setTime(UserProxy.inst.sevenDayBegTime * 1000);
        time.setHours(23);
        time.setMinutes(59);
        time.setSeconds(59);
        var todayEnd = Math.floor(time.valueOf() / 1000) + 1; //第一天结束
        var activeEnd = todayEnd + 86400 * 8;
        return activeEnd;
    };
    /**
     *7日
     * @param sevenDayData
     * @returns {number}
     */
    p.sevenDayFinish = function (sevenDayData) {
        var nowValue = 0;
        switch (sevenDayData["task_type"]) {
            case 1:
                nowValue = UserProxy.inst.shareObj["shareCount"];
                break;
            case 2:
                nowValue = UserProxy.inst.rmbDays;
                break;
            case 3:
                for (var i in UserProxy.inst.makeMoney) {
                    if (UserProxy.inst.makeMoney[i]["lv"]) {
                        nowValue++;
                    }
                }
                break;
            case 4:
                var roleIds = UserProxy.inst.heroData.getHeroIds();
                for (var i in roleIds) {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    if (heroData.strengthenLevel >= parseInt(sevenDayData["task_id"])) {
                        nowValue++;
                    }
                }
                break;
            case 5:
                var heroData = UserProxy.inst.heroData.getHeroData(parseInt(sevenDayData["task_id"]));
                nowValue = heroData.level ? 1 : 0;
                break;
            case 6:
                for (var i in UserProxy.inst.weaponList) {
                    var weaponData = Config.WeaponData[i];
                    if (parseInt(weaponData["rank"]) >= sevenDayData["task_id"]) {
                        nowValue++;
                    }
                }
                break;
            case 7:
                var roleIds = UserProxy.inst.heroData.getHeroIds();
                for (var i in roleIds) {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    if (heroData.starLevel >= parseInt(sevenDayData["task_id"])) {
                        nowValue++;
                    }
                }
                break;
            case 8:
                nowValue = UserProxy.inst.achievementObj["pvpWinNum"];
                break;
            case 9:
                nowValue = UserProxy.inst.achievementObj["pvpContinueWin"];
                break;
            case 10:
                break;
            case 11:
                nowValue = UserProxy.inst.historyArea;
                break;
            case 12:
                nowValue = UserProxy.inst.achievementObj["relationNum"];
                break;
        }
        return nowValue;
    };
    /**
     * 目标任务
     * @param TargetData
     * @returns {number}
     */
    p.targetFinish = function (TargetData) {
        /* var statue:number = 0;
         if(this.isBitGet(Number(TargetData["id"]),UserProxy.inst.missionBit))
         {
             statue = 1;
             return statue;
         }*/
        var nowValue = 0;
        switch (TargetData["task_type"]) {
            case 1:
                break;
            case 2:
                nowValue = UserProxy.inst.makeMoney[TargetData["task_id"]]["lv"] ? 1 : 0;
                break;
            case 3:
                var roleIds = UserProxy.inst.heroData.getHeroIds();
                for (var i in roleIds) {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    if (heroData.strengthenLevel >= parseInt(TargetData["task_id"])) {
                        nowValue++;
                    }
                }
                break;
            case 4:
                for (var i in UserProxy.inst.weaponList) {
                    var weaponData = Config.WeaponData[i];
                    if (parseInt(weaponData["rank"]) >= TargetData["task_id"]) {
                        nowValue++;
                    }
                }
                break;
            case 5:
                var roleIds = UserProxy.inst.heroData.getHeroIds();
                for (var i in roleIds) {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    if (heroData.starLevel >= parseInt(TargetData["task_id"])) {
                        nowValue++;
                    }
                }
                break;
            case 6:
                nowValue = UserProxy.inst.achievementObj["pvpWinNum"];
                break;
            case 7:
                nowValue = UserProxy.inst.achievementObj["pvpContinueWin"];
                break;
            case 8:
                nowValue = Object.keys(UserProxy.inst.friendList).length;
                break;
            case 9:
                nowValue = UserProxy.inst.historyArea;
                break;
            case 10:
                nowValue = UserProxy.inst.achievementObj["relationNum"];
                break;
            case 11:
                nowValue = UserProxy.inst.achievementObj["circle"];
                break;
            case 12:
                var lv = 0;
                var roleIds = UserProxy.inst.heroData.getHeroIds();
                for (var i in roleIds) {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    lv += heroData.level;
                }
                nowValue = lv;
                break;
            case 13:
                var lv = 0;
                for (var i in UserProxy.inst.makeMoney) {
                    lv += UserProxy.inst.makeMoney[i]["lv"];
                }
                nowValue = lv;
                break;
        }
        return nowValue;
    };
    p.isMissionGet = function (id) {
        return BitUtil.isBitTrueByString(id - 1, UserProxy.inst.missionBit);
    };
    p.isBitGet = function (id, bit) {
        return BitUtil.isBitTrueByString(id - 1, bit);
    };
    /**
     * 提示红点
     * @param parent
     * @param name
     * @param pos
     */
    p.addRedPoint = function (parent, name, pos) {
        if (!DisplayUtil.getChildByName(parent, name)) {
            var redPoint = new RedPoint();
            redPoint.x = pos.x;
            redPoint.y = pos.y;
            redPoint.name = name;
            parent.addChild(redPoint);
        }
    };
    /**
     * 移除红点
     * @param parent
     */
    p.removeRedPoint = function (parent, name) {
        var redPoint = DisplayUtil.getChildByName(parent, name);
        if (redPoint) {
            redPoint.clear();
            DisplayUtil.removeFromParent(redPoint);
        }
    };
    /**
     * 奖励展示
     */
    p.showAward = function (data) {
        var bonusList = new BonusList();
        if (data["diamond"]) {
            var addDiamond = data["diamond"] - UserProxy.inst.diamond;
            UserProxy.inst.diamond = data["diamond"];
            if (addDiamond > 0) {
                bonusList.push(BonusType.GOLD, addDiamond);
            }
        }
        if (data["gold"]) {
            var addGold = BigNum.sub(data["gold"], UserProxy.inst.gold);
            UserProxy.inst.gold = data["gold"];
            if (parseFloat(addGold) > 0) {
                bonusList.push(BonusType.COIN, parseFloat(addGold));
            }
        }
        if (data["pill"]) {
            var add = data["pill"] - UserProxy.inst.pill;
            UserProxy.inst.pill = data["pill"];
            if (add > 0) {
                bonusList.push(BonusType.STAR_PILL, add);
            }
        }
        if (data["medal"]) {
            var add = data["medal"] - UserProxy.inst.medal;
            UserProxy.inst.medal = data["medal"];
            if (add > 0) {
                bonusList.push(BonusType.JADE, add);
            }
        }
        if (data["weaponCoin"]) {
            var add_0 = data["weaponCoin"][0] - UserProxy.inst.weaponCoin[0];
            UserProxy.inst.weaponCoin[0] = data["weaponCoin"][0];
            var add_1 = data["weaponCoin"][1] - UserProxy.inst.weaponCoin[1];
            UserProxy.inst.weaponCoin[1] = data["weaponCoin"][1];
            var add_2 = data["weaponCoin"][2] - UserProxy.inst.weaponCoin[2];
            UserProxy.inst.weaponCoin[2] = data["weaponCoin"][2];
            var add_3 = data["weaponCoin"][3] - UserProxy.inst.weaponCoin[3];
            UserProxy.inst.weaponCoin[3] = data["weaponCoin"][3];
            var add_4 = data["weaponCoin"][4] - UserProxy.inst.weaponCoin[4];
            UserProxy.inst.weaponCoin[4] = data["weaponCoin"][4];
            if (add_0 > 0) {
                bonusList.push(BonusType.METAL, add_0);
            }
            if (add_1 > 0) {
                bonusList.push(BonusType.WOOD, add_1);
            }
            if (add_2 > 0) {
                bonusList.push(BonusType.WATER, add_2);
            }
            if (add_3 > 0) {
                bonusList.push(BonusType.FIRE, add_3);
            }
            if (add_4 > 0) {
                bonusList.push(BonusType.SOIL, add_4);
            }
        }
        if (data["soulCoin"]) {
            var add_0 = data["soulCoin"][0] - UserProxy.inst.soulCoin[0];
            UserProxy.inst.soulCoin[0] = data["soulCoin"][0];
            var add_1 = data["soulCoin"][1] - UserProxy.inst.soulCoin[1];
            UserProxy.inst.soulCoin[1] = data["soulCoin"][1];
            var add_2 = data["soulCoin"][2] - UserProxy.inst.soulCoin[2];
            UserProxy.inst.soulCoin[2] = data["soulCoin"][2];
            var add_3 = data["soulCoin"][3] - UserProxy.inst.soulCoin[3];
            UserProxy.inst.soulCoin[3] = data["soulCoin"][3];
            if (add_0 > 0) {
                bonusList.push(BonusType.SOUL_1, add_0);
            }
            if (add_1 > 0) {
                bonusList.push(BonusType.SOUL_2, add_1);
            }
            if (add_2 > 0) {
                bonusList.push(BonusType.SOUL_3, add_2);
            }
            if (add_3 > 0) {
                bonusList.push(BonusType.SOUL_4, add_3);
            }
        }
        if (data["ticket"]) {
            var add = data["ticket"] - UserProxy.inst.ticket;
            UserProxy.inst.ticket = data["ticket"];
            if (add > 0) {
                bonusList.push(BonusType.HERO_DRAW, add);
            }
        }
        if (data["nowTimes"]) {
            var add = data["nowTimes"] - UserProxy.inst.circleObj["nowTimes"];
            UserProxy.inst.circleObj["nowTimes"] = data["nowTimes"];
            if (add > 0) {
                bonusList.push(BonusType.CIRCLE_TIMES, add);
            }
        }
        if (data["maxNum"]) {
            var add = data["maxNum"] - UserProxy.inst.maxNum;
            UserProxy.inst.maxNum = data["maxNum"];
            if (add > 0) {
                bonusList.push(BonusType.WEAPON_BOX, add);
            }
        }
        if (data["maxTimes"]) {
            var add = data["maxTimes"] - UserProxy.inst.maxTimes;
            UserProxy.inst.maxTimes = data["maxTimes"];
            if (add > 0) {
                bonusList.push(BonusType.WEAPON_FB, add);
            }
        }
        if (data["pvpCoin"]) {
            var add = data["pvpCoin"] - UserProxy.inst.pvpShopObj["pvpCoin"];
            UserProxy.inst.pvpShopObj["pvpCoin"] = data["pvpCoin"];
            if (add > 0) {
                bonusList.push(BonusType.PVP_COIN, add);
            }
        }
        if (data["heroList"]) {
            var changeIds = [];
            for (var i in data["heroList"]) {
                changeIds.push(parseInt(i));
            }
            var length = changeIds.length;
            for (var j = 0; j < length; j++) {
                var heroData = UserProxy.inst.heroData.getHeroData(changeIds[j]);
                var newLv = data["heroList"][changeIds[j]]["lv"];
                var newPiece = data["heroList"][changeIds[j]]["starPiece"];
                var addPiece = newPiece - heroData.starPiece;
                if (newLv > 0 && heroData.level == 0) {
                    bonusList.push(BonusType.HERO, 1, changeIds[j]);
                }
                if (addPiece > 0) {
                    bonusList.push(BonusType.HERO_CHIP, addPiece, changeIds[j]);
                }
            }
            UserProxy.inst.heroData.parseHeroList(data["heroList"]);
            EventManager.inst.dispatch(ContextEvent.HAVE_NEW_ROLE);
        }
        bonusList.show();
    };
    p.setExterAdd = function () {
        UserProxy.inst.subOpenXunShanMoney = this.addExtraNature(9);
        UserProxy.inst.subXunShanTime = this.addExtraNature(10);
        UserProxy.inst.subRiseXunShanMoney = this.addExtraNature(11);
        UserProxy.inst.addXunShanAward = this.addExtraNature(12);
        UserProxy.inst.subFriendMoney = this.addExtraNature(13);
        UserProxy.inst.subMissonHp = this.addExtraNature(14);
        UserProxy.inst.subSecretHp = this.addExtraNature(15);
        UserProxy.inst.addSecretAward = this.addExtraNature(16);
        UserProxy.inst.addTurnMedal = this.addExtraNature(17);
    };
    p.addExtraNature = function (type) {
        var shouldAdd = 1;
        //法宝
        var addWeapon = 1;
        for (var c in UserProxy.inst.weaponList) {
            var weaponInfo = UserProxy.inst.weaponList[c];
            var weaponData = Config.WeaponData[c];
            var value1 = weaponData["attr_1"];
            var value2 = weaponData["attr_2"];
            var add1 = parseFloat(value1[2]) * (1 + 0.1 * weaponInfo["lv"]);
            var target1 = parseInt(value1[0]); //加成目标
            var add2 = 0;
            var target2 = 0;
            if (value2) {
                add2 = parseFloat(value2[2]) * (1 + 0.1 * weaponInfo["lv"]);
                target2 = parseInt(value2[0]); //加成目标
            }
            if (target1 == type) {
                addWeapon += add1;
            }
            if (target2 == type) {
                addWeapon += add2;
            }
        }
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
                for (var j = 1; j <= suitNum.length; j++) {
                    if (count >= parseInt(suitNum[j - 1])) {
                        var suitValue = suitData["attr_" + j];
                        var nature = parseInt(suitValue[0]); //加成类型
                        var add = parseFloat(suitValue[2]); //加成值
                        if (type == nature) {
                            addSuit *= (1 + add);
                            break;
                        }
                    }
                }
                addedSuit.push(weaponData["suit"]);
            }
        }
        //情缘
        var addShip = 1;
        for (var k in UserProxy.inst.relationship) {
            var shipInfo = UserProxy.inst.relationship[k];
            var shipData = Config.FriendshipData[k];
            var parm = shipData["attr_parm"];
            if (shipInfo["lv"]) {
                var shipValue = shipData["attr_1"];
                var nature = parseInt(shipValue[0]); //加成类型
                var add = parseFloat(shipValue[2]) * (Math.pow(parm, shipInfo["lv"] - 1)); //加成值
                if (type == nature) {
                    addShip *= (1 + add);
                }
            }
        }
        //矿洞
        var addCave = 1;
        var building = UserProxy.inst.building;
        if (building) {
            for (var c in building) {
                var id = parseInt(c);
                var build = building[c];
                if (build["lv"]) {
                    var caveData = Config.CaveData[build["lv"]];
                    var caveValue = caveData["attr_" + id];
                    var nature = parseInt(caveValue[0]); //加成类型
                    var add = parseFloat(caveValue[2]); //加成值
                    if (type == nature) {
                        addCave *= add;
                        break;
                    }
                }
            }
        }
        add = shouldAdd * addShip * addWeapon * addSuit * addCave;
        return add;
    };
    /**
     * 前往
     * @param goType
     */
    p.typeGo = function (goType) {
        switch (goType) {
            case 1:
                PanelManager.inst.showPanel("FriendMainPanel", 1);
                break;
            case 2:
                MenuPanel.inst.openMenu(6);
                break;
            case 3:
                MenuPanel.inst.openMenu(1);
                break;
            case 4:
                PanelManager.inst.showPanel("ActivePanel", 3);
                break;
            case 5:
                MenuPanel.inst.openMenu(2);
                break;
            case 6:
                MenuPanel.inst.openMenu(2);
                break;
            case 7:
                MenuPanel.inst.openMenu(2);
                PanelManager.inst.showPanel("RoleDrawPanel");
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                MenuPanel.inst.openMenu(3);
                break;
            case 11:
                break;
            case 12:
                PanelManager.inst.showPanel("FriendMainPanel", 3);
                break;
            case 13:
                break;
        }
    };
    p.sevenDayGo = function (type) {
        PanelManager.inst.hidePanel("SevenDayPanel");
        switch (type) {
            case 1:
                PanelManager.inst.showPanel("ActivePanel", 1);
                break;
            case 2:
                MenuPanel.inst.openMenu(6);
                break;
            case 3:
                MenuPanel.inst.openMenu(1);
                break;
            case 4:
                MenuPanel.inst.openMenu(2);
                break;
            case 5:
                MenuPanel.inst.openMenu(2);
                PanelManager.inst.showPanel("RoleDrawPanel");
                break;
            case 6:
                MenuPanel.inst.openMenu(4);
                break;
            case 7:
                MenuPanel.inst.openMenu(2);
                break;
            case 8:
                MenuPanel.inst.openMenu(5);
                break;
            case 9:
                MenuPanel.inst.openMenu(5);
                break;
            case 11:
                break;
            case 12:
                MenuPanel.inst.openMenu(2);
                break;
        }
    };
    p.getStageJade = function (awardNum) {
        var reward3 = parseFloat(awardNum);
        var award;
        if (UserProxy.inst.historyArea >= 50) {
            award = Math.floor((UserProxy.inst.historyArea - 50 + parseFloat(Config.BaseData[12]["value"])) * reward3);
        }
        else {
            award = Math.floor(parseFloat(Config.BaseData[12]["value"]) * reward3);
        }
        return MathUtil.easyNumber(award);
    };
    p.getWeaponCoinStage = function (rewardData) {
        var award;
        var reward = rewardData.concat();
        var dataAdd = parseFloat(rewardData[2]);
        var base = parseFloat(Config.BaseData[60]["value"]);
        var id = 0;
        switch (parseInt(reward[0])) {
            case 17:
                var level = UserProxy.inst.dungeonList[1]["dungeonId"];
                id = 1000 + level;
                break;
            case 18:
                var level = UserProxy.inst.dungeonList[2]["dungeonId"];
                id = 2000 + level;
                break;
            case 19:
                var level = UserProxy.inst.dungeonList[3]["dungeonId"];
                id = 3000 + level;
                break;
            case 20:
                var level = UserProxy.inst.dungeonList[4]["dungeonId"];
                id = 4000 + level;
                break;
            case 21:
                var level = UserProxy.inst.dungeonList[5]["dungeonId"];
                id = 5000 + level;
                break;
        }
        if (level) {
            var weaponFb = Config.WeaponFb[id];
            var add = parseInt(weaponFb["reward_1"][2]);
            award = Math.floor(add * dataAdd);
        }
        else {
            award = Math.floor(base * dataAdd);
        }
        return MathUtil.easyNumber(award);
    };
    p.dailyNowPar = function (id) {
        var nowParm;
        switch (id) {
            case 1:
                nowParm = UserProxy.inst.taskObj["invite"];
                break;
            case 2:
                nowParm = UserProxy.inst.taskObj["rmb"];
                break;
            case 3:
                nowParm = UserProxy.inst.taskObj["moneyUp"];
                break;
            case 4:
                nowParm = UserProxy.inst.taskObj["moneyTree"];
                break;
            case 5:
                nowParm = UserProxy.inst.taskObj["heroUp"];
                break;
            case 6:
                nowParm = UserProxy.inst.taskObj["enhance"];
                break;
            case 7:
                nowParm = UserProxy.inst.taskObj["drawHero"];
                break;
            case 8:
                nowParm = UserProxy.inst.taskObj["area"];
                break;
            case 9:
                nowParm = UserProxy.inst.taskObj["monster"];
                break;
            case 10:
                nowParm = UserProxy.inst.taskObj["dungeon"];
                break;
            case 11:
                nowParm = UserProxy.inst.taskObj["circle"];
                break;
            case 12:
                nowParm = UserProxy.inst.taskObj["sendVit"];
                break;
            case 13:
                nowParm = UserProxy.inst.taskObj["event"];
                break;
            case 14:
                nowParm = UserProxy.inst.taskObj["pvpNum"];
                break;
        }
        return nowParm;
    };
    p.achieveNowPar = function (id) {
        var nowParm;
        switch (id) {
            case 1:
                nowParm = UserProxy.inst.achievementObj["area"];
                break;
            case 2:
                nowParm = UserProxy.inst.achievementObj["box"];
                break;
            case 3:
                nowParm = UserProxy.inst.achievementObj["circle"];
                break;
            case 4:
                nowParm = UserProxy.inst.achievementObj["drawHero"];
                break;
            case 5:
                nowParm = UserProxy.inst.achievementObj["heroNum"];
                break;
            case 6:
                nowParm = UserProxy.inst.achievementObj["enhance"];
                break;
            case 7:
                nowParm = UserProxy.inst.achievementObj["star"];
                break;
            case 8:
                nowParm = UserProxy.inst.achievementObj["relationNum"];
                break;
            case 9:
                nowParm = UserProxy.inst.achievementObj["monsterNum"];
                break;
            case 10:
                nowParm = UserProxy.inst.achievementObj["monsterUp"];
                break;
            case 11:
                nowParm = UserProxy.inst.achievementObj["weaponRank"];
                break;
            case 12:
                nowParm = UserProxy.inst.achievementObj["weaponNum"];
                break;
            case 13:
                nowParm = UserProxy.inst.achievementObj["moneyNum"];
                break;
            case 14:
                nowParm = UserProxy.inst.achievementObj["pvpWinNum"];
                break;
            case 15:
                nowParm = UserProxy.inst.achievementObj["pvpContinueWin"];
                break;
        }
        return nowParm;
    };
    p.shareCheck = function () {
        if (UserProxy.inst.shareObj["dayShareCount"] < 3) {
            var leftTime = parseInt(Config.BaseData[36]["value"]) * 60 - (UserProxy.inst.server_time - UserProxy.inst.shareObj["lastShareTime"]);
            if (leftTime <= 0) {
                this._shareShowPoint = true;
                return true;
            }
        }
        this._shareShowPoint = false;
        return false;
    };
    p.dailyCheck = function () {
        for (var i in Config.DailyTaskData) {
            var dailyData = Config.DailyTaskData[i];
            if (!UserMethod.inst.isBitGet(parseInt(dailyData["id"]), UserProxy.inst.taskBit)) {
                var endParm = dailyData["task_parm"];
                var nowParm = UserMethod.inst.dailyNowPar(parseInt(dailyData["task_type"]));
                if (nowParm >= endParm) {
                    this._dailyPointShow = true;
                    return true;
                }
            }
        }
        this._dailyPointShow = false;
        return false;
    };
    p.achieveCheck = function () {
        for (var i in Config.AchievementData) {
            var achievementData = Config.AchievementData[i];
            if (!UserMethod.inst.isBitGet(parseInt(i), UserProxy.inst.achieveBit)) {
                var endParm = achievementData["achv_parm"];
                var nowParm = UserMethod.inst.achieveNowPar(parseInt(achievementData["achv_type"]));
                if (nowParm >= endParm) {
                    this._achievePointShow = true;
                    return true;
                }
            }
        }
        this._achievePointShow = false;
        return false;
    };
    p.targetCheck = function () {
        if (this.isTargetEnd()) {
            return false;
        }
        var nowGroup = UserProxy.inst.missionObj["group"];
        var firstId = Math.floor(nowGroup / 5) * 5 + 1;
        var groupId = firstId + 4;
        for (var i = firstId; i < groupId; i++) {
            var missionData = Config.TargetData[i];
            var endParm = missionData["task_num"];
            var nowParm = UserMethod.inst.targetFinish(missionData);
            if (!UserMethod.inst.isBitGet(missionData["id"], UserProxy.inst.missionBit)) {
                if (nowParm >= endParm) {
                    return true;
                }
            }
        }
        return false;
    };
    p.isTargetEnd = function () {
        var nowGroup = UserProxy.inst.missionObj["group"];
        var firstId = Math.floor(nowGroup / 5) * 5 + 1;
        var firstMission = Config.TargetData[firstId];
        if (!firstMission) {
            return true;
        }
        return false;
    };
    p.dialCheck = function () {
        return UserProxy.inst.wheelTimes > 0;
    };
    p.posterCheck = function () {
        if (UserProxy.inst.inviteUserInfos) {
            var inviteLength = UserProxy.inst.inviteUserInfos.length;
            for (var i in Config.InviteData) {
                if (UserProxy.inst.inviteUserInfos && parseInt(i) <= inviteLength) {
                    var id = parseInt(i);
                    if (!UserMethod.inst.isBitGet(id, UserProxy.inst.inviteObj["inviteBit"])) {
                        this._invitePoint = true;
                        return true;
                    }
                }
            }
        }
        this._invitePoint = false;
        return false;
    };
    p.sevenDayCheck = function () {
        var today = UserMethod.inst.activeDay();
        if (!today) {
            if (this.activeDayEndTime() > UserProxy.inst.server_time) {
                today = 7;
            }
        }
        if (today) {
            for (var i = 1; i < 8; i++) {
                for (var c in Config.SevenDayData) {
                    var sevenDayData = Config.SevenDayData[c];
                    if (parseInt(sevenDayData["day"]) == today) {
                        var endValue = sevenDayData["task_num"];
                        var nowValue = UserMethod.inst.sevenDayFinish(sevenDayData);
                        if (!UserMethod.inst.isBitGet(Number(sevenDayData["id"]), UserProxy.inst.sevenDayBit)) {
                            if (nowValue >= endValue) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    };
    p.privilegeCheck = function () {
        if (UserProxy.inst.vipObj["monthVIP"]) {
            if (!UserProxy.inst.vipObj["monthFlag"]) {
                return true;
            }
        }
        if (UserProxy.inst.vipObj["foreverVIP"]) {
            if (!UserProxy.inst.vipObj["foreverFlag"]) {
                return true;
            }
        }
        return false;
    };
    p.mailCheck = function () {
        for (var i in UserProxy.inst.mail) {
            var mailInfo = UserProxy.inst.mail[i];
            if (!mailInfo["state"]) {
                return true;
            }
        }
        return false;
    };
    p.activeCheck = function (actNum) {
        var signShow = false;
        var dayInviteShow = false;
        var fundCheckShow = false;
        var fruitShow = false;
        if (actNum) {
            signShow = this.signCheck();
            dayInviteShow = this._inviteShowPoint;
            fundCheckShow = this._fundPointShow;
            fruitShow = this._fruitPointShow;
            switch (actNum) {
                case 1:
                    signShow = this.signCheck();
                    break;
                case 2:
                    dayInviteShow = this.dayInviteCheck();
                    break;
                case 3:
                    fundCheckShow = this.fundCheck();
                    break;
                case 4:
                    fruitShow = this.fruitCheck();
                    break;
            }
        }
        else {
            signShow = this.signCheck();
            dayInviteShow = this.dayInviteCheck();
            fundCheckShow = this.fundCheck();
            fruitShow = this.fruitCheck();
        }
        if (signShow || dayInviteShow || fundCheckShow || fruitShow) {
            return true;
        }
        return false;
    };
    p.friendCheck = function () {
        if (this.shareCheck() || this.posterCheck()) {
            return true;
        }
    };
    p.openLimitActive = function () {
        if (this.isWordOpen() || this.isRechargeOpen() || this.isCostOpen() || this.isOnePayOpen() || this.isInviteDoubleOpen() || this.isFestivalOpen()) {
            return true;
        }
        return false;
    };
    p.limitActiveCheck = function (limit) {
        var rechargeShow = false;
        var wordShow = false;
        var costShow = false;
        var onPay = false;
        var festivalShow = false;
        if (limit) {
            rechargeShow = this._actRechargeShow;
            wordShow = this._actWordShow;
            costShow = this._actCostShow;
            onPay = this._actOnePayShow;
            festivalShow = this._actFestivalShow;
            switch (limit) {
                case 1:
                    rechargeShow = this.checkRechargePoint();
                    break;
                case 2:
                    wordShow = this.checkWordPoint();
                    break;
                case 3:
                    costShow = this.checkCostPoint();
                    break;
                case 4:
                    onPay = this.checkOnePayPoint();
                    break;
                case 5:
                    festivalShow = this.checkFestivalPoint();
                    break;
            }
        }
        else {
            rechargeShow = this.checkRechargePoint();
            wordShow = this.checkWordPoint();
            costShow = this.checkCostPoint();
            onPay = this.checkOnePayPoint();
            festivalShow = this.checkFestivalPoint();
        }
        if (rechargeShow || wordShow || costShow || onPay || festivalShow) {
            return true;
        }
        return false;
    };
    p.circleGoCheck = function () {
        var goMission = UserProxy.inst.circleObj["lastCircleArea"] - parseInt(Config.BaseData[69]["value"]);
        if (UserProxy.inst.circleObj["lastCircleArea"] >= parseInt(Config.BaseData[68]["value"]) && UserProxy.inst.curArea < goMission) {
            return true;
        }
        return false;
    };
    p.noticeShowCheck = function () {
        var version = Config.NoticeData[1]["version"];
        var noticeTime = new Date();
        noticeTime.setTime(version * 1000);
        var noticeYear = noticeTime.getFullYear();
        var noticeMonth = noticeTime.getMonth();
        var noticeDay = noticeTime.getDay();
        var nowTime = new Date();
        nowTime.setTime(UserProxy.inst.server_time * 1000);
        var nowYear = nowTime.getFullYear();
        var nowMonth = nowTime.getMonth();
        var nowDay = nowTime.getDay();
        if (noticeYear == nowYear && noticeMonth == nowMonth && noticeDay == nowDay) {
            UserProxy.inst.noticeOpen = true;
        }
        else {
            UserProxy.inst.noticeOpen = false;
        }
    };
    p.signCheck = function () {
        return !UserProxy.inst.todayFlag;
    };
    p.dayInviteCheck = function () {
        for (var c in Config.DailyInviteData) {
            var dailyInviteData = Config.DailyInviteData[c];
            if (!UserMethod.inst.isBitGet(parseInt(dailyInviteData["id"]), UserProxy.inst.shareObj["shareBit"])) {
                if (UserProxy.inst.shareObj["shareCount"] >= parseInt(dailyInviteData["invite_days"])) {
                    this._inviteShowPoint = true;
                    return true;
                }
            }
        }
        this._inviteShowPoint = false;
        return false;
    };
    p.fundCheck = function () {
        if (UserProxy.inst.vipObj["fund"]) {
            for (var i in Config.DailyFundData) {
                var fundData = Config.DailyFundData[i];
                if (!UserMethod.inst.isBitGet(parseInt(i), UserProxy.inst.vipObj["fundBit"])) {
                    if (UserProxy.inst.historyArea > parseInt(fundData["floor"])) {
                        this._fundPointShow = true;
                        return true;
                    }
                }
            }
        }
        this._fundPointShow = false;
        return false;
    };
    p.fruitCheck = function () {
        if (UserProxy.inst.circleObj["circleTimes"] < 1) {
            this._fruitPointShow = false;
            return false;
        }
        var date = new Date(UserProxy.inst.server_time * 1000);
        var hour = date.getHours();
        if (hour >= 11 && hour < 15) {
            if (!BitUtil.isBitTrueByString(0, UserProxy.inst.dailyObj["freeVitBit"])) {
                this._fruitPointShow = true;
                return true;
            }
        }
        else if (hour >= 15 && hour < 19) {
            if (!BitUtil.isBitTrueByString(1, UserProxy.inst.dailyObj["freeVitBit"])) {
                this._fruitPointShow = true;
                return true;
            }
        }
        else if (hour >= 19 && hour < 23) {
            if (!BitUtil.isBitTrueByString(2, UserProxy.inst.dailyObj["freeVitBit"])) {
                this._fruitPointShow = true;
                return true;
            }
        }
        this._fruitPointShow = false;
        return false;
    };
    p.drawHeroCheck = function () {
        if (UserProxy.inst.historyArea < 10) {
            this._drawPointShow = false;
            return false;
        }
        var base = parseInt(Config.BaseData[43]["value"]);
        var time = (base * 60) - (UserProxy.inst.server_time - UserProxy.inst.lastFreeTime);
        if (time <= 0 || UserProxy.inst.ticket) {
            this._drawPointShow = true;
            return true;
        }
        this._drawPointShow = false;
        return false;
    };
    p.formationCheck = function () {
        if (UserProxy.inst.circleObj["circleTimes"] >= 1) {
            return false;
        }
        var battleArr = UserProxy.inst.fightData.getPVEFormation();
        var length = battleArr.length;
        if (length >= 6) {
            return false;
        }
        var count = 0;
        for (var i in UserProxy.inst.heroData.getHeroIds()) {
            var id = UserProxy.inst.heroData.getHeroIds()[i];
            var heroData = UserProxy.inst.heroData.getHeroData(id);
            if (heroData.level) {
                count++;
            }
        }
        if (count > length && length < 6) {
            return true;
        }
        return false;
    };
    p.starCheck = function () {
        for (var i in UserProxy.inst.heroData.getHeroIds()) {
            var id = UserProxy.inst.heroData.getHeroIds()[i];
            var heroData = UserProxy.inst.heroData.getHeroData(id);
            if (heroData.starPiece) {
                var quality = parseInt(heroData.config.quality);
                var starData = Config.HeroStarData[heroData.starLevel + 1];
                var needChip = starData["rank_chip_" + quality];
                var needPill = starData["rank_pill_" + quality];
                var starPiece = heroData.starPiece;
                var chipEnough = 0;
                var pillEnough = 0;
                if (starPiece >= needChip) {
                    chipEnough = 1;
                }
                if (UserProxy.inst.pill >= needPill) {
                    pillEnough = 1;
                }
                if (chipEnough && pillEnough) {
                    var starMax = parseInt(Config.BaseData[67]["value"][quality - 1]);
                    if (heroData.starLevel < starMax) {
                        this._starPointShow = true;
                        return true;
                    }
                }
            }
        }
        this._starPointShow = false;
        return false;
    };
    p.oneStarCheck = function (id) {
        var heroData = UserProxy.inst.heroData.getHeroData(id);
        var quality = parseInt(heroData.config.quality);
        var starData = Config.HeroStarData[heroData.starLevel + 1];
        var needChip = starData["rank_chip_" + quality];
        var needPill = starData["rank_pill_" + quality];
        var starPiece = heroData.starPiece;
        var chipEnough = 0;
        var pillEnough = 0;
        var starMax = parseInt(Config.BaseData[67]["value"][quality - 1]);
        if (heroData.starLevel < starMax) {
            if (starPiece >= needChip) {
                chipEnough = 1;
            }
            if (UserProxy.inst.pill >= needPill) {
                pillEnough = 1;
            }
        }
        if (chipEnough && pillEnough) {
            return true;
        }
        return false;
    };
    p.shipCheck = function () {
        for (var i in UserProxy.inst.heroData.getHeroIds()) {
            var id = UserProxy.inst.heroData.getHeroIds()[i];
            var heroData = UserProxy.inst.heroData.getHeroData(id);
            var ships = heroData.config.friendly;
            var shipsLength = ships.length;
            for (var j = 0; j < shipsLength; j++) {
                var shipData = Config.FriendshipData[ships[j]];
                var shipInfo = UserProxy.inst.relationship[ships[j]];
                var heroLength = shipData["herogroup"].length;
                var starCount = 0;
                var notHad = true;
                for (var k = 0; k < heroLength; k++) {
                    var roleId = shipData["herogroup"][k];
                    var roleInfo = UserProxy.inst.heroData.getValue(roleId);
                    starCount += roleInfo.starLevel;
                    if (!roleInfo.starLevel) {
                        notHad = false;
                    }
                }
                var shipLv = shipInfo["lv"];
                var needStar = shipData["stars"][shipLv];
                if (shipLv < 10) {
                    if (starCount >= needStar && notHad) {
                        this._shipPointShow = true;
                        return true;
                    }
                }
            }
        }
        this._shipPointShow = false;
        return false;
    };
    p.oneShipCheck = function (id) {
        var heroData = UserProxy.inst.heroData.getHeroData(id);
        var ships = heroData.config.friendly;
        var shipsLength = ships.length;
        for (var j = 0; j < shipsLength; j++) {
            var shipData = Config.FriendshipData[ships[j]];
            var shipInfo = UserProxy.inst.relationship[ships[j]];
            var heroLength = shipData["herogroup"].length;
            var starCount = 0;
            var notHad = true;
            for (var k = 0; k < heroLength; k++) {
                var roleId = shipData["herogroup"][k];
                var roleInfo = UserProxy.inst.heroData.getValue(roleId);
                starCount += roleInfo.starLevel;
                if (!roleInfo.starLevel) {
                    notHad = false;
                }
            }
            var shipLv = shipInfo["lv"];
            var needStar = shipData["stars"][shipLv];
            if (shipLv < 10) {
                if (starCount >= needStar && notHad) {
                    return true;
                }
            }
        }
        return false;
    };
    p.getConfigHeadId = function (string) {
        var index = string.indexOf("_");
        var head = string.substring(0, index);
        return parseInt(head);
    };
    p.getHeadImg = function (string) {
        var headStr = null;
        var index = string.indexOf("_");
        var head = string.substring(0, index);
        var headId = parseInt(head);
        var headData = Config.HeadData[headId];
        if (headData) {
            if (headId > 12) {
                headStr = Global.getChaIcon(headData["head_res"]);
            }
            else {
                headStr = Global.getSecretIcon(headData["head_res"]);
            }
        }
        return headStr;
    };
    /**
     * 限时活动----
     */
    p.isWordOpen = function () {
        var actWord = UserProxy.inst.activityObj[101];
        if (!actWord || !actWord["id"]) {
            return false;
        }
        var id = actWord["id"];
        var actData = Config.ActivityData[id];
        if (!actData) {
            return false;
        }
        var start_time = actData["time_start"];
        var end_time = actData["time_exchange"];
        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    };
    p.checkWordPoint = function () {
        if (!this.isWordOpen()) {
            this._actWordShow = false;
            return false;
        }
        for (var i = 1; i < 6; i++) {
            var enable = [];
            var wordData = Config.ActWordData[i];
            var wordLength = wordData["condition"].length;
            for (var j = 0; j < wordLength; j++) {
                var wordId = parseInt(wordData["condition"][j]);
                var collectWord = UserProxy.inst.activityObj[101]["collectWord"].concat();
                var count = collectWord[wordId - 1];
                if (count > 0) {
                    enable.push(1);
                }
                else {
                    enable.push(0);
                }
            }
            var calEnable = 1;
            for (var j = 0; j < enable.length; j++) {
                calEnable *= enable[j];
            }
            if (calEnable) {
                this._actWordShow = true;
                return true;
            }
        }
        this._actWordShow = false;
        return false;
    };
    p.isRechargeOpen = function () {
        var actRecharge = UserProxy.inst.activityObj[102];
        if (!actRecharge || !actRecharge["id"]) {
            return false;
        }
        var id = actRecharge["id"];
        var actData = Config.ActivityData[id];
        if (!actData) {
            return false;
        }
        var start_time = actData["time_start"];
        var end_time = actData["time_exchange"];
        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    };
    p.checkRechargePoint = function () {
        if (!this.isRechargeOpen()) {
            this._actRechargeShow = false;
            return false;
        }
        for (var i in Config.ActAddBuyData) {
            var payData = Config.ActAddBuyData[i];
            var actObj = UserProxy.inst.activityObj[102];
            if (!UserMethod.inst.isBitGet(parseInt(payData["id"]), actObj["rmbActBit"])) {
                if (parseInt(payData["condition"]) <= actObj["rmbAct"]) {
                    this._actRechargeShow = true;
                    return true;
                }
            }
        }
        this._actRechargeShow = false;
        return false;
    };
    p.isCostOpen = function () {
        var actRecharge = UserProxy.inst.activityObj[103];
        if (!actRecharge || !actRecharge["id"]) {
            return false;
        }
        var id = actRecharge["id"];
        var actData = Config.ActivityData[id];
        if (!actData) {
            return false;
        }
        var start_time = actData["time_start"];
        var end_time = actData["time_exchange"];
        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    };
    p.checkCostPoint = function () {
        if (!this.isCostOpen()) {
            this._actCostShow = false;
            return false;
        }
        for (var i in Config.ActAddCostData) {
            var costData = Config.ActAddCostData[i];
            var actObj = UserProxy.inst.activityObj[103];
            if (!UserMethod.inst.isBitGet(parseInt(costData["id"]), actObj["consumeActBit"])) {
                if (parseInt(costData["condition"]) <= actObj["consumeAct"]) {
                    this._actCostShow = true;
                    return true;
                }
            }
        }
        this._actCostShow = false;
        return false;
    };
    p.isOnePayOpen = function () {
        var actRecharge = UserProxy.inst.activityObj[106];
        if (!actRecharge || !actRecharge["id"]) {
            return false;
        }
        var id = actRecharge["id"];
        var actData = Config.ActivityData[id];
        if (!actData) {
            return false;
        }
        var start_time = actData["time_start"];
        var end_time = actData["time_exchange"];
        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    };
    p.checkOnePayPoint = function () {
        if (!this.isOnePayOpen()) {
            this._actOnePayShow = false;
            return false;
        }
        for (var i in Config.ActSingleBuyData) {
            var costData = Config.ActSingleBuyData[i];
            var actObj = UserProxy.inst.activityObj[106];
            if (!UserMethod.inst.isBitGet(parseInt(costData["id"]), actObj["dayRMBBit"])) {
                if (actObj["todayRMB"][parseInt(i) - 1] >= 1) {
                    this._actOnePayShow = true;
                    return true;
                }
            }
        }
        this._actOnePayShow = false;
        return false;
    };
    p.isInviteDoubleOpen = function () {
        var actRecharge = UserProxy.inst.activityObj[105];
        if (!actRecharge || !actRecharge["id"]) {
            return false;
        }
        var id = actRecharge["id"];
        var actData = Config.ActivityData[id];
        if (!actData) {
            return false;
        }
        var start_time = Config.ActivityData[id]["time_start"];
        var end_time = Config.ActivityData[id]["time_exchange"];
        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    };
    p.checkMinePoint = function () {
        //矿满
        var mineData = UserProxy.inst.home["mine"];
        this._mineFullPoint = false;
        for (var i = 0; i < 3; i++) {
            if (!UserProxy.inst.mineOutputAry) {
                this._mineFullPoint = false;
                break;
            }
            var outPut = UserProxy.inst.mineOutputAry[i];
            var outPutMax = mineData[i + 1]["maxOutput"];
            if (outPut >= outPutMax) {
                this._mineFullPoint = true;
                break;
            }
        }
        //建筑可升级
        this._mineBuildPoint = false;
        var openArea = Config.BaseData[74]["value"];
        for (var c in UserProxy.inst.building) {
            var buildInfo = UserProxy.inst.building[c];
            if (!buildInfo) {
                this._mineBuildPoint = false;
                break;
            }
            var nextCaveData;
            var lv = buildInfo["lv"];
            if (!lv) {
                nextCaveData = Config.CaveData[1];
            }
            else {
                nextCaveData = Config.CaveData[lv + 1];
            }
            if (nextCaveData) {
                var idx = parseInt(c);
                var cost = nextCaveData["build_cost_" + idx];
                if (UserProxy.inst.ore >= cost) {
                    if (idx == 1) {
                        this._mineBuildPoint = true;
                    }
                    else if (idx == 2 && UserProxy.inst.historyArea >= parseInt(openArea[1])) {
                        this._mineFullPoint = true;
                    }
                    else if (idx == 3 && UserProxy.inst.historyArea >= parseInt(openArea[2])) {
                        this._mineFullPoint = true;
                    }
                    break;
                }
            }
        }
        if (this._mineBuildPoint || this._mineFullPoint) {
            return true;
        }
        return false;
    };
    p.isFestivalOpen = function () {
        var actRecharge = UserProxy.inst.activityObj[111];
        if (!actRecharge || !actRecharge["id"]) {
            return false;
        }
        var id = actRecharge["id"];
        var actData = Config.ActivityData[id];
        if (!actData) {
            return false;
        }
        var start_time = Config.ActivityData[id]["time_start"];
        var end_time = Config.ActivityData[id]["time_exchange"];
        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    };
    p.checkFestivalPoint = function () {
        if (!this.isFestivalOpen()) {
            this._actFestivalShow = false;
            return false;
        }
        var actFestival = UserProxy.inst.activityObj[111];
        var buyFlag = actFestival["buyFlag"];
        var timesAry = actFestival["timesAry"];
        var todayFlag = actFestival["todayFlag"];
        for (var i = 0; i < 3; i++) {
            var actInvest = Config.ActInvestData;
            var nowActData = actInvest[i + 1];
            var buy = buyFlag[i];
            var times = timesAry[i];
            var today = todayFlag[i];
            if (buy) {
                if (!today && times < parseInt(nowActData["days"])) {
                    this._actFestivalShow = true;
                    return true;
                }
            }
        }
        this._actFestivalShow = false;
        return false;
    };
    UserMethod._instance = null;
    return UserMethod;
}(egret.HashObject));
egret.registerClass(UserMethod,'UserMethod');
//# sourceMappingURL=UserMethod.js.map