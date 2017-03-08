/**
 * 转圈
 * @author j
 * 2016/2/22
 */
var Processing = (function (_super) {
    __extends(Processing, _super);
    function Processing() {
        _super.call(this);
        this.touchEnabled = true;
        var mask = DisplayUtil.createMask();
        this.addChild(mask);
        /* this._bitmap = new AutoBitmap();
         this._bitmap.x = Global.getStageWidth() / 2;
         this._bitmap.y = Global.getStageHeight() / 2;
         this._bitmap.source = "loading_01";
         this._bitmap.anchorOffsetX = 28;
         this._bitmap.anchorOffsetY = 28;
         this.addChild(this._bitmap)*/
        MovieClipUtils.createMovieClip(Global.getOtherEffect("process"), "process", afterAdd1, this);
        function afterAdd1(data) {
            var mc = data;
            mc.x = 240;
            mc.y = 400;
            mc.play(-1);
            mc.name = "process";
            this.addChild(mc);
        }
    }
    var d = __define,c=Processing,p=c.prototype;
    d(Processing, "inst"
        ,function () {
            if (Processing._instance == null) {
                Processing._instance = new Processing();
            }
            return Processing._instance;
        }
    );
    p.show = function () {
        // egret.Tween.removeTweens(this._bitmap);
        // egret.Tween.get(this._bitmap, {loop: true}).to({rotation: 360}, 1000);
        Global.getStage().addChild(this);
    };
    p.hide = function () {
        // egret.Tween.removeTweens(this._bitmap);
        var mc = DisplayUtil.getChildByName(this, "process");
        if (mc) {
            mc.stop();
            DisplayUtil.removeFromParent(mc);
        }
        DisplayUtil.removeFromParent(this);
    };
    return Processing;
}(egret.Sprite));
egret.registerClass(Processing,'Processing');
