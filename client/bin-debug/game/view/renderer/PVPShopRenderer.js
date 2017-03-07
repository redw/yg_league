/**
 * Created by Administrator on 12/25 0025.
 */
var PVPShopRenderer = (function (_super) {
    __extends(PVPShopRenderer, _super);
    function PVPShopRenderer() {
        _super.call(this);
        this.skinName = PVPShopRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=PVPShopRenderer,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.PVP_SHOP_BUY, this.buyBack, this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.PVP_SHOP_BUY, this.buyBack, this);
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
    };
    p.buyBack = function (e) {
        UserMethod.inst.showAward(e.data);
        UserProxy.inst.pvpShopObj = e.data["pvpShopObj"];
        EventManager.inst.dispatch(ContextEvent.PVP_SHOP_BUY);
        this.dataChanged();
    };
    p.onBuy = function () {
        if (UserProxy.inst.pvpShopObj["pvpCoin"] < this._price) {
            Notice.show("竞技币不够！");
            return;
        }
        Http.inst.send(CmdID.PVP_SHOP_BUY, { idx: this.data });
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var shopInfo = UserProxy.inst.pvpShopObj["pvpShop"][this.data];
        var id = shopInfo["id"];
        var itemData = Config.PVPShopData[id];
        this.btnBuy.label = itemData["price"];
        this.btnBuy.extraLabel = "购 买";
        this._price = parseInt(itemData["price"]);
        var reward = itemData["reward_1"];
        var rewardData = UserMethod.inst.rewardJs[reward[0]];
        this.lblDesc.text = rewardData.Disc;
        this.lblName.text = rewardData.name;
        this.weaponIcon.touchReward = reward;
        this.lblName.text = rewardData.name;
        this.lblNum.text = "x" + MathUtil.easyNumber(reward[2]);
        if (rewardData.id == 6 || rewardData.id == 7) {
            var heroData = UserProxy.inst.heroData.getHeroData(reward[1]);
            var quality = heroData.config.quality;
            this.weaponIcon.qualityBg = quality;
            if (rewardData.id == 6) {
                this.weaponIcon.imgIcon = Global.getChaIcon(reward[1]);
                this.lblName.text = heroData.config.name;
            }
            else {
                this.weaponIcon.imgIcon = Global.getChaChipIcon(reward[1]);
                this.lblName.text = heroData.config.name + "元神";
            }
        }
        else if (rewardData.id >= 17 && rewardData.id <= 21) {
            this.lblNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
            this.weaponIcon.imgIcon = rewardData.icon;
        }
        else if (rewardData.id == 5) {
            this.lblNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
            this.weaponIcon.imgIcon = rewardData.icon;
        }
        else {
            this.weaponIcon.imgIcon = rewardData.icon;
        }
        this.imgGot.visible = !!shopInfo["state"];
        this.btnBuy.visible = !shopInfo["state"];
        this.btnBuy.coinType = "reward_23_s_png";
    };
    return PVPShopRenderer;
}(eui.ItemRenderer));
egret.registerClass(PVPShopRenderer,'PVPShopRenderer');
//# sourceMappingURL=PVPShopRenderer.js.map