/**
 * 进入游戏返回
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var NetEnterCmd = (function (_super) {
    __extends(NetEnterCmd, _super);
    function NetEnterCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetEnterCmd,p=c.prototype;
    p.execute = function () {
        Config.init();
        fight.init();
        UserProxy.inst.server_time = this.data["serverTime"];
        UserProxy.inst.gold = this.data["gold"];
        UserProxy.inst.diamond = this.data["diamond"];
        UserProxy.inst.curArea = this.data["curArea"];
        UserProxy.inst.historyArea = this.data["historyArea"];
        UserProxy.inst.nickname = this.data["nickname"];
        UserProxy.inst.headimgurl = this.data["headimgurl"];
        UserProxy.inst.isFocus = this.data["isfocus"];
        UserProxy.inst.uid = this.data["uid"];
        /**weaponObj*/
        UserProxy.inst.weaponList = this.data["weaponObj"]["weaponList"];
        UserProxy.inst.maxNum = this.data["weaponObj"]["maxNum"];
        UserProxy.inst.buyNum = this.data["weaponObj"]["buyNum"];
        UserProxy.inst.weaponCoin = this.data["weaponObj"]["weaponCoin"];
        UserProxy.inst.weaponShop = this.data["weaponObj"]["weaponShop"];
        UserProxy.inst.weaponShopResetLastTime = this.data["weaponObj"]["weaponShopResetLastTime"];
        /**monsterObj*/
        UserProxy.inst.monsterObj = this.data["monsterObj"];
        UserProxy.inst.allKindPiece = this.data["monsterObj"]["allKindPiece"];
        UserProxy.inst.buyVitTimes = this.data["monsterObj"]["buyVitTimes"];
        UserProxy.inst.monsterList = this.data["monsterObj"]["monsterList"];
        UserProxy.inst.score = this.data["monsterObj"]["score"];
        UserProxy.inst.vitality = this.data["monsterObj"]["vitality"];
        UserProxy.inst.vitalityMax = this.data["monsterObj"]["vitalityMax"];
        UserProxy.inst.recoverNum = this.data["monsterObj"]["recoverNum"];
        /**dungeonObj*/
        UserProxy.inst.buyTimes = this.data["dungeonObj"]["buyTimes"];
        UserProxy.inst.dungeonList = this.data["dungeonObj"]["dungeonList"];
        UserProxy.inst.freeTimes = this.data["dungeonObj"]["freeTimes"];
        UserProxy.inst.dungeonLastRecoverTime = this.data["dungeonObj"]["lastRecoverTime"];
        UserProxy.inst.maxTimes = this.data["dungeonObj"]["maxTimes"];
        /**achievement、task、mission*/
        UserProxy.inst.achievementObj = this.data["achievementObj"];
        UserProxy.inst.achieveBit = this.data["achievementObj"]["achieveBit"];
        UserProxy.inst.taskObj = this.data["taskObj"];
        UserProxy.inst.taskBit = this.data["taskObj"]["taskBit"];
        UserProxy.inst.missionObj = this.data["missionObj"];
        UserProxy.inst.missionBit = this.data["missionObj"]["missionBit"];
        /**dailyObj*/
        UserProxy.inst.dailyObj = this.data["dailyObj"];
        /**shareObj*/
        UserProxy.inst.shareObj = this.data["shareObj"];
        UserProxy.inst.lastShareTime = this.data["shareObj"]["lastShareTime"];
        UserProxy.inst.vipObj = this.data["vipObj"];
        /**pvpShopObj*/
        UserProxy.inst.pvpShopObj = this.data["pvpShopObj"];
        /**friendObj*/
        UserProxy.inst.newMsg = this.data["friendObj"]["newMsg"];
        UserProxy.inst.giftMsg = this.data["friendObj"]["giftMsg"];
        UserProxy.inst.friendCoin = this.data["friendObj"]["friendCoin"];
        UserProxy.inst.friendTimes = this.data["friendObj"]["friendTimes"];
        UserProxy.inst.getGiftTimes = this.data["friendObj"]["getGiftTimes"];
        UserProxy.inst.friendList = this.data["friendObj"]["friendList"];
        /**circleObj*/
        UserProxy.inst.circleObj = this.data["circleObj"];
        UserProxy.inst.medal = this.data["circleObj"]["medal"];
        /**shopObj*/
        UserProxy.inst.shopObj = this.data["shopObj"];
        /**sevenDay*/
        UserProxy.inst.sevenDayBegTime = this.data["sevenDay"]["sevenDayBegTime"];
        UserProxy.inst.sevenDayBit = this.data["sevenDay"]["sevenDayBit"];
        UserProxy.inst.sevenBuyBit = this.data["sevenDay"]["sevenBuyBit"];
        UserProxy.inst.rmbDays = this.data["sevenDay"]["rmbDays"];
        /**drawObj*/
        UserProxy.inst.drawTimes = this.data["drawObj"]["drawTimes"];
        UserProxy.inst.lastFreeTime = this.data["drawObj"]["lastFreeTime"];
        UserProxy.inst.ticket = this.data["drawObj"]["ticket"];
        UserProxy.inst.soulCoin = this.data["drawObj"]["soulCoin"];
        UserProxy.inst.lastSignTime = this.data["signObj"]["lastSignTime"];
        UserProxy.inst.signDays = this.data["signObj"]["signDays"];
        UserProxy.inst.todayFlag = this.data["signObj"]["todayFlag"];
        UserProxy.inst.inviteObj = this.data["inviteObj"];
        UserProxy.inst.activityObj = this.data["activityObj"];
        UserProxy.inst.mailFlag = this.data["mailFlag"];
        UserProxy.inst.mail = this.data["mailObj"]["mail"];
        UserProxy.inst.makeMoney = this.data["makeMoney"];
        UserProxy.inst.pill = this.data["pill"];
        UserProxy.inst.relationship = this.data["relationship"];
        UserProxy.inst.rechargeFlag = this.data["rechargeFlag"];
        UserProxy.inst.wheelTimes = this.data["battleObj"]["wheelTimes"];
        UserProxy.inst.offlineGold = this.data["offlineCoin"];
        UserProxy.inst.offlineTime = this.data["offlineTime"];
        UserProxy.inst.todayEnter = this.data["todayEnter"];
        /**home*/
        UserProxy.inst.home = this.data["home"];
        UserProxy.inst.building = UserProxy.inst.home["building"];
        UserProxy.inst.ore = UserProxy.inst.home["ore"];
        UserProxy.inst.rmbGet = this.data["rmbGet"];
        UserProxy.inst.guide = this.data["guideBit"] ? this.data["guideBit"] : "00000000000000";
        UserMethod.inst.setExterAdd();
        /***/
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        UserProxy.inst.fightData.parse(this.data["battleObj"]);
        UserProxy.inst.newObj = this.data.newObj;
        if (this.data["setup"]) {
            UserProxy.inst.setting = this.data["setup"];
            UserProxy.inst.costAlart = UserProxy.inst.getSetting(1);
            UserProxy.inst.musicOpen = UserProxy.inst.getSetting(2);
            UserProxy.inst.soundOpen = UserProxy.inst.getSetting(3);
            SoundManager.inst.effectSwitch = !UserProxy.inst.soundOpen;
            SoundManager.inst.musicSwitch = !UserProxy.inst.musicOpen;
        }
        UserProxy.inst.setLastTaskCD();
        PanelManager.inst.showPanel("LoadPanel", {
            thisObject: this,
            callback: this.init
        });
    };
    p.init = function () {
        PanelManager.inst.hidePanel("LoadPanel");
        var level = UserProxy.inst.curArea;
        var heroArr = [].concat(UserProxy.inst.fightData.getPVEBattleHero(), UserProxy.inst.fightData.getMonster(level, true));
        var resArr = fight.getRolePathArr(heroArr);
        if (!UserProxy.inst.isGuideEnd()) {
            resArr.push("guide_img_json", "menu_json", "make_money_json", "notice_json", "draw_img_json");
        }
        if (ExternalUtil.inst.getIsHT()) {
            resArr.push("n2_notice_fk_json");
        }
        else {
            if (ExternalUtil.inst.getIsYYB()) {
                resArr.push("n2_notice_yyb_json");
            }
            else {
                resArr.push("n2_notice_json");
            }
        }
        if (UserProxy.inst.curArea < 100) {
            resArr.push("n2_tips_xs_json");
        }
        PanelManager.inst.showPanel("LoadExtraPanel", {
            resArray: resArr,
            showText: "加载战斗配置",
            groupName: "extra",
            thisObject: this,
            callback: this.extraInit
        });
    };
    p.extraInit = function () {
        if (PanelManager.inst.isShow("LoadExtraPanel")) {
            PanelManager.inst.hidePanel("LoadExtraPanel");
        }
        if (UserProxy.inst.historyArea < 120) {
            Config.loadTip();
        }
        PanelManager.inst.showPanel("ScencePanel");
        PanelManager.inst.showPanel("MenuPanel");
        PanelManager.inst.showPanel("TopPanel");
        if (UserProxy.inst.rmbGet && UserProxy.inst.rmbGet.length) {
            ExternalUtil.inst.sendPayCmd();
        }
        TDGAUtil.initACount();
        UserProxy.inst.setTask();
        if (!Global.DEBUG) {
            Http.inst.send(CmdID.GET_INVITE_INFO, { hortor: ExternalUtil.inst.getIsHT() ? 1 : 0 });
        }
        //新手引导
        UserProxy.inst.nextGuide();
        //checkMsg
        if (Object.keys(UserProxy.inst.newMsg).length) {
            PanelManager.inst.showPanel("FriendMainPanel", 4);
        }
        // 公告配置
        Config.loadNotice();
        UserMethod.inst.noticeShowCheck();
        if (UserProxy.inst.isGuideEnd()) {
            if (UserProxy.inst.todayEnter || UserProxy.inst.noticeOpen) {
                PanelManager.inst.showPanel("NoticePanel");
            }
        }
        if (UserProxy.inst.offlineGold) {
            PanelManager.inst.showPanel("OfflinePanel");
        }
    };
    return NetEnterCmd;
}(BaseCmd));
egret.registerClass(NetEnterCmd,'NetEnterCmd');
