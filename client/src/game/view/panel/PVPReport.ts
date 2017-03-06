/**
 * Created by Administrator on 12/21 0021.
 */
class PVPReport extends eui.Component
{

    public constructor()
    {
        super();
        this.skinName = PVPReportSkin;
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