/**
 * Created by hh on 2017/1/11.
 */
var FightResultPanel = (function (_super) {
    __extends(FightResultPanel, _super);
    function FightResultPanel() {
        _super.call(this);
        this._modal = true;
        this._layer = PanelManager.TOP_LAYER;
        this.verticalCenter = 0;
        this.horizontalCenter = 0;
    }
    var d = __define,c=FightResultPanel,p=c.prototype;
    p.init = function () {
        this.bitmap = new AutoBitmap;
        this.bitmap.x = -531 * 0.5;
        this.bitmap.y = -239 * 0.5 - 150;
        this.addChild(this.bitmap);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    };
    p.onTouch = function () {
        PanelManager.inst.hidePanel("FightResultPanel");
        if (this.data.curPanelName) {
            PanelManager.inst.hidePanel(this.data.curPanelName);
        }
        if (this.data.prevPanelName) {
            PanelManager.inst.showPanel(this.data.prevPanelName);
        }
    };
    p.initData = function () {
        var ret = this._data ? this._data.ret : 1;
        if (this._data.ret) {
            this.bitmap.source = "vector_png";
        }
        else {
            this.bitmap.source = "fail_png";
        }
    };
    p.destory = function () {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    };
    return FightResultPanel;
}(BasePanel));
egret.registerClass(FightResultPanel,'FightResultPanel');
