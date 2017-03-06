/**
 * Created by Administrator on 12/1 0001.
 */
class WeaponPanel extends BasePanel
{
    public btnWeaponShop:GreenButton;
    public weaponList:eui.List;
    public weaponCell:eui.Label;
    public weaponScroller:eui.Scroller;
    public btnUp:SimpleButton;

    private lblWeaponCoin0:eui.Label;
    private lblWeaponCoin1:eui.Label;
    private lblWeaponCoin2:eui.Label;
    private lblWeaponCoin3:eui.Label;
    private lblWeaponCoin4:eui.Label;
    public btnHelp:SimpleButton;

    private _upDown:boolean ;
    private _moving:boolean = false;

    private _lastVerticalScrollPos: number = 0;

    public constructor()
    {
        super();
        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = WeaponPanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }

    public init(): void
    {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON_COIN,this.refreshWeaponCoin,this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.btnWeaponShop.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onWeaponShop,this);
        this.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHelp,this);
        this.weaponList.itemRenderer = WeaponRenderer;
    }

    public initData(): void
    {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON,this.onWeaponRefresh,this);
        Http.inst.addCmdListener(CmdID.WEAPON_POS_BUY,this.refresh,this);
        this.refresh();
        this.refreshWeaponCoin();

        this._upDown = MenuPanel.inst.menuUp;
        if(MenuPanel.inst.menuUp)
        {
            this.btnUp.source = "menu_down_png";
            this.height = 616;
            this.weaponScroller.height = 494;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            this.height = 282;
            this.weaponScroller.height = 160;
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

    private onWeaponRefresh(event: egret.Event): void
    {
        this._lastVerticalScrollPos = this.weaponList.scrollV;
        this.refresh();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
    }

    private onEnterFrame(event: egret.Event): void
    {
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        this.weaponList.scrollV = this._lastVerticalScrollPos;
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
            egret.Tween.get(this.weaponScroller).to({height:494},time);
            MenuPanel.inst.menuUp = true;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            egret.Tween.get(this).to({height:282},time);
            egret.Tween.get(this.weaponScroller).to({height:150},time);
            MenuPanel.inst.menuUp = false;
        }
        egret.setTimeout(function () {  this._moving = false;},this,time);

    }

    private refresh():void
    {
        this.showWeaponCell();
        var weaponIds:number[] = [];
        for(var i in UserProxy.inst.weaponList)
        {
            weaponIds.push(parseInt(i));
        }

        if(UserMethod.inst.getWeaponCount() >= UserProxy.inst.maxNum && UserProxy.inst.buyNum < Config.BaseData[9]["value"])
        {
            weaponIds.push(0);
        }

        this.weaponList.dataProvider = new eui.ArrayCollection(weaponIds);
    }

    private onWeaponShop(e:egret.TouchEvent):void
    {
        PanelManager.inst.showPanel("WeaponBuyPanel");
    }

    public showWeaponCell():void
    {
        this.weaponCell.text = "(" + UserMethod.inst.getWeaponCount() + "/" + UserProxy.inst.maxNum + ")";
    }

    private onHelp():void
    {
        PanelManager.inst.showPanel("HelpPanel",4);
    }

    public destory():void
    {
        super.destory();
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_WEAPON_COIN,this.refreshWeaponCoin,this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.btnWeaponShop.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onWeaponShop,this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_WEAPON,this.refresh,this);
        Http.inst.removeCmdListener(CmdID.WEAPON_POS_BUY,this.refresh,this);
        this.btnHelp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHelp,this);
    }

}
