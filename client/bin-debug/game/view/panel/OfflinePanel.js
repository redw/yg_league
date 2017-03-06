/**
 * Created by Administrator on 1/18 0018.
 */
var OfflinePanel = (function (_super) {
    __extends(OfflinePanel, _super);
    function OfflinePanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = OfflinePanlSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=OfflinePanel,p=c.prototype;
    p.init = function () {
        this.btnSure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.initData = function () {
        this.lblGold.text = MathUtil.easyNumber(UserProxy.inst.offlineGold);
        var monthTime = 0;
        var lifeTime = 0;
        if (UserProxy.inst.vipObj["monthVIP"]) {
            monthTime = 2;
        }
        if (UserProxy.inst.vipObj["foreverVIP"]) {
            lifeTime = 2;
        }
        var time = 8 + monthTime + lifeTime;
        this.lblLeave.text = "您已离线" + StringUtil.timeToString(UserProxy.inst.offlineTime) + "（最高" + time + "小时）";
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("OfflinePanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnSure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    return OfflinePanel;
}(BasePanel));
egret.registerClass(OfflinePanel,'OfflinePanel');
