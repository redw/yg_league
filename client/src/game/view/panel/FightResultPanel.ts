/**
 * Created by hh on 2017/1/11.
 */
class FightResultPanel extends BasePanel{
    private bitmap:AutoBitmap;

    public constructor() {
        super();
        this._modal = true;
        this._layer = PanelManager.TOP_LAYER;
        this.verticalCenter = 0;
        this.horizontalCenter = 0;
    }

    public init(): void {
        this.bitmap = new AutoBitmap;
        this.bitmap.x = -531 * 0.5;
        this.bitmap.y = -239 * 0.5 - 150;
        this.addChild(this.bitmap);

        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    private onTouch(){
        PanelManager.inst.hidePanel("FightResultPanel");
        if (this.data.curPanelName) {
            PanelManager.inst.hidePanel(this.data.curPanelName);
        }
        if (this.data.prevPanelName) {
            PanelManager.inst.showPanel(this.data.prevPanelName);
        }
    }

    public initData(): void {
        let ret = this._data ? this._data.ret : 1;
        if (this._data.ret) {
            this.bitmap.source = `vector_png`;
        } else {
            this.bitmap.source =  `fail_png`;
        }
    }

    public destory(){
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }
}