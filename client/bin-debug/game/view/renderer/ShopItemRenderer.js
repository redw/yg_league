/**
 * Created by Administrator on 12/28 0028.
 */
var ShopItemRenderer = (function (_super) {
    __extends(ShopItemRenderer, _super);
    function ShopItemRenderer() {
        _super.call(this);
        this.skinName = ShopItemRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ShopItemRenderer,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.SHOP, this.onBuyBack, this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
        EventManager.inst.addEventListener(ContextEvent.RECHARGE_BACK, this.dataChanged, this);
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.SHOP, this.onBuyBack, this);
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
        EventManager.inst.removeEventListener(ContextEvent.RECHARGE_BACK, this.dataChanged, this);
    };
    p.onBuyBack = function (e) {
        UserProxy.inst.shopObj = e.data["shopObj"];
        UserProxy.inst.diamond = e.data["diamond"];
        UserMethod.inst.showAward(e.data);
        this.dataChanged();
    };
    p.onBuy = function () {
        if (this.data > 7 && this.data < 17) {
            var shopData = Config.ShopData[this.data];
            if (UserProxy.inst.costAlart) {
                this.showCost();
            }
            else {
                Alert.showCost(shopData["price"], "购买" + shopData["name"], true, this.showCost, null, this);
            }
        }
        else {
            switch (this.data) {
                case 1:
                    ExternalUtil.inst.pay(PidType.PID_2);
                    break;
                case 2:
                    ExternalUtil.inst.pay(PidType.PID_6);
                    break;
                case 3:
                    ExternalUtil.inst.pay(PidType.PID_30);
                    break;
                case 4:
                    ExternalUtil.inst.pay(PidType.PID_50);
                    break;
                case 5:
                    ExternalUtil.inst.pay(PidType.PID_98);
                    break;
                case 6:
                    ExternalUtil.inst.pay(PidType.PID_198);
                    break;
                case 7:
                    ExternalUtil.inst.pay(PidType.PID_648);
                    break;
                case 17:
                    ExternalUtil.inst.pay(PidType.PID_FOREVER);
                    break;
                case 18:
                    ExternalUtil.inst.pay(PidType.PID_MONTH);
                    break;
                case 19:
                    ExternalUtil.inst.pay(PidType.PID_FUND);
                    break;
            }
        }
    };
    p.showCost = function () {
        var shopData = Config.ShopData[this.data];
        if (UserProxy.inst.diamond >= parseInt(shopData["price"])) {
            Http.inst.send(CmdID.SHOP, { id: this.data });
        }
        else {
            ExternalUtil.inst.diamondAlert();
        }
    };
    p.onGo = function () {
        if (this.data == 17 || this.data == 18) {
            PanelManager.inst.showPanel("PrivilegePanel");
        }
        else {
            PanelManager.inst.showPanel("ActivePanel", 2);
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.btnGo.visible = false;
        var shopData = Config.ShopData[this.data];
        var shopInfo = UserProxy.inst.shopObj[this.data];
        this.imgIcon.source = shopData["icon"] + "_png";
        this.lblName.text = shopData["name"];
        this.lblDesc.text = shopData["disc"];
        if (parseInt(shopData["type"]) == 1) {
            this.btnBuy.coinType = "RMB_png";
        }
        else {
            this.btnBuy.coinType = "reward_3_s_png";
        }
        this.btnBuy.label = shopData["price"];
        this.btnBuy.extraLabel = "购 买";
        if (parseInt(shopData["daytimes"])) {
            this.lblBuyTimes.visible = true;
            this.lblBuyTimes.x = this.lblName.x + this.lblName.width + 10;
            this.lblBuyTimes.text = "(今日可购" + (parseInt(shopData["daytimes"]) - shopInfo["todayTimes"]) + "/" + shopData["daytimes"] + "次)";
        }
        else {
            this.lblBuyTimes.visible = false;
        }
        if (this.data > 7 && this.data < 17) {
            if (parseInt(shopData["daytimes"]) - shopInfo["todayTimes"] == 0) {
                this.imgHadBuy.visible = true;
                this.btnBuy.visible = false;
            }
            else {
                this.imgHadBuy.visible = false;
                this.btnBuy.visible = true;
            }
        }
        else if (this.data >= 17) {
            this.imgHadBuy.visible = false;
            if (this.data == 17) {
                //终身
                if (UserProxy.inst.vipObj["foreverVIP"]) {
                    this.btnGo.visible = true;
                    this.btnBuy.visible = false;
                }
                else {
                    this.btnBuy.visible = true;
                    this.btnGo.visible = false;
                }
            }
            else if (this.data == 18) {
                //月
                if (UserProxy.inst.vipObj["monthVIP"]) {
                    this.btnGo.visible = true;
                    this.btnBuy.visible = false;
                }
                else {
                    this.btnBuy.visible = true;
                    this.btnGo.visible = false;
                }
            }
            else if (this.data == 19) {
                if (UserProxy.inst.vipObj["fund"]) {
                    this.btnGo.visible = true;
                    this.btnBuy.visible = false;
                }
                else {
                    this.btnBuy.visible = true;
                    this.btnGo.visible = false;
                }
            }
        }
        else {
            this.imgHadBuy.visible = false;
            this.btnBuy.visible = true;
        }
    };
    return ShopItemRenderer;
}(eui.ItemRenderer));
egret.registerClass(ShopItemRenderer,'ShopItemRenderer');
//# sourceMappingURL=ShopItemRenderer.js.map