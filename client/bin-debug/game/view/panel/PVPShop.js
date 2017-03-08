/**
 * Created by Administrator on 12/21 0021.
 */
var PVPShop = (function (_super) {
    __extends(PVPShop, _super);
    function PVPShop() {
        _super.call(this);
        this.skinName = PVPShopSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=PVPShop,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.PVP_SHOP_RESET, this.onRefreshBack, this);
        EventManager.inst.addEventListener(ContextEvent.PVP_SHOP_BUY, this.showPVPCoin, this);
        this.shopList.itemRenderer = PVPShopRenderer;
        this.btnRefresh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefresh, this);
        this.showCDTime();
        this.showPVPCoin();
    };
    p.onHide = function (event) {
        EventManager.inst.removeEventListener(ContextEvent.PVP_SHOP_BUY, this.showPVPCoin, this);
        Http.inst.removeCmdListener(CmdID.PVP_SHOP_RESET, this.onRefreshBack, this);
        this.btnRefresh.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRefresh, this);
        TickerUtil.unregister(this.tickerTime, this);
    };
    p.onRefreshBack = function (e) {
        if (e.data["diamond"] || e.data["diamond"] == 0) {
            UserProxy.inst.diamond = e.data["diamond"];
        }
        UserProxy.inst.pvpShopObj = e.data["pvpShopObj"];
        this.showCDTime();
    };
    p.showPVPCoin = function () {
        this.lblPVPCoin.text = UserProxy.inst.pvpShopObj["pvpCoin"];
    };
    p.onRefresh = function () {
        var type = 0;
        if (this._cdTime <= 0) {
            type = 1;
        }
        else {
            type = 2;
        }
        if (type == 2) {
            if (UserProxy.inst.costAlart) {
                showCost();
            }
            else {
                Alert.showCost(Config.PVPData[14]["value"], "换一批商品", true, showCost, null, this);
            }
            function showCost() {
                if (UserProxy.inst.diamond >= parseInt(Config.PVPData[14]["value"])) {
                    Http.inst.send(CmdID.PVP_SHOP_RESET, { type: 2 });
                }
                else {
                    ExternalUtil.inst.diamondAlert();
                }
            }
        }
        else {
            Http.inst.send(CmdID.PVP_SHOP_RESET, { type: 1 });
        }
    };
    p.showCDTime = function () {
        this._cdTime = (parseInt(Config.PVPData[12]["value"]) * 60) - (UserProxy.inst.server_time - UserProxy.inst.pvpShopObj["resetLastTime"]);
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
    p.refresh = function () {
        var ids = [];
        for (var i in UserProxy.inst.pvpShopObj["pvpShop"]) {
            ids.push(parseInt(i));
        }
        this.shopList.dataProvider = new eui.ArrayCollection(ids);
    };
    return PVPShop;
}(eui.Component));
egret.registerClass(PVPShop,'PVPShop');
