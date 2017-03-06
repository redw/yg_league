/**
 * Created by Administrator on 12/14 0014.
 */
class FriendSendTogether extends eui.Component
{
    public lblGetTimes:eui.Label;
    public btnSendGet:eui.Button;
    public friendList:eui.List;

    private _lastVerticalScrollPos: number;
    public constructor()
    {
        super();
        this.skinName = FriendSendTogetherSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        Http.inst.addCmdListener(CmdID.DELETE_FRIEND,this.answerFriendBack,this);
        Http.inst.addCmdListener(CmdID.OPEN_FRIEND,this.openBack,this);
        Http.inst.addCmdListener(CmdID.ONE_KEY,this.sendGetBack,this);
        Http.inst.addCmdListener(CmdID.GET_ONE,this.sendGetBack,this);
        this.btnSendGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSendGet,this);
        this.friendList.itemRenderer = FriendSendTogetherRenderer;
        Http.inst.send(CmdID.OPEN_FRIEND);

    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.OPEN_FRIEND,this.openBack,this);
        Http.inst.removeCmdListener(CmdID.ONE_KEY,this.sendGetBack,this);
        Http.inst.removeCmdListener(CmdID.GET_ONE,this.sendGetBack,this);
        this.btnSendGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSendGet,this);
        Http.inst.removeCmdListener(CmdID.DELETE_FRIEND,this.answerFriendBack,this);
    }

    private openBack(e:egret.Event):void
    {
        UserProxy.inst.friendList = e.data["friendList"];
        UserProxy.inst.userInfos = e.data["userInfos"];
        this.showList();
    }

    private answerFriendBack(e:egret.Event):void
    {
        UserProxy.inst.friendList = e.data["friendList"];
        this.showList();
    }

    private sendGetBack(e:egret.Event):void
    {
        var data:any = e.data["friendObj"];
        // UserProxy.inst.friendCoin = data["friendCoin"];
        UserProxy.inst.friendList = data["friendList"];
        UserProxy.inst.friendTimes = data["friendTimes"];
        UserProxy.inst.getGiftTimes = data["getGiftTimes"];
        UserMethod.inst.showAward(e.data);
        this._lastVerticalScrollPos = this.friendList.scrollV;
        this.showList();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
    }

    private onEnterFrame(event: egret.Event): void
    {
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        this.friendList.scrollV = this._lastVerticalScrollPos;
    }


    private showList():void
    {
        this.lblGetTimes.text = "今日还能收取：" + UserProxy.inst.friendTimes + "/" + Config.BaseData[47]["value"];
        var ids:number[] = [];

        for (var i in UserProxy.inst.friendList)
        {
            ids.push(parseInt(i));
        }
        ids.sort(friendSort);

        function friendSort(a,b)
        {
            var friendInfo1:any = UserProxy.inst.friendList[a];
            var friendInfo2:any = UserProxy.inst.friendList[b];
            if(friendInfo1["friendPoint"] > friendInfo2["friendPoint"])
            {
                return 1;
            }
        }
        this.friendList.dataProvider = new eui.ArrayCollection(ids);
    }

    private onSendGet():void
    {
        Http.inst.send(CmdID.ONE_KEY);
    }


}