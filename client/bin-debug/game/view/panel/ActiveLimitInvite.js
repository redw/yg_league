/**
 * Created by Administrator on 1/25 0025.
 */
var ActiveLimitInvite = (function (_super) {
    __extends(ActiveLimitInvite, _super);
    function ActiveLimitInvite() {
        _super.call(this);
        this.skinName = ActiveInviteDoubleSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveLimitInvite,p=c.prototype;
    p.onShow = function (event) {
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
        this.showTime();
    };
    p.onHide = function (event) {
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
    };
    p.showTime = function () {
        if (ExternalUtil.inst.getIsYYB()) {
            this.imgInviteTitle.source = "limit_invite_double_title_yyb_png";
            this.lblInvite.text = "每日3次的在线奖励";
            this.btnGo.label = "前往领取";
        }
        var actWord = UserProxy.inst.activityObj[105];
        var id = actWord["id"];
        var start_time = Config.ActivityData[id]["show_start"];
        var end_time = Config.ActivityData[id]["time_end"];
        var startDate = new Date(start_time * 1000);
        var endDate = new Date(end_time * 1000);
        this.lblActTime.text = "活动时间：" + StringUtil.dateToString(startDate) + " 至 " + StringUtil.dateToString(endDate);
    };
    p.onGo = function () {
        PanelManager.inst.showPanel("FriendMainPanel", 1);
    };
    return ActiveLimitInvite;
}(eui.Component));
egret.registerClass(ActiveLimitInvite,'ActiveLimitInvite');
