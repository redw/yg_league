/**
 * Created by Administrator on 1/25 0025.
 */
class ActLimitDrawRenderer extends eui.ItemRenderer
{
    public lblDesc:eui.Label;
    public lblDown:eui.Label;
    public btnGet:eui.Button;
    public imgGot:eui.Image;

    public constructor()
    {
        super();
        this.skinName = ActLimitRechargeRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        Http.inst.addCmdListener(CmdID.ACTIVITY,this.dataChanged,this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
    }

    private onHide(event: egret.Event): void
    {
        Http.inst.removeCmdListener(CmdID.ACTIVITY,this.dataChanged,this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
    }

    private onGet():void
    {
        Http.inst.send(CmdID.ACTIVITY,{type:3,id:this.data});
    }

    public dataChanged(): void
    {
        super.dataChanged();

        var addBuyData:any = Config.ActAddBuyData[this.data];
        this.lblDesc.text = "累计充值" + addBuyData["condition"] + "元";
        this.lblDown.visible = false;

        for(var i:number = 1;i < 5; i++)
        {
            var awardGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"awardGroup" + i);
            if(addBuyData["reward_" + i])
            {
                awardGroup.visible = true;
                var reward:any[] = addBuyData["reward_" + i];

                var awardIcon:WeaponIcon = <WeaponIcon>DisplayUtil.getChildByName(awardGroup,"awardIcon");
                var awardNum:eui.Label = <eui.Label>DisplayUtil.getChildByName(awardGroup,"awardNum");
                var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
                awardIcon.imageIcon.source = rewardData.icon;
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

        var rmbInfo:any = UserProxy.inst.activityObj[102];
        if(UserMethod.inst.isBitGet(this.data,rmbInfo["rmbActBit"]))
        {
            this.imgGot.visible = true;
            this.btnGet.visible = false;
            this.lblDown.visible = true;
            this.lblDown.x = this.lblDesc.width + 19;
        }
        else
        {
            this.imgGot.visible = false;
            this.btnGet.visible = true;
            if(rmbInfo["rmbAct"] >= parseInt(addBuyData["condition"]))
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