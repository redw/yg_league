/**
 * 浮动文本
 * @author j
 * 2016/3/4
 */
var Notice = (function (_super) {
    __extends(Notice, _super);
    //----------------------------------------//
    function Notice() {
        _super.call(this);
    }
    var d = __define,c=Notice,p=c.prototype;
    Notice.show = function (msg, color) {
        var notcie = new Notice();
        notcie.show(msg, color);
        Global.getStage().addChild(notcie);
    };
    p.show = function (msg, color) {
        this.width = Global.getStageWidth();
        this.size = 24;
        this.bold = true;
        this.textColor = color ? color : 0xFF0000;
        this.fontFamily = Global.SYS_FONT;
        this.stroke = 2;
        this.strokeColor = 0x000000;
        this.textAlign = egret.HorizontalAlign.CENTER;
        this.verticalAlign = egret.VerticalAlign.MIDDLE;
        if (typeof (msg) == "string") {
            this.text = msg;
        }
        else {
            this.textFlow = msg;
        }
        this.x = 0;
        this.y = Global.getStageHeight() / 3;
        this.alpha = 0;
        egret.Tween.get(this).to({ alpha: 1, y: this.y - 60 }, 300).call(function () {
            egret.Tween.get(this).wait(1000).to({ alpha: 0, y: this.y - 60 }, 300).call(function () {
                DisplayUtil.removeFromParent(this);
            }, this);
        }, this);
    };
    return Notice;
}(egret.TextField));
egret.registerClass(Notice,'Notice');
