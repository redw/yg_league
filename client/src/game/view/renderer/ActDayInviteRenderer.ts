/**
 * Created by Administrator on 12/23 0023.
 */
class ActDayInviteRenderer extends eui.ItemRenderer
{
    public lblName:eui.Label;
    public btnGet:eui.Button;
    public imgGot:eui.Image;
    public lblEnd:eui.Label;
    public lblNowInvite:eui.Label;
    public lblTitle:eui.Label;

    public constructor()
    {
        super();
        this.skinName = ActDayInviteRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        Http.inst.addCmdListener(CmdID.SHARE_PRICE,this.awardBack,this);
    }

    private onHide(event: egret.Event): void
    {
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        Http.inst.removeCmdListener(CmdID.SHARE_PRICE,this.awardBack,this);
    }

    private onGet():void
    {
        Http.inst.send(CmdID.SHARE_PRICE,{id:this.data});
    }

    private awardBack(e:egret.Event):void
    {
        this.dataChanged();
    }

    public dataChanged(): void
    {
        super.dataChanged();

        var dailyInviteData:any = Config.DailyInviteData[this.data];
        this.lblName.text = dailyInviteData["invite_days"] + "天";
        this.lblEnd.text = "/ " + dailyInviteData["invite_days"];
        this.lblNowInvite.text = UserProxy.inst.shareObj["shareCount"];
        if(ExternalUtil.inst.getIsYYB())
        {
            this.lblTitle.text = "累计在线";
        }
        else
        {
            this.lblTitle.text = "累计邀请";
        }

        for(var i:number = 1;i < 5; i++)
        {
            var awardGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"awardGroup" + i);
            if(dailyInviteData["reward_" + i])
            {
                awardGroup.visible = true;
                var reward:any[] = dailyInviteData["reward_" + i];

                var awardIcon:WeaponIcon = <WeaponIcon>DisplayUtil.getChildByName(awardGroup,"awardIcon");
                var awardNum:eui.Label = <eui.Label>DisplayUtil.getChildByName(awardGroup,"awardNum");
                var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];

                awardNum.text = "x" + MathUtil.easyNumber(reward[2]);
                awardIcon.touchReward = reward;

                if(rewardData.id == 6 || rewardData.id == 7)
                {
                    if(rewardData.id == 6)
                    {
                        awardIcon.imgIcon = Global.getChaIcon(reward[1]);
                    }
                    else
                    {
                        awardIcon.imgIcon = Global.getChaChipIcon(reward[1]);
                    }
                }
                else if(rewardData.id >= 9 && rewardData.id <= 13)
                {
                    awardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
                    awardIcon.imgIcon = rewardData.icon;
                }
                else if(rewardData.id == 5)
                {
                    awardNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
                    awardIcon.imgIcon = rewardData.icon;
                }
                else
                {
                    awardIcon.imgIcon = rewardData.icon;
                }
            }
            else
            {
                awardGroup.visible = false;
            }
        }

        if(UserMethod.inst.isBitGet(this.data,UserProxy.inst.shareObj["shareBit"]))
        {
            this.imgGot.visible = true;
            this.btnGet.visible = false;
        }
        else
        {
            this.imgGot.visible = false;
            this.btnGet.visible = true;
            if(UserProxy.inst.shareObj["shareCount"] >= parseInt(dailyInviteData["invite_days"]))
            {
                this.btnGet.enabled = true;
            }
            else
            {
                this.btnGet.enabled = false;
            }
        }

    }
}