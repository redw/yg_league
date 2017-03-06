/**
 * Created by Administrator on 12/13 0013.
 */
class FriendInvite extends eui.Component
{
    public btnInvite:SimpleButton;
    public inviteList:eui.List;

    public constructor()
    {
        super();
        this.skinName = FriendInviteSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        // if(UserProxy.inst.server_time > UserMethod.inst.inviteTime + 30)
        // {
        //     UserMethod.inst.inviteTime = UserProxy.inst.server_time;
            Http.inst.send(CmdID.GET_INVITE_INFO,{hortor:ExternalUtil.inst.getIsHT()? 1 : 0});
        // }
        // else
        // {
        //     this.showList();
        // }

        Http.inst.addCmdListener(CmdID.GET_INVITE_INFO,this.showList,this);
        this.btnInvite.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onInvite,this);
        this.inviteList.itemRenderer = FriendInviteRenderer;
    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.GET_INVITE_INFO,this.showList,this);
        this.btnInvite.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onInvite,this);
    }


    private showList():void
    {
        var ids:number[] = [];
        var groupIds:any[] = [];
        for(var i in Config.InviteData)
        {
            if(ids.length == 3)
            {
                groupIds.push(ids);
                ids = [];
                ids.push(parseInt(i));
            }
            else
            {
                ids.push(parseInt(i));
            }
        }
        if(ids.length)
        {
            groupIds.push(ids);
        }
        this.inviteList.dataProvider = new eui.ArrayCollection(groupIds);
    }

    private onInvite():void
    {
        // Notice.show("敬请期待！");
        ShareUtils.share();
        // ShareUtil.share("poster_bg_png", new egret.Point(34, 12), new egret.Point(309, 628));
    }


}