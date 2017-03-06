/**
 * Created by Administrator on 12/14 0014.
 */
var FriendApply = (function (_super) {
    __extends(FriendApply, _super);
    function FriendApply() {
        _super.call(this);
        this.skinName = FriendApplySkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=FriendApply,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.ANSWER_FRIEND, this.answerFriendBack, this);
        this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
        this.btnMy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMy, this);
        this.btnCity.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCity, this);
        this.applyList.itemRenderer = FriendApplyRenderer;
        this.showList();
        if (ExternalUtil.inst.getIsHT()) {
            this.btnCity.visible = false;
            this.btnAdd.x = 231;
            this.btnMy.x = 60;
        }
        if (ExternalUtil.inst.getIsYYB()) {
            this.lblNoApply.text = "木有人加你哟，快去添加几个好友吧！";
            this.btnCity.visible = false;
            this.btnAdd.x = 231;
            this.btnMy.x = 60;
        }
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.ANSWER_FRIEND, this.answerFriendBack, this);
        this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
        this.btnMy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMy, this);
        this.btnCity.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCity, this);
    };
    p.answerFriendBack = function (e) {
        UserProxy.inst.newMsg = e.data["newMsg"];
        if (e.data["type"] == 1) {
            //好友
            EventManager.inst.dispatch(ContextEvent.FRIEND_POINT, "showFriendPoint");
        }
        this.showList();
    };
    p.onAdd = function () {
        PanelManager.inst.showPanel("FriendAddUID");
    };
    p.onMy = function () {
        ExternalUtil.inst.copyUID();
    };
    p.onCity = function () {
        if (ExternalUtil.inst.getIsYYB()) {
            prompt("复制QQ群：", Config.NoticeData[1]["qq_id"]);
        }
        else {
            ExternalUtil.inst.joinChatRoom();
        }
    };
    p.showList = function () {
        var ids = [];
        for (var i in UserProxy.inst.newMsg) {
            ids.push(parseInt(i));
        }
        this.lblNoApply.visible = ids.length == 0;
        this.applyList.dataProvider = new eui.ArrayCollection(ids);
    };
    return FriendApply;
}(eui.Component));
egret.registerClass(FriendApply,'FriendApply');
