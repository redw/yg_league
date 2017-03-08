/**
 * Created by Administrator on 1/25 0025.
 */
var ActLimitRechargeRenderer = (function (_super) {
    __extends(ActLimitRechargeRenderer, _super);
    function ActLimitRechargeRenderer() {
        _super.call(this);
        this.skinName = ActLimitRechargeRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActLimitRechargeRenderer,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.ACTIVITY, this.dataChanged, this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRecharge, this);
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.ACTIVITY, this.dataChanged, this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRecharge, this);
    };
    p.onRecharge = function () {
        var actData = Config.ActSingleBuyData[this.data];
        switch (parseInt(actData["condition"])) {
            case 6:
                UserMethod.inst.shopMoveTo = 5;
                break;
            case 30:
                UserMethod.inst.shopMoveTo = 6;
                break;
            case 198:
                UserMethod.inst.shopMoveTo = 9;
                break;
            case 648:
                UserMethod.inst.shopMoveTo = 10;
                break;
            default:
                UserMethod.inst.shopMoveTo = 0;
                break;
        }
        MenuPanel.inst.openMenu(6);
        PanelManager.inst.hidePanel("ActiveLimitPanel");
    };
    p.onGet = function () {
        if (UserMethod.inst.recharge_cost == 1) {
            Http.inst.send(CmdID.ACTIVITY, { type: 3, id: this.data });
        }
        else if (UserMethod.inst.recharge_cost == 2) {
            Http.inst.send(CmdID.ACTIVITY, { type: 4, id: this.data });
        }
        else if (UserMethod.inst.recharge_cost == 3) {
            Http.inst.send(CmdID.ACTIVITY, { type: 14, id: this.data });
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var actData;
        var actInfo;
        var actBit;
        var actNumber;
        this.btnGo.visible = false;
        if (UserMethod.inst.recharge_cost == 1) {
            actData = Config.ActAddBuyData[this.data];
            actInfo = UserProxy.inst.activityObj[102];
            this.lblDesc.text = "累计充值RMB"; /*+ actData["condition"] + "元"*/
            actBit = actInfo["rmbActBit"];
            actNumber = actInfo["rmbAct"];
        }
        else if (UserMethod.inst.recharge_cost == 2) {
            actData = Config.ActAddCostData[this.data];
            actInfo = UserProxy.inst.activityObj[103];
            this.lblDesc.text = "累计消费元宝"; /*+ actData["condition"] + "元宝"*/
            actBit = actInfo["consumeActBit"];
            actNumber = actInfo["consumeAct"];
        }
        else if (UserMethod.inst.recharge_cost == 3) {
            this.btnGo.visible = true;
            actData = Config.ActSingleBuyData[this.data];
            actInfo = UserProxy.inst.activityObj[106];
            this.lblDesc.text = "今日单笔充值" + actData["condition"] + "元"; /*+ actData["condition"] + "元宝"*/
            actBit = actInfo["dayRMBBit"];
            actNumber = actInfo["todayRMB"];
        }
        for (var i = 1; i < 5; i++) {
            var awardGroup = DisplayUtil.getChildByName(this, "awardGroup" + i);
            if (actData["reward_" + i]) {
                awardGroup.visible = true;
                var reward = actData["reward_" + i];
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
        if (UserMethod.inst.isBitGet(this.data, actBit)) {
            this.imgGot.visible = true;
            this.btnGet.visible = false;
            this.btnGo.visible = false;
            this.lblDown.text = "（已达成）";
            this.lblDown.x = this.lblDesc.width + 19;
        }
        else {
            this.imgGot.visible = false;
            this.btnGet.visible = true;
            if (UserMethod.inst.recharge_cost == 3) {
                this.lblDown.text = "（" + actNumber[this.data - 1] + "/" + 1 + "）";
                this.lblDown.x = this.lblDesc.width + 19;
                if (actNumber[this.data - 1] >= 1) {
                    this.btnGet.visible = true;
                    this.btnGo.visible = false;
                }
                else {
                    this.btnGet.visible = false;
                    this.btnGo.visible = true;
                }
            }
            else {
                this.lblDown.text = "（" + actNumber + "/" + actData["condition"] + "）";
                this.lblDown.x = this.lblDesc.width + 19;
                if (actNumber >= parseInt(actData["condition"])) {
                    this.btnGet.enabled = true;
                }
                else {
                    this.btnGet.enabled = false;
                }
            }
        }
    };
    return ActLimitRechargeRenderer;
}(eui.ItemRenderer));
egret.registerClass(ActLimitRechargeRenderer,'ActLimitRechargeRenderer');
