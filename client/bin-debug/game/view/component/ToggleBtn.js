/**
 * Created by Administrator on 11/30 0030.
 */
var ToggleBtn = (function (_super) {
    __extends(ToggleBtn, _super);
    function ToggleBtn() {
        _super.call(this);
        this._select = true;
        this.skinName = ToggleBtnSkin;
    }
    var d = __define,c=ToggleBtn,p=c.prototype;
    d(p, "select",undefined
        ,function (value) {
            this._select = value;
            this.imageDown.visible = this._select;
            this.imageUp.visible = !this._select;
        }
    );
    return ToggleBtn;
}(eui.Component));
egret.registerClass(ToggleBtn,'ToggleBtn');
//# sourceMappingURL=ToggleBtn.js.map