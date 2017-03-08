/**
 * Created by Administrator on 12/28 0028.
 */
var ShopPanel = (function (_super) {
    __extends(ShopPanel, _super);
    function ShopPanel() {
        _super.call(this);
        this._moving = false;
        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = ShopPanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }
    var d = __define,c=ShopPanel,p=c.prototype;
    p.init = function () {
        this.imgBag.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.imgRecharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpDown, this);
        this.shopList.itemRenderer = ShopItemRenderer;
        this.coinShow.startListener();
    };
    p.initData = function () {
        this.imgRecharge.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        this._upDown = MenuPanel.inst.menuUp;
        if (MenuPanel.inst.menuUp) {
            this.btnUp.source = "menu_down_png";
            this.height = 616;
            this.scroll.height = 494;
        }
        else {
            this.btnUp.source = "menu_up_png";
            this.height = 282;
            this.scroll.height = 160;
        }
    };
    p.onChange = function (e) {
        if (this._lastSelect && this._lastSelect == e.currentTarget) {
            return;
        }
        this._lastSelect = e.currentTarget;
        if (e.currentTarget == this.imgBag) {
            this.imgBag.source = "show_bag_light_png";
            this.imgRecharge.source = "show_recharge_png";
        }
        else {
            this.imgBag.source = "show_bag_png";
            this.imgRecharge.source = "show_recharge_light_png";
        }
        this.refresh();
    };
    p.refresh = function () {
        var ids = [];
        var shopDatas = [];
        var buyIds = [];
        for (var i in Config.ShopData) {
            shopDatas.push(Config.ShopData[i]);
        }
        shopDatas.sort(shopSort);
        function shopSort(a, b) {
            return parseInt(a["sort"]) - parseInt(b["sort"]);
        }
        for (var i in shopDatas) {
            var id = shopDatas[i]["id"];
            var shopData = Config.ShopData[id];
            var shopInfo = UserProxy.inst.shopObj[id];
            if (this._lastSelect == this.imgBag) {
                if (shopDatas[i]["type"] == 2) {
                    if (parseInt(shopData["daytimes"]) - shopInfo["todayTimes"] == 0) {
                        buyIds.push(id);
                    }
                    else {
                        ids.push(id);
                    }
                }
            }
            else {
                if (shopDatas[i]["type"] == 1) {
                    ids.push(id);
                }
            }
        }
        this.shopList.dataProvider = new eui.ArrayCollection(ids.concat(buyIds));
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    };
    p.onEnterFrame = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        var turnId = UserMethod.inst.shopMoveTo;
        if (turnId > 2) {
            this.shopList.scrollV = (turnId - 1) * 73;
        }
    };
    p.onUpDown = function () {
        if (this._moving) {
            return;
        }
        this._moving = true;
        this._upDown = !this._upDown;
        var time = 500;
        if (this._upDown) {
            this.btnUp.source = "menu_down_png";
            egret.Tween.get(this).to({ height: 616 }, time);
            egret.Tween.get(this.scroll).to({ height: 494 }, time);
            MenuPanel.inst.menuUp = true;
        }
        else {
            this.btnUp.source = "menu_up_png";
            egret.Tween.get(this).to({ height: 282 }, time);
            egret.Tween.get(this.scroll).to({ height: 150 }, time);
            MenuPanel.inst.menuUp = false;
        }
        egret.setTimeout(function () { this._moving = false; }, this, time);
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpDown, this);
        this.coinShow.endListener();
    };
    return ShopPanel;
}(BasePanel));
egret.registerClass(ShopPanel,'ShopPanel');
