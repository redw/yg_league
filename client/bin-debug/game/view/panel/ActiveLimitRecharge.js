/**
 * Created by Administrator on 1/25 0025.
 */
var ActiveLimitRecharge = (function (_super) {
    __extends(ActiveLimitRecharge, _super);
    function ActiveLimitRecharge() {
        _super.call(this);
        this.skinName = ActiveLimitRechargeSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveLimitRecharge,p=c.prototype;
    p.onShow = function (event) {
        this.awardList.itemRenderer = ActLimitRechargeRenderer;
        this.showTime();
        this.refresh();
    };
    p.onHide = function (event) {
    };
    p.showTime = function () {
        var actWord = UserProxy.inst.activityObj[102];
        var id = actWord["id"];
        var start_time = Config.ActivityData[id]["show_start"];
        var end_time = Config.ActivityData[id]["time_end"];
        var exc_time = Config.ActivityData[id]["time_exchange"];
        var startDate = new Date(start_time * 1000);
        var endDate = new Date(end_time * 1000);
        var excData = new Date(exc_time * 1000);
        this.lblActTime.text = "活动时间：" + StringUtil.dateToString(startDate) + " 至 " + StringUtil.dateToString(endDate);
        this.lblEndTime.text = "兑换截止时间：" + StringUtil.dateToString(excData);
    };
    p.refresh = function () {
        var ids = [];
        var downIds = [];
        var actWord = UserProxy.inst.activityObj[102];
        for (var i in Config.ActAddBuyData) {
            var buyData = Config.ActAddBuyData[i];
            if (UserMethod.inst.isBitGet(parseInt(i), actWord["rmbActBit"])) {
                downIds.push(parseInt(i));
            }
            else {
                if (actWord["rmbAct"] >= parseInt(buyData["show"])) {
                    ids.push(parseInt(i));
                }
            }
        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids.concat(downIds));
    };
    return ActiveLimitRecharge;
}(eui.Component));
egret.registerClass(ActiveLimitRecharge,'ActiveLimitRecharge');
