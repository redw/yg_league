/**
 * Created by Administrator on 12/12 0012.
 */
class SevenDayRenderer extends eui.ItemRenderer
{
    public lblName:eui.Label;
    public btnGet:eui.Button;
    public imgGot:eui.Image;
    public btnGo:eui.Button;
    public awardIcon:WeaponIcon;
    public lblNum:eui.Label;
    public lblTimes:eui.Label;

    public constructor()
    {
        super();
        this.skinName = SevenDayRendererSkin;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        Http.inst.addCmdListener(CmdID.ACTIVITY,this.onActivityBack,this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGetReward,this);
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.ACTIVITY,this.onActivityBack,this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGetReward,this);
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
    }

    private onActivityBack(e:egret.Event):void
    {
        if(e.data["id"] == this.data)
        {
            this.dataChanged();
        }

    }

    public onGetReward():void
    {
        Http.inst.send(CmdID.ACTIVITY,{type:1,id:this.data});
    }

    private onGo(e:egret.Event):void
    {
        var type:number = parseInt(e.currentTarget["id"]);
        UserMethod.inst.sevenDayGo(type);
    }

    public dataChanged(): void
    {
        super.dataChanged();
        var sevenDayData:any = Config.SevenDayData[this.data];
        this.lblName.text = sevenDayData["name"];
        if(parseInt(sevenDayData["task_type"]) == 1 && ExternalUtil.inst.getIsYYB())
        {
            this.lblName.text = this.lblName.text.replace("邀请好友","领取在线奖励");

        }

        var reward:any[] = sevenDayData["reward_1"];
        var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
        this.awardIcon.imageIcon.source = rewardData.icon;
        this.lblNum.text = "x" + MathUtil.easyNumber(reward[2]);
        if(rewardData.id == 2)
        {
            this.lblNum.text = "x" + MathUtil.easyNumber(reward[2]) + "小时";
        }
        this.awardIcon.touchReward = reward;
        if(rewardData.id == 6 || rewardData.id == 7)
        {
            var heroData:any = UserProxy.inst.heroData.getHeroData(reward[1]);
            var quality:string = heroData.config.quality;
            this.awardIcon.qualityBg = quality;
            if(rewardData.id == 6)
            {
                this.awardIcon.imgIcon = Global.getChaIcon(reward[1]);
            }
            else
            {
                this.awardIcon.imgIcon = Global.getChaChipIcon(reward[1]);

            }
        }
        else if(rewardData.id >= 17 && rewardData.id <= 21)
        {
            this.lblNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
            this.awardIcon.imgIcon = rewardData.icon;
        }
        else if(rewardData.id == 5)
        {
            this.lblNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
            this.awardIcon.imgIcon = rewardData.icon;
        }
        else
        {
            this.awardIcon.imgIcon = rewardData.icon;
        }


        this.imgGot.visible = false;
        this.btnGet.visible = true;

        var endValue: number = sevenDayData["task_num"];
        var nowValue:number = UserMethod.inst.sevenDayFinish(sevenDayData);
        // if(UserMethod.inst.activeDay() >= sevenDayData["day"])
        // {

        if(nowValue < endValue)
        {
            this.btnGet.visible = false;
            this.btnGo.visible = true;
            this.btnGo["id"] = sevenDayData["task_type"];
        }
        else
        {
            this.btnGo.visible = false;
            this.btnGet.enabled = true;
        }
        this.lblTimes.visible = true;
        this.lblTimes.x = 80 + this.lblName.width;
        this.lblTimes.text = "(" + nowValue + "/" + endValue + ")";
        // }

        //状态
        if(UserMethod.inst.isBitGet(Number(sevenDayData["id"]),UserProxy.inst.sevenDayBit))
        {
            this.btnGet.visible = false;
            this.imgGot.visible = true;
            this.btnGo.visible = false;
            this.lblTimes.visible = false;
        }
    }
}