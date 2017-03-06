/**
 * Created by Administrator on 12/19 0019.
 */
class MailPanel extends BasePanel
{
    public mailList:eui.List;
    public btnClose:SimpleButton;
    public coinShow:CoinShowPanel;

    public constructor()
    {
        super();

        this._layer = PanelManager.MIDDLE_LAYER;
        this._modal = true;
        this.skinName = MailPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init():void
    {
        Http.inst.addCmdListener(CmdID.MAIL_ENCLOSE,this.onGetMail,this);
        EventManager.inst.addEventListener(ContextEvent.DELETA_MAIL,this.refresh,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.mailList.itemRenderer = MailRenderer;
        this.coinShow.startListener();
    }

    public initData():void
    {
        this.refresh();
    }

    public refresh():void
    {
        var ids:number[] = [];
        var hadIds:number[] = [];
        for(var i in UserProxy.inst.mail)
        {
            var mailInfo:any = UserProxy.inst.mail[i];
            if(mailInfo["state"])
            {
                hadIds.push(parseInt(i))
            }
            else
            {
                ids.push(parseInt(i));
            }

        }

        ids.sort(sortTime);

        function sortTime(a,b)
        {
            var mailInfo1:any = UserProxy.inst.mail[a];
            var mailInfo2:any = UserProxy.inst.mail[b];
            if(mailInfo2["createTime"] > mailInfo1["createTime"])
            {
                return 1;
            }

        }


        this.mailList.dataProvider = new eui.ArrayCollection(ids.concat(hadIds));
    }

    private onGetMail():void
    {
        this.refresh();
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("MailPanel");
    }

    public destory():void
    {
        super.destory();
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        Http.inst.removeCmdListener(CmdID.MAIL_ENCLOSE,this.onGetMail,this);
        this.coinShow.endListener();
    }
}