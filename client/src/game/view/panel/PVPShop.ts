/**
 * Created by Administrator on 12/21 0021.
 */
class PVPShop extends eui.Component
{
    public shopList:eui.List;
    public btnRefresh:eui.Button;
    public lblTime:eui.Label;
    public lblPVPCoin:eui.Label;

    private _cdTime:number;

    public constructor()
    {
        super();
        this.skinName = PVPShopSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        Http.inst.addCmdListener(CmdID.PVP_SHOP_RESET,this.onRefreshBack,this);
        EventManager.inst.addEventListener(ContextEvent.PVP_SHOP_BUY,this.showPVPCoin,this);

        this.shopList.itemRenderer = PVPShopRenderer;
        this.btnRefresh.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRefresh,this);

        this.showCDTime();
        this.showPVPCoin();
    }

    private onHide(event:egret.Event):void
    {
        EventManager.inst.removeEventListener(ContextEvent.PVP_SHOP_BUY,this.showPVPCoin,this);
        Http.inst.removeCmdListener(CmdID.PVP_SHOP_RESET,this.onRefreshBack,this);
        this.btnRefresh.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRefresh,this);
        TickerUtil.unregister(this.tickerTime,this);
    }

    private onRefreshBack(e:egret.Event):void
    {
        if(e.data["diamond"] || e.data["diamond"] == 0)
        {
            UserProxy.inst.diamond = e.data["diamond"];
        }
        UserProxy.inst.pvpShopObj = e.data["pvpShopObj"];
        this.showCDTime();
    }


    private showPVPCoin():void
    {
        this.lblPVPCoin.text = UserProxy.inst.pvpShopObj["pvpCoin"];
    }

    private onRefresh():void
    {
        var type:number = 0;
        if(this._cdTime <= 0)
        {
            type = 1;
        }
        else
        {
            type = 2;
        }

        if(type == 2)
        {
            if(UserProxy.inst.costAlart)
            {
                showCost();
            }
            else
            {
                Alert.showCost(Config.PVPData[14]["value"],"换一批商品",true,showCost,null,this);
            }

            function showCost():void
            {
                if(UserProxy.inst.diamond >= parseInt(Config.PVPData[14]["value"]))
                {
                    Http.inst.send(CmdID.PVP_SHOP_RESET,{type:2});
                }
                else
                {
                    ExternalUtil.inst.diamondAlert();
                }
            }
        }
        else
        {
            Http.inst.send(CmdID.PVP_SHOP_RESET,{type:1});
        }

    }


    public showCDTime():void
    {
        this._cdTime = (parseInt(Config.PVPData[12]["value"]) * 60) - (UserProxy.inst.server_time - UserProxy.inst.pvpShopObj["resetLastTime"]);
        this.refreshTime();
    }

    public refreshTime():void
    {
        if(this._cdTime > 0)
        {
            this.tickerTime();
            TickerUtil.register(this.tickerTime, this, 1000);
        }
        this.refresh();
    }

    public tickerTime():void
    {
        this.lblTime.text =  "("+StringUtil.timeToString(this._cdTime,false) + ")";
        this._cdTime--;
        if(!this._cdTime)
        {
            TickerUtil.unregister(this.tickerTime,this);
        }
    }

    private refresh():void
    {
        var ids:number[] = [];
        for(var i in UserProxy.inst.pvpShopObj["pvpShop"])
        {
            ids.push(parseInt(i));
        }
        this.shopList.dataProvider = new eui.ArrayCollection(ids);
    }

}