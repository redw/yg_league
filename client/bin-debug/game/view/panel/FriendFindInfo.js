/**
 * Created by Administrator on 1/19 0019.
 */
var FriendFindInfo = (function (_super) {
    __extends(FriendFindInfo, _super);
    function FriendFindInfo() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = FriendFindInfoSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=FriendFindInfo,p=c.prototype;
    p.init = function () {
        this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        Http.inst.addCmdListener(CmdID.ADD_FRIEND, this.addBack, this);
    };
    p.initData = function () {
        var data = this.data;
        this.lblName.text = StringUtil.decodeName(data["nickname"]);
        this.lblUID.text = "UID：" + data["fuid"];
        this.imgHead.source = UserMethod.inst.getHeadImg(data["headimgurl"]);
    };
    p.addBack = function (e) {
        if (e.data["msg"]) {
            Notice.show("申请成功！");
            this.onClose();
        }
    };
    p.onAdd = function () {
        Http.inst.send(CmdID.ADD_FRIEND, { fuid: this.data["fuid"] });
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("FriendFindInfo");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        Http.inst.removeCmdListener(CmdID.ADD_FRIEND, this.addBack, this);
    };
    return FriendFindInfo;
}(BasePanel));
egret.registerClass(FriendFindInfo,'FriendFindInfo');
