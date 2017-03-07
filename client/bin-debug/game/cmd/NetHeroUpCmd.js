/**
 * 英雄升级
 * Created by Administrator on 11/28 0028.
 */
var NetHeroUpCmd = (function (_super) {
    __extends(NetHeroUpCmd, _super);
    function NetHeroUpCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetHeroUpCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        UserProxy.inst.gold = this.data["gold"];
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    };
    return NetHeroUpCmd;
}(BaseCmd));
egret.registerClass(NetHeroUpCmd,'NetHeroUpCmd');
var NetEnhanceUpCmd = (function (_super) {
    __extends(NetEnhanceUpCmd, _super);
    function NetEnhanceUpCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetEnhanceUpCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        UserProxy.inst.medal = this.data["medal"];
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
    };
    return NetEnhanceUpCmd;
}(BaseCmd));
egret.registerClass(NetEnhanceUpCmd,'NetEnhanceUpCmd');
var NetEnhanceResetCmd = (function (_super) {
    __extends(NetEnhanceResetCmd, _super);
    function NetEnhanceResetCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetEnhanceResetCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserMethod.inst.showAward(this.data);
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
    };
    return NetEnhanceResetCmd;
}(BaseCmd));
egret.registerClass(NetEnhanceResetCmd,'NetEnhanceResetCmd');
var NetStarUpCmd = (function (_super) {
    __extends(NetStarUpCmd, _super);
    function NetStarUpCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetStarUpCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.pill = this.data["pill"];
        var needRefresh = false;
        for (var i in this.data["heroList"]) {
            var heroData = UserProxy.inst.heroData.getHeroData(i);
            var heroInfo = this.data["heroList"][i];
            if (heroData.starLevel == 0 && heroInfo["star"]) {
                needRefresh = true;
                PanelManager.inst.showPanel("RoleDrawInfoPanel", { id: parseInt(i), from: 1 });
            }
        }
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
        if (needRefresh) {
            EventManager.inst.dispatch(ContextEvent.HAVE_NEW_ROLE);
        }
    };
    return NetStarUpCmd;
}(BaseCmd));
egret.registerClass(NetStarUpCmd,'NetStarUpCmd');
var NetRelationCmd = (function (_super) {
    __extends(NetRelationCmd, _super);
    function NetRelationCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetRelationCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        var refreshId;
        for (var i in this.data["relationship"]) {
            var data = this.data["relationship"][i];
            var info = UserProxy.inst.relationship[i];
            var newLv = data["lv"];
            var oldLv = info["lv"];
            if (newLv != oldLv) {
                refreshId = parseInt(i);
            }
            UserProxy.inst.relationship[i] = this.data["relationship"][i];
        }
        UserMethod.inst.setExterAdd();
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
        EventManager.inst.dispatch(ContextEvent.HERO_SHIP_UP, refreshId);
    };
    return NetRelationCmd;
}(BaseCmd));
egret.registerClass(NetRelationCmd,'NetRelationCmd');
var NetExchangeCmd = (function (_super) {
    __extends(NetExchangeCmd, _super);
    function NetExchangeCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetExchangeCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserMethod.inst.showAward(this.data);
    };
    return NetExchangeCmd;
}(BaseCmd));
egret.registerClass(NetExchangeCmd,'NetExchangeCmd');
//# sourceMappingURL=NetHeroUpCmd.js.map