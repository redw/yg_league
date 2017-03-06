/**
 * Created by Administrator on 1/13 0013.
 */
var CirclePanel = (function (_super) {
    __extends(CirclePanel, _super);
    function CirclePanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = CirclePanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=CirclePanel,p=c.prototype;
    p.init = function () {
        this.btnDouble.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCircle, this);
        this.btnCircle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCircle, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        Http.inst.addCmdListener(CmdID.OPEN_CIRCLE, this.onOpen, this);
        this.coinShow.startListener();
    };
    p.initData = function () {
        Http.inst.send(CmdID.OPEN_CIRCLE);
    };
    p.openBack = function () {
        this.btnDouble.label = Config.BaseData[53]["value"];
        this.btnDouble.extraLabel = "双倍灵玉";
        this.lblCircleTimes.text = UserProxy.inst.circleObj["nowTimes"] + "/" + UserProxy.inst.circleObj["maxTimes"];
        this.lblTime.visible = false;
        // var base:number = parseFloat(Config.StageData[UserProxy.inst.curArea]["circle_jade"]);
        this.lblBaseAdd.text = MathUtil.easyNumber(this._getMedal);
        /*var extra:number = base * UserProxy.inst.addTurnMedal - base;
        if(extra)
        {
            this.lblExtraAdd.text = "+" + MathUtil.easyNumber(extra) + "（" + (UserProxy.inst.addTurnMedal-1) * 100 + "%）";
        }
        else
        {
            this.lblExtraAdd.visible = false;
        }*/
    };
    p.onCircle = function (e) {
        if (e.currentTarget == this.btnCircle) {
            Http.inst.send(CmdID.CIRCLE, { type: 1 });
        }
        else {
            if (UserProxy.inst.costAlart) {
                showCost();
            }
            else {
                Alert.showCost(Config.BaseData[53]["value"], "获得双倍转生仙玉", true, showCost, null, this);
            }
            function showCost() {
                if (UserProxy.inst.diamond >= parseInt(Config.BaseData[53]["value"])) {
                    Http.inst.send(CmdID.CIRCLE, { type: 2 });
                }
                else {
                    ExternalUtil.inst.diamondAlert();
                }
            }
        }
    };
    p.onOpen = function (e) {
        if (e.data) {
            UserProxy.inst.circleObj = e.data["circleObj"];
            this._getMedal = e.data["medal"];
        }
        this.openBack();
        if (UserProxy.inst.circleObj && UserProxy.inst.circleObj["lastCircleTimes"] > 0) {
            this.lblTime.visible = true;
            var monthTime = 0;
            var liftTime = 0;
            if (UserProxy.inst.vipObj["monthVIP"]) {
                monthTime = 4;
            }
            if (UserProxy.inst.vipObj["foreverVIP"]) {
                liftTime = 4;
            }
            this._cdTime = (parseInt(Config.BaseData[51]["value"]) * 60 - monthTime * 60 * 60 - liftTime * 60 * 60) - (UserProxy.inst.server_time - UserProxy.inst.circleObj["lastCircleTimes"]);
            this.refreshTime();
        }
    };
    p.refreshTime = function () {
        if (this._cdTime > 0) {
            this.tickerTime();
            TickerUtil.register(this.tickerTime, this, 1000);
        }
    };
    p.tickerTime = function () {
        this.lblTime.text = "恢复时间：" + StringUtil.timeToString(this._cdTime, true);
        this._cdTime--;
        if (!this._cdTime) {
            Http.inst.send(CmdID.OPEN_CIRCLE);
            TickerUtil.unregister(this.tickerTime, this);
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("CirclePanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnDouble.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCircle, this);
        this.btnCircle.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCircle, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        Http.inst.addCmdListener(CmdID.OPEN_CIRCLE, this.onOpen, this);
        TickerUtil.unregister(this.tickerTime, this);
        this.coinShow.endListener();
    };
    return CirclePanel;
}(BasePanel));
egret.registerClass(CirclePanel,'CirclePanel');
