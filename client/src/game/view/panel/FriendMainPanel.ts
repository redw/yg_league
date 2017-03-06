/**
 * Created by Administrator on 12/13 0013.
 */

class FriendMainPanel extends BasePanel
{
    public btnShare:SimpleButton;
    public btnInvite:SimpleButton;
    public btnSend:SimpleButton;
    public btnApply:SimpleButton;
    public imgSelect:eui.Image;
    public btnClose:SimpleButton;
    public contentGroup:eui.Group;

    public _lastBtn:SimpleButton;
    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = FriendMainPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnInvite.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnSend.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnApply.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        EventManager.inst.addEventListener(ContextEvent.FRIEND_POINT,this.checkPoint,this);
    }

    public initData(): void
    {
        Http.inst.addCmdListener(CmdID.INVITE_PRICE,this.checkMainPoint,this);
        switch (this.data)
        {
            case 1:this.btnShare.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);break;
            case 2:this.btnInvite.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);break;
            case 3:this.btnSend.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);break;
            case 4:this.btnApply.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);break;
        }

        if(ExternalUtil.inst.getIsYYB())
        {
            this.btnInvite.visible = false;
            this.btnShare.x = 97;
            this.btnSend.x = 197;
            this.btnApply.x = 297;
        }
        else
        {
            this.checkMainPoint();
        }

    }

    public checkMainPoint():void
    {
        UserMethod.inst.removeRedPoint(this.btnShare.parent,"share");
        if(UserMethod.inst._shareShowPoint)
        {
            UserMethod.inst.addRedPoint(this.btnShare.parent,"share",new egret.Point(this.btnShare.x + 70,this.btnShare.y + 18));
        }

        UserMethod.inst.removeRedPoint(this.btnInvite.parent,"invite");
        if(!ExternalUtil.inst.getIsYYB())
        {
            if(UserMethod.inst._invitePoint)
            {
                UserMethod.inst.addRedPoint(this.btnInvite.parent,"invite",new egret.Point(this.btnInvite.x + 70,this.btnInvite.y + 18));
            }
        }
    }

    private onTouch(e:egret.TouchEvent):void
    {
        var touchBtn:SimpleButton = e.currentTarget;
        if(this._lastBtn)
        {
            if(this._lastBtn == touchBtn)
            {
                return;
            }
            this.removeOldPanel();
        }

        this._lastBtn = touchBtn;
        var layer:eui.Component;

        switch (touchBtn)
        {
            case this.btnShare:
                this.imgSelect.x = 47;

                if(ExternalUtil.inst.getIsYYB())
                {
                    this.imgSelect.x = 97;
                }

                layer = new FriendShare();

                break;
            case this.btnInvite:
                this.imgSelect.x = 147;

                layer = new FriendInvite();
                break;
            case this.btnSend:
                this.imgSelect.x = 247;
                if(ExternalUtil.inst.getIsYYB())
                {
                    this.imgSelect.x = 197;
                }
                layer = new FriendSendTogether();
                EventManager.inst.dispatch(ContextEvent.FRIEND_POINT,"closeFriendPoint");
                break;
            case this.btnApply:
                this.imgSelect.x = 347;
                if(ExternalUtil.inst.getIsYYB())
                {
                    this.imgSelect.x = 297;
                }
                layer = new FriendApply();
                break;
        }

        layer.name = "layer";
        this.contentGroup.addChild(layer);

    }

    private removeOldPanel():void
    {
        var layer:eui.Component = <eui.Component>DisplayUtil.getChildByName(this.contentGroup,"layer");
        if(layer)
        {
            DisplayUtil.removeFromParent(layer);
        }

    }

    private checkPoint(e:egret.Event):void
    {
        switch (e.data)
        {
            case "showFriendPoint":
                UserMethod.inst.addRedPoint(this,"friend",new egret.Point(261,125));
                break;
            case "closeFriendPoint":
                UserMethod.inst.removeRedPoint(this,"friend");
                break;
        }

    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("FriendMainPanel");
    }

    public destory():void
    {
        super.destory();
        Http.inst.removeCmdListener(CmdID.INVITE_PRICE,this.checkMainPoint,this);
        EventManager.inst.removeEventListener(ContextEvent.FRIEND_POINT,this.checkPoint,this);
        this.btnShare.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnInvite.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnSend.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnApply.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        TopPanel.inst.showPoint(12);
    }

}
