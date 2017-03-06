/**
 * Created by Administrator on 1/19 0019.
 */
class FriendAddUID extends BasePanel
{
    public btnFind:eui.Button;
    public editText:eui.EditableText;
    public btnClose:SimpleButton;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = FriendAddUIDSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnFind.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onFind,this);
        Http.inst.addCmdListener(CmdID.FIND_FRIEND,this.friendInfo,this);
    }

    public initData():void
    {

    }

    private friendInfo(e:egret.Event):void
    {
        if(e.data)
        {
            PanelManager.inst.showPanel("FriendFindInfo",e.data);
            this.onClose();
        }
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("FriendAddUID");
    }

    private onFind():void
    {
        Http.inst.send(CmdID.FIND_FRIEND,{fuid:this.editText.text});
    }

    public destory():void
    {
        super.destory();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        Http.inst.removeCmdListener(CmdID.FIND_FRIEND,this.friendInfo,this);
    }

}