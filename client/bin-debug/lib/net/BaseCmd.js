/**
 * 协议基类
 * @author j
 * 2016/2/22
 */
var BaseCmd = (function (_super) {
    __extends(BaseCmd, _super);
    function BaseCmd(data) {
        _super.call(this);
        this.data = data;
    }
    var d = __define,c=BaseCmd,p=c.prototype;
    p.execute = function () {
        if (this.data["achievementObj"]) {
            UserProxy.inst.achievementObj = this.data["achievementObj"];
            TopPanel.inst.showPoint(4);
        }
        if (this.data["taskObj"]) {
            UserProxy.inst.taskObj = this.data["taskObj"];
            TopPanel.inst.showPoint(4);
        }
    };
    return BaseCmd;
}(egret.HashObject));
egret.registerClass(BaseCmd,'BaseCmd');
