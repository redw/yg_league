/**
 * Created by Administrator on 1/25 0025.
 */
class ActiveLimitInvite extends eui.Component
{
    public btnGo:eui.Button;
    public lblActTime:eui.Label;
    public imgInviteTitle:AutoBitmap;
    public lblInvite:eui.Label;

    public constructor()
    {
        super();
        this.skinName = ActiveInviteDoubleSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
        this.showTime();
    }

    private onHide(event:egret.Event):void
    {
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
    }

    private showTime():void
    {
        if(ExternalUtil.inst.getIsYYB())
        {
            this.imgInviteTitle.source = "limit_invite_double_title_yyb_png";
            this.lblInvite.text = "每日3次的在线奖励";
            this.btnGo.label = "前往领取";
        }

        var actWord:any = UserProxy.inst.activityObj[105];
        var id:number = actWord["id"];
        var start_time: number = Config.ActivityData[id]["show_start"];
        var end_time: number = Config.ActivityData[id]["time_end"];
        var startDate:Date = new Date(start_time*1000);
        var endDate:Date = new Date(end_time*1000);
        this.lblActTime.text = "活动时间：" + StringUtil.dateToString(startDate) + " 至 " +StringUtil.dateToString(endDate);
    }

    private onGo():void
    {
        PanelManager.inst.showPanel("FriendMainPanel",1);
    }

}