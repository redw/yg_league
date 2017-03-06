/**
 * 底下菜单
 * Created by Administrator on 11/23 0023.
 */
class MenuPanel extends BasePanel
{
    public contentGroup:eui.Group;
    public _openIndex:number;
    public menuUp:boolean;
    public secretLock:eui.Image;
    public weaponLock:eui.Image;
    public pvpLock:eui.Image;
    public moneyLock:eui.Image;
    public _needMoveTo:boolean = false;

    public static _inst:MenuPanel;
    static  get inst():MenuPanel
    {
        return MenuPanel._inst;
    }

    public constructor()
    {
        super();
        MenuPanel._inst = this;
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = MenuPanelSkin;
        this.bottom = 3;
        this.horizontalCenter = 0;
    }


    public init():void
    {
        for(var i:number = 1;i <= 6;i++)
        {
            var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.contentGroup,"btn" + i);
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMenu,this);
        }
        EventManager.inst.addEventListener(ContextEvent.OPEN_DEBLOCKING,this.openFunction,this);
    }

    public initData():void
    {
        this.menuUp = false;
        if(UserProxy.inst.historyArea < 20)
        {
            this.openMenu(2);
        }
        else
        {
            this.openMenu(1);
        }

        this.checkDraw();
        this.checkMoney();
        this.checkMine();
        this.openFunction();
    }

    public openFunction():void
    {
        this.moneyLock.visible = UserProxy.inst.historyArea < 20;
        this.secretLock.visible = UserProxy.inst.circleObj["circleTimes"] < 1;
        this.weaponLock.visible = UserProxy.inst.circleObj["circleTimes"] < 1;
        this.pvpLock.visible = UserProxy.inst.historyArea < 200;
    }

    public checkDraw():void
    {
        var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.contentGroup,"btn" + 2);
        UserMethod.inst.removeRedPoint(btn.parent,"draw");

        var draw:boolean = false;
        var star:boolean = false;

        var ship:boolean = false;
        if(UserMethod.inst.drawHeroCheck())
        {
            draw = true;
        }
        if(UserMethod.inst.starCheck())
        {
            star = true;
        }

        if(UserMethod.inst.shipCheck())
        {
            ship = true;
        }

        if(draw||star||ship)
        {
            UserMethod.inst.addRedPoint(btn.parent,"draw",new egret.Point(btn.x + 80 ,btn.y + 15));
        }
    }

    public checkMoney():void
    {
        if(UserProxy.inst.historyArea < 20)
        {
            return;
        }


        var autoShow:boolean = false;
        var openShow:boolean = false;
        var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.contentGroup,"btn" + 1);
        UserMethod.inst.removeRedPoint(btn.parent,"money");
        var autoId:number = 0;
        for(var i in UserProxy.inst.makeMoney)
        {
            if(!UserProxy.inst.makeMoney[i]["auto"] && UserProxy.inst.makeMoney[i]["lv"])
            {
                autoId = parseInt(i);
                break;
            }
        }

        if(autoId)
        {
            var taskData:any = Config.MakeMoneyData[autoId];
            var cost:number = parseInt(taskData["auto"]);
            if(BigNum.greaterOrEqual(UserProxy.inst.gold,cost))
            {
                autoShow = true;
            }
        }

        for(var i in UserProxy.inst.makeMoney)
        {
            if(UserProxy.inst.makeMoney[i]["lv"] == 0)
            {
                var taskData:any = Config.MakeMoneyData[i];
                var open:number = parseFloat(taskData["open"]) / UserProxy.inst.subOpenXunShanMoney;
                if(BigNum.greaterOrEqual(UserProxy.inst.gold,open))
                {
                    openShow = true;
                    this._needMoveTo = true;
                    break;
                }
            }
        }

        if(autoShow ||openShow )
        {
            UserMethod.inst.addRedPoint(btn.parent,"money",new egret.Point(btn.x + 80 ,btn.y + 15));
        }
    }

    public checkMine():void
    {
        var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.contentGroup,"btn" + 5);
        UserMethod.inst.removeRedPoint(btn.parent,"mine");
       if(UserMethod.inst.checkMinePoint())
       {
           UserMethod.inst.addRedPoint(btn.parent,"mine",new egret.Point(btn.x + 80 ,btn.y + 15));
       }
    }

    public openIndex(index:number):void
    {
        var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.contentGroup,"btn" + index);
        var source:string = "";
        switch (index)
        {
            case 1: source = "menu_xunshan_png";break;
            case 2: source = "menu_friend_png";break;
            case 3: source = "menu_mijing_png";break;
            case 4: source = "menu_lingshou_png";break;
            case 5: source = "menu_doufa_png";break;
            case 6: source = "menu_shop_png";break;
        }
        btn.source = source;

    }
    public closeIndex(index:number):void
    {

        var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.contentGroup,"btn" + index);
        var source:string = "";
        switch (index)
        {
            case 1:
                source = "menu_xunshan_close_png";
                break;
            case 2:
                source = "menu_friend_close_png";
                break;
            case 3:
                source = "menu_mijing_close_png";
                break;
            case 4:
                source = "menu_lingshou_close_png";
                break;
            case 5:
                source = "menu_doufa_close_png";
                break;
            case 6:
                source = "menu_shop_close_png";
                break;
        }
        btn.source = source;
    }


    public onMenu(event:egret.TouchEvent):void
    {
        var index: number = parseInt(event.currentTarget.name.replace("btn",""));
        this.openMenu(index,true);
    }

    public openMenu(index:number,menuDown?:boolean):void
    {

        switch (index)
        {
            case 1:
                if(UserProxy.inst.historyArea < 20)
                {
                    Notice.show("通过20关开启！");
                    return;
                }
                break;
            case 3:
                if(UserProxy.inst.circleObj["circleTimes"] < 1)
                {
                    Notice.show("轮回后开启！");
                    return;
                }
               break;
            case 4:
                if(UserProxy.inst.circleObj["circleTimes"] < 1)
                {
                    Notice.show("轮回后开启！");
                    return;
                }
               break;
            case 5:
                if(UserProxy.inst.historyArea < 200)
                {
                    Notice.show("通过200关开启！");
                   return;
                }
                break;
        }

        if(this._openIndex && index != this._openIndex)
        {
            this.closeIndex(this._openIndex);
        }
        else
        {
            if(index == this._openIndex && index == 1)
            {
                return;
            }
        }

        if(menuDown)
        {
            this._openIndex = UserProxy.inst.historyArea < 20 ? 2 : 1;
        }
        else
        {
            this._openIndex = index;
        }

        switch (index)
        {
            case 1:
            {
                if(PanelManager.inst.isShow("XunShanPanel"))
                {
                    PanelManager.inst.hidePanel("XunShanPanel");
                    this.closeIndex(index);
                }
            }
                break;
            case 2:
            {
                if(PanelManager.inst.isShow("RolePanel"))
                {
                    PanelManager.inst.hidePanel("RolePanel");
                    this.closeIndex(index);
                }
                else
                {
                    this._openIndex = 2;
                }
            }
                break;
            case 4:
                if(PanelManager.inst.isShow("WeaponPanel"))
                {
                    PanelManager.inst.hidePanel("WeaponPanel");
                    this.closeIndex(index);
                }
                else
                {
                    this._openIndex = 4;
                }
                break;
            case 3:
                if(PanelManager.inst.isShow("SecretPanel"))
                {
                    PanelManager.inst.hidePanel("SecretPanel");
                    this.closeIndex(index);
                }
                else
                {
                    this._openIndex = 3;
                }
                break;
            case 5:
                if(PanelManager.inst.isShow("PVPBeforePanel"))
                {
                    PanelManager.inst.hidePanel("PVPBeforePanel");
                    this.closeIndex(index);
                }
                else
                {
                    this._openIndex = 5;
                }
                break;
            case 6:
                if(PanelManager.inst.isShow("ShopPanel"))
                {
                    PanelManager.inst.hidePanel("ShopPanel");
                    this.closeIndex(index);
                }
                else
                {
                    this._openIndex = 6;
                }
                break;
        }


        this.openIndex(this._openIndex);
        this.openPanel(this._openIndex);

        if(this._openIndex == 1 && this._needMoveTo)
        {
            this._needMoveTo = false;
            EventManager.inst.dispatch("MONEY_MOVE");
        }
    }

    public openPanel(index:number):void
    {
        switch (index)
        {
            case 1:
                PanelManager.inst.showPanel("XunShanPanel");
                break;
            case 2:
                PanelManager.inst.showPanel("RolePanel");
                break;
            case 4:
                PanelManager.inst.showPanel("WeaponPanel");
                break;
            case 3:
                PanelManager.inst.showPanel("SecretPanel");
                break;
            case 5:
                PanelManager.inst.showPanel("PVPBeforePanel");
                break;
            case 6:
                PanelManager.inst.showPanel("ShopPanel");
                break;
        }
    }



    public destory(): void
    {
        super.destory();
        for(var i:number = 1;i <= 6;i++)
        {
            var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.contentGroup,"btn" + i);
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMenu,this);
        }

        EventManager.inst.removeEventListener(ContextEvent.OPEN_DEBLOCKING,this.openFunction,this);
    }


}
