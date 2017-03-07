/**
 * Created by Administrator on 12/13 0013.
 */
var FriendShare = (function (_super) {
    __extends(FriendShare, _super);
    function FriendShare() {
        _super.call(this);
        this.skinName = FriendShareSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=FriendShare,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.GET_SHARE_PRIZE, this.showData, this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
        this.btnInvite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onInvite, this);
        this.showData();
        this.btnInvite.visible = false;
        if (ExternalUtil.inst.getIsYYB()) {
            this.lblShareTitle.text = "在线奖励";
            this.lblShare.text = "每日在线奖励";
            this.lblDayShare.text = "每日可领取在线奖励3次";
            this.btnShare.source = "friend_share_button_yyb_png";
            this.imgShare.source = "firend_wukong_yyb_png";
            this.btnInvite.visible = true;
        }
        if (ExternalUtil.inst.getIsHT()) {
            this.btnShare.visible = false;
        }
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.GET_SHARE_PRIZE, this.showData, this);
        this.btnShare.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
        this.btnInvite.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onInvite, this);
    };
    p.onInvite = function () {
        ShareUtils.share();
    };
    p.showData = function () {
        var awardArr = Config.BaseData[37]["value"].concat();
        this.lblShareTimes.text = (3 - UserProxy.inst.shareObj["dayShareCount"]) + "/3";
        this.lblReward.text = awardArr[UserProxy.inst.shareObj["dayShareCount"]];
        var leftTime = 5400 - (UserProxy.inst.server_time - UserProxy.inst.shareObj["lastShareTime"]);
        if (leftTime <= 0) {
            this.lblFrozeTime.text = "快去分享赚元宝吧！";
            this.lblShowClear.text = "冷却结束：";
        }
        else {
            this.lblShowClear.text = "冷却中：";
            this._cdTime = leftTime;
            this.refreshTime();
        }
        TopPanel.inst.showPoint(3);
    };
    p.refreshTime = function () {
        if (this._cdTime > 0) {
            this.tickerTime();
            TickerUtil.register(this.tickerTime, this, 1000);
        }
        else {
            this.lblFrozeTime.text = "快去分享赚元宝吧！";
        }
    };
    p.tickerTime = function () {
        this.lblFrozeTime.text = "(" + StringUtil.timeToString(this._cdTime, true) + ")";
        this._cdTime--;
        if (!this._cdTime) {
            TickerUtil.unregister(this.tickerTime, this);
        }
    };
    p.onShare = function () {
        if (ExternalUtil.inst.getIsYYB()) {
            ExternalUtil.inst.shareCheck();
        }
        else {
            ExternalUtil.inst.showInvite();
        }
    };
    return FriendShare;
}(eui.Component));
egret.registerClass(FriendShare,'FriendShare');
//# sourceMappingURL=FriendShare.js.map