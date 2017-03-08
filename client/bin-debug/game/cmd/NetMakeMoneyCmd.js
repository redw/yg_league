/**
 * Created by Administrator on 12/19 0019.
 */
var NetMakeMoneyCmd = (function (_super) {
    __extends(NetMakeMoneyCmd, _super);
    function NetMakeMoneyCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetMakeMoneyCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        EventManager.inst.dispatch(ContextEvent.ADD_EARN_MONEY, this.data["gold"]);
        // UserProxy.inst.gold = this.data["gold"];
        // EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    };
    return NetMakeMoneyCmd;
}(BaseCmd));
egret.registerClass(NetMakeMoneyCmd,'NetMakeMoneyCmd');
var NetMoneyUpCmd = (function (_super) {
    __extends(NetMoneyUpCmd, _super);
    function NetMoneyUpCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetMoneyUpCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.gold = this.data["gold"];
        for (var i in this.data["makeMoney"]) {
            UserProxy.inst.makeMoney[i] = this.data["makeMoney"][i];
        }
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    };
    return NetMoneyUpCmd;
}(BaseCmd));
egret.registerClass(NetMoneyUpCmd,'NetMoneyUpCmd');
var NetAutoMoneyCmd = (function (_super) {
    __extends(NetAutoMoneyCmd, _super);
    function NetAutoMoneyCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetAutoMoneyCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        if (this.data["gold"] != undefined) {
            UserProxy.inst.gold = this.data["gold"];
        }
        if (this.data["diamond"] != undefined) {
            UserProxy.inst.diamond = this.data["diamond"];
        }
        for (var i in this.data["makeMoney"]) {
            UserProxy.inst.makeMoney[i] = this.data["makeMoney"][i];
        }
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    };
    return NetAutoMoneyCmd;
}(BaseCmd));
egret.registerClass(NetAutoMoneyCmd,'NetAutoMoneyCmd');
