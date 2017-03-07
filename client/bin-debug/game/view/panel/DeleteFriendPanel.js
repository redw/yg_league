/**
 * Created by Administrator on 1/17 0017.
 */
var DeleteFriendPanel = (function (_super) {
    __extends(DeleteFriendPanel, _super);
    function DeleteFriendPanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = DeleteFriendPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=DeleteFriendPanel,p=c.prototype;
    p.init = function () {
        this.btnDelete.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.initData = function () {
        var userInfos = UserProxy.inst.userInfos[this.data];
        var friendInfo = UserProxy.inst.friendList[this.data];
        this._uid = this.data;
        this.lblName.text = StringUtil.decodeName(userInfos["nickname"]);
        this.lblLevel.text = "最高关数：" + userInfos["historyArea"];
        this.lblLuck.text = "缘分：" + friendInfo["friendPoint"];
        if (userInfos["headimgurl"]) {
            this.imgHead.source = UserMethod.inst.getHeadImg(userInfos["headimgurl"]);
        }
    };
    p.onDelete = function () {
        Http.inst.send(CmdID.DELETE_FRIEND, { fuid: this.data });
        this.onClose();
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("DeleteFriendPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnDelete.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    return DeleteFriendPanel;
}(BasePanel));
egret.registerClass(DeleteFriendPanel,'DeleteFriendPanel');
//# sourceMappingURL=DeleteFriendPanel.js.map