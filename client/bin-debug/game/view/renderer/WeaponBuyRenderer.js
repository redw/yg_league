/**
 * Created by Administrator on 12/5 0005.
 */
var WeaponBuyRenderer = (function (_super) {
    __extends(WeaponBuyRenderer, _super);
    function WeaponBuyRenderer() {
        _super.call(this);
        this.skinName = WeaponBuyRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=WeaponBuyRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWeaponBuy, this);
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowWeapon, this);
    };
    p.onHide = function (event) {
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onWeaponBuy, this);
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowWeapon, this);
    };
    p.onWeaponBuy = function (e) {
        if (UserMethod.inst.getWeaponCount() >= UserProxy.inst.maxNum) {
            if (UserProxy.inst.buyNum > 7) {
                Notice.show("装备栏放不下装备了！");
            }
            else {
                this.onAdd();
            }
            return;
        }
        Http.inst.send(CmdID.WEAPON_SHOP_BUY, { idx: this.data });
    };
    p.onAdd = function () {
        var cost = parseInt(Config.BaseData[13]["value"][UserProxy.inst.buyNum]);
        Alert.showCost(cost, "添加装备栏", true, showCost, null, this);
        function showCost() {
            if (UserProxy.inst.diamond >= cost) {
                Http.inst.send(CmdID.WEAPON_POS_BUY);
            }
            else {
                ExternalUtil.inst.diamondAlert();
            }
        }
    };
    p.onShowWeapon = function (e) {
        var weaponShopInfo = UserProxy.inst.weaponShop[this.data];
        var weaponId = weaponShopInfo["id"];
        PanelManager.inst.showPanel("WeaponInfoPanel", weaponId);
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var weaponShopInfo = UserProxy.inst.weaponShop[this.data];
        var weaponId = weaponShopInfo["id"];
        var state = weaponShopInfo["state"];
        var weaponData = Config.WeaponData[weaponId];
        this.lblName.text = weaponData["name"];
        var dec1 = UserMethod.inst.getAddSting(weaponData["attr_1"]);
        var dec2 = "";
        if (weaponData["attr_2"]) {
            dec2 = UserMethod.inst.getAddSting(weaponData["attr_2"]);
        }
        this.lblDec.text = dec1 + "\n" + dec2;
        this.icon.imageBg.source = "weapon_icon_" + weaponData["rank"] + "_png";
        this.icon.imageIcon.source = Global.getWeaponURL(weaponId);
        var costTypes = UserMethod.inst.getWeaponCostType(weaponData["cost"]);
        var costType1 = costTypes[0];
        var costType2 = costTypes[1];
        this.btnBuy.visible = state == 0;
        this.imgBuy.visible = state != 0;
        if (weaponData["rank"] < 3) {
            this.btnBuy.imageType.y = 14;
            this.btnBuy.labelDisplay.y = 22;
            this.btnBuy.imageType1.visible = false;
            this.btnBuy.labelDisplay1.visible = false;
            var id = parseInt(costType1["key"]) + 9;
            this.btnBuy.type = UserMethod.inst.rewardJs[id].icon_s;
            this.btnBuy.label = MathUtil.easyNumber(costType1["value"]);
            this.btnBuy.enabled = parseInt(costType1["value"]) <= UserProxy.inst.weaponCoin[costType1["key"]];
        }
        else {
            var id1 = parseInt(costType1["key"]) + 9;
            var id2 = parseInt(costType2["key"]) + 9;
            this.btnBuy.type = UserMethod.inst.rewardJs[id1].icon_s;
            this.btnBuy.label = MathUtil.easyNumber(costType1["value"]);
            this.btnBuy.type1 = UserMethod.inst.rewardJs[id2].icon_s;
            this.btnBuy.label1 = MathUtil.easyNumber(costType2["value"]);
            var oneCan = parseInt(costType1["value"]) <= UserProxy.inst.weaponCoin[costType1["key"]];
            var twoCan = parseInt(costType2["value"]) <= UserProxy.inst.weaponCoin[costType2["key"]];
            this.btnBuy.enabled = (oneCan && twoCan);
        }
    };
    return WeaponBuyRenderer;
}(eui.ItemRenderer));
egret.registerClass(WeaponBuyRenderer,'WeaponBuyRenderer');
