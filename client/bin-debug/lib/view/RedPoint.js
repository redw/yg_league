/**
 * 小红点
 * @author j
 * 2016/1/25
 */
var RedPoint = (function (_super) {
    __extends(RedPoint, _super);
    function RedPoint() {
        _super.call(this);
        this.jump = true;
        this.bitmap = new AutoBitmap();
        this.bitmap.x = -RedPoint.POINT_RADIUS / 2;
        this.bitmap.y = -RedPoint.POINT_RADIUS / 2;
        this.bitmap.source = "red_point_png";
        this.addChild(this.bitmap);
        this.startJump();
    }
    var d = __define,c=RedPoint,p=c.prototype;
    p.setJump = function (bool) {
        this.jump = bool;
        this.startJump();
    };
    p.startJump = function () {
        if (this.jump) {
            egret.Tween.get(this.bitmap).to({ y: -20 }, 200, egret.Ease.sineIn).to({ y: -RedPoint.POINT_RADIUS / 2 }, 500, egret.Ease.bounceOut).wait(5000).call(function () {
                this.startJump();
            }, this);
        }
        else {
            this.bitmap.x = -RedPoint.POINT_RADIUS / 2;
            this.bitmap.y = -RedPoint.POINT_RADIUS / 2;
            egret.Tween.removeTweens(this.bitmap);
        }
    };
    p.clear = function () {
        egret.Tween.removeTweens(this.bitmap);
    };
    RedPoint.POINT_RADIUS = 20;
    return RedPoint;
}(egret.Sprite));
egret.registerClass(RedPoint,'RedPoint');
