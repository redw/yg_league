/**
 * @货币类
 * Created by Administrator on 11/24 0024.
 */
class CoinPanel extends BasePanel
{
    public lblGold:eui.Label;
    public lblDiamond:eui.Label;
    public lblMedal:eui.Label;
    public commonGroup:eui.Group;
    public weaponGroup:eui.Group;
    public lblDiamond1:eui.Label;
    public lblWeaponCoin4:eui.Label;
    public lblWeaponCoin3:eui.Label;
    public lblWeaponCoin2:eui.Label;
    public lblWeaponCoin1:eui.Label;
    public lblWeaponCoin0:eui.Label;
    public btnClose:SimpleButton;
    private _className:string;

    public static _inst:CoinPanel;
    static  get inst():CoinPanel
    {
        return CoinPanel._inst;
    }

    public constructor()
    {
        super();
        CoinPanel._inst = this;
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = CoinPanelSkin;
        this.horizontalCenter = 0;
    }

    public hideCoinPanel(show:boolean):void
    {
        this.visible = show;
    }

    public setCoinBottom(type:number,showClose:boolean = false,className:string = "",isWeapon:boolean = false):void
    {
        this._className = className;
        var bottom:number;
        switch (type)
        {
            case 1:bottom = Global.COIN_BOTTOM_HEIGHT ;break;
            case 2:bottom = Global.COIN_TOP_HEIGHT; break;
            case 3:bottom = 800 - this.height; break;
        }
        this.bottom = bottom;
        this.isShowCommon(isWeapon);
        this.btnClose.visible = showClose;
    }

    public isShowCommon(showCommon:boolean):void
    {
        if(!showCommon)
        {
            this.commonGroup.visible = true;
            this.weaponGroup.visible = false;
            this.btnClose.y = 0;
        }
        else
        {
            this.commonGroup.visible = false;
            this.weaponGroup.visible = true;
            this.btnClose.y = -50;
        }
    }

    public init():void
    {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_BASE,this.refresh,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }

    public initData():void
    {
        this.refresh();
    }

    private refresh():void
    {
        this.lblDiamond.text = MathUtil.easyNumber(UserProxy.inst.diamond);
        this.lblGold.text = MathUtil.easyNumber(UserProxy.inst.gold);
        this.lblMedal.text = MathUtil.easyNumber(UserProxy.inst.medal);
        this.refreshWeaponCoin();
    }

    private refreshWeaponCoin():void
    {
        this.lblWeaponCoin0.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[0]);
        this.lblWeaponCoin1.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[1]);
        this.lblWeaponCoin2.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[2]);
        this.lblWeaponCoin3.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[3]);
        this.lblWeaponCoin4.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[4]);
        this.lblDiamond1.text = this.lblDiamond.text;
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel(this._className);
    }

    public destory(): void
    {
        super.destory();
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_BASE,this.refresh,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }
}
