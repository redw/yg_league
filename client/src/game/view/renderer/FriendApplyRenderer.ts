/**
 * Created by Administrator on 12/14 0014.
 */
class FriendApplyRenderer extends eui.ItemRenderer
{
    public lblName:eui.Label;
    public btnNo:eui.Button;
    public btnYes:eui.Button;
    public imgIcon:AutoBitmap;

    public constructor()
    {
        super();
        this.skinName = FriendApplyRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        this.btnNo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnYes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    private onHide(event: egret.Event): void
    {
        this.btnNo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnYes.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    public onTouch(e:egret.TouchEvent):void
    {
        var type:number = 0;
        if(e.currentTarget == this.btnYes)
        {
            type = 1;
        }
        else
        {
            type = 2;
        }

        Http.inst.send(CmdID.ANSWER_FRIEND,{fuid:this.data,type:type});

    }

    public dataChanged(): void
    {
        super.dataChanged();

        var applyInfo:any = UserProxy.inst.newMsg[this.data];
        this.lblName.text = StringUtil.decodeName(applyInfo["nickname"]);
        // if(applyInfo["headimgurl"])
        // {
        //     this.imgIcon.source = applyInfo["headimgurl"];
        // }

    }
}