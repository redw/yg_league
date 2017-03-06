/**
 * Created by Administrator on 12/9 0009.
 */
class ActiveFund extends eui.Component
{
    public btnBuy:eui.Button;
    public awardList:eui.List;

    public constructor()
    {
        super();
        this.skinName = ActiveFundSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        EventManager.inst.addEventListener(ContextEvent.RECHARGE_BACK,this.buyBack,this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.awardList.itemRenderer = ActFundRenderer;
        this.btnBuy.visible = !UserProxy.inst.vipObj["fund"];
        this.refresh();
    }

    private buyBack():void
    {
        this.btnBuy.visible = !UserProxy.inst.vipObj["fund"];
        this.refresh();
    }

    private onHide(event:egret.Event):void
    {
        EventManager.inst.removeEventListener(ContextEvent.RECHARGE_BACK,this.buyBack,this);
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
    }

    private refresh():void
    {
        var ids:number[] = [];
        var doneIds:number[] = [];
        for (var i in Config.DailyFundData)
        {
            if(UserMethod.inst.isBitGet(parseInt(i),UserProxy.inst.vipObj["fundBit"]))
            {
                doneIds.push(parseInt(i));
            }
            else
            {
                ids.push(parseInt(i));
            }

        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids.concat(doneIds));
    }

    private onBuy():void
    {
        ExternalUtil.inst.pay(PidType.PID_FUND);
    }


}