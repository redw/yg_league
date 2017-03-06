/**
 * Created by Administrator on 12/14 0014.
 */
var FriendSendTogetherRenderer = (function (_super) {
    __extends(FriendSendTogetherRenderer, _super);
    function FriendSendTogetherRenderer() {
        _super.call(this);
        this.skinName = FriendSendTogetherRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=FriendSendTogetherRenderer,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.GET_ONE, this.dataChanged, this);
        this.imgPower.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnergy, this);
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.GET_ONE, this.dataChanged, this);
        this.imgPower.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnergy, this);
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
    };
    p.onGift = function () {
        PanelManager.inst.showPanel("FriendGiftPanel", this._uid);
    };
    p.onEnergy = function (e) {
        // Http.inst.send(CmdID.GET_ONE,{fuid:this._uid});
        Http.inst.send(CmdID.ONE_KEY);
    };
    p.onDelete = function (e) {
        PanelManager.inst.showPanel("DeleteFriendPanel", this._uid);
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.imgPower.touchEnabled = false;
        var userInfos = UserProxy.inst.userInfos[this.data];
        var friendInfo = UserProxy.inst.friendList[this.data];
        this._uid = this.data;
        if (userInfos) {
            this.contentGroup.visible = true;
            this.lblName.text = StringUtil.decodeName(userInfos["nickname"]);
            this.lblLevel.text = "最高关数：" + userInfos["historyArea"];
            this.lblLuck.text = "缘分：" + friendInfo["friendPoint"];
            this.showLeaveTimes(userInfos["lastKeepLive"]);
            this.imgLove.visible = friendInfo["isnew"] == 1;
            if (userInfos["headimgurl"]) {
                this.imgHead.source = UserMethod.inst.getHeadImg(userInfos["headimgurl"]);
            }
        }
        else {
            this.contentGroup.visible = false;
        }
        /**getState  好友有没有送*/
        /**giveState 我有没有送*/
        /**isget     我有没有领取*/
        if (friendInfo["giveState"]) {
            if (friendInfo["getState"] && friendInfo["isget"]) {
                this.imgPower.source = "friend_power_over_png";
            }
            else if (friendInfo["getState"]) {
                this.imgPower.source = "friend_power_add_png";
            }
            else {
                this.imgPower.source = "friend_no_power_png";
            }
        }
        else {
            this.imgPower.source = "friend_power_send_png";
        }
    };
    p.showLeaveTimes = function (time) {
        var distanceTime = UserProxy.inst.server_time - time;
        var day = Math.floor(distanceTime / 3600 / 24);
        var hour = Math.floor(distanceTime / 3600);
        if (hour < 24) {
            if (hour < 1) {
                this.lblLeaveTime.text = "上次在线：刚刚";
            }
            else {
                this.lblLeaveTime.text = "上次在线：" + hour + "小时前";
            }
        }
        else {
            if (day < 7) {
                this.lblLeaveTime.text = "上次在线：" + day + "天前";
            }
            else {
                if (day >= 7 && day < 14) {
                    this.lblLeaveTime.text = "上次在线：1周前";
                }
                else if (day >= 14 && day < 21) {
                    this.lblLeaveTime.text = "上次在线：2周前";
                }
                else if (day >= 21 && day < 28) {
                    this.lblLeaveTime.text = "上次在线：3周前";
                }
                else {
                    this.lblLeaveTime.text = "上次在线：1月前";
                }
            }
        }
    };
    return FriendSendTogetherRenderer;
}(eui.ItemRenderer));
egret.registerClass(FriendSendTogetherRenderer,'FriendSendTogetherRenderer');
