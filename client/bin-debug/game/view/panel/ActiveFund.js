/**
 * Created by Administrator on 12/9 0009.
 */
var ActiveFund = (function (_super) {
    __extends(ActiveFund, _super);
    function ActiveFund() {
        _super.call(this);
        this.skinName = ActiveFundSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveFund,p=c.prototype;
    p.onShow = function (event) {
        EventManager.inst.addEventListener(ContextEvent.RECHARGE_BACK, this.buyBack, this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.awardList.itemRenderer = ActFundRenderer;
        this.btnBuy.visible = !UserProxy.inst.vipObj["fund"];
        this.refresh();
    };
    p.buyBack = function () {
        this.btnBuy.visible = !UserProxy.inst.vipObj["fund"];
        this.refresh();
    };
    p.onHide = function (event) {
        EventManager.inst.removeEventListener(ContextEvent.RECHARGE_BACK, this.buyBack, this);
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
    };
    p.refresh = function () {
        var ids = [];
        var doneIds = [];
        for (var i in Config.DailyFundData) {
            if (UserMethod.inst.isBitGet(parseInt(i), UserProxy.inst.vipObj["fundBit"])) {
                doneIds.push(parseInt(i));
            }
            else {
                ids.push(parseInt(i));
            }
        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids.concat(doneIds));
    };
    p.onBuy = function () {
        ExternalUtil.inst.pay(PidType.PID_FUND);
    };
    return ActiveFund;
}(eui.Component));
egret.registerClass(ActiveFund,'ActiveFund');
