/**
 * 用户数据
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var UserProxy = (function (_super) {
    __extends(UserProxy, _super);
    function UserProxy() {
        _super.apply(this, arguments);
        this.isFocus = 0; //是否关注
        this.heroData = new HeroModel();
        this.fightData = new FightDataModel();
        /**rank*/
        this.rankTime = 0;
        this.pvpRankTime = 0;
        this.pvpNowRankTime = 0;
        this.pvpHonorTime = 0;
        //设置
        this.setting = "";
        this.noticeOpen = false;
        this._lastNow = 0;
        this._lastPass = 0;
    }
    var d = __define,c=UserProxy,p=c.prototype;
    d(UserProxy, "inst"
        ,function () {
            if (UserProxy._instance == null) {
                UserProxy._instance = new UserProxy();
                UserProxy._instance.clearTaskCD();
                UserProxy._instance.setup();
            }
            return UserProxy._instance;
        }
    );
    p.setup = function () {
        TickerUtil.register(UserProxy.inst.onTicker_1, this, 1000);
        TickerUtil.register(UserProxy.inst.onTicker_4, this, 30000);
        TickerUtil.register(UserProxy.inst.checkTarget, this, 10000);
        this.startAlive();
        /*
  
          TickerUtil.register(UserProxy.inst.onTicker_3, this, 60000);
  
          UserProxy.inst.onTicker_2();*/
    };
    p.startAlive = function () {
        TickerUtil.register(UserProxy.inst.onTicker_2, this, 5000);
    };
    p.stopAlive = function () {
        TickerUtil.unregister(UserProxy.inst.onTicker_2, this);
    };
    p.setTask = function () {
        TickerUtil.register(UserProxy.inst.onTaskTick, this, 50);
    };
    p.startCheckBattle = function () {
        UserMethod.inst.sendBattleSyncTime = 5;
        TickerUtil.register(UserProxy.inst.checkBattleCmd, this, 5000);
    };
    p.endCheckBattle = function () {
        TickerUtil.unregister(UserProxy.inst.checkBattleCmd, this);
    };
    p.checkBattleCmd = function () {
        if (UserMethod.inst.sendBattleSyncTime > 0) {
            UserMethod.inst.sendBattleSyncTime--;
        }
        else {
            EventManager.inst.dispatch(ContextEvent.PVE_SYNC_AGAIN);
        }
    };
    p.clearTaskCD = function () {
        this.taskCDList = [];
        this.taskHand = [];
        for (var i = 1; i < 100; i++) {
            this.taskCDList[i] = 0;
            this.taskHand[i] = 0;
        }
    };
    p.setLastTaskCD = function () {
        for (var i = 1; i < 100; i++) {
            var moneyInfo = UserProxy.inst.makeMoney[i];
            if (moneyInfo && moneyInfo["lv"] && moneyInfo["lastMoneyTime"]) {
                var cdTime = (UserProxy.inst.server_time - moneyInfo["lastMoneyTime"]) * 1000;
                this.taskCDList[i] = cdTime;
                if (moneyInfo["auto"] == 0 && cdTime) {
                    this.taskHand[i] = 1;
                }
            }
        }
    };
    d(p, "goldString"
        ,function () {
            return MathUtil.easyNumber(this.gold);
        }
    );
    p.onTicker_1 = function () {
        UserProxy.inst.server_time += 1;
        if (UserMethod.inst.aliveTime) {
            UserMethod.inst.aliveTime++;
            if (UserMethod.inst.aliveTime > 30) {
                Alert.show("与服务器连接异常，\n请重新登录！", false, function () {
                    window.location.reload();
                }, null, this);
            }
        }
    };
    p.onTicker_2 = function () {
        this.stopAlive();
        UserMethod.inst.aliveTime = 1;
        Http.inst.send(CmdID.ALIVE);
    };
    p.onTicker_3 = function () {
        Http.inst.send(CmdID.HAS_NEW_MAIL);
        EventManager.inst.dispatch("CHECK_ACTIVE_RED_POINT");
    };
    p.onTicker_4 = function () {
        if (PanelManager.inst.isShow("MenuPanel")) {
            MenuPanel.inst.checkDraw();
            MenuPanel.inst.checkMoney();
            MenuPanel.inst.checkMine();
            TopPanel.inst.checkFormation();
        }
        TopPanel.inst.showPoint(7);
        TopPanel.inst.checkHide();
        // EventManager.inst.dispatch(ContextEvent.TARGET_HANG);
        EventManager.inst.dispatch(ContextEvent.LABEL_MOVE_SHOW);
    };
    p.checkTarget = function () {
        TopPanel.inst.showPoint(5);
    };
    p.onTaskTick = function () {
        var delta = 50;
        if (this._lastNow) {
            var passTime = Date.now() - this._lastNow;
            if (passTime < 50) {
                this._lastPass += passTime;
                if (this._lastPass >= 50) {
                    this._lastPass = 0;
                    return;
                }
            }
        }
        this._lastNow = Date.now();
        for (var i in this.taskCDList) {
            var taskInfo = this.makeMoney[i];
            if (taskInfo && taskInfo["lv"] && (taskInfo["auto"] || this.taskHand[i])) {
                var taskData = Config.MakeMoneyData[i];
                this.taskCDList[i] += delta;
                var dataTime = taskData["time"] / UserProxy.inst.subXunShanTime;
                var nextTime = dataTime * 1000;
                if (this.taskCDList[i] >= nextTime) {
                    this.taskCDList[i] = this.taskCDList[i] % nextTime;
                    if (!taskInfo["auto"]) {
                        this.taskHand[i] = 0;
                    }
                }
            }
        }
        EventManager.inst.dispatch(ContextEvent.REFRESH_TASK);
    };
    p.nextGuide = function () {
        var step = UserProxy.inst.getGuideStep();
        if (step == 1) {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_HEROUP");
                    UserProxy.inst.setBuffer(1);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 2) {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_HEROUP");
                    UserProxy.inst.setBuffer(2);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 3) {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_HEROUP");
                    UserProxy.inst.setBuffer(3);
                }, "thisObj": this });
        }
        else if (step == 4) {
            if (UserProxy.inst.historyArea < 10) {
                return;
            }
            this.guideClosePanel();
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    PanelManager.inst.showPanel("RoleDrawPanel");
                    UserProxy.inst.setBuffer(4);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 5) {
            if (!PanelManager.inst.isShow("RoleDrawPanel")) {
                var hero = UserProxy.inst.heroData.getHeroData(103);
                if (hero.level) {
                    UserProxy.inst.setBuffer(5);
                    UserProxy.inst.nextGuide();
                }
                else {
                    PanelManager.inst.showPanel("RoleDrawPanel");
                }
            }
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    UserMethod.inst.guideBajie = true;
                    EventManager.inst.dispatch("GUIDE_DRAW");
                }, "thisObj": this });
        }
        else if (step == 6) {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    PanelManager.inst.showPanel("RoleFormationPanel", { type: 1 });
                    UserProxy.inst.setBuffer(6);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 7) {
            if (!PanelManager.inst.isShow("RoleFormationPanel")) {
                PanelManager.inst.showPanel("RoleFormationPanel", { type: 1 });
            }
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_FORMATION_1");
                    UserProxy.inst.setBuffer(7);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 8) {
            if (!PanelManager.inst.isShow("RoleFormationPanel")) {
                UserProxy.inst.setBuffer(7, false);
                UserProxy.inst.nextGuide();
            }
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_FORMATION_2");
                    UserProxy.inst.setBuffer(8);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 9) {
            if (!PanelManager.inst.isShow("RoleFormationPanel")) {
                UserProxy.inst.setBuffer(7, false);
                UserProxy.inst.setBuffer(8, false);
                UserProxy.inst.nextGuide();
            }
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_CLOSE_FORMATION");
                    UserProxy.inst.setBuffer(9);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 10) {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_HEROUP_2");
                    UserProxy.inst.setBuffer(10);
                }, "thisObj": this });
        }
        else if (step == 11) {
            if (UserProxy.inst.historyArea < 20) {
                return;
            }
            this.guideClosePanel();
            MenuPanel.inst.openMenu(1);
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_MONRYUP");
                    UserProxy.inst.setBuffer(11);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 12) {
            MenuPanel.inst.openMenu(1);
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_HEAD");
                    UserProxy.inst.setBuffer(12);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 13) {
            MenuPanel.inst.openMenu(1);
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    EventManager.inst.dispatch("GUIDE_MONRYUP");
                    UserProxy.inst.setBuffer(13);
                    UserProxy.inst.nextGuide();
                }, "thisObj": this });
        }
        else if (step == 14) {
            PanelManager.inst.showPanel("GuidePanel", { "callback": function () {
                    UserProxy.inst.setBuffer(14);
                    UserProxy.inst.nextGuide();
                    PanelManager.inst.showPanel("NoticePanel");
                }, "thisObj": this });
        }
    };
    p.isGuideEnd = function () {
        if (UserProxy.inst.getGuideStep() == -1) {
            return true;
        }
        else {
            return false;
        }
    };
    p.getGuideStep = function () {
        var step = 1;
        var length = 13;
        for (var i = 0; i < length; i++) {
            if (UserProxy.inst.guide.charAt(i) == "0") {
                return step;
            }
            step++;
        }
        if (step > length) {
            return -1;
        }
        return step;
    };
    p.setBuffer = function (buffer, state) {
        while (UserProxy.inst.guide.length < buffer) {
            UserProxy.inst.guide = UserProxy.inst.guide + "0";
        }
        var str = UserProxy.inst.guide.substr(0, buffer - 1);
        if (state == null) {
            str = str + "1";
        }
        else {
            if (state) {
                str = str + "1";
            }
            else {
                str = str + "0";
            }
        }
        str = str + UserProxy.inst.guide.substr(buffer);
        UserProxy.inst.guide = str;
        Http.inst.send(CmdID.SET_GUIDE, { "guide": UserProxy.inst.guide });
    };
    p.getBuffer = function (buffer) {
        while (UserProxy.inst.guide.length < buffer) {
            UserProxy.inst.guide = UserProxy.inst.guide + "0";
        }
        return UserProxy.inst.guide.charAt(buffer - 1) != "0";
    };
    p.setSetting = function (idx, open) {
        while (UserProxy.inst.setting.length < idx) {
            UserProxy.inst.setting = UserProxy.inst.setting + "0";
        }
        var str = UserProxy.inst.setting.substr(0, idx - 1);
        if (open) {
            str = str + "1";
        }
        else {
            str = str + "0";
        }
        str = str + UserProxy.inst.setting.substr(idx);
        UserProxy.inst.setting = str;
        Http.inst.send(CmdID.SETUP, { "setup": UserProxy.inst.setting });
    };
    p.getSetting = function (idx) {
        while (UserProxy.inst.setting.length < idx) {
            UserProxy.inst.setting = UserProxy.inst.setting + "0";
        }
        return UserProxy.inst.setting.charAt(idx - 1) != "0";
    };
    p.guideClosePanel = function () {
        if (PanelManager.inst.isShow("FriendMainPanel")) {
            PanelManager.inst.hidePanel("FriendMainPanel");
        }
        if (PanelManager.inst.isShow("FirstRechargePanel")) {
            PanelManager.inst.hidePanel("FirstRechargePanel");
        }
        if (PanelManager.inst.isShow("SevenDayPanel")) {
            PanelManager.inst.hidePanel("SevenDayPanel");
        }
        if (PanelManager.inst.isShow("DailyAchievePanel")) {
            PanelManager.inst.hidePanel("DailyAchievePanel");
        }
        if (PanelManager.inst.isShow("RankPanel")) {
            PanelManager.inst.hidePanel("RankPanel");
        }
        if (PanelManager.inst.isShow("TargetPanel")) {
            PanelManager.inst.hidePanel("TargetPanel");
        }
        if (PanelManager.inst.isShow("PrivilegePanel")) {
            PanelManager.inst.hidePanel("PrivilegePanel");
        }
        if (PanelManager.inst.isShow("ActivePanel")) {
            PanelManager.inst.hidePanel("ActivePanel");
        }
        if (PanelManager.inst.isShow("NoticePanel")) {
            PanelManager.inst.hidePanel("NoticePanel");
        }
        if (PanelManager.inst.isShow("MailPanel")) {
            PanelManager.inst.hidePanel("MailPanel");
        }
        if (PanelManager.inst.isShow("MailInfoPanel")) {
            PanelManager.inst.hidePanel("MailInfoPanel");
        }
        if (PanelManager.inst.isShow("SettingPanel")) {
            PanelManager.inst.hidePanel("SettingPanel");
        }
        if (PanelManager.inst.isShow("RoleFormationPanel")) {
            PanelManager.inst.hidePanel("RoleFormationPanel");
        }
        if (PanelManager.inst.isShow("RoleDrawPanel")) {
            EventManager.inst.dispatch("GUIDE_DRAW_CLOSE");
            PanelManager.inst.hidePanel("RoleDrawPanel");
        }
        if (PanelManager.inst.isShow("RoleDrawInfoPanel")) {
            PanelManager.inst.hidePanel("RoleDrawInfoPanel");
        }
        if (PanelManager.inst.isShow("RoleDetailsPanel")) {
            PanelManager.inst.hidePanel("RoleDetailsPanel");
        }
        if (PanelManager.inst.isShow("ActiveLimitPanel")) {
            PanelManager.inst.hidePanel("ActiveLimitPanel");
        }
    };
    /**
     * 是否是新手阶段
     */
    p.isNoviceLevel = function () {
        return this.curArea < 5 && !this.isGuideEnd();
    };
    UserProxy._instance = null;
    return UserProxy;
}(egret.HashObject));
egret.registerClass(UserProxy,'UserProxy');
//# sourceMappingURL=UserProxy.js.map