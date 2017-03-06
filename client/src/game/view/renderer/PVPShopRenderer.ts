/**
 * Created by Administrator on 12/25 0025.
 */
class PVPShopRenderer extends eui.ItemRenderer
{
    public weaponIcon:WeaponIcon;
    public lblName:eui.Label;
    public lblDesc:eui.Label;
    public btnBuy:YellowCoinButton;
    public lblNum:eui.Label;
    public imgGot:eui.Image;

    private _price:number;

    public constructor()
    {
        super();
        this.skinName = PVPShopRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        Http.inst.addCmdListener(CmdID.PVP_SHOP_BUY,this.buyBack,this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
    }

    private onHide(event: egret.Event): void
    {
        Http.inst.removeCmdListener(CmdID.PVP_SHOP_BUY,this.buyBack,this);
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
    }

    private buyBack(e:egret.Event):void
    {
        UserMethod.inst.showAward(e.data);
        UserProxy.inst.pvpShopObj = e.data["pvpShopObj"];
        EventManager.inst.dispatch(ContextEvent.PVP_SHOP_BUY);
        this.dataChanged();
    }

    private onBuy():void
    {
        if(UserProxy.inst.pvpShopObj["pvpCoin"] < this._price)
        {
            Notice.show("竞技币不够！");
            return;
        }

        Http.inst.send(CmdID.PVP_SHOP_BUY,{idx:this.data});
    }

    public dataChanged(): void
    {
        super.dataChanged();
        var shopInfo:any = UserProxy.inst.pvpShopObj["pvpShop"][this.data];
        var id:number = shopInfo["id"];
        var itemData:any = Config.PVPShopData[id];
        this.btnBuy.label = itemData["price"];
        this.btnBuy.extraLabel = "购 买";
        this._price = parseInt(itemData["price"]);

        var reward:any[] = itemData["reward_1"];
        var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
        this.lblDesc.text = rewardData.Disc;
        this.lblName.text = rewardData.name;

        this.weaponIcon.touchReward = reward;
        this.lblName.text = rewardData.name;
        this.lblNum.text = "x" + MathUtil.easyNumber(reward[2]);
        if(rewardData.id == 6 || rewardData.id == 7)
        {
            var heroData:any = UserProxy.inst.heroData.getHeroData(reward[1]);
            var quality:string = heroData.config.quality;
            this.weaponIcon.qualityBg = quality;
            if(rewardData.id == 6)
            {
                this.weaponIcon.imgIcon = Global.getChaIcon(reward[1]);
                this.lblName.text = heroData.config.name;
            }
            else
            {
                this.weaponIcon.imgIcon = Global.getChaChipIcon(reward[1]);
                this.lblName.text = heroData.config.name + "元神";
            }
        }
        else if(rewardData.id >= 17 && rewardData.id <= 21)
        {
            this.lblNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
            this.weaponIcon.imgIcon = rewardData.icon;
        }
        else if(rewardData.id == 5)
        {
            this.lblNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
            this.weaponIcon.imgIcon = rewardData.icon;
        }
        else
        {
            this.weaponIcon.imgIcon = rewardData.icon;
        }

        this.imgGot.visible = !!shopInfo["state"];
        this.btnBuy.visible = !shopInfo["state"];
        this.btnBuy.coinType = "reward_23_s_png";

    }
}