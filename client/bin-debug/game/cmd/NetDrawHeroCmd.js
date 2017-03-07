/**
 * Created by Administrator on 12/16 0016.
 */
var NetDrawHeroCmd = (function (_super) {
    __extends(NetDrawHeroCmd, _super);
    function NetDrawHeroCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetDrawHeroCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.drawTimes = this.data["drawObj"]["drawTimes"];
        UserProxy.inst.lastFreeTime = this.data["drawObj"]["lastFreeTime"];
        UserProxy.inst.ticket = this.data["drawObj"]["ticket"];
        UserProxy.inst.diamond = this.data["diamond"];
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    };
    return NetDrawHeroCmd;
}(BaseCmd));
egret.registerClass(NetDrawHeroCmd,'NetDrawHeroCmd');
//# sourceMappingURL=NetDrawHeroCmd.js.map