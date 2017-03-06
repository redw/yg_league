/**
 * Created by Administrator on 12/9 0009.
 */
class ActiveSign extends eui.Component
{
    public btnSign:eui.Button;
    public _signDay:number;

    public constructor()
    {
        super();
        this.skinName = ActiveSignSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnSign.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSign,this);
        Http.inst.addCmdListener(CmdID.SIGN_IN,this.signBack,this);

        this.continueSign();
        this.showInfo();
    }

    private onHide(event:egret.Event):void
    {
        this.btnSign.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSign,this);
        Http.inst.removeCmdListener(CmdID.SIGN_IN,this.signBack,this);
    }

    private signBack(e:egret.Event):void
    {
        UserMethod.inst.showAward(e.data);
        this.btnSign.enabled = false;
        this.btnSign.label = "已签到";
        var data:any = e.data;
        UserProxy.inst.signDays = data["signObj"]["signDays"];
        UserProxy.inst.todayFlag = data["signObj"]["todayFlag"];
        UserProxy.inst.lastSignTime = data["signObj"]["lastSignTime"];
        this.continueSign();
        this.showInfo();
        this.signToday( UserProxy.inst.signDays);
        TopPanel.inst.showPoint(11,1);
        ActivePanel.inst.checkPoint(1);

    }

    private showInfo():void
    {
        for(var i:number = 1; i < 8;i++)
        {
            var dayGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"dayGroup" + i);
            var name:eui.Label = <eui.Label>DisplayUtil.getChildByName(dayGroup,"name");
            var icon:WeaponIcon = <WeaponIcon>DisplayUtil.getChildByName(dayGroup,"icon");
            var awardNum:eui.Label = <eui.Label>DisplayUtil.getChildByName(dayGroup,"awardNum");
            var mask:eui.Image = <eui.Image>DisplayUtil.getChildByName(dayGroup,"mask");
            var imgGot:eui.Image = <eui.Image>DisplayUtil.getChildByName(dayGroup,"imgGot");
            var imgDouble:AutoBitmap = <AutoBitmap>DisplayUtil.getChildByName(dayGroup,"imgDouble");

            var signData:any = Config.DailySigninData[i];
            var typeStr:string = this.doubleType(parseInt(signData["double_condition"]));
            if(typeStr)
            {
                imgDouble.visible = true;
                imgDouble.source = typeStr;
            }
            else
            {
                imgDouble.visible = false;
            }

            var reward:any[] = signData["reward_1"].concat();
            var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
            icon.touchReward = reward;
            name.text = rewardData.name;
            awardNum.text = "x" + MathUtil.easyNumber(reward[2]);
            if(rewardData.id == 6 || rewardData.id == 7)
            {
                var heroData:any = UserProxy.inst.heroData.getHeroData(reward[1]);
                var quality:string = heroData.config.quality;
                icon.qualityBg = quality;
                if(rewardData.id == 6)
                {
                    icon.imgIcon = Global.getChaIcon(reward[1]);
                    name.text = heroData.config.name;
                }
                else
                {
                    icon.imgIcon = Global.getChaChipIcon(reward[1]);
                    name.text = heroData.config.name + "元神";
                }
            }
            else if(rewardData.id >= 17 && rewardData.id <= 21)
            {
                awardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
                icon.imgIcon = rewardData.icon;
            }
            else if(rewardData.id == 5)
            {
                awardNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
                icon.imgIcon = rewardData.icon;
            }
            else
            {
                icon.imgIcon = rewardData.icon;
            }

            if(this._signDay >= i)
            {
                imgGot.visible = true;
                mask.visible = true;
            }
            else
            {
                imgGot.visible = false;
                mask.visible = false;
            }
        }

        if(UserProxy.inst.todayFlag)
        {
            this.btnSign.enabled = false;
            this.btnSign.label = "已签到";
        }
    }

    private signToday(day:number):void
    {
        var dayGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"dayGroup" + day);
        var mask:eui.Image = <eui.Image>DisplayUtil.getChildByName(dayGroup,"mask");
        var imgGot:eui.Image = <eui.Image>DisplayUtil.getChildByName(dayGroup,"imgGot");
        imgGot.y = imgGot.y + 20;
        imgGot.visible = true;
        imgGot.scaleX = 3;
        imgGot.scaleY = 3;
        egret.Tween.get(imgGot).to({scaleX:1,scaleY:1,y:imgGot.y - 20},300,egret.Ease.circIn).call(function(){mask.visible = true;});
    }

    private doubleType(type:number):string
    {
        var imgStr:string;
        switch (type)
        {
            case 0:imgStr = null;break;
            case 1:imgStr = "s_first_double_png";break;
            case 2:imgStr = "s_lifetime_double_png";break;
            case 3:imgStr = "s_month_double_png";break;
        }
        return imgStr;
    }


    private continueSign():void
    {

        var time:Date = new Date();
        time.setTime(UserProxy.inst.lastSignTime*1000);
        time.setHours(23);
        time.setMinutes(59);
        time.setSeconds(59);
        var lastDay: number = Math.floor(time.valueOf() / 1000 ) + 1;

        var nowTime:Date = new Date();
        nowTime.setTime(UserProxy.inst.server_time*1000);
        nowTime.setHours(23);
        nowTime.setMinutes(59);
        nowTime.setSeconds(59);
        var today: number = Math.floor(nowTime.valueOf() / 1000 ) + 1;

        var duringSign:number = Math.floor((today - lastDay)/86400);

        this._signDay = UserProxy.inst.signDays;
        if(!UserProxy.inst.todayFlag)
        {
            //判断签到天数
            if(UserProxy.inst.signDays == 7)
            {
                this._signDay = 0;
            }
            else if(duringSign > 1)
            {
                this._signDay = 0;
            }
        }
    }

    private onSign():void
    {
        Http.inst.send(CmdID.SIGN_IN);
    }


}