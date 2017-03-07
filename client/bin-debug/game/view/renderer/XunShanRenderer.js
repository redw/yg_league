/**
 * Created by Administrator on 11/24 0024.
 */
var XunShanRenderer = (function (_super) {
    __extends(XunShanRenderer, _super);
    function XunShanRenderer() {
        _super.call(this);
        this._touchCount = 0;
        this._continueTouch = 0;
        this._continueTimes = 0;
        this.skinName = XunShanRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=XunShanRenderer,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.MONEY_UP, this.onRefreshTask, this);
        Http.inst.addCmdListener(CmdID.AUTO_MONEY, this.onAutoBack, this);
        EventManager.inst.addEventListener(ContextEvent.REFRESH_BASE, this.showMoney, this);
        EventManager.inst.addEventListener(ContextEvent.REFRESH_TASK, this.onRefreshTaskCD, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnUpTwo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnUpThree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.headGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHead, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this.btnUpGroup.visible = false;
        EventManager.inst.addEventListener("GUIDE_HEAD", this.onHead, this);
        EventManager.inst.addEventListener("GUIDE_MONRYUP", this.onGuide, this);
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.MONEY_UP, this.onRefreshTask, this);
        Http.inst.removeCmdListener(CmdID.AUTO_MONEY, this.onAutoBack, this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_BASE, this.showMoney, this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_TASK, this.onRefreshTaskCD, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnUpTwo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnUpThree.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.headGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHead, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        EventManager.inst.removeEventListener("GUIDE_HEAD", this.onHead, this);
        EventManager.inst.removeEventListener("GUIDE_MONRYUP", this.onGuide, this);
        egret.Tween.removeTweens(this.imgLabel);
    };
    p.onRefreshTaskCD = function () {
        var taskData = Config.MakeMoneyData[this.data];
        var taskInfo = UserProxy.inst.makeMoney[this.data];
        if (this._lv) {
            if (UserProxy.inst.taskHand[this.data] || taskInfo["auto"]) {
                var dataTime = Math.ceil(taskData["time"] / UserProxy.inst.subXunShanTime);
                var showTime = false;
                var barValue = UserProxy.inst.taskCDList[this.data] / (dataTime * 10);
                var time = Math.ceil(dataTime - dataTime * (barValue) / 100);
                if (time >= 3600) {
                    showTime = true;
                }
                this.lblTime.visible = true;
                this.lblTime.text = TimeUtil.timeToString(time, showTime);
                this.progressBar.value = barValue;
            }
            else {
                this.progressBar.value = 100;
                this.touchGroup.visible = true;
                this.lblTime.visible = false;
            }
        }
    };
    p.onRefreshTask = function (e) {
        var _this = this;
        for (var i in e.data["makeMoney"]) {
            if (parseInt(i) == this.data) {
                MovieClipUtils.createMovieClip(Global.getOtherEffect("level_up_effect"), "level_up_effect", function (data) {
                    var mc = data;
                    mc.x = 6;
                    mc.y = 5;
                    _this.addChild(mc);
                    MovieClipUtils.playMCOnce(mc, function () {
                        DisplayUtil.removeFromParent(mc);
                    }, _this);
                }, this);
                this.dataChanged();
            }
        }
    };
    p.onAutoBack = function (e) {
        for (var i in e.data["makeMoney"]) {
            if (parseInt(i) == this.data) {
                this.showAuto();
            }
        }
    };
    p.onUp = function (e) {
        var upLv = 0;
        if (e.currentTarget == this.btnUp) {
            upLv = 1;
        }
        else if (e.currentTarget == this.btnUpTwo) {
            upLv = 10;
        }
        else {
            upLv = this._topLv;
        }
        this.delayShow();
        Http.inst.send(CmdID.MONEY_UP, { mid: this.data, upLel: upLv });
    };
    p.onTouch = function () {
        this.btnUp.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    };
    p.onTouchEnd = function () {
        this.btnUp.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    };
    p.onEnterFrame = function () {
        this._continueTimes++;
        if (this._continueTimes > 10 && !this._continueTouch) {
            this._touchCount = 3;
            this._continueTouch = 1;
            this._continueTimes = 0;
            this.delayShow();
            this.onTouchEnd();
        }
    };
    p.delayShow = function () {
        this._touchCount++;
        if (this._touchCount > 3 && this._lv) {
            this.btnUpGroup.visible = true;
        }
        if (this.btnUpGroup.visible) {
            if (this._delayTimes) {
                egret.clearTimeout(this._delayTimes);
            }
            this._delayTimes = egret.setTimeout(clearShow, this, 2000);
        }
        function clearShow() {
            this.btnUpGroup.visible = false;
            this._continueTouch = 0;
            this._touchCount = 0;
        }
    };
    p.onGuide = function () {
        if (this.data == 1) {
            this.btnUp.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
    };
    p.onHead = function () {
        var taskInfo = UserProxy.inst.makeMoney[this.data];
        if (!UserProxy.inst.taskHand[this.data] && this._lv && !taskInfo["auto"]) {
            UserProxy.inst.taskHand[this.data] = 1;
            this.touchGroup.visible = false;
            SoundManager.inst.playEffect("money_mp3");
            Http.inst.send(CmdID.MONEY, { mid: this.data });
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        UserMethod.inst.removeRedPoint(this.btnUp.parent, "upPoint");
        //
        this.lblTime.visible = true;
        var taskData = Config.MakeMoneyData[this.data];
        var taskInfo = UserProxy.inst.makeMoney[this.data];
        var dataTime = Math.ceil(taskData["time"] / UserProxy.inst.subXunShanTime);
        var showTime = false;
        if (dataTime >= 3600) {
            showTime = true;
        }
        this.lblTime.text = TimeUtil.timeToString(dataTime, showTime);
        this.lblName.text = taskData["name"];
        this.imgIcon.source = "makemoney_" + this.data + "_png";
        this._lv = taskInfo["lv"];
        this.lblLv.text = "Lv." + taskInfo["lv"];
        if (this._lv) {
            this.imgCellBg.source = "common_cell_png";
            this.progressBar.visible = true;
            this.progressBar.value = 100;
            if (!taskInfo["auto"] && !UserProxy.inst.taskHand[this.data]) {
                this.touchGroup.visible = true;
            }
            else {
                this.touchGroup.visible = false;
            }
        }
        else {
            this.progressBar.visible = false;
            this.touchGroup.visible = false;
        }
        this.showMoney();
        egret.Tween.get(this.imgLabel, { loop: true }).to({ scaleX: 1.05, scaleY: 1.05 }, 500).to({ scaleX: 1, scaleY: 1 }, 500).to({ scaleX: 0.95, scaleY: 0.95 }, 500).to({ scaleX: 1, scaleY: 1 }, 500);
    };
    p.showMoney = function () {
        var taskData = Config.MakeMoneyData[this.data];
        var baseCost = parseFloat(taskData["cost"]) / UserProxy.inst.subRiseXunShanMoney;
        var baseEarn = parseFloat(taskData["earn"]);
        var up = taskData["up"];
        if (this._lv) {
            var baseUp = Config.BaseData[7]["value"];
            var baseLv = Math.pow(baseUp, this._lv);
            var baseDiv = 1 - baseUp;
            var before_1 = (1 - Math.pow(baseUp, 1)) / baseDiv;
            var before_2 = (1 - Math.pow(baseUp, 10)) / baseDiv;
            var before_3 = (1 - Math.pow(baseUp, 100)) / baseDiv;
            var before_4 = (1 - Math.pow(baseUp, 1000)) / baseDiv;
            var before_5 = (1 - Math.pow(baseUp, 10000)) / baseDiv;
            var baseUp_1 = BigNum.mul(baseLv, before_1);
            var baseUp_2 = BigNum.mul(baseLv, before_2);
            var baseUp_3 = BigNum.mul(baseLv, before_3);
            var baseUp_4 = BigNum.mul(baseLv, before_4);
            var baseUp_5 = BigNum.mul(baseLv, before_5);
            var up_1 = BigNum.mul(baseCost, baseUp_1);
            var up_2 = BigNum.mul(baseCost, baseUp_2);
            var up_3 = BigNum.mul(baseCost, baseUp_3);
            var up_4 = BigNum.mul(baseCost, baseUp_4);
            var up_5 = BigNum.mul(baseCost, baseUp_5);
            //1---
            if (Number(up_1) < 1) {
                this.btnUp.label = 1 + "";
            }
            else {
                this.btnUp.label = MathUtil.easyNumber(up_1);
            }
            var earn = (baseEarn + up * (this._lv - 1)) * UserProxy.inst.addXunShanAward;
            this.lblUpGold.text = MathUtil.easyNumber(earn);
            this.btnUp.extraLabel = "升级";
            this.btnUp.enabled = BigNum.greaterOrEqual(UserProxy.inst.gold, up_1);
            this.btnUp.coinType = "reward_1_s_png";
            //2---
            this.btnUpTwo.label = MathUtil.easyNumber(up_2);
            this.btnUpTwo.extraLabel = "升10级";
            this.btnUpTwo.enabled = BigNum.greaterOrEqual(UserProxy.inst.gold, up_2);
            this.btnUpTwo.coinType = "reward_1_s_png";
            this.btnUpThree.coinType = "reward_1_s_png";
            //3---
            if (BigNum.less(UserProxy.inst.gold, up_3)) {
                this.btnUpThree.label = MathUtil.easyNumber(up_3);
                this.btnUpThree.extraLabel = "升100级";
                this.btnUpThree.enabled = false;
            }
            else if (BigNum.greaterOrEqual(UserProxy.inst.gold, up_3) && BigNum.less(UserProxy.inst.gold, up_4)) {
                this.btnUpThree.label = MathUtil.easyNumber(up_3);
                this.btnUpThree.extraLabel = "升100级";
                this.btnUpThree.enabled = true;
                this._topLv = 100;
            }
            else if (BigNum.greaterOrEqual(UserProxy.inst.gold, up_4) && BigNum.less(UserProxy.inst.gold, up_5)) {
                this.btnUpThree.label = MathUtil.easyNumber(up_4);
                this.btnUpThree.extraLabel = "升1000级";
                this.btnUpThree.enabled = true;
                this._topLv = 1000;
            }
            else {
                this.btnUpThree.label = MathUtil.easyNumber(up_5);
                this.btnUpThree.extraLabel = "升1000级";
                this.btnUpThree.enabled = true;
                this._topLv = 10000;
            }
        }
        else {
            var open = parseFloat(taskData["open"]) / UserProxy.inst.subOpenXunShanMoney;
            this.imgCellBg.source = "role_unhad_cell_png";
            this.btnUp.extraLabel = "开启";
            var baseEarn = parseFloat(taskData["earn"]);
            this.lblUpGold.text = MathUtil.easyNumber(baseEarn);
            this.btnUp.label = MathUtil.easyNumber(open);
            this.btnUp.enabled = BigNum.greaterOrEqual(UserProxy.inst.gold, open);
            if (BigNum.greaterOrEqual(UserProxy.inst.gold, open)) {
                UserMethod.inst.addRedPoint(this.btnUp.parent, "upPoint", new egret.Point(this.btnUp.x + 90, this.btnUp.y + 10));
            }
        }
    };
    p.showAuto = function () {
        var taskInfo = UserProxy.inst.makeMoney[this.data];
        if (!taskInfo["auto"]) {
            this.touchGroup.visible = true;
        }
        else {
            this.touchGroup.visible = false;
        }
    };
    return XunShanRenderer;
}(eui.ItemRenderer));
egret.registerClass(XunShanRenderer,'XunShanRenderer');
//# sourceMappingURL=XunShanRenderer.js.map