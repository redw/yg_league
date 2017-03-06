/**
 * Created by Administrator on 12/13 0013.
 */
var FriendInviteRenderer = (function (_super) {
    __extends(FriendInviteRenderer, _super);
    function FriendInviteRenderer() {
        _super.call(this);
        this.skinName = FriendInviteRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=FriendInviteRenderer,p=c.prototype;
    p.onShow = function (event) {
        for (var i = 0; i < 3; i++) {
            var group = DisplayUtil.getChildByName(this.contentGroup, "group" + i);
            group.visible = false;
            group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetInvite, this);
        }
        Http.inst.addCmdListener(CmdID.INVITE_PRICE, this.getInviteBack, this);
    };
    p.onHide = function (event) {
        for (var i = 0; i < 3; i++) {
            var group = DisplayUtil.getChildByName(this.contentGroup, "group" + i);
            group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetInvite, this);
        }
        Http.inst.removeCmdListener(CmdID.INVITE_PRICE, this.getInviteBack, this);
    };
    p.getInviteBack = function (e) {
        this.dataChanged();
    };
    p.onGetInvite = function (e) {
        var id = e.currentTarget["id"];
        if (UserMethod.inst.isBitGet(id, UserProxy.inst.inviteObj["inviteBit"])) {
            return;
        }
        if (UserProxy.inst.inviteUserInfos) {
            var length = UserProxy.inst.inviteUserInfos.length;
            if (length >= id - 1) {
                Http.inst.send(CmdID.INVITE_PRICE, { id: id });
            }
            else {
                Notice.show("未满足条件！");
            }
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var dataLength = this.data.length;
        for (var i = 0; i < dataLength; i++) {
            var group = DisplayUtil.getChildByName(this.contentGroup, "group" + i);
            group.visible = true;
            group["id"] = this.data[i];
            var head = DisplayUtil.getChildByName(group, "head");
            var type = DisplayUtil.getChildByName(group, "type");
            var got = DisplayUtil.getChildByName(group, "got");
            var awardNum = DisplayUtil.getChildByName(group, "awardNum");
            var lblName = DisplayUtil.getChildByName(group, "lblName");
            var inviteData = Config.InviteData[this.data[i]];
            var reward = inviteData["reward_1"].concat();
            var rewardData = UserMethod.inst.rewardJs[reward[0]];
            awardNum.text = MathUtil.easyNumber(reward[2]);
            if (rewardData.id == 6 || rewardData.id == 7) {
                if (rewardData.id == 6) {
                    type.source = Global.getChaIcon(reward[1]);
                }
                else {
                    type.source = Global.getChaChipIcon(reward[1]);
                }
            }
            else if (rewardData.id >= 9 && rewardData.id <= 13) {
                awardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
                type.source = rewardData.icon;
            }
            else if (rewardData.id == 5) {
                awardNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
                type.source = rewardData.icon;
            }
            else {
                type.source = rewardData.icon;
            }
            head.source = "friend_none_invite_png";
            lblName.visible = false;
            if (UserProxy.inst.inviteUserInfos) {
                var length = UserProxy.inst.inviteUserInfos.length;
                if (this.data[i] - 1 <= length) {
                    var userInfo = UserProxy.inst.inviteUserInfos[this.data[i] - 1];
                    if (userInfo) {
                        lblName.visible = true;
                        lblName.text = StringUtil.decodeName(userInfo["nickname"]);
                        if (userInfo["headimgurl"]) {
                            head.source = UserMethod.inst.getHeadImg(userInfo["headimgurl"]);
                        }
                        else {
                            head.source = "friend_invite_head_png";
                        }
                    }
                }
            }
            if (UserMethod.inst.isBitGet(this.data[i], UserProxy.inst.inviteObj["inviteBit"])) {
                got.visible = true;
                group.touchEnabled = true;
            }
            else {
                got.visible = false;
                group.touchEnabled = false;
            }
        }
    };
    return FriendInviteRenderer;
}(eui.ItemRenderer));
egret.registerClass(FriendInviteRenderer,'FriendInviteRenderer');
