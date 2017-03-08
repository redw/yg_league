/**
 * Created by Administrator on 2/10 0010.
 */
var ActiveLimitCost = (function (_super) {
    __extends(ActiveLimitCost, _super);
    function ActiveLimitCost() {
        _super.call(this);
        this.skinName = ActiveLimitCostSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveLimitCost,p=c.prototype;
    p.onShow = function (event) {
        this.awardList.itemRenderer = ActLimitRechargeRenderer;
        this.showTime();
        this.refresh();
    };
    p.onHide = function (event) {
    };
    p.showTime = function () {
        var actCost = UserProxy.inst.activityObj[103];
        var id = actCost["id"];
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
        var actCost = UserProxy.inst.activityObj[103];
        for (var i in Config.ActAddCostData) {
            var costData = Config.ActAddCostData[i];
            if (UserMethod.inst.isBitGet(parseInt(i), actCost["consumeActBit"])) {
                downIds.push(parseInt(i));
            }
            else {
                if (actCost["consumeAct"] >= parseInt(costData["show"])) {
                    ids.push(parseInt(i));
                }
            }
        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids.concat(downIds));
    };
    return ActiveLimitCost;
}(eui.Component));
egret.registerClass(ActiveLimitCost,'ActiveLimitCost');
