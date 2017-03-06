/**
 * Created by Administrator on 1/17 0017.
 */
class NoticePanel extends BasePanel
{

    public btnClose:eui.Button;
    public btnCopy:eui.Button;
    public lblDesc:eui.Label;
    public lblQ:eui.Label;

    private _qqId:string;
    // public imgRecharge:eui.Image;
    // public imgInvite:eui.Image;
    // public imgSign:eui.Image;
    // public imgAchieve:eui.Image;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = NoticePanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnCopy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCopy,this);
        // this.imgAchieve.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
        // this.imgInvite.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
        // this.imgRecharge.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
        // this.imgSign.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);

        if(ExternalUtil.inst.getIsYYB())
        {
            this.btnCopy.visible = false;
            this.lblQ.visible = false;
            this.btnClose.x = 182;
        }
    }

    public initData(): void
    {
        this.lblDesc.text = Config.NoticeData[1]["circle_jade"];
        this._qqId = Config.NoticeData[1]["qq_id"];
        this.lblQ.text = "QQ群：" + this._qqId;
        this.lblQ.textColor = 0x109A75;
        var textArr:any[] = [];
        for(var i in Config.NoticeData)
        {
            var noticeData:any = Config.NoticeData[i];
            var text:string = noticeData["circle_jade"];
            var color:string = "0x" + noticeData["title"];
            var size:number = parseInt(noticeData["size"]);
            textArr.push({text:text + "\n",style: { "textColor": color,"size": size }});
        }
        this.lblDesc.textFlow = <Array<egret.ITextElement>>textArr;
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("NoticePanel");
    }

    private onCopy():void
    {
        prompt("复制QQ群：", this._qqId);
    }

    /*private onGo(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.imgSign)
        {
            PanelManager.inst.showPanel("ActivePanel");
        }
        else if(e.currentTarget == this.imgRecharge)
        {
            if(UserProxy.inst.rechargeFlag == 2)
            {
                PanelManager.inst.showPanel("DailyAchievePanel",1);
            }
            else
            {
                PanelManager.inst.showPanel("FirstRechargePanel");
            }

        }
        else if(e.currentTarget == this.imgInvite)
        {
            PanelManager.inst.showPanel("FriendMainPanel",1);
        }
        else
        {
            PanelManager.inst.showPanel("DailyAchievePanel",2);
        }

        this.onClose();

    }*/

    public destory():void
    {
        super.destory();
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnCopy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onCopy,this);
        // this.imgAchieve.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
        // this.imgInvite.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
        // this.imgRecharge.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
        // this.imgSign.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
    }


}