/**
 * Created by Administrator on 2017/1/19.
 */
class PVEFailEff extends egret.DisplayObjectContainer {
    private bitmap:AutoBitmap;
    private timer:number;

    public constructor(value:number) {
        super();

        this.bitmap = new AutoBitmap();
        if (value == 0)
            this.bitmap.source = "pve_fail_tip_png";
        else
            this.bitmap.source = "over_round_png";
        this.addChild(this.bitmap);

        this.bitmap.x = 136;
        this.bitmap.y = 180;
        this.timer = egret.setTimeout(this.dispose, this, 2000);
    }

    private dispose(){
        egret.clearTimeout(this.timer);
        this.dispatchEventWith(egret.Event.COMPLETE, true);
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}