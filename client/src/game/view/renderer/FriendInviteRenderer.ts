/**
 * Created by Administrator on 12/13 0013.
 */

class FriendInviteRenderer extends eui.ItemRenderer
{
    private contentGroup:eui.Group;
    public constructor()
    {
        super();
        this.skinName = FriendInviteRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        for(var i:number = 0 ;i < 3; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.contentGroup,"group" + i);
            group.visible = false;
            group.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGetInvite,this);
        }

        Http.inst.addCmdListener(CmdID.INVITE_PRICE,this.getInviteBack,this);
    }

    private onHide(event:egret.Event):void
    {
        for(var i:number = 0 ;i < 3; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.contentGroup,"group" + i);
            group.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGetInvite,this);
        }
        Http.inst.removeCmdListener(CmdID.INVITE_PRICE,this.getInviteBack,this);
    }

    private getInviteBack(e:egret.Event):void
    {
        this.dataChanged();
    }

    private onGetInvite(e:egret.TouchEvent):void
    {
        var id:number = e.currentTarget["id"];
        if(UserMethod.inst.isBitGet(id,UserProxy.inst.inviteObj["inviteBit"]))
        {
            return;
        }

        if(UserProxy.inst.inviteUserInfos)
        {
            var length = UserProxy.inst.inviteUserInfos.length;
            if(length >= id - 1)
            {
                Http.inst.send(CmdID.INVITE_PRICE,{id:id});
            }
            else
            {
                Notice.show("未满足条件！");
            }

        }

    }

    public dataChanged(): void
    {
        super.dataChanged();

        var dataLength:number = this.data.length;
        for(var i:number = 0 ;i < dataLength ; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.contentGroup,"group" + i);
            group.visible = true;
            group["id"] = this.data[i];
            var head:AutoBitmap = <AutoBitmap>DisplayUtil.getChildByName(group,"head");
            var type:AutoBitmap = <AutoBitmap>DisplayUtil.getChildByName(group,"type");
            var got:AutoBitmap = <AutoBitmap>DisplayUtil.getChildByName(group,"got");
            var awardNum:eui.Label = <eui.Label>DisplayUtil.getChildByName(group,"awardNum");
            var lblName:eui.Label = <eui.Label>DisplayUtil.getChildByName(group,"lblName");

            var inviteData:any = Config.InviteData[this.data[i]];
            var reward:any[] = inviteData["reward_1"].concat();
            var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
            awardNum.text = MathUtil.easyNumber(reward[2]);
            if(rewardData.id == 6 || rewardData.id == 7)
            {
                if(rewardData.id == 6)
                {
                    type.source = Global.getChaIcon(reward[1]);
                }
                else
                {
                    type.source = Global.getChaChipIcon(reward[1]);
                }
            }
            else if(rewardData.id >= 9 && rewardData.id <= 13)
            {
                awardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
                type.source = rewardData.icon;
            }
            else if(rewardData.id == 5)
            {
                awardNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
                type.source = rewardData.icon;
            }
            else
            {
                type.source = rewardData.icon;
            }
            head.source = "friend_none_invite_png";
            lblName.visible = false;
            if(UserProxy.inst.inviteUserInfos)
            {
                var length = UserProxy.inst.inviteUserInfos.length;
                if(this.data[i] - 1 <=  length)
                {
                    var userInfo:any = UserProxy.inst.inviteUserInfos[this.data[i] - 1];
                    if(userInfo)
                    {
                        lblName.visible = true;
                        lblName.text = StringUtil.decodeName(userInfo["nickname"]);

                        if(userInfo["headimgurl"])
                        {
                            head.source = UserMethod.inst.getHeadImg(userInfo["headimgurl"]);
                        }
                        else
                        {
                            head.source = "friend_invite_head_png";
                        }
                    }



                   /* var userInfo:any = UserProxy.inst.inviteUserInfos[this.data[i] - 1];
                    {
                        if(userInfo)
                        {
                            if(userInfo["headimgurl"])
                            {
                                head.source = userInfo["headimgurl"];
                            }
                            else
                            {

                            }
                        }
                    }*/
                }
            }


            if(UserMethod.inst.isBitGet(this.data[i],UserProxy.inst.inviteObj["inviteBit"]))
            {
                got.visible = true;
                group.touchEnabled = true;
            }
            else
            {
                got.visible = false;
                group.touchEnabled = false;
            }

        }
    }
}