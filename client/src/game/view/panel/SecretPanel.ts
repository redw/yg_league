/**
 * Created by Administrator on 12/5 0005.
 */
class SecretPanel extends BasePanel
{
    public secretList:eui.List;
    public secretTimes:eui.Label;
    public lblTime:eui.Label;

    private lblWeaponCoin0:eui.Label;
    private lblWeaponCoin1:eui.Label;
    private lblWeaponCoin2:eui.Label;
    private lblWeaponCoin3:eui.Label;
    private lblWeaponCoin4:eui.Label;

    public scroll:eui.Scroller;
    public btnUp:SimpleButton;
    public btnAdd:SimpleButton;
    public btnHelp:SimpleButton;

    private _upDown:boolean;
    private _moving:boolean = false;
    private _cdTime:number;
    public constructor()
    {
        super();
        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = SecretPanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }

    public init(): void
    {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON_COIN,this.refreshWeaponCoin,this);
        EventManager.inst.addEventListener(ContextEvent.BOSS_FIGHT_END,this.battleBack,this);
        Http.inst.addCmdListener(CmdID.DUNGEON_OPEN,this.openBack,this);
        Http.inst.addCmdListener(CmdID.DUNGEON_TIMES,this.buyBack,this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);
        this.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHelp,this);
        EventManager.inst.addEventListener(ContextEvent.REFRESH_DUNGEON_INFO,this.changeTime,this);
        this.secretList.itemRenderer = SecretRenderer;
    }

    public initData(): void
    {
        this.refreshWeaponCoin();
        var fbs:number[] = [];
        for(var i in Config.WeaponFbOp)
        {
            fbs.push(parseInt(i));
        }

        this.secretList.dataProvider = new eui.ArrayCollection(fbs);
        Http.inst.send(CmdID.DUNGEON_OPEN);

        this._upDown = MenuPanel.inst.menuUp;
        if(MenuPanel.inst.menuUp)
        {
            this.btnUp.source = "menu_down_png";
            this.height = 616;
            this.scroll.height = 494;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            this.height = 282;
            this.scroll.height = 160;
        }
    }

    private changeTime():void
    {
        Http.inst.send(CmdID.DUNGEON_OPEN);
    }

    private battleBack(e:egret.Event):void
    {
        if(e.data)
        {
            UserMethod.inst.showAward(e.data);
            this.showTimes();
        }
    }

    private refreshWeaponCoin():void
    {
        this.lblWeaponCoin0.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[0]);
        this.lblWeaponCoin1.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[1]);
        this.lblWeaponCoin2.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[2]);
        this.lblWeaponCoin3.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[3]);
        this.lblWeaponCoin4.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[4]);
    }

    private onUpDown():void
    {
        if(this._moving)
        {
            return;
        }
        this._moving = true;
        this._upDown = !this._upDown;
        var time:number = 500;
        if(this._upDown)
        {
            this.btnUp.source = "menu_down_png";
            egret.Tween.get(this).to({height:616},time);
            egret.Tween.get(this.scroll).to({height:494},time);
            MenuPanel.inst.menuUp = true;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            egret.Tween.get(this).to({height:282},time);
            egret.Tween.get(this.scroll).to({height:150},time);
            MenuPanel.inst.menuUp = false;
        }
        egret.setTimeout(function () {  this._moving = false;},this,time);

    }

    private showTimes():void
    {
        this.secretTimes.text = "(" + UserProxy.inst.freeTimes + "/" + UserProxy.inst.maxTimes + ")";
        this.btnAdd.visible = !UserProxy.inst.freeTimes;
        this.lblTime.visible = true;
        if(UserProxy.inst.lastRecoverTime < 0)
        {
            this.lblTime.text = "(00:00)";
            this.lblTime.visible = false;
        }
        else
        {
            this.showCDTime();
        }

    }

    public showCDTime():void
    {
        var last:number = UserProxy.inst.server_time - UserProxy.inst.lastRecoverTime;
        this._cdTime = (parseInt(Config.BaseData[28]["value"]) * 60) - last;
        this.refreshTime();
    }

    public refreshTime():void
    {
        if(this._cdTime > 0)
        {
            this.tickerTime();
            TickerUtil.register(this.tickerTime, this, 1000);
        }
    }

    public tickerTime():void
    {
        this.lblTime.text =  "("+StringUtil.timeToString(this._cdTime,false) + ")";
        this._cdTime--;
        if(this._cdTime <= 0)
        {
            TickerUtil.unregister(this.tickerTime,this);
            Http.inst.send(CmdID.DUNGEON_OPEN);
        }
    }

    private openBack(e:egret.Event):void
    {
        if(e.data["dungeonObj"])
        {
            UserProxy.inst.dungeonList = e.data["dungeonObj"]["dungeonList"];
            UserProxy.inst.buyTimes = e.data["dungeonObj"]["buyTimes"];
            UserProxy.inst.maxTimes = e.data["dungeonObj"]["maxTimes"];
            UserProxy.inst.freeTimes = e.data["dungeonObj"]["freeTimes"];
            UserProxy.inst.lastRecoverTime = e.data["dungeonObj"]["lastRecoverTime"];
        }
        this.showTimes();
    }

    private onAdd():void
    {
        var cost:number = parseInt(Config.BaseData[29]["value"]) * (1 + 0.5 * (UserProxy.inst.buyTimes - 1));
        if(UserProxy.inst.costAlart)
        {
            showCost();
        }
        else
        {
            Alert.showCost(cost,"买一次体力（ps:人参果可以增加次数哦~）",true,showCost,null,this);
        }

        function showCost():void
        {
            if(UserProxy.inst.diamond >= cost)
            {
                Http.inst.send(CmdID.DUNGEON_TIMES);
            }
            else
            {
                ExternalUtil.inst.diamondAlert();
            }
        }
    }

    private buyBack(e:egret.Event):void
    {
        UserProxy.inst.buyTimes = e.data["buyTimes"];
        UserProxy.inst.freeTimes = e.data["freeTimes"];
        UserProxy.inst.diamond = e.data["diamond"];
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        this.showTimes();
    }

    public onHelp():void
    {
        PanelManager.inst.showPanel("HelpPanel",3);
    }

    public destory():void
    {
        super.destory();
        EventManager.inst.removeEventListener(ContextEvent.BOSS_FIGHT_END,this.battleBack,this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_WEAPON_COIN,this.refreshWeaponCoin,this);
        Http.inst.removeCmdListener(CmdID.DUNGEON_OPEN,this.openBack,this);
        Http.inst.removeCmdListener(CmdID.DUNGEON_TIMES,this.buyBack,this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);
        this.btnHelp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHelp,this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_DUNGEON_INFO,this.changeTime,this);
    }


}