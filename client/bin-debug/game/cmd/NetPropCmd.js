/**
 * Created by Administrator on 2017/1/14.
 */
/** 使用道具 */
var NetUsePropCmd = (function (_super) {
    __extends(NetUsePropCmd, _super);
    function NetUsePropCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetUsePropCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserMethod.inst.showAward(this.data);
        UserProxy.inst.circleObj["nowTimes"] = this.data["nowTimes"];
        UserProxy.inst.fightData.parseDrop(this.data["itemList"]);
        EventManager.inst.dispatch(ContextEvent.PROP_USE_RES);
    };
    return NetUsePropCmd;
}(BaseCmd));
egret.registerClass(NetUsePropCmd,'NetUsePropCmd');
//# sourceMappingURL=NetPropCmd.js.map