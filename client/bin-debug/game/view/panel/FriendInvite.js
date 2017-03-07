/**
 * Created by Administrator on 12/13 0013.
 */
var FriendInvite = (function (_super) {
    __extends(FriendInvite, _super);
    function FriendInvite() {
        _super.call(this);
        this.skinName = FriendInviteSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=FriendInvite,p=c.prototype;
    p.onShow = function (event) {
        // if(UserProxy.inst.server_time > UserMethod.inst.inviteTime + 30)
        // {
        //     UserMethod.inst.inviteTime = UserProxy.inst.server_time;
        Http.inst.send(CmdID.GET_INVITE_INFO, { hortor: ExternalUtil.inst.getIsHT() ? 1 : 0 });
        // }
        // else
        // {
        //     this.showList();
        // }
        Http.inst.addCmdListener(CmdID.GET_INVITE_INFO, this.showList, this);
        this.btnInvite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onInvite, this);
        this.inviteList.itemRenderer = FriendInviteRenderer;
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.GET_INVITE_INFO, this.showList, this);
        this.btnInvite.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onInvite, this);
    };
    p.showList = function () {
        var ids = [];
        var groupIds = [];
        for (var i in Config.InviteData) {
            if (ids.length == 3) {
                groupIds.push(ids);
                ids = [];
                ids.push(parseInt(i));
            }
            else {
                ids.push(parseInt(i));
            }
        }
        if (ids.length) {
            groupIds.push(ids);
        }
        this.inviteList.dataProvider = new eui.ArrayCollection(groupIds);
    };
    p.onInvite = function () {
        // Notice.show("敬请期待！");
        ShareUtils.share();
        // ShareUtil.share("poster_bg_png", new egret.Point(34, 12), new egret.Point(309, 628));
    };
    return FriendInvite;
}(eui.Component));
egret.registerClass(FriendInvite,'FriendInvite');
//# sourceMappingURL=FriendInvite.js.map