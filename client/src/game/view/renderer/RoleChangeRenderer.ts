/**
 * Created by Administrator on 2/8 0008.
 */
class RoleChangeRenderer extends eui.ItemRenderer
{
    private imgIcon:AutoBitmap;
    private lblName:eui.Label;
    private lblHadNum:eui.Label;
    private lblType:eui.Label;
    private lblTypeNum:eui.Label;
    private btnChange:YellowTwoCoinBtn;
    private imgType:AutoBitmap;

    public constructor()
    {
        super();
        this.skinName = RoleChangeRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnChange.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);
        Http.inst.addCmdListener(CmdID.EXCHANGE,this.dataChanged,this);
    }

    private onHide(event:egret.Event):void
    {
        this.btnChange.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);
        Http.inst.removeCmdListener(CmdID.EXCHANGE,this.dataChanged,this);
    }

    private onChange():void
    {
        Http.inst.send(CmdID.EXCHANGE,{type:UserMethod.inst.sell_change,id:this.data});
    }

    public dataChanged(): void
    {
        super.dataChanged();

        this.btnChange.imageType.y = 14;
        this.btnChange.labelDisplay.y = 22;
        this.btnChange.labelDisplay.visible = true;
        this.btnChange.imageType.visible = true;
        this.btnChange.imageType1.visible = false;
        this.btnChange.labelDisplay1.visible = false;

        if(UserMethod.inst.sell_change == 1)
        {
            var sellData:any = Config.DrawShopSellData[this.data];

            if(this.data > 100)
            {
                this.imgIcon.source = Global.getChaIcon(this.data);
                var roleData:HeroVO = UserProxy.inst.heroData.getHeroData(this.data);
                this.lblName.text = "回收" + roleData.config.name + "元神";
                this.lblHadNum.x = 90 + this.lblName.width ;
                this.lblHadNum.text = "（拥有" + roleData.starPiece + "）";

                this.lblType.text = "获得：";
                var rewardData:RewardData = UserMethod.inst.rewardJs[sellData["reward_1"][0]];
                this.lblTypeNum.text = sellData["reward_1"][2];
                this.imgType.source = rewardData.icon_s;

                this.btnChange.label = sellData["sell_num"];
                this.btnChange.type = Global.getChaChipIcon(this.data);

                this.btnChange.enabled =  roleData.starPiece >= parseInt(sellData["sell_num"]);
            }
            else
            {
                this.imgIcon.source = "reward_22_png";
                this.lblName.text = "回收升星丹";
                this.lblHadNum.x = 90 + this.lblName.width ;
                this.lblHadNum.text = "（拥有" + UserProxy.inst.pill + "）";

                this.lblType.text = "获得：";
                var rewardData:RewardData = UserMethod.inst.rewardJs[sellData["reward_1"][0]];
                this.lblTypeNum.text = sellData["reward_1"][2];
                this.imgType.source = rewardData.icon_s;

                this.btnChange.label = sellData["sell_num"];
                this.btnChange.type = "reward_22_s_png";

                this.btnChange.enabled =  UserProxy.inst.pill >= parseInt(sellData["sell_num"]);
            }



        }
        else
        {
            var buyData:any = Config.DrawShopBuyData[this.data];
            this.lblHadNum.visible = false;
            if(this.data > 100)
            {
                this.imgIcon.source = Global.getChaIcon(this.data);
                var roleData:HeroVO = UserProxy.inst.heroData.getHeroData(this.data);
                this.lblName.text = "兑换" + roleData.config.name + "元神";
            }
            else
            {
                this.imgIcon.source = "reward_22_png";
                this.lblName.text = "兑换升星丹";
            }

            this.lblType.text = "获得：";
            var rewardData:RewardData = UserMethod.inst.rewardJs[buyData["reward_1"][0]];
            this.lblTypeNum.text =  buyData["reward_1"][2];

            if(rewardData.id == 7)
            {
                this.imgType.source = Global.getChaChipIcon(buyData["reward_1"][1]);
                this.lblTypeNum.text = buyData["reward_1"][2];
            }
            else
            {
                this.imgType.source = rewardData.icon_s;
            }

            this.btnChange.label = buyData["cost_num"];
            var costRewardId:number = 0;
            switch (parseInt(buyData["cost_type"]))
            {
                case 1:costRewardId = 25; break;
                case 2:costRewardId = 26; break;
                case 3:costRewardId = 27; break;
                case 4:costRewardId = 28; break;
            }
            var costReward:RewardData = UserMethod.inst.rewardJs[costRewardId];

            this.btnChange.type = costReward.icon_s;


            this.btnChange.enabled =  UserProxy.inst.soulCoin[parseInt(buyData["cost_type"]) - 1] >= parseInt(buyData["cost_num"]);
        }
    }

}