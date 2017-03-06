/**
 * Created by Administrator on 12/9 0009.
 */
class ActiveRichSign extends eui.Component
{
    public btnBuy:eui.Button;

    public constructor()
    {
        super();
        this.skinName = ActiveRichSignSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
    }

    private onHide(event:egret.Event):void
    {
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
    }

    private onBuy():void
    {

    }


}