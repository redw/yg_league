/**
 * Created by Administrator on 12/14 0014.
 */
class FriendApply extends eui.Component
{
    public applyList:eui.List;
    public lblNoApply:eui.Label;
    public btnAdd:SimpleButton;
    public btnMy:SimpleButton;
    public btnCity:SimpleButton;

    public constructor()
    {
        super();
        this.skinName = FriendApplySkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        Http.inst.addCmdListener(CmdID.ANSWER_FRIEND,this.answerFriendBack,this);
        this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);
        this.btnMy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMy,this);
        this.btnCity.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCity,this);

        this.applyList.itemRenderer = FriendApplyRenderer;
        this.showList();

        if(ExternalUtil.inst.getIsHT())
        {
            this.btnCity.visible = false;
            this.btnAdd.x = 231;
            this.btnMy.x = 60;
        }

        if(ExternalUtil.inst.getIsYYB())
        {
            this.lblNoApply.text = "木有人加你哟，快去添加几个好友吧！";
            this.btnCity.visible = false;
            this.btnAdd.x = 231;
            this.btnMy.x = 60;
        }
    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.ANSWER_FRIEND,this.answerFriendBack,this);
        this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);
        this.btnMy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMy,this);
        this.btnCity.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onCity,this);
    }

    private answerFriendBack(e:egret.Event):void
    {
        UserProxy.inst.newMsg = e.data["newMsg"];
        if(e.data["type"] == 1)
        {
            //好友
            EventManager.inst.dispatch(ContextEvent.FRIEND_POINT,"showFriendPoint");
        }
        this.showList();
    }

    private onAdd():void
    {
        PanelManager.inst.showPanel("FriendAddUID");
    }

    private onMy():void
    {
        ExternalUtil.inst.copyUID();
    }

    private onCity():void
    {
        if(ExternalUtil.inst.getIsYYB())
        {
            prompt("复制QQ群：", Config.NoticeData[1]["qq_id"]);
        }
        else
        {
            ExternalUtil.inst.joinChatRoom();
        }


    }


    private showList():void
    {

       var ids:number[] = [];
       for(var i in UserProxy.inst.newMsg)
       {
           ids.push(parseInt(i));
       }

       this.lblNoApply.visible = ids.length == 0;

        this.applyList.dataProvider = new eui.ArrayCollection(ids);
    }



}