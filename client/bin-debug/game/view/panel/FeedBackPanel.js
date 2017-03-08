/**
 *
 * @author
 *
 */
var FeedBackPanel = (function (_super) {
    __extends(FeedBackPanel, _super);
    function FeedBackPanel() {
        _super.call(this);
        this.skinName = FeedBackPanelSkin;
        this._modal = false;
        this._layer = PanelManager.TOP_LAYER;
        this.verticalCenter = 0;
        this.horizontalCenter = 0;
    }
    var d = __define,c=FeedBackPanel,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFeed, this);
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
    };
    p.onClose = function (evt) {
        PanelManager.inst.hidePanel("FeedBackPanel");
    };
    p.onFeed = function (evt) {
        Http.inst.send(CmdID.ADVICE, { "text": this.editText.text });
        PanelManager.inst.hidePanel("FeedBackPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFeed, this);
    };
    return FeedBackPanel;
}(BasePanel));
egret.registerClass(FeedBackPanel,'FeedBackPanel');
