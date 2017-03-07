/**
 * Created by Administrator on 2/4 0004.
 */
var MoneyUnitRenderer = (function (_super) {
    __extends(MoneyUnitRenderer, _super);
    function MoneyUnitRenderer() {
        _super.call(this);
        this.skinName = MoneyUnitRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=MoneyUnitRenderer,p=c.prototype;
    p.onShow = function (event) {
    };
    p.onHide = function (event) {
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.lblName.text = MathUtil.unitKey[this.data];
        this.lblDesc.text = (this.data + 1) * 3 + "个零";
    };
    return MoneyUnitRenderer;
}(eui.ItemRenderer));
egret.registerClass(MoneyUnitRenderer,'MoneyUnitRenderer');
//# sourceMappingURL=MoneyUnitRenderer.js.map