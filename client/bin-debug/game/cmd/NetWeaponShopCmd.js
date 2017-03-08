/**
 * Created by Administrator on 12/5 0005.
 */
var NetWeaponShopCmd = (function (_super) {
    __extends(NetWeaponShopCmd, _super);
    function NetWeaponShopCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetWeaponShopCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        if (this.data["diamond"] || this.data["diamond"] == 0) {
            UserProxy.inst.diamond = this.data["diamond"];
        }
        UserProxy.inst.weaponShop = this.data["weaponShop"];
        if (this.data["weaponShopResetLastTime"]) {
            UserProxy.inst.weaponShopResetLastTime = this.data["weaponShopResetLastTime"];
        }
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    };
    return NetWeaponShopCmd;
}(BaseCmd));
egret.registerClass(NetWeaponShopCmd,'NetWeaponShopCmd');
var NetWeaponBuyCmd = (function (_super) {
    __extends(NetWeaponBuyCmd, _super);
    function NetWeaponBuyCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetWeaponBuyCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.weaponCoin = this.data["weaponCoin"];
        for (var i in this.data["weaponList"]) {
            UserProxy.inst.weaponList[i] = this.data["weaponList"][i];
        }
        UserMethod.inst.setExterAdd();
        UserProxy.inst.weaponShop = this.data["weaponShop"];
        // EventManager.inst.dispatch(ContextEvent.ROLE_DATA_UPDATE);
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON);
        EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON_COIN);
    };
    return NetWeaponBuyCmd;
}(BaseCmd));
egret.registerClass(NetWeaponBuyCmd,'NetWeaponBuyCmd');
var NetWeaponUpCmd = (function (_super) {
    __extends(NetWeaponUpCmd, _super);
    function NetWeaponUpCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetWeaponUpCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.weaponCoin = this.data["weaponCoin"];
        for (var i in this.data["weaponList"]) {
            UserProxy.inst.weaponList[i] = this.data["weaponList"][i];
        }
        UserMethod.inst.setExterAdd();
        // EventManager.inst.dispatch(ContextEvent.ROLE_DATA_UPDATE);
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON_COIN);
    };
    return NetWeaponUpCmd;
}(BaseCmd));
egret.registerClass(NetWeaponUpCmd,'NetWeaponUpCmd');
var NetWeaponSellCmd = (function (_super) {
    __extends(NetWeaponSellCmd, _super);
    function NetWeaponSellCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetWeaponSellCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.weaponList = this.data["weaponList"];
        UserMethod.inst.setExterAdd();
        EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON);
        UserMethod.inst.showAward(this.data);
        // EventManager.inst.dispatch(ContextEvent.ROLE_DATA_UPDATE);
    };
    return NetWeaponSellCmd;
}(BaseCmd));
egret.registerClass(NetWeaponSellCmd,'NetWeaponSellCmd');
var NetWeaponPosBuyCmd = (function (_super) {
    __extends(NetWeaponPosBuyCmd, _super);
    function NetWeaponPosBuyCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetWeaponPosBuyCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.maxNum = this.data["maxNum"];
        UserProxy.inst.buyNum = this.data["buyNum"];
        UserProxy.inst.diamond = this.data["diamond"];
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    };
    return NetWeaponPosBuyCmd;
}(BaseCmd));
egret.registerClass(NetWeaponPosBuyCmd,'NetWeaponPosBuyCmd');
