/**
 * Created by Administrator on 12/14 0014.
 */
class FriendGetGiftRenderer extends eui.ItemRenderer
{
    public lblName:eui.Label;
    public lblLuck:eui.Label;
    public lblTime:eui.Label;
    public btnGet:eui.Button;
    public imgGot:eui.Image;

    public constructor()
    {
        super();
        this.skinName = FriendGetGiftRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
    }

    private onHide(event:egret.Event):void
    {
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
    }

    private onGet():void
    {

    }

    public dataChanged(): void
    {
        super.dataChanged();

    }
}