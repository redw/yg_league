/**
 * Created by Administrator on 12/14 0014.
 */
class FriendGetGift extends eui.Component
{
    public lblGetTimes:eui.Label;
    public giftList:eui.List;

    public constructor()
    {
        super();
        this.skinName = FriendGetGiftSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.giftList.itemRenderer = FriendGetGiftRenderer;
        this.showList();
    }

    private onHide(event:egret.Event):void
    {

    }

    private showList():void
    {
        var ids:number[] = [1,2,3];

        this.giftList.dataProvider = new eui.ArrayCollection(ids);
    }



}