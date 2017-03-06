/**
 * Created by Administrator on 12/5 0005.
 */
class WeaponBuyPanel extends BasePanel
{
    public buyList:eui.List;
    public btnRefresh:GreenButton;
    public lblTime:eui.Label;
    public weaponCell:eui.Label;
    public btnClose:SimpleButton;

    private lblWeaponCoin0:eui.Label;
    private lblWeaponCoin1:eui.Label;
    private lblWeaponCoin2:eui.Label;
    private lblWeaponCoin3:eui.Label;
    private lblWeaponCoin4:eui.Label;

    public _cdTime:number;
    private _lastVerticalScrollPos: number;
    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = WeaponBuyPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON_COIN,this.refreshWeaponCoin,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnRefresh.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRefresh,this);
        this.buyList.itemRenderer = WeaponBuyRenderer;

        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON,this.onWeaponRefresh,this);
        Http.inst.addCmdListener(CmdID.WEAPON_SHOP_RESET,this.showCDTime,this);
        Http.inst.addCmdListener(CmdID.WEAPON_POS_BUY,this.showWeaponCell,this);
    }

    public initData(): void
    {
        this.btnRefresh.labelDisplay.horizontalCenter = "-25";
        this.showCDTime();
        this.refreshWeaponCoin();
    }

    private refreshWeaponCoin():void
    {
        this.lblWeaponCoin0.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[0]);
        this.lblWeaponCoin1.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[1]);
        this.lblWeaponCoin2.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[2]);
        this.lblWeaponCoin3.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[3]);
        this.lblWeaponCoin4.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[4]);
    }

    public showCDTime():void
    {
        this._cdTime = (parseInt(Config.BaseData[16]["value"]) * 60) - (UserProxy.inst.server_time - UserProxy.inst.weaponShopResetLastTime);
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

    public showWeaponCell():void
    {
        this.weaponCell.text = "(" + UserMethod.inst.getWeaponCount() + "/" + UserProxy.inst.maxNum + ")";
    }


    private onWeaponRefresh(event: egret.Event): void
    {
        this._lastVerticalScrollPos = this.buyList.scrollV;
        this.refresh();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
    }

    private onEnterFrame(event: egret.Event): void
    {
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        this.buyList.scrollV = this._lastVerticalScrollPos;
    }

    public refresh():void
    {
        this.showWeaponCell();
        var buyIndexs:number[] = [];
        for(var i in UserProxy.inst.weaponShop)
        {
            buyIndexs.push(parseInt(i));
        }
        this.buyList.dataProvider = new eui.ArrayCollection(buyIndexs);
    }

    private onClose(e:egret.TouchEvent):void
    {
        PanelManager.inst.hidePanel("WeaponBuyPanel");
    }

    private onRefresh():void
    {
        if(this._cdTime < 0)
        {
            Http.inst.send(CmdID.WEAPON_SHOP_RESET,{type:1});
        }
        else
        {
            if(UserProxy.inst.costAlart)
            {
                showCost();
            }
            else
            {
                Alert.showCost(Config.BaseData[14]["value"],"刷新装备商店",true,showCost,null,this);
            }
        }

        function showCost():void
        {
            if(UserProxy.inst.diamond >= parseInt(Config.BaseData[14]["value"]))
            {
                Http.inst.send(CmdID.WEAPON_SHOP_RESET,{type:2});
            }
        }

    }


    public destory():void
    {
        super.destory();
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_WEAPON_COIN,this.refreshWeaponCoin,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnRefresh.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRefresh,this);
        Http.inst.removeCmdListener(CmdID.WEAPON_SHOP_RESET,this.showCDTime,this);
        Http.inst.removeCmdListener(CmdID.WEAPON_POS_BUY,this.showWeaponCell,this);
        TickerUtil.unregister(this.tickerTime,this);
    }

}