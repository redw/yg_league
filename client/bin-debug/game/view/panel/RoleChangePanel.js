/**
 * Created by Administrator on 2/8 0008.
 */
var RoleChangePanel = (function (_super) {
    __extends(RoleChangePanel, _super);
    function RoleChangePanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = RoleChangePanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
        this._modal = true;
    }
    var d = __define,c=RoleChangePanel,p=c.prototype;
    p.init = function () {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_SOUL_COIN, this.soulCoin, this);
        this.imgSell.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.imgBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.list.itemRenderer = RoleChangeRenderer;
    };
    p.initData = function () {
        this.imgSell.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        this.soulCoin();
    };
    p.soulCoin = function () {
        this.lblSoulCoin1.text = UserProxy.inst.soulCoin[0] + "";
        this.lblSoulCoin2.text = UserProxy.inst.soulCoin[1] + "";
        this.lblSoulCoin3.text = UserProxy.inst.soulCoin[2] + "";
        this.lblSoulCoin4.text = UserProxy.inst.soulCoin[3] + "";
    };
    p.onTouch = function (e) {
        if (this._lastSelect && this._lastSelect == e.currentTarget) {
            return;
        }
        if (e.currentTarget == this.imgSell) {
            this.imgSell.source = "role_draw_sell_light_png";
            this.imgBuy.source = "role_draw_change_png";
            UserMethod.inst.sell_change = 1;
            this.lblShow.text = "回收闲置的伙伴元神，获得神魂";
        }
        else {
            this.imgSell.source = "role_draw_sell_png";
            this.imgBuy.source = "role_draw_change_light_png";
            UserMethod.inst.sell_change = 2;
            this.lblShow.text = "用神魂兑换指定伙伴元神";
        }
        this._lastSelect = e.currentTarget;
        this.refresh();
    };
    p.refresh = function () {
        var ids = [];
        var upIds = [];
        var downs = [];
        if (UserMethod.inst.sell_change == 1) {
            for (var i in Config.DrawShopSellData) {
                var sellData = Config.DrawShopSellData[i];
                if (parseInt(sellData["is_sell"])) {
                    ids.push(parseInt(i));
                }
            }
            ids.sort(orderSort);
            function orderSort(a, b) {
                var sell1 = Config.DrawShopSellData[a];
                var sell2 = Config.DrawShopSellData[b];
                return parseInt(sell2["order"]) - parseInt(sell1["order"]);
            }
            for (var c in ids) {
                var sell = Config.DrawShopSellData[ids[c]];
                if (ids[c] > 100) {
                    var roleData = UserProxy.inst.heroData.getHeroData(ids[c]);
                    if (roleData.starPiece >= parseInt(sell["sell_num"])) {
                        upIds.push(ids[c]);
                    }
                    else {
                        downs.push(ids[c]);
                    }
                }
                else {
                    if (UserProxy.inst.pill >= parseInt(sellData["sell_num"])) {
                        upIds.push(ids[c]);
                    }
                    else {
                        downs.push(ids[c]);
                    }
                }
            }
        }
        else {
            for (var i in Config.DrawShopBuyData) {
                var buyData = Config.DrawShopBuyData[i];
                if (parseInt(buyData["is_buy"])) {
                    ids.push(parseInt(i));
                }
            }
            ids.sort(buyOrderSort);
            function buyOrderSort(a, b) {
                var buy1 = Config.DrawShopBuyData[a];
                var buy2 = Config.DrawShopBuyData[b];
                return parseInt(buy2["order"]) - parseInt(buy1["order"]);
            }
            for (var c in ids) {
                var buy = Config.DrawShopBuyData[ids[c]];
                if (UserProxy.inst.soulCoin[parseInt(buy["cost_type"]) - 1] >= parseInt(buy["cost_num"])) {
                    upIds.push(ids[c]);
                }
                else {
                    downs.push(ids[c]);
                }
            }
        }
        this.list.dataProvider = new eui.ArrayCollection(upIds.concat(downs));
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("RoleChangePanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_SOUL_COIN, this.soulCoin, this);
        this.imgSell.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.imgBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    return RoleChangePanel;
}(BasePanel));
egret.registerClass(RoleChangePanel,'RoleChangePanel');
//# sourceMappingURL=RoleChangePanel.js.map