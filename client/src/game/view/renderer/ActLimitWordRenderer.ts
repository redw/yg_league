/**
 * Created by Administrator on 1/25 0025.
 */
class ActLimitWordRenderer extends eui.ItemRenderer
{
    private imgType:AutoBitmap;
    private lblAwardNum:eui.Label;
    private btnGet:eui.Button;


    public constructor()
    {
        super();
        this.skinName = ActLimitWordRendererSkin;
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

    private onGet(): void
    {
        Http.inst.send(CmdID.ACTIVITY,{type:2,id:this.data});
    }

    public dataChanged(): void
    {
        super.dataChanged();
        var wordData:any = Config.ActWordData[this.data];
        this.showReward(wordData);

        for(var i: number = 0;i < 5 ;i++)
        {
            var group: eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            group.visible = false;
        }

        var enable:boolean[] = [];
        for(var i: number = 0;i < wordData["condition"].length;i++)
        {
            if(wordData["condition"][i])
            {
                var group: eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
                var word: AutoBitmap = <eui.Image>DisplayUtil.getChildByName(group,"word");
                var num: eui.Label = <eui.Label>DisplayUtil.getChildByName(group,"num");
                group.visible = true;
                word.source = "piece_" + wordData["condition"][i] + "_png";

               var wordInfo:any = UserProxy.inst.activityObj[101];
                if(wordInfo && wordInfo["collectWord"])
                {
                    var collectWord:number[] = UserProxy.inst.activityObj[101]["collectWord"].concat();

                    var count:number = collectWord[parseInt(wordData["condition"][i])-1];
                    num.text = "x" + count;
                    if(count > 0)
                    {
                        enable.push(true);
                    }
                    else
                    {
                        enable.push(false);
                    }
                }
                else
                {
                    num.text = "x0";
                    enable.push(false);
                }

            }
        }

        for(var j: number = 0;j < enable.length;j++)
        {
            if(!enable[j])
            {
                this.btnGet.enabled = false;
                return;
            }
        }
        this.btnGet.enabled = true;

    }

    private showReward(data:any):void
    {
        var rewardData:RewardData = UserMethod.inst.rewardJs[data["reward_1"][0]];
        this.lblAwardNum.text = rewardData.name + "x" + data["reward_1"][2];
        if(rewardData.id == 2)
        {
            this.lblAwardNum.text = rewardData.name + "x" + data["reward_1"][2] + "小时";
        }
        if(rewardData.id == 6 || rewardData.id == 7)
        {
            var heroData:any = UserProxy.inst.heroData.getHeroData(data["reward_1"][1]);
            if(rewardData.id == 6)
            {
                this.imgType.source = Global.getChaIcon(data["reward_1"][1]);
                this.lblAwardNum.text = heroData.config.name + "x" + data["reward_1"][2];;
            }
            else
            {
                this.imgType.source = Global.getChaChipIcon(data["reward_1"][1]);
                this.lblAwardNum.text = heroData.config.name + "元神" + "x" + data["reward_1"][2];
            }
        }
        else if(rewardData.id >= 17 && rewardData.id <= 21)
        {
            this.lblAwardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(data["reward_1"]);
            this.imgType.source = rewardData.icon_s;
        }
        else if(rewardData.id == 5)
        {
            this.lblAwardNum.text = "x" + UserMethod.inst.getStageJade(data["reward_1"][2]);
            this.imgType.source = rewardData.icon_s;
        }
        else
        {
            this.imgType.source = rewardData.icon_s;
        }
    }

}