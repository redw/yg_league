/**
 * Created by Administrator on 2/10 0010.
 */
class ActiveLimitCost extends eui.Component
{
    public awardList:eui.List;
    public lblActTime:eui.Label;
    public lblEndTime:eui.Label;

    public constructor()
    {
        super();
        this.skinName = ActiveLimitCostSkin;
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
        var actCost:any = UserProxy.inst.activityObj[103];
        var id:number = actCost["id"];
        var start_time: number = Config.ActivityData[id]["show_start"];
        var end_time: number = Config.ActivityData[id]["time_end"];
        var exc_time:number = Config.ActivityData[id]["time_exchange"];
        var startDate:Date = new Date(start_time*1000);
        var endDate:Date = new Date(end_time*1000);
        var excData:Date = new Date(exc_time*1000);
        this.lblActTime.text = "活动时间：" + StringUtil.dateToString(startDate) + " 至 " +StringUtil.dateToString(endDate);
        this.lblEndTime.text = "兑换截止时间：" +  StringUtil.dateToString(excData);
    }

    private refresh():void
    {
        var ids:number[] = [];
        var downIds:number[] = [];
        var actCost:any = UserProxy.inst.activityObj[103];
        for (var i in Config.ActAddCostData)
        {
            var costData:any = Config.ActAddCostData[i];
            if(UserMethod.inst.isBitGet(parseInt(i),actCost["consumeActBit"]))
            {
                downIds.push(parseInt(i));
            }
            else
            {
                if(actCost["consumeAct"] >= parseInt(costData["show"]))
                {
                    ids.push(parseInt(i));
                }
            }
        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids.concat(downIds));
    }
}