/**
 * Created by Administrator on 12/19 0019.
 */
var NetMailCmd = (function (_super) {
    __extends(NetMailCmd, _super);
    function NetMailCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetMailCmd,p=c.prototype;
    p.execute = function () {
        UserMethod.inst.showAward(this.data);
        for (var i in this.data["thisMail"]) {
            UserProxy.inst.mail[i] = this.data["thisMail"][i];
        }
    };
    return NetMailCmd;
}(BaseCmd));
egret.registerClass(NetMailCmd,'NetMailCmd');
