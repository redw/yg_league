/**
 * Created by Administrator on 1/25 0025.
 */
var ActiveLimitWord = (function (_super) {
    __extends(ActiveLimitWord, _super);
    function ActiveLimitWord() {
        _super.call(this);
        this.skinName = ActiveLimitWordSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveLimitWord,p=c.prototype;
    p.onShow = function (event) {
        this.awardList.itemRenderer = ActLimitWordRenderer;
        this.showTime();
        this.refresh();
    };
    p.onHide = function (event) {
    };
    p.showTime = function () {
        var actWord = UserProxy.inst.activityObj[101];
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
        for (var i in Config.ActWordData) {
            ids.push(parseInt(i));
        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids);
    };
    return ActiveLimitWord;
}(eui.Component));
egret.registerClass(ActiveLimitWord,'ActiveLimitWord');
