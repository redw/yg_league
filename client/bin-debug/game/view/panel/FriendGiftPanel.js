/**
 * Created by Administrator on 12/14 0014.
 */
var FriendGiftPanel = (function (_super) {
    __extends(FriendGiftPanel, _super);
    function FriendGiftPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        //        this.skinName = FriendGiftPanelSkin;
        this._modal = true;
        // this.horizontalCenter = 0;
        // this.verticalCenter = 0;
        this.effectType = 2;
    }
    var d = __define,c=FriendGiftPanel,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnSpecial.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnBuy1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnBuy2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
    };
    p.initData = function () {
        this._sendUid = this.data;
    };
    p.onBuy = function (e) {
        if (e.currentTarget == this.btnBuy1) {
        }
        else if (e.currentTarget == this.btnBuy2) {
        }
        else {
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("FriendGiftPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnSpecial.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnBuy1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnBuy2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
    };
    return FriendGiftPanel;
}(BasePanel));
egret.registerClass(FriendGiftPanel,'FriendGiftPanel');
//# sourceMappingURL=FriendGiftPanel.js.map