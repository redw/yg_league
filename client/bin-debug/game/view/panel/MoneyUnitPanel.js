/**
 * Created by Administrator on 2/4 0004.
 */
var MoneyUnitPanel = (function (_super) {
    __extends(MoneyUnitPanel, _super);
    function MoneyUnitPanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = MoneyUnitPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=MoneyUnitPanel,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.unitList.itemRenderer = MoneyUnitRenderer;
    };
    p.initData = function () {
        var ids = [];
        for (var i = 0; i < 100; i++) {
            ids.push(i);
        }
        this.unitList.dataProvider = new eui.ArrayCollection(ids);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("MoneyUnitPanel");
    };
    p.destory = function () {
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    return MoneyUnitPanel;
}(BasePanel));
egret.registerClass(MoneyUnitPanel,'MoneyUnitPanel');
