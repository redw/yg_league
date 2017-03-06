/**
 * Created by Administrator on 1/17 0017.
 */
class DeleteFriendPanel extends BasePanel
{

    private lblName:eui.Label;
    private imgHead:AutoBitmap;
    private lblLuck:eui.Label;
    private lblLevel:eui.Label;
    private btnDelete:eui.Button;
    private btnClose:eui.Button;
    private _uid:number;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = DeleteFriendPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        this.btnDelete.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDelete,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }

    public initData():void
    {
        var userInfos:any = UserProxy.inst.userInfos[this.data];
        var friendInfo:any = UserProxy.inst.friendList[this.data];
        this._uid = this.data;

        this.lblName.text = StringUtil.decodeName(userInfos["nickname"]);
        this.lblLevel.text = "最高关数：" + userInfos["historyArea"];
        this.lblLuck.text = "缘分：" + friendInfo["friendPoint"];
        if(userInfos["headimgurl"])
        {
            this.imgHead.source = UserMethod.inst.getHeadImg(userInfos["headimgurl"]);
        }
    }

    private onDelete():void
    {
        Http.inst.send(CmdID.DELETE_FRIEND,{fuid:this.data});
        this.onClose();
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("DeleteFriendPanel");
    }

    public destory():void
    {
        super.destory();
        this.btnDelete.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDelete,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }
}