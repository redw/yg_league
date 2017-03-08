/**
 * Created by Administrator on 1/20 0020.
 */
var NetAcieveCmd = (function (_super) {
    __extends(NetAcieveCmd, _super);
    function NetAcieveCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetAcieveCmd,p=c.prototype;
    p.execute = function () {
        UserProxy.inst.achieveBit = this.data["achieveBit"];
        UserMethod.inst.showAward(this.data);
        TopPanel.inst.showPoint(4);
    };
    return NetAcieveCmd;
}(BaseCmd));
egret.registerClass(NetAcieveCmd,'NetAcieveCmd');
