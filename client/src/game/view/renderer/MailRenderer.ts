/**
 * Created by Administrator on 12/19 0019.
 */
class MailRenderer extends eui.ItemRenderer
{
    public imgType:AutoBitmap;
    public lblName:eui.Label;
    public lblTime:eui.Label;
    public btnShow:eui.Button;
    public btnGet:eui.Button;

    public constructor()
    {
        super();
        this.skinName = MailRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnShow.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowInfo,this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowInfo,this);
    }

    private onHide(event:egret.Event):void
    {
        this.btnShow.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowInfo,this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowInfo,this)
    }

    private onShowInfo():void
    {
        PanelManager.inst.showPanel("MailInfoPanel",this.data);
    }

    public dataChanged(): void
    {
        super.dataChanged();
        var mailInfo:any = UserProxy.inst.mail[this.data];
        this.lblName.text = mailInfo["title"];
        var date:Date = new Date(mailInfo["createTime"]*1000);
        this.lblTime.text = StringUtil.dateToString(date);
        this.imgType.source = mailInfo["type"] == 1?"mail_notice_png":"mail_gift_png";


        if(mailInfo["state"])
        {
            this.btnGet.visible = true;
            this.btnShow.visible = false;
        }
        else
        {
            this.btnGet.visible = false;
            this.btnShow.visible = true;
        }
    }
}