/**
 * Created by Administrator on 12/23 0023.
 */
var ActFundRenderer = (function (_super) {
    __extends(ActFundRenderer, _super);
    function ActFundRenderer() {
        _super.call(this);
        this.skinName = ActFundRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActFundRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        Http.inst.addCmdListener(CmdID.ACTIVITY, this.onBack, this);
    };
    p.onHide = function (event) {
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        Http.inst.removeCmdListener(CmdID.ACTIVITY, this.onBack, this);
    };
    p.onBack = function (e) {
        this.dataChanged();
    };
    p.onGet = function () {
        Http.inst.send(CmdID.ACTIVITY, { type: 7, id: this.data });
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var fundData = Config.DailyFundData[this.data];
        this.lblArea.text = fundData["floor"] + "关";
        var reward = fundData["reward_1"];
        var rewardData = UserMethod.inst.rewardJs[reward[0]];
        this.lblAward.text = rewardData.name + "x" + reward[2];
        this.imgIcon.source = fundData["icon"] + "_png";
        if (UserProxy.inst.vipObj["fund"]) {
            if (UserMethod.inst.isBitGet(this.data, UserProxy.inst.vipObj["fundBit"])) {
                this.imgGot.visible = true;
                this.btnGet.visible = false;
            }
            else {
                this.imgGot.visible = false;
                this.btnGet.visible = true;
            }
            this.btnGet.enabled = UserProxy.inst.historyArea > parseInt(fundData["floor"]);
        }
        else {
            this.imgGot.visible = false;
            this.btnGet.enabled = false;
        }
    };
    return ActFundRenderer;
}(eui.ItemRenderer));
egret.registerClass(ActFundRenderer,'ActFundRenderer');
//# sourceMappingURL=ActFundRenderer.js.map