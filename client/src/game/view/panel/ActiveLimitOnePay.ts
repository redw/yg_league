/**
 * Created by Administrator on 2/14 0014.
 */
class ActiveLimitOnePay extends eui.Component
{
    public awardList:eui.List;
    public lblActTime:eui.Label;

    public constructor()
    {
        super();
        this.skinName = ActiveLimitOnePaySkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.awardList.itemRenderer = ActLimitRechargeRenderer;
        this.showTime();
        this.refresh();
    }

    private onHide(event:egret.Event):void
    {

    }

    private showTime():void
    {
        var actCost:any = UserProxy.inst.activityObj[106];
        var id:number = actCost["id"];
        var start_time: number = Config.ActivityData[id]["show_start"];
        var end_time: number = Config.ActivityData[id]["time_end"];
        var exc_time:number = Config.ActivityData[id]["time_exchange"];
        var startDate:Date = new Date(start_time*1000);
        var endDate:Date = new Date(end_time*1000);
        var excData:Date = new Date(exc_time*1000);
        this.lblActTime.text = "活动时间：" + StringUtil.dateToString(startDate) + " 至 " +StringUtil.dateToString(endDate);
    }

    private refresh():void
    {
        var ids:number[] = [];
        var downIds:number[] = [];
        var actCost:any = UserProxy.inst.activityObj[106];
        for (var i in Config.ActSingleBuyData)
        {
            // var singleData:any = Config.ActSingleBuyData[i];
            if(UserMethod.inst.isBitGet(parseInt(i),actCost["dayRMBBit"]))
            {
                downIds.push(parseInt(i));
            }
            else
            {
                ids.push(parseInt(i));

            }
        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids.concat(downIds));
    }
}