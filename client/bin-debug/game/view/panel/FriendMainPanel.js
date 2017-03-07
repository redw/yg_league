/**
 * Created by Administrator on 12/13 0013.
 */
var FriendMainPanel = (function (_super) {
    __extends(FriendMainPanel, _super);
    function FriendMainPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = FriendMainPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=FriendMainPanel,p=c.prototype;
    p.init = function () {
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnInvite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnSend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnApply.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        EventManager.inst.addEventListener(ContextEvent.FRIEND_POINT, this.checkPoint, this);
    };
    p.initData = function () {
        Http.inst.addCmdListener(CmdID.INVITE_PRICE, this.checkMainPoint, this);
        switch (this.data) {
            case 1:
                this.btnShare.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
                break;
            case 2:
                this.btnInvite.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
                break;
            case 3:
                this.btnSend.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
                break;
            case 4:
                this.btnApply.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
                break;
        }
        if (ExternalUtil.inst.getIsYYB()) {
            this.btnInvite.visible = false;
            this.btnShare.x = 97;
            this.btnSend.x = 197;
            this.btnApply.x = 297;
        }
        else {
            this.checkMainPoint();
        }
    };
    p.checkMainPoint = function () {
        UserMethod.inst.removeRedPoint(this.btnShare.parent, "share");
        if (UserMethod.inst._shareShowPoint) {
            UserMethod.inst.addRedPoint(this.btnShare.parent, "share", new egret.Point(this.btnShare.x + 70, this.btnShare.y + 18));
        }
        UserMethod.inst.removeRedPoint(this.btnInvite.parent, "invite");
        if (!ExternalUtil.inst.getIsYYB()) {
            if (UserMethod.inst._invitePoint) {
                UserMethod.inst.addRedPoint(this.btnInvite.parent, "invite", new egret.Point(this.btnInvite.x + 70, this.btnInvite.y + 18));
            }
        }
    };
    p.onTouch = function (e) {
        var touchBtn = e.currentTarget;
        if (this._lastBtn) {
            if (this._lastBtn == touchBtn) {
                return;
            }
            this.removeOldPanel();
        }
        this._lastBtn = touchBtn;
        var layer;
        switch (touchBtn) {
            case this.btnShare:
                this.imgSelect.x = 47;
                if (ExternalUtil.inst.getIsYYB()) {
                    this.imgSelect.x = 97;
                }
                layer = new FriendShare();
                break;
            case this.btnInvite:
                this.imgSelect.x = 147;
                layer = new FriendInvite();
                break;
            case this.btnSend:
                this.imgSelect.x = 247;
                if (ExternalUtil.inst.getIsYYB()) {
                    this.imgSelect.x = 197;
                }
                layer = new FriendSendTogether();
                EventManager.inst.dispatch(ContextEvent.FRIEND_POINT, "closeFriendPoint");
                break;
            case this.btnApply:
                this.imgSelect.x = 347;
                if (ExternalUtil.inst.getIsYYB()) {
                    this.imgSelect.x = 297;
                }
                layer = new FriendApply();
                break;
        }
        layer.name = "layer";
        this.contentGroup.addChild(layer);
    };
    p.removeOldPanel = function () {
        var layer = DisplayUtil.getChildByName(this.contentGroup, "layer");
        if (layer) {
            DisplayUtil.removeFromParent(layer);
        }
    };
    p.checkPoint = function (e) {
        switch (e.data) {
            case "showFriendPoint":
                UserMethod.inst.addRedPoint(this, "friend", new egret.Point(261, 125));
                break;
            case "closeFriendPoint":
                UserMethod.inst.removeRedPoint(this, "friend");
                break;
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("FriendMainPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        Http.inst.removeCmdListener(CmdID.INVITE_PRICE, this.checkMainPoint, this);
        EventManager.inst.removeEventListener(ContextEvent.FRIEND_POINT, this.checkPoint, this);
        this.btnShare.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnInvite.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnSend.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnApply.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        TopPanel.inst.showPoint(12);
    };
    return FriendMainPanel;
}(BasePanel));
egret.registerClass(FriendMainPanel,'FriendMainPanel');
//# sourceMappingURL=FriendMainPanel.js.map