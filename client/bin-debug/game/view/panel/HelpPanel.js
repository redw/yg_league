/**
 * Created by Administrator on 1/19 0019.
 */
var HelpPanel = (function (_super) {
    __extends(HelpPanel, _super);
    function HelpPanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = HelpPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=HelpPanel,p=c.prototype;
    p.init = function () {
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.initData = function () {
        this.contentGroup.alpha = 0;
        egret.Tween.get(this.contentGroup).to({ alpha: 1 }, 500);
        switch (this.data) {
            case 1:
                this.imgType.source = "help_money_png";
                break;
            case 2:
                this.imgType.source = "help_friend_png";
                break;
            case 3:
                this.imgType.source = "help_secret_png";
                break;
            case 4:
                this.imgType.source = "help_weapon_png";
                break;
        }
        egret.Tween.get(this.lblOut, { loop: true }).to({ alpha: 0 }, 1000).to({ alpha: 1 }, 1000);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("HelpPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        egret.Tween.removeTweens(this.lblOut);
    };
    return HelpPanel;
}(BasePanel));
egret.registerClass(HelpPanel,'HelpPanel');
//# sourceMappingURL=HelpPanel.js.map