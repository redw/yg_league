/**
 * @巡山
 * Created by Administrator on 11/24 0024.
 */
class XunShanPanel extends BasePanel
{
    public imgIcon:AutoBitmap;
    public lblName:eui.Label;
    public btnGoldAuto:GreenCoinButton;
    public btnDiamondAuto:GreenCoinButton;
    public taskList:eui.List;
    public taskScroller:eui.Scroller;
    public btnUp:SimpleButton;
    public btnHelp:SimpleButton;
    public coinShow:CoinShowPanel;

    private _autoId:number = 0;
    private _lastVerticalScrollPos:number;
    private _upDown:boolean ;
    private _moving:boolean = false;
    private _diamondCost:number = 0;

    public constructor()
    {
        super();

        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = XunShanPanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }

    public init(): void
    {
        EventManager.inst.addEventListener("GUIDE_AUTO",this.guideAuto,this);
        Http.inst.addCmdListener(CmdID.AUTO_MONEY,this.onAutoBack,this);
        Http.inst.addCmdListener(CmdID.MONEY_UP,this.addNewTask,this);
        EventManager.inst.addEventListener(ContextEvent.REFRESH_BASE,this.autoMoney,this);
        this.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHelp,this);

        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.btnGoldAuto.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAuto,this);
        this.btnDiamondAuto.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAuto,this);
        this.btnGoldAuto.type = 1;
        this.btnDiamondAuto.type = 2;
        this.taskList.itemRenderer = XunShanRenderer;
        EventManager.inst.addEventListener("MONEY_MOVE",this.moveTo,this);
        this.coinShow.startListener();
    }

    public initData(): void
    {
        this.refresh();
        this.autoMoney();

        this._upDown = MenuPanel.inst.menuUp;
        if(MenuPanel.inst.menuUp)
        {
            this.btnUp.source = "menu_down_png";
            this.height = 616;
            this.taskScroller.height = 494;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            this.height = 282;
            this.taskScroller.height = 160;
        }

    }

    private guideAuto():void
    {
        this.btnGoldAuto.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    }

    private onRefresh(): void
    {
        this._lastVerticalScrollPos = this.taskList.scrollV;
        this.refresh();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
    }

    private onEnterFrame(): void
    {
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        this.taskList.scrollV = this._lastVerticalScrollPos;
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
            egret.Tween.get(this.taskScroller).to({height:494},time);
            MenuPanel.inst.menuUp = true;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            egret.Tween.get(this).to({height:282},time);
            egret.Tween.get(this.taskScroller).to({height:150},time);
            MenuPanel.inst.menuUp = false;
        }
        egret.setTimeout(function () {  this._moving = false;},this,time);

    }


    private refresh():void
    {
        var ids:number[] = [];
        for(var i in UserProxy.inst.makeMoney)
        {
            ids.push(parseInt(i));
            if(!this._autoId && !UserProxy.inst.makeMoney[i]["auto"])
            {
                this._autoId = parseInt(i);
            }
            if(!UserProxy.inst.makeMoney[i]["lv"])
            {
                break;
            }
        }
        this.taskList.dataProvider = new eui.ArrayCollection(ids);
    }

    private addNewTask(e:egret.Event):void
    {
        for(var i in e.data["makeMoney"])
        {
            if(e.data["makeMoney"][i]["lv"] == 1)
            {
                this.onRefresh();
            }
        }
        MenuPanel.inst.checkMoney();
    }

    private onAuto(e:egret.Event):void
    {
        if(!UserProxy.inst.makeMoney[this._autoId]["lv"])
        {
            Notice.show("对应的巡山未开启！");
            return;
        }

        if(e.currentTarget == this.btnGoldAuto)
        {
            Http.inst.send(CmdID.AUTO_MONEY,{mid:this._autoId,type:1});
        }
        else
        {
            if(UserProxy.inst.costAlart)
            {
                this.showCost();
            }
            else
            {
                var taskData:any = Config.MakeMoneyData[this._autoId];
                Alert.showCost(this._diamondCost,"开启【" + taskData["name"] +"】自动\n（轮回后需要重新开启）",true,this.showCost,null,this);
            }
        }
    }

    private showCost():void
    {
        if(UserProxy.inst.diamond >= this._diamondCost)
        {
            Http.inst.send(CmdID.AUTO_MONEY,{mid:this._autoId,type:2});
        }
    }

    private onAutoBack():void
    {
        this._autoId++;
        this.autoMoney();
        MenuPanel.inst.checkMoney();
    }

    private autoMoney():void
    {
        this.btnGoldAuto.type = 1;
        this.btnDiamondAuto.type = 2;
        var taskData:any = Config.MakeMoneyData[this._autoId];
        UserMethod.inst.removeRedPoint(this.btnGoldAuto.parent,"money");
        if(taskData)
        {
            MenuPanel.inst.checkMoney();
            this.btnGoldAuto.label = MathUtil.easyNumber(taskData["auto"]);
            this.btnDiamondAuto.label = taskData["auto_diamond"];
            this._diamondCost = parseInt(taskData["auto_diamond"]);
            this.imgIcon.source = "makemoney_" + this._autoId + "_png";
            this.lblName.text = taskData["name"];

            if(BigNum.greaterOrEqual(UserProxy.inst.gold,taskData["auto"]) && UserProxy.inst.makeMoney[this._autoId]["lv"])
            {
                this.btnGoldAuto.enabled = true;
                UserMethod.inst.addRedPoint(this.btnGoldAuto.parent,"money",new egret.Point(this.btnGoldAuto.x + 90 ,this.btnGoldAuto.y + 10));
            }
            else
            {
                this.btnGoldAuto.enabled = false;
            }

            if(UserProxy.inst.diamond >= parseInt(taskData["auto_diamond"]))
            {
                this.btnDiamondAuto.enabled = true;
            }
            else
            {
                this.btnDiamondAuto.enabled = false;
            }
        }
        else
        {
            this.imgIcon.source = "makemoney_35_png";
            this.lblName.text = "已开启所有巡山";
            this.btnDiamondAuto.visible = false;
            this.btnGoldAuto.visible = false;
        }



    }

    private onHelp():void
    {
        PanelManager.inst.showPanel("HelpPanel",1);
    }

    private moveTo():void
    {
        var turnId:number = 0;
        for(var i in UserProxy.inst.makeMoney)
        {
            if(!UserProxy.inst.makeMoney[i]["lv"])
            {
                turnId = parseInt(i);
                break;
            }
        }
        egret.setTimeout(function() {

            if(turnId > 2)
            {
                this.taskList.scrollV =  (turnId-2) * 73;
            }
        },this,100);

    }

    public destory():void
    {
        super.destory();
        EventManager.inst.removeEventListener("GUIDE_AUTO",this.guideAuto,this);
        Http.inst.removeCmdListener(CmdID.AUTO_MONEY,this.onAutoBack,this);
        Http.inst.removeCmdListener(CmdID.MONEY_UP,this.addNewTask,this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_BASE,this.autoMoney,this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.btnGoldAuto.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onAuto,this);
        this.btnDiamondAuto.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onAuto,this);
        this.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHelp,this);
        EventManager.inst.addEventListener("MONEY_MOVE",this.moveTo,this);
        this.coinShow.endListener();
    }

}