/**
 * TabButton
 * @author j
 * 2016/11/14
 */
var TabButton = (function (_super) {
    __extends(TabButton, _super);
    function TabButton() {
        _super.call(this);
        this._label = "";
        this._select = true;
        this.touchChildren = false;
        this.skinName = TabButtonSkin;
    }
    var d = __define,c=TabButton,p=c.prototype;
    d(p, "label",undefined
        ,function (value) {
            this._label = value;
            this.labelDisplay.text = this._label;
        }
    );
    d(p, "select",undefined
        ,function (value) {
            this._select = value;
            this.imageDown.visible = this._select;
            this.imageUp.visible = !this._select;
        }
    );
    return TabButton;
}(eui.Component));
egret.registerClass(TabButton,'TabButton');
