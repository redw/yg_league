/**
 * Created by Administrator on 1/25 0025.
 */
var ActLimitDrawRenderer = (function (_super) {
    __extends(ActLimitDrawRenderer, _super);
    function ActLimitDrawRenderer() {
        _super.call(this);
        this.skinName = ActLimitRechargeRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActLimitDrawRenderer,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.ACTIVITY, this.dataChanged, this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.ACTIVITY, this.dataChanged, this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
    };
    p.onGet = function () {
        Http.inst.send(CmdID.ACTIVITY, { type: 3, id: this.data });
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var addBuyData = Config.ActAddBuyData[this.data];
        this.lblDesc.text = "累计充值" + addBuyData["condition"] + "元";
        this.lblDown.visible = false;
        for (var i = 1; i < 5; i++) {
            var awardGroup = DisplayUtil.getChildByName(this, "awardGroup" + i);
            if (addBuyData["reward_" + i]) {
                awardGroup.visible = true;
                var reward = addBuyData["reward_" + i];
                var awardIcon = DisplayUtil.getChildByName(awardGroup, "awardIcon");
                var awardNum = DisplayUtil.getChildByName(awardGroup, "awardNum");
                var rewardData = UserMethod.inst.rewardJs[reward[0]];
                awardIcon.imageIcon.source = rewardData.icon;
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
        var rmbInfo = UserProxy.inst.activityObj[102];
        if (UserMethod.inst.isBitGet(this.data, rmbInfo["rmbActBit"])) {
            this.imgGot.visible = true;
            this.btnGet.visible = false;
            this.lblDown.visible = true;
            this.lblDown.x = this.lblDesc.width + 19;
        }
        else {
            this.imgGot.visible = false;
            this.btnGet.visible = true;
            if (rmbInfo["rmbAct"] >= parseInt(addBuyData["condition"])) {
                this.btnGet.enabled = true;
            }
            else {
                this.btnGet.enabled = false;
            }
        }
    };
    return ActLimitDrawRenderer;
}(eui.ItemRenderer));
egret.registerClass(ActLimitDrawRenderer,'ActLimitDrawRenderer');
