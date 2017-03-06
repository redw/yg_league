/**
 * Created by Administrator on 1/12 0012.
 */
var NetShareCmd = (function (_super) {
    __extends(NetShareCmd, _super);
    function NetShareCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetShareCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.shareObj = this.data["shareObj"];
        UserMethod.inst.showAward(this.data);
    };
    return NetShareCmd;
}(BaseCmd));
egret.registerClass(NetShareCmd,'NetShareCmd');
var NetInviteCmd = (function (_super) {
    __extends(NetInviteCmd, _super);
    function NetInviteCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetInviteCmd,p=c.prototype;
    p.execute = function () {
        UserProxy.inst.inviteUserInfos = this.data["userInfos"];
        TopPanel.inst.showPoint(2);
        TopPanel.inst.checkHide();
    };
    return NetInviteCmd;
}(BaseCmd));
egret.registerClass(NetInviteCmd,'NetInviteCmd');
var NetInvitePriceCmd = (function (_super) {
    __extends(NetInvitePriceCmd, _super);
    function NetInvitePriceCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetInvitePriceCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserProxy.inst.inviteObj = this.data["inviteObj"];
        UserMethod.inst.showAward(this.data);
        TopPanel.inst.showPoint(2);
        TopPanel.inst.checkHide();
    };
    return NetInvitePriceCmd;
}(BaseCmd));
egret.registerClass(NetInvitePriceCmd,'NetInvitePriceCmd');
var NetSharePriceCmd = (function (_super) {
    __extends(NetSharePriceCmd, _super);
    function NetSharePriceCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetSharePriceCmd,p=c.prototype;
    p.execute = function () {
        UserMethod.inst.showAward(this.data);
        UserProxy.inst.shareObj = this.data["shareObj"];
        TopPanel.inst.showPoint(11, 2);
        ActivePanel.inst.checkPoint(2);
    };
    return NetSharePriceCmd;
}(BaseCmd));
egret.registerClass(NetSharePriceCmd,'NetSharePriceCmd');
var NetShareHeroPriceCmd = (function (_super) {
    __extends(NetShareHeroPriceCmd, _super);
    function NetShareHeroPriceCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetShareHeroPriceCmd,p=c.prototype;
    p.execute = function () {
        var bonusList = new BonusList();
        if (this.data["diamond"]) {
            var addDiamond = this.data["diamond"] - UserProxy.inst.diamond;
            UserProxy.inst.diamond = this.data["diamond"];
            if (addDiamond > 0) {
                bonusList.push(BonusType.GOLD, addDiamond);
            }
        }
        bonusList.show();
        var roleData = UserProxy.inst.heroData.getHeroData(this.data["id"]);
        roleData.evolution = 1;
    };
    return NetShareHeroPriceCmd;
}(BaseCmd));
egret.registerClass(NetShareHeroPriceCmd,'NetShareHeroPriceCmd');
var NetRechargeCmd = (function (_super) {
    __extends(NetRechargeCmd, _super);
    function NetRechargeCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetRechargeCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        if (this.data["rechargeFlag"]) {
            UserProxy.inst.rechargeFlag = this.data["rechargeFlag"];
        }
        if (this.data["vipObj"]) {
            UserProxy.inst.vipObj = this.data["vipObj"];
        }
        if (this.data["rmbDays"]) {
            UserProxy.inst.rmbDays = this.data["rmbDays"];
        }
        if (this.data["rmbAct"]) {
            var actWord = UserProxy.inst.activityObj[102];
            actWord["rmbAct"] = this.data["rmbAct"];
            TopPanel.inst.showPoint(8, 1);
        }
        if (this.data["todayRMB"]) {
            var actWord = UserProxy.inst.activityObj[106];
            actWord["todayRMB"] = this.data["todayRMB"];
            TopPanel.inst.showPoint(8, 4);
        }
        UserMethod.inst.showAward(this.data);
        EventManager.inst.dispatch(ContextEvent.RECHARGE_BACK);
    };
    return NetRechargeCmd;
}(BaseCmd));
egret.registerClass(NetRechargeCmd,'NetRechargeCmd');
