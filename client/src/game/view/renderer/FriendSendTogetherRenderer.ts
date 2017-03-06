/**
 * Created by Administrator on 12/14 0014.
 */
class FriendSendTogetherRenderer extends eui.ItemRenderer
{
    public lblName:eui.Label;
    public lblLuck:eui.Label;
    public lblLevel:eui.Label;
    public lblLeaveTime:eui.Label;
    public imgPower:AutoBitmap;
    public imgHead:AutoBitmap;
    public contentGroup:eui.Group;
    public imgLove:eui.Image;

    private _uid:number;

    public constructor()
    {
        super();
        this.skinName = FriendSendTogetherRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        Http.inst.addCmdListener(CmdID.GET_ONE,this.dataChanged,this);

        this.imgPower.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onEnergy,this);
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDelete,this);
    }

    private onHide(event: egret.Event): void
    {
        Http.inst.removeCmdListener(CmdID.GET_ONE,this.dataChanged,this);
        this.imgPower.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onEnergy,this);
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDelete,this);
    }

    private onGift(): void
    {
        PanelManager.inst.showPanel("FriendGiftPanel",this._uid);
    }

    private onEnergy(e:egret.Event):void
    {
       // Http.inst.send(CmdID.GET_ONE,{fuid:this._uid});
        Http.inst.send(CmdID.ONE_KEY);
    }

    private onDelete(e:egret.Event):void
    {
        PanelManager.inst.showPanel("DeleteFriendPanel",this._uid);
    }

    public dataChanged(): void
    {
        super.dataChanged();
        this.imgPower.touchEnabled = false;
        var userInfos:any = UserProxy.inst.userInfos[this.data];
        var friendInfo:any = UserProxy.inst.friendList[this.data];
        this._uid = this.data;

        if(userInfos)
        {
            this.contentGroup.visible = true;
            this.lblName.text = StringUtil.decodeName(userInfos["nickname"]);
            this.lblLevel.text = "最高关数：" + userInfos["historyArea"];
            this.lblLuck.text = "缘分：" + friendInfo["friendPoint"];
            this.showLeaveTimes(userInfos["lastKeepLive"]);
            this.imgLove.visible = friendInfo["isnew"] == 1;
            if(userInfos["headimgurl"])
            {
                this.imgHead.source = UserMethod.inst.getHeadImg(userInfos["headimgurl"]);
            }
        }
        else
        {
            this.contentGroup.visible = false;
        }


        /**getState  好友有没有送*/
        /**giveState 我有没有送*/
        /**isget     我有没有领取*/

        if(friendInfo["giveState"])
        {
            if(friendInfo["getState"] && friendInfo["isget"])
            {
                this.imgPower.source = "friend_power_over_png";
            }
            else if(friendInfo["getState"])
            {
                this.imgPower.source = "friend_power_add_png";
                // this.imgPower.touchEnabled = true;
            }
            else
            {
                this.imgPower.source = "friend_no_power_png";
            }
        }
        else
        {
            this.imgPower.source = "friend_power_send_png";
        }
    }


    private showLeaveTimes(time:number):void
    {
        var distanceTime:number = UserProxy.inst.server_time - time;
        var day:number = Math.floor(distanceTime / 3600 / 24);
        var hour: number = Math.floor(distanceTime / 3600);

        if(hour < 24)
        {
            if(hour < 1)
            {
                this.lblLeaveTime.text = "上次在线：刚刚";
            }
            else
            {
                this.lblLeaveTime.text = "上次在线：" + hour + "小时前";
            }
        }
        else
        {
            if(day < 7)
            {
                this.lblLeaveTime.text = "上次在线：" + day + "天前";
            }
            else
            {
                if(day >= 7 && day < 14)
                {
                    this.lblLeaveTime.text = "上次在线：1周前";
                }
                else if(day >= 14 && day < 21)
                {
                    this.lblLeaveTime.text = "上次在线：2周前";
                }
                else if(day >= 21 && day < 28)
                {
                    this.lblLeaveTime.text = "上次在线：3周前";
                }
                else
                {
                    this.lblLeaveTime.text = "上次在线：1月前";
                }
            }
        }




    }
}