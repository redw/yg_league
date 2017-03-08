/**
 * Created by Administrator on 2/7 0007.
 */
var CircleGoPanel = (function (_super) {
    __extends(CircleGoPanel, _super);
    function CircleGoPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = CircleGoPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=CircleGoPanel,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.lblGetCard.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoCard, this);
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoNow, this);
    };
    p.initData = function () {
        this.lblGoCondition.text = Config.BaseData[68]["value"] + "关以上的轮回，可使用突进";
        var goMission = UserProxy.inst.circleObj["lastCircleArea"] - parseInt(Config.BaseData[69]["value"]);
        this.lblMission.text = goMission + "关";
        this.lblTimes.text = Math.floor((goMission - UserProxy.inst.curArea) / 50) + "次";
        this.btnGo.extraLabel = "突 进";
        this._shakeCost = parseInt(Config.BaseData[70]["value"]) * (goMission - UserProxy.inst.curArea);
        this.btnGo.label = this._shakeCost + "";
        this.lblNowArea.text = UserProxy.inst.curArea + "关";
        if (UserProxy.inst.vipObj["foreverVIP"]) {
            this.btnGo.label = "免费";
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("CircleGoPanel");
    };
    p.onGoCard = function () {
        PanelManager.inst.showPanel("PrivilegePanel");
        this.onClose();
    };
    p.onGoNow = function () {
        if (UserProxy.inst.vipObj["foreverVIP"]) {
            Http.inst.send(CmdID.GET_BACK);
        }
        else {
            if (UserProxy.inst.costAlart) {
                this.showCostAlert();
            }
            else {
                Alert.showCost(this._shakeCost, "直接突进", true, this.showCostAlert, null, this);
            }
        }
    };
    p.showCostAlert = function () {
        if (UserProxy.inst.diamond >= this._shakeCost) {
            Http.inst.send(CmdID.GET_BACK);
        }
        else {
            ExternalUtil.inst.diamondAlert();
        }
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.lblGetCard.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoCard, this);
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoNow, this);
    };
    return CircleGoPanel;
}(BasePanel));
egret.registerClass(CircleGoPanel,'CircleGoPanel');
