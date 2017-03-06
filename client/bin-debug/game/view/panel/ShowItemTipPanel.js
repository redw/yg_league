/**
 * Created by Administrator on 1/11 0011.
 */
var ShowItemTipPanel = (function (_super) {
    __extends(ShowItemTipPanel, _super);
    function ShowItemTipPanel() {
        _super.call(this);
        this.skinName = ItemShowSkin;
        this._modal = true;
        this._layer = PanelManager.TOP_LAYER;
        this.verticalCenter = 0;
        this.horizontalCenter = 0;
    }
    var d = __define,c=ShowItemTipPanel,p=c.prototype;
    ShowItemTipPanel.show = function (rewardData) {
        PanelManager.inst.showPanel("ShowItemTipPanel", {
            rewardData: rewardData
        });
    };
    p.init = function () {
        this.btnSure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("ShowItemTipPanel");
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
        this._rewardData = this.data["rewardData"];
        var reward = this._rewardData.concat();
        var rewardData = UserMethod.inst.rewardJs[reward[0]];
        this.lblName.text = rewardData.TipsName;
        this.lblDesc.text = StringUtil.replaceDescribe(rewardData.TipsDisc);
        if (rewardData.id == 6 || rewardData.id == 7) {
            var heroData = UserProxy.inst.heroData.getHeroData(reward[1]);
            var quality = heroData.config.quality;
            this.icon.qualityBg = quality;
            if (rewardData.id == 6) {
                this.icon.imgIcon = Global.getChaIcon(reward[1]);
                this.lblName.text = heroData.config.name;
                this.lblDesc.text = heroData.config.weapon_disc;
            }
            else {
                this.icon.imgIcon = Global.getChaChipIcon(reward[1]);
                this.lblName.text = heroData.config.name + "元神";
                this.lblDesc.text = heroData.config.name + "元神,凑齐10枚可召唤" + heroData.config.name + "。\n元神还可用于" + heroData.config.name + "升星，升星后加成大量属性。";
            }
        }
        else if (rewardData.id == 8) {
            var weaponData = Config.WeaponData[reward[1]];
            this.lblName.text = weaponData["name"];
            var addNature1 = parseFloat(weaponData["attr_1"][2]);
            var addNature2 = 0;
            if (weaponData["attr_2"]) {
                addNature2 = parseFloat(weaponData["attr_2"][2]);
            }
            var dec1 = UserMethod.inst.getAddSting(weaponData["attr_1"], addNature1);
            var dec2 = "";
            if (addNature2) {
                dec2 = UserMethod.inst.getAddSting(weaponData["attr_2"], addNature2);
            }
            this.lblDesc.text = dec1 + "\n" + dec2;
        }
        else {
            this.icon.imgIcon = rewardData.icon;
        }
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    return ShowItemTipPanel;
}(BasePanel));
egret.registerClass(ShowItemTipPanel,'ShowItemTipPanel');
