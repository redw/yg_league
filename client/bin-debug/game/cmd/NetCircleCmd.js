/**
 * Created by Administrator on 1/13 0013.
 */
var NetCircleCmd = (function (_super) {
    __extends(NetCircleCmd, _super);
    function NetCircleCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetCircleCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.gold = this.data["gold"];
        if ("diamond" in this.data) {
            UserProxy.inst.diamond = this.data["diamond"];
            EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        }
        UserProxy.inst.curArea = this.data["curArea"];
        UserProxy.inst.circleObj = this.data["circleObj"];
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        UserProxy.inst.makeMoney = this.data["makeMoney"];
        UserProxy.inst.clearTaskCD();
        UserProxy.inst.setTask();
        PanelManager.inst.hidePanel("CirclePanel");
        PanelManager.inst.showPanel("CircleSuccessPanel", UserProxy.inst.circleObj["medal"]);
        EventManager.inst.dispatch(ContextEvent.FORCE_TO_STAGE);
        PanelManager.inst.hidePanel("MenuPanel");
        PanelManager.inst.showPanel("MenuPanel");
        TopPanel.inst.showPoint(6);
        TopPanel.inst.showPoint(9);
    };
    return NetCircleCmd;
}(BaseCmd));
egret.registerClass(NetCircleCmd,'NetCircleCmd');
var NetCircleGoBackCmd = (function (_super) {
    __extends(NetCircleGoBackCmd, _super);
    function NetCircleGoBackCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetCircleGoBackCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.curArea = this.data["curArea"];
        if ("diamond" in this.data) {
            UserProxy.inst.diamond = this.data["diamond"];
            EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        }
        UserProxy.inst.wheelTimes = this.data["wheelTimes"];
        UserProxy.inst.circleObj["lastCircleArea"] = this.data["lastCircleArea"];
        PanelManager.inst.hidePanel("CircleGoPanel");
        EventManager.inst.dispatch(ContextEvent.FORCE_TO_STAGE);
        PanelManager.inst.showPanel("CircleGoSuccessPanel");
        TopPanel.inst.showPoint(6);
        TopPanel.inst.showPoint(9);
    };
    return NetCircleGoBackCmd;
}(BaseCmd));
egret.registerClass(NetCircleGoBackCmd,'NetCircleGoBackCmd');
