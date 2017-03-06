/**
 * Created by Administrator on 12/14 0014.
 */
class FriendGiftPanel extends BasePanel
{
    public btnSpecial:SimpleButton;
    public btnClose:SimpleButton;
    public btnBuy1:eui.Button;
    public btnBuy2:eui.Button;

    private _sendUid:number;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
//        this.skinName = FriendGiftPanelSkin;
        this._modal = true;
        // this.horizontalCenter = 0;
        // this.verticalCenter = 0;
        this.effectType = 2;
    }

    public init():void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnSpecial.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuy1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuy2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
    }

    public initData():void
    {
        this._sendUid = this.data;

    }

    private onBuy(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.btnBuy1)
        {

        }
        else if(e.currentTarget == this.btnBuy2)
        {

        }
        else
        {

        }
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("FriendGiftPanel");
    }

    public destory(): void
    {
        super.destory();
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnSpecial.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuy1.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuy2.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
    }

}