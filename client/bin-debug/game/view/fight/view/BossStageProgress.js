/**
 * boss关卡进度条
 * Created by hh on 2016/12/27.
 */
var BossStageProgress = (function (_super) {
    __extends(BossStageProgress, _super);
    function BossStageProgress() {
        _super.call(this);
        this.WIDTH = 184;
        // this.background1 = new AutoBitmap("boss_stage_blood_background_1_png");
        // this.addChild(this.background1);
        // this.background2 = new AutoBitmap("boss_stage_blood_background_2_png");
        // this.addChild(this.background2);
        this.hpBitmap = new AutoBitmap("boss_blood_stage_png");
        this.addChild(this.hpBitmap);
        this.maskLayer = new egret.Shape();
        this.addChild(this.maskLayer);
        this.background1 = new AutoBitmap("boss_stage_blood_background_1_png");
        this.addChild(this.background1);
        // this.maskLayer = new egret.Shape();
        // this.addChild(this.maskLayer);
        this.levelImg = new egret.BitmapText();
        this.levelImg.y = 9;
        this.addChild(this.levelImg);
        this.levelImg.font = RES.getRes("stage_fnt");
        this.levelImg.letterSpacing = -3;
        this.levelImg.width = this.WIDTH;
        this.levelImg.$setTextAlign(egret.HorizontalAlign.CENTER);
    }
    var d = __define,c=BossStageProgress,p=c.prototype;
    p.startLevel = function (value) {
        this.levelImg.text = "关卡" + value;
        this.setProgress(1);
    };
    p.setProgress = function (value) {
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
    return BossStageProgress;
}(egret.DisplayObjectContainer));
egret.registerClass(BossStageProgress,'BossStageProgress');
