var WIDTH = fight.WIDTH;
/**
 * 关卡进度条
 * Created by hh on 2016/12/27.
 */
var StageProgress = (function (_super) {
    __extends(StageProgress, _super);
    function StageProgress() {
        _super.call(this);
        this.WIDTH = 173;
        this.backGround = new AutoBitmap();
        this.addChild(this.backGround);
        this.backGround.source = "blood_stage_background_png";
        this.hpBitmap = new AutoBitmap();
        this.hpBitmap.source = "blood_stage_png";
        this.addChild(this.hpBitmap);
        this.maskLayer = new egret.Shape();
        this.addChild(this.maskLayer);
        this.levelImg = new egret.BitmapText();
        this.addChild(this.levelImg);
        this.levelImg.font = RES.getRes("stage_fnt");
        this.levelImg.letterSpacing = -3;
        this.levelImg.width = 173;
        this.levelImg.$setTextAlign(egret.HorizontalAlign.CENTER);
    }
    var d = __define,c=StageProgress,p=c.prototype;
    p.startLevel = function (value) {
        this.levelImg.text = "关卡" + value;
        this.setProgress(1);
    };
    p.setProgress = function (value) {
        // let w = MathUtil.clamp(value,0,1) * this.WIDTH;
        // this.hpBitmap.width = w;
        // this.hpBitmap.x = this.WIDTH - w;
        if (!this.hpBitmap.mask) {
            this.hpBitmap.mask = this.maskLayer;
        }
        var w = MathUtil.clamp(value, 0, 1) * this.WIDTH;
        this.maskLayer.x = this.WIDTH - w;
        this.maskLayer.graphics.clear();
        this.maskLayer.graphics.beginFill(0x0, 1);
        this.maskLayer.graphics.drawRect(0, 0, w, this.hpBitmap.height);
        this.maskLayer.graphics.endFill();
    };
    return StageProgress;
}(egret.DisplayObjectContainer));
egret.registerClass(StageProgress,'StageProgress');
//# sourceMappingURL=StageProgress.js.map