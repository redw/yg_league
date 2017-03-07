/**
 * Created by Administrator on 1/19 0019.
 */
var FriendAddUID = (function (_super) {
    __extends(FriendAddUID, _super);
    function FriendAddUID() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = FriendAddUIDSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=FriendAddUID,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnFind.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFind, this);
        Http.inst.addCmdListener(CmdID.FIND_FRIEND, this.friendInfo, this);
    };
    p.initData = function () {
    };
    p.friendInfo = function (e) {
        if (e.data) {
            PanelManager.inst.showPanel("FriendFindInfo", e.data);
            this.onClose();
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("FriendAddUID");
    };
    p.onFind = function () {
        Http.inst.send(CmdID.FIND_FRIEND, { fuid: this.editText.text });
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        Http.inst.removeCmdListener(CmdID.FIND_FRIEND, this.friendInfo, this);
    };
    return FriendAddUID;
}(BasePanel));
egret.registerClass(FriendAddUID,'FriendAddUID');
//# sourceMappingURL=FriendAddUID.js.map