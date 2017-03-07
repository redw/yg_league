/**
 * CheckBox
 * @author j
 * 2016/1/13
 */
var CheckBox = (function (_super) {
    __extends(CheckBox, _super);
    function CheckBox() {
        _super.call(this);
        this.isEnabled = true;
    }
    var d = __define,c=CheckBox,p=c.prototype;
    p.childrenCreated = function () {
        this.setEnabled(true);
        _super.prototype.childrenCreated.call(this);
    };
    p.setEnabled = function (bool) {
        this.isEnabled = bool;
        this.touchEnabled = this.isEnabled;
        this.touchChildren = this.isEnabled;
        this.imageBg.visible = this.isEnabled == true;
        this.imageGrayBg.visible = this.isEnabled == false;
        this.imageSelect.visible = this.isEnabled == true;
        this.imageGraySelect.visible = this.isEnabled == false;
        if (this.isEnabled) {
            this.labelText.textColor = 0xF8F6C4;
            this.labelText.strokeColor = 0x6b2407;
        }
        else {
            this.labelText.textColor = 0x154963;
            this.labelText.strokeColor = 0x333333;
        }
    };
    p.getEnabled = function () {
        return this.isEnabled;
    };
    p.setSelect = function (bool) {
        this.imageSelect.visible = bool;
    };
    p.getSelect = function () {
        return this.imageSelect.visible;
    };
    p.setLabel = function (value) {
        this.labelText.text = value;
    };
    p.getLabel = function () {
        return this.labelText.text;
    };
    p.setColor = function (value) {
        this.labelText.textColor = value;
    };
    p.getColor = function () {
        return this.labelText.textColor;
    };
    return CheckBox;
}(eui.Component));
egret.registerClass(CheckBox,'CheckBox');
//# sourceMappingURL=CheckBox.js.map