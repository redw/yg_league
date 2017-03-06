/**
 * Created by Administrator on 12/9 0009.
 */
class ActivePrivilege extends eui.Component
{

    public constructor()
    {
        super();
        this.skinName = ActivePrivilegeSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {

    }

    private onHide(event:egret.Event):void
    {

    }


}