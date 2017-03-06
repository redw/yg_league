/**
 * Created by Administrator on 1/18 0018.
 */
class OfflinePanel extends BasePanel
{
    public lblLeave:eui.Label;
    public lblGold:eui.Label;
    public btnSure:eui.Button;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = OfflinePanlSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        this.btnSure.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }

    public initData():void
    {
        this.lblGold.text = MathUtil.easyNumber(UserProxy.inst.offlineGold);

        var monthTime:number = 0;
        var lifeTime:number = 0;

        if(UserProxy.inst.vipObj["monthVIP"])
        {
            monthTime = 2;
        }

        if(UserProxy.inst.vipObj["foreverVIP"])
        {
            lifeTime = 2;
        }

        var time:number = 8 + monthTime + lifeTime;
        this.lblLeave.text = "您已离线" + StringUtil.timeToString(UserProxy.inst.offlineTime) + "（最高" + time +"小时）";
    }
    private onClose():void
    {
        PanelManager.inst.hidePanel("OfflinePanel");
    }

    public destory():void
    {
        super.destory();
        this.btnSure.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }

}