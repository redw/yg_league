/**
 * Created by Administrator on 12/14 0014.
 */
var AlertApplyPanel = (function (_super) {
    __extends(AlertApplyPanel, _super);
    function AlertApplyPanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = AlertApplyPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
        this.effectType = 2;
    }
    var d = __define,c=AlertApplyPanel,p=c.prototype;
    p.init = function () {
    };
    p.initData = function () {
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
    };
    return AlertApplyPanel;
}(BasePanel));
egret.registerClass(AlertApplyPanel,'AlertApplyPanel');
