/**
 * Created by Administrator on 12/9 0009.
 */
var ActiveRichSign = (function (_super) {
    __extends(ActiveRichSign, _super);
    function ActiveRichSign() {
        _super.call(this);
        this.skinName = ActiveRichSignSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveRichSign,p=c.prototype;
    p.onShow = function (event) {
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
    };
    p.onHide = function (event) {
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
    };
    p.onBuy = function () {
    };
    return ActiveRichSign;
}(eui.Component));
egret.registerClass(ActiveRichSign,'ActiveRichSign');
//# sourceMappingURL=ActiveRichSign.js.map