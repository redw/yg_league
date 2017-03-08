/**
 * Created by Administrator on 12/5 0005.
 */
var WeaponBuyPanel = (function (_super) {
    __extends(WeaponBuyPanel, _super);
    function WeaponBuyPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = WeaponBuyPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=WeaponBuyPanel,p=c.prototype;
    p.init = function () {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON_COIN, this.refreshWeaponCoin, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnRefresh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefresh, this);
        this.buyList.itemRenderer = WeaponBuyRenderer;
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON, this.onWeaponRefresh, this);
        Http.inst.addCmdListener(CmdID.WEAPON_SHOP_RESET, this.showCDTime, this);
        Http.inst.addCmdListener(CmdID.WEAPON_POS_BUY, this.showWeaponCell, this);
    };
    p.initData = function () {
        this.btnRefresh.labelDisplay.horizontalCenter = "-25";
        this.showCDTime();
        this.refreshWeaponCoin();
    };
    p.refreshWeaponCoin = function () {
        this.lblWeaponCoin0.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[0]);
        this.lblWeaponCoin1.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[1]);
        this.lblWeaponCoin2.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[2]);
        this.lblWeaponCoin3.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[3]);
        this.lblWeaponCoin4.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[4]);
    };
    p.showCDTime = function () {
        this._cdTime = (parseInt(Config.BaseData[16]["value"]) * 60) - (UserProxy.inst.server_time - UserProxy.inst.weaponShopResetLastTime);
        this.refreshTime();
    };
    p.refreshTime = function () {
        if (this._cdTime > 0) {
            this.tickerTime();
            TickerUtil.register(this.tickerTime, this, 1000);
        }
        this.refresh();
    };
    p.tickerTime = function () {
        this.lblTime.text = "(" + StringUtil.timeToString(this._cdTime, false) + ")";
        this._cdTime--;
        if (!this._cdTime) {
            TickerUtil.unregister(this.tickerTime, this);
        }
    };
    p.showWeaponCell = function () {
        this.weaponCell.text = "(" + UserMethod.inst.getWeaponCount() + "/" + UserProxy.inst.maxNum + ")";
    };
    p.onWeaponRefresh = function (event) {
        this._lastVerticalScrollPos = this.buyList.scrollV;
        this.refresh();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    };
    p.onEnterFrame = function (event) {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.buyList.scrollV = this._lastVerticalScrollPos;
    };
    p.refresh = function () {
        this.showWeaponCell();
        var buyIndexs = [];
        for (var i in UserProxy.inst.weaponShop) {
            buyIndexs.push(parseInt(i));
        }
        this.buyList.dataProvider = new eui.ArrayCollection(buyIndexs);
    };
    p.onClose = function (e) {
        PanelManager.inst.hidePanel("WeaponBuyPanel");
    };
    p.onRefresh = function () {
        if (this._cdTime < 0) {
            Http.inst.send(CmdID.WEAPON_SHOP_RESET, { type: 1 });
        }
        else {
            if (UserProxy.inst.costAlart) {
                showCost();
            }
            else {
                Alert.showCost(Config.BaseData[14]["value"], "刷新装备商店", true, showCost, null, this);
            }
        }
        function showCost() {
            if (UserProxy.inst.diamond >= parseInt(Config.BaseData[14]["value"])) {
                Http.inst.send(CmdID.WEAPON_SHOP_RESET, { type: 2 });
            }
        }
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_WEAPON_COIN, this.refreshWeaponCoin, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnRefresh.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefresh, this);
        Http.inst.removeCmdListener(CmdID.WEAPON_SHOP_RESET, this.showCDTime, this);
        Http.inst.removeCmdListener(CmdID.WEAPON_POS_BUY, this.showWeaponCell, this);
        TickerUtil.unregister(this.tickerTime, this);
    };
    return WeaponBuyPanel;
}(BasePanel));
egret.registerClass(WeaponBuyPanel,'WeaponBuyPanel');
