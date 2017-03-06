/**
 * Created by Administrator on 1/19 0019.
 */
class FriendFindInfo extends BasePanel
{
    public btnClose:SimpleButton;
    public btnAdd:eui.Button;
    public lblUID:eui.Label;
    public lblName:eui.Label;
    public imgHead:AutoBitmap;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = FriendFindInfoSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        Http.inst.addCmdListener(CmdID.ADD_FRIEND,this.addBack,this);
    }

    public initData():void
    {
        var data:any = this.data;
        this.lblName.text = StringUtil.decodeName(data["nickname"]);
        this.lblUID.text = "UID：" + data["fuid"];
        this.imgHead.source = UserMethod.inst.getHeadImg(data["headimgurl"]);
    }

    private addBack(e:egret.Event):void
    {
        if(e.data["msg"])
        {
            Notice.show("申请成功！");
            this.onClose();
        }
    }

    public onAdd():void
    {
        Http.inst.send(CmdID.ADD_FRIEND,{fuid:this.data["fuid"]});
    }

    public onClose():void
    {
        PanelManager.inst.hidePanel("FriendFindInfo");
    }

    public destory():void
    {
        super.destory();
        this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        Http.inst.removeCmdListener(CmdID.ADD_FRIEND,this.addBack,this);
    }
}