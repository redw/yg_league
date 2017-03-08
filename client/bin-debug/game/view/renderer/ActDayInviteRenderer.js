/**
 * Created by Administrator on 12/23 0023.
 */
var ActDayInviteRenderer = (function (_super) {
    __extends(ActDayInviteRenderer, _super);
    function ActDayInviteRenderer() {
        _super.call(this);
        this.skinName = ActDayInviteRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActDayInviteRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        Http.inst.addCmdListener(CmdID.SHARE_PRICE, this.awardBack, this);
    };
    p.onHide = function (event) {
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        Http.inst.removeCmdListener(CmdID.SHARE_PRICE, this.awardBack, this);
    };
    p.onGet = function () {
        Http.inst.send(CmdID.SHARE_PRICE, { id: this.data });
    };
    p.awardBack = function (e) {
        this.dataChanged();
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var dailyInviteData = Config.DailyInviteData[this.data];
        this.lblName.text = dailyInviteData["invite_days"] + "天";
        this.lblEnd.text = "/ " + dailyInviteData["invite_days"];
        this.lblNowInvite.text = UserProxy.inst.shareObj["shareCount"];
        if (ExternalUtil.inst.getIsYYB()) {
            this.lblTitle.text = "累计在线";
        }
        else {
            this.lblTitle.text = "累计邀请";
        }
        for (var i = 1; i < 5; i++) {
            var awardGroup = DisplayUtil.getChildByName(this, "awardGroup" + i);
            if (dailyInviteData["reward_" + i]) {
                awardGroup.visible = true;
                var reward = dailyInviteData["reward_" + i];
                var awardIcon = DisplayUtil.getChildByName(awardGroup, "awardIcon");
                var awardNum = DisplayUtil.getChildByName(awardGroup, "awardNum");
                var rewardData = UserMethod.inst.rewardJs[reward[0]];
                awardNum.text = "x" + MathUtil.easyNumber(reward[2]);
                awardIcon.touchReward = reward;
                if (rewardData.id == 6 || rewardData.id == 7) {
                    if (rewardData.id == 6) {
                        awardIcon.imgIcon = Global.getChaIcon(reward[1]);
                    }
                    else {
                        awardIcon.imgIcon = Global.getChaChipIcon(reward[1]);
                    }
                }
                else if (rewardData.id >= 9 && rewardData.id <= 13) {
                    awardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
                    awardIcon.imgIcon = rewardData.icon;
                }
                else if (rewardData.id == 5) {
                    awardNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
                    awardIcon.imgIcon = rewardData.icon;
                }
                else {
                    awardIcon.imgIcon = rewardData.icon;
                }
            }
            else {
                awardGroup.visible = false;
            }
        }
        if (UserMethod.inst.isBitGet(this.data, UserProxy.inst.shareObj["shareBit"])) {
            this.imgGot.visible = true;
            this.btnGet.visible = false;
        }
        else {
            this.imgGot.visible = false;
            this.btnGet.visible = true;
            if (UserProxy.inst.shareObj["shareCount"] >= parseInt(dailyInviteData["invite_days"])) {
                this.btnGet.enabled = true;
            }
            else {
                this.btnGet.enabled = false;
            }
        }
    };
    return ActDayInviteRenderer;
}(eui.ItemRenderer));
egret.registerClass(ActDayInviteRenderer,'ActDayInviteRenderer');
