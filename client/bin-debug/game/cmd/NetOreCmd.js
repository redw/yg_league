/**
 * Created by Administrator on 2/24 0024.
 */
var NetOreCmd = (function (_super) {
    __extends(NetOreCmd, _super);
    function NetOreCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetOreCmd,p=c.prototype;
    p.execute = function () {
        var bonusList = new BonusList();
        var add = this.data["home"]["ore"] - UserProxy.inst.home["ore"];
        if (add > 0) {
            bonusList.push(BonusType.ORE, add);
        }
        bonusList.show();
        UserProxy.inst.home = this.data["home"];
        UserProxy.inst.ore = UserProxy.inst.home["ore"];
        MenuPanel.inst.checkMine();
    };
    return NetOreCmd;
}(BaseCmd));
egret.registerClass(NetOreCmd,'NetOreCmd');
var NetBuildingUpCmd = (function (_super) {
    __extends(NetBuildingUpCmd, _super);
    function NetBuildingUpCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetBuildingUpCmd,p=c.prototype;
    p.execute = function () {
        UserProxy.inst.ore = this.data["ore"];
        UserProxy.inst.building = this.data["building"];
        UserMethod.inst.setExterAdd();
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
        MenuPanel.inst.checkMine();
    };
    return NetBuildingUpCmd;
}(BaseCmd));
egret.registerClass(NetBuildingUpCmd,'NetBuildingUpCmd');
var NetMineUp = (function (_super) {
    __extends(NetMineUp, _super);
    function NetMineUp() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetMineUp,p=c.prototype;
    p.execute = function () {
        UserProxy.inst.ore = this.data["ore"];
        UserProxy.inst.home["mine"] = this.data["mine"];
        MenuPanel.inst.checkMine();
    };
    return NetMineUp;
}(BaseCmd));
egret.registerClass(NetMineUp,'NetMineUp');
//# sourceMappingURL=NetOreCmd.js.map