/**
 * Created by Administrator on 2017/1/23.
 */
var PlayerHead = (function (_super) {
    __extends(PlayerHead, _super);
    function PlayerHead(align) {
        if (align === void 0) { align = "left"; }
        _super.call(this);
        this.align = align;
        this.image = new AutoBitmap("common_head_png");
        this.image.width = 55;
        this.image.height = 55;
        this.addChild(this.image);
        this.border = new AutoBitmap("pvp_icon_1_png");
        this.border.x = -10;
        this.addChild(this.border);
        this.nameLabel = new eui.Label();
        this.nameLabel.y = 64;
        this.nameLabel.fontFamily = "微软雅黑";
        this.nameLabel.bold = true;
        this.nameLabel.size = 15;
        this.nameLabel.textColor = 0xffffff;
        this.addChild(this.nameLabel);
    }
    var d = __define,c=PlayerHead,p=c.prototype;
    p.setInfo = function (value) {
        if (value) {
            this.image.source = value.head || "common_head_png";
            this.nameLabel.text = value.name || "";
            if (this.align == "right") {
                this.nameLabel.x = 480 - this.nameLabel.textWidth - 4;
                this.image.x = 480 - (55);
                this.border.x = 480 - 65;
            }
            this.border.source = value.border || "pvp_icon_5_png";
        }
        else {
            this.dispose();
        }
    };
    p.dispose = function () {
        if (this.image && this.parent) {
            this.removeChild(this.image);
        }
        if (this.nameLabel && this.parent) {
            this.removeChild(this.nameLabel);
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.image = null;
        this.nameLabel = null;
    };
    return PlayerHead;
}(egret.DisplayObjectContainer));
egret.registerClass(PlayerHead,'PlayerHead');
