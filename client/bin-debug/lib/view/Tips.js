/**
 * 提示框
 * @author j
 * 2016/7/25
 */
var Tips = (function (_super) {
    __extends(Tips, _super);
    function Tips() {
        var _this = this;
        _super.call(this);
        this.touchEnabled = false;
        this.touchChildren = false;
        this._bg = new egret.Bitmap();
        this.addChild(this._bg);
        this._text = new egret.TextField();
        this._text.width = 200;
        this._text.size = 14;
        this._text.bold = true;
        this._text.textAlign = "left";
        this._text.textColor = 0xffffcc;
        this._text.fontFamily = "微软雅黑";
        this._text.lineSpacing = 6;
        this.addChild(this._text);
        RES.getResAsync("tips_bg_png", function (res) {
            _this._bg.scale9Grid = new egret.Rectangle(20, 20, 10, 10);
            _this._bg.texture = res;
        }, this);
    }
    var d = __define,c=Tips,p=c.prototype;
    Tips.show = function (x, y, msg, root) {
        var tips = new Tips();
        tips.show(x, y, msg, root);
        return tips;
    };
    p.show = function (x, y, msg, root) {
        if (typeof (msg) == "string") {
            this._text.text = msg;
        }
        else {
            this._text.textFlow = msg;
        }
        this._bg.width = this._text.textWidth + 30;
        this._bg.height = this._text.textHeight + 38;
        this._bg.x = -this._bg.width + 40;
        this._bg.y = -this._bg.height + 5;
        this._text.x = this._bg.x + 15;
        this._text.y = this._bg.y + 15;
        this.x = x;
        this.y = y;
        if (root) {
            root.addChild(this);
        }
        else {
            PanelManager.inst.getLayer(PanelManager.ALERT_LAYER).addChild(this);
        }
        egret.clearTimeout(this._hideTimeout);
        this._hideTimeout = egret.setTimeout(this.hide, this, 2000);
    };
    p.hide = function () {
        DisplayUtil.removeFromParent(this);
    };
    return Tips;
}(egret.Sprite));
egret.registerClass(Tips,'Tips');
