/**
 * Created by Administrator on 12/5 0005.
 */
var GreenButton = (function (_super) {
    __extends(GreenButton, _super);
    function GreenButton() {
        _super.call(this);
        this.skinName = GreenButtonSkin;
    }
    var d = __define,c=GreenButton,p=c.prototype;
    d(p, "label",undefined
        ,function (value) {
            this.labelDisplay.text = value;
        }
    );
    return GreenButton;
}(eui.Button));
egret.registerClass(GreenButton,'GreenButton');
//# sourceMappingURL=GreenButton.js.map