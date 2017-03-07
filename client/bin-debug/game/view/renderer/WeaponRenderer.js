/**
 * Created by Administrator on 12/1 0001.
 */
var WeaponRenderer = (function (_super) {
    __extends(WeaponRenderer, _super);
    function WeaponRenderer() {
        _super.call(this);
        this.skinName = WeaponRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=WeaponRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWeaponUp, this);
        this.weaponUnlockGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddWeaponCell, this);
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowWeapon, this);
        Http.inst.addCmdListener(CmdID.WEAPON_UP, this.dataChanged, this);
    };
    p.onHide = function (event) {
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onWeaponUp, this);
        this.weaponUnlockGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddWeaponCell, this);
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowWeapon, this);
        Http.inst.removeCmdListener(CmdID.WEAPON_UP, this.dataChanged, this);
    };
    p.onWeaponUp = function (e) {
        Http.inst.send(CmdID.WEAPON_UP, { wid: this.data });
    };
    p.onAddWeaponCell = function (e) {
        this.onAdd();
    };
    p.onAdd = function () {
        var cost = parseInt(Config.BaseData[13]["value"][UserProxy.inst.buyNum]);
        if (UserProxy.inst.costAlart) {
            showCost();
        }
        else {
            Alert.showCost(cost, "添加装备栏", true, showCost, null, this);
        }
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
        PanelManager.inst.showPanel("WeaponInfoPanel", this.data);
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (this.data) {
            this.weaponUnlockGroup.visible = false;
            this.contentGroup.visible = true;
            this.btnUp.visible = true;
            var weaponInfo = UserProxy.inst.weaponList[this.data];
            var weaponData = Config.WeaponData[this.data];
            this.lblName.text = weaponData["name"];
            var addNature1 = parseFloat(weaponData["attr_1"][2]) * (1 + 0.1 * weaponInfo["lv"]);
            var dec1 = UserMethod.inst.getAddSting(weaponData["attr_1"], addNature1);
            var dec2 = "";
            if (weaponData["attr_2"]) {
                var addNature2 = parseFloat(weaponData["attr_2"][2]) * (1 + 0.1 * weaponInfo["lv"]);
                dec2 = UserMethod.inst.getAddSting(weaponData["attr_2"], addNature2);
            }
            this.lblDec.text = dec1 + "\n" + dec2;
            this.lblLv.text = "+" + weaponInfo["lv"];
            this.lblLv.visible = weaponInfo["lv"] > 0;
            this.icon.imageBg.source = "weapon_icon_" + weaponData["rank"] + "_png";
            this.icon.imageIcon.source = Global.getWeaponURL(this.data);
            var costTypes = UserMethod.inst.getWeaponCostType(weaponData["cost"]);
            var costType1 = costTypes[0];
            var costType2 = costTypes[1];
            this.btnUp.labelDisplay.x = 42;
            if (weaponData["rank"] < 3) {
                this.btnUp.imageType.y = 14;
                this.btnUp.labelDisplay.y = 22;
                this.btnUp.labelDisplay.visible = true;
                this.btnUp.imageType.visible = true;
                this.btnUp.imageType1.visible = false;
                this.btnUp.labelDisplay1.visible = false;
                var id = parseInt(costType1["key"]) + 9;
                this.btnUp.type = UserMethod.inst.rewardJs[id].icon_s;
                var cost = parseInt(costType1["value"]) * 0.2 * (parseInt(weaponInfo["lv"]) + 1);
                this.btnUp.label = MathUtil.easyNumber(cost);
                this.btnUp.enabled = UserProxy.inst.weaponCoin[costType1["key"]] >= cost;
            }
            else {
                this.btnUp.labelDisplay.visible = true;
                this.btnUp.imageType.visible = true;
                this.btnUp.imageType1.visible = true;
                this.btnUp.labelDisplay1.visible = true;
                this.btnUp.imageType.y = 4;
                this.btnUp.labelDisplay.y = 11;
                this.btnUp.imageType1.y = 26;
                this.btnUp.labelDisplay1.y = 33;
                var id1 = parseInt(costType1["key"]) + 9;
                var id2 = parseInt(costType2["key"]) + 9;
                this.btnUp.type = UserMethod.inst.rewardJs[id1].icon_s;
                this.btnUp.type1 = UserMethod.inst.rewardJs[id2].icon_s;
                var cost1 = parseInt(costType1["value"]) * 0.2 * (parseInt(weaponInfo["lv"]) + 1);
                var cost2 = parseInt(costType2["value"]) * 0.2 * (parseInt(weaponInfo["lv"]) + 1);
                this.btnUp.label = MathUtil.easyNumber(cost1);
                this.btnUp.label1 = MathUtil.easyNumber(cost2);
                this.btnUp.enabled = UserProxy.inst.weaponCoin[costType1["key"]] >= cost1 && UserProxy.inst.weaponCoin[costType2["key"]] >= cost2;
            }
            if (weaponInfo["lv"] >= weaponData["maxlv"]) {
                this.btnUp.labelDisplay.y = 22;
                this.btnUp.labelDisplay.x = 32;
                this.btnUp.imageType1.visible = false;
                this.btnUp.labelDisplay1.visible = false;
                this.btnUp.imageType.visible = false;
                this.btnUp.label = "MAX";
                this.btnUp.enabled = false;
            }
        }
        else {
            this.contentGroup.visible = false;
            this.weaponUnlockGroup.visible = true;
            this.btnUp.visible = false;
            if (UserProxy.inst.buyNum >= 8) {
                this.weaponUnlockGroup.visible = false;
            }
            else {
                this.lblUnlockCost1.text = Config.BaseData[13]["value"][UserProxy.inst.buyNum];
            }
        }
    };
    return WeaponRenderer;
}(eui.ItemRenderer));
egret.registerClass(WeaponRenderer,'WeaponRenderer');
//# sourceMappingURL=WeaponRenderer.js.map