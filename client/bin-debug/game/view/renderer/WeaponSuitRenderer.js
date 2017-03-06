/**
 * Created by Administrator on 12/5 0005.
 */
var WeaponSuitRenderer = (function (_super) {
    __extends(WeaponSuitRenderer, _super);
    function WeaponSuitRenderer() {
        _super.call(this);
        this.skinName = WeaponSuitRendererSkin;
    }
    var d = __define,c=WeaponSuitRenderer,p=c.prototype;
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.lblDec.text = UserMethod.inst.getAddSting(this.data["buff"]) + "(" + this.data["hadCount"] + "/" + this.data["needCount"] + ")";
        if (parseInt(this.data["hadCount"]) >= parseInt(this.data["needCount"])) {
            this.lblDec.textColor = 0x906C53;
        }
        else {
            this.lblDec.textColor = 0xAA9C89;
        }
    };
    return WeaponSuitRenderer;
}(eui.ItemRenderer));
egret.registerClass(WeaponSuitRenderer,'WeaponSuitRenderer');
