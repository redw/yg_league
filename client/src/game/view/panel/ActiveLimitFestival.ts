/**
 * Created by Administrator on 2/28 0028.
 */
class ActiveLimitFestival extends eui.Component
{
    public lblActTime:eui.Label;
    public lblEndTime:eui.Label;
    public btnBuy1:SimpleButton;
    public btnBuy2:SimpleButton;
    public btnBuy3:SimpleButton;
    public imgBuy1:AutoBitmap;
    public imgBuy2:AutoBitmap;
    public imgBuy3:AutoBitmap;
    private _cost:number;
    private _buyId:number;
    private _endTime:number;

    public constructor()
    {
        super();
        this.skinName = ActiveLimitFestivalSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        Http.inst.addCmdListener(CmdID.INVEST,this.buyRefresh,this);
        Http.inst.addCmdListener(CmdID.ACTIVITY,this.getBack,this);
        this.btnBuy1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuy2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuy3.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);

        this.showTime();

    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.INVEST,this.buyRefresh,this);
        Http.inst.removeCmdListener(CmdID.ACTIVITY,this.getBack,this);
        this.btnBuy1.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuy2.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuy3.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
    }

    private buyRefresh(e:egret.Event):void
    {
        UserProxy.inst.diamond = e.data["diamond"];
        var actFestival:any = UserProxy.inst.activityObj[111];
        actFestival["buyFlag"] = e.data["buyFlag"];
        this.showInfo(actFestival);
        TopPanel.inst.showPoint(8,5);
        ActiveLimitPanel.inst.checkPoint(5);
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    }

    private getBack(e:egret.Event):void
    {
        if(e.data["type"] == 16)
        {
            var actFestival:any = UserProxy.inst.activityObj[111];
            this.showInfo(actFestival);
        }
    }

    private onBuy(e:egret.TouchEvent):void
    {
        var actFestival:any = UserProxy.inst.activityObj[111];
        var buyFlag:number[] = actFestival["buyFlag"];
        if(e.currentTarget == this.btnBuy1)
        {
            if(buyFlag[0])
            {
                //领取
                Http.inst.send(CmdID.ACTIVITY,{type:16,id:1});
            }
            else
            {
                //买
                if(!UserProxy.inst.rechargeFlag)
                {
                    Notice.show("首冲后才能购买哦~");
                    return;
                }
                this.onBuyCost(1);
            }
        }
        else if(e.currentTarget == this.btnBuy2)
        {
            if(buyFlag[1])
            {
                //领取
                Http.inst.send(CmdID.ACTIVITY,{type:16,id:2});
            }
            else
            {
                if(!UserProxy.inst.vipObj["monthVIP"])
                {
                    Notice.show("月卡用户才能购买哦~");
                    return;
                }
                //买
                this.onBuyCost(2);
            }
        }
        else
        {
            if(buyFlag[2])
            {
                //领取
                Http.inst.send(CmdID.ACTIVITY,{type:16,id:3});
            }
            else
            {
                if(!UserProxy.inst.vipObj["foreverVIP"])
                {
                    Notice.show("终身卡用户才能购买哦~");
                    return;
                }
                //买
               this.onBuyCost(3);
            }
        }
    }

    private onBuyCost(id:number):void
    {

        if(this._endTime < UserProxy.inst.server_time)
        {
            Notice.show("已过期！");
            return;
        }

        this._buyId = id;
        var strName:string;
        var actInvest:any = Config.ActInvestData;
        switch (id)
        {
            case 1:this._cost = parseInt(actInvest[id]["cost"]);strName = "繁星红利";break;
            case 2:this._cost = parseInt(actInvest[id]["cost"]);strName = "玄月红利";break;
            case 3:this._cost = parseInt(actInvest[id]["cost"]);strName = "耀日红利";break;
        }
        if(UserProxy.inst.costAlart)
        {
            this.showCostAlert();
        }
        else
        {
            Alert.showCost(this._cost,"购买"+strName,true,this.showCostAlert,null,this);
        }

    }

    private showCostAlert():void
    {
        if(UserProxy.inst.diamond >= this._cost)
        {
            Http.inst.send(CmdID.INVEST,{id:this._buyId});
        }
        else
        {
            ExternalUtil.inst.diamondAlert();
        }
    }

    private showInfo(data:any):void
    {
        var actInvest:any = Config.ActInvestData;
        var buyFlag:number[] = data["buyFlag"];
        var timesAry:number[] = data["timesAry"];
        var todayFlag:number[] = data["todayFlag"];

        var imgArr:AutoBitmap[] = [this.imgBuy1,this.imgBuy2,this.imgBuy3];
        var btnArr:SimpleButton[] = [this.btnBuy1,this.btnBuy2,this.btnBuy3];

        for(var i:number = 0;i < 3; i++)
        {
            var nowActData:any = actInvest[i+1];
            var buy:number = buyFlag[i];
            var times:number = timesAry[i];
            var today:number = todayFlag[i];
            var img:AutoBitmap = imgArr[i];
            var btn:SimpleButton = btnArr[i];

            if(buy)
            {
                img.source = "limit_festival_had_img_png";
                if(today)//今天有没有领
                {
                    btn.source = "limit_festival_had_got_png";
                    btn.touchEnabled = false;
                }
                else
                {
                    btn.source = "limit_festival_get_png";
                    btn.touchEnabled = true;
                }

                if(times >= parseInt(nowActData["days"]))//领完了
                {
                    btn.source = "limit_festival_get_all_png";
                    btn.touchEnabled = false;
                }
            }
            else
            {
                img.source = "limit_festival_buy_pos" + (i+1) + "_png";
                btn.source = "limit_festival_buy_png";
            }
        }

    }

    private showTime():void
    {
        var actFestival:any = UserProxy.inst.activityObj[111];
        var id:number = actFestival["id"];
        var start_time: number = Config.ActivityData[id]["show_start"];
        var end_time: number = Config.ActivityData[id]["time_end"];
        var exc_time:number = Config.ActivityData[id]["time_exchange"];
        var startDate:Date = new Date(start_time*1000);
        var endDate:Date = new Date(end_time*1000);
        var excData:Date = new Date(exc_time*1000);
        this.lblActTime.text = "活动时间：" + StringUtil.dateToString(startDate) + " 至 " +StringUtil.dateToString(endDate);
        this.lblEndTime.text = "兑换截止时间：" +  StringUtil.dateToString(excData);
        this._endTime = parseFloat(Config.ActivityData[id]["time_end"]);
        this.showInfo(actFestival);
    }


}