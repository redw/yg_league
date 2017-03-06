/**
 * Created by Administrator on 12/9 0009.
 */
class ActiveGift extends eui.Component
{
    public btnSure:eui.Button;
    public editText:eui.EditableText;

    public constructor()
    {
        super();
        this.skinName = ActiveGiftSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        Http.inst.addCmdListener(CmdID.GIFT_CODE,this.cmdBack,this);
        this.btnSure.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSure,this);
    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.GIFT_CODE,this.cmdBack,this);
        this.btnSure.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSure,this);
    }

    private cmdBack(e:egret.Event):void
    {
        UserMethod.inst.showAward(e.data);
    }


    private onSure():void
    {
        Http.inst.send(CmdID.GIFT_CODE,{code:this.editText.text});
    }


}