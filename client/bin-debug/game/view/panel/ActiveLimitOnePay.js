/**
 * Created by Administrator on 2/14 0014.
 */
var ActiveLimitOnePay = (function (_super) {
    __extends(ActiveLimitOnePay, _super);
    function ActiveLimitOnePay() {
        _super.call(this);
        this.skinName = ActiveLimitOnePaySkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveLimitOnePay,p=c.prototype;
    p.onShow = function (event) {
        this.awardList.itemRenderer = ActLimitRechargeRenderer;
        this.showTime();
        this.refresh();
    };
    p.onHide = function (event) {
    };
    p.showTime = function () {
        var actCost = UserProxy.inst.activityObj[106];
        var id = actCost["id"];
        var start_time = Config.ActivityData[id]["show_start"];
        var end_time = Config.ActivityData[id]["time_end"];
        var exc_time = Config.ActivityData[id]["time_exchange"];
        var startDate = new Date(start_time * 1000);
        var endDate = new Date(end_time * 1000);
        var excData = new Date(exc_time * 1000);
        this.lblActTime.text = "活动时间：" + StringUtil.dateToString(startDate) + " 至 " + StringUtil.dateToString(endDate);
    };
    p.refresh = function () {
        var ids = [];
        var downIds = [];
        var actCost = UserProxy.inst.activityObj[106];
        for (var i in Config.ActSingleBuyData) {
            // var singleData:any = Config.ActSingleBuyData[i];
            if (UserMethod.inst.isBitGet(parseInt(i), actCost["dayRMBBit"])) {
                downIds.push(parseInt(i));
            }
            else {
                ids.push(parseInt(i));
            }
        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids.concat(downIds));
    };
    return ActiveLimitOnePay;
}(eui.Component));
egret.registerClass(ActiveLimitOnePay,'ActiveLimitOnePay');
