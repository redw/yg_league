/**
 * Created by Administrator on 12/5 0005.
 */
var SecretAreaRenderer = (function (_super) {
    __extends(SecretAreaRenderer, _super);
    function SecretAreaRenderer() {
        _super.call(this);
        this.skinName = SecretAreaRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=SecretAreaRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnFight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFight, this);
    };
    p.onHide = function (event) {
        this.btnFight.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFight, this);
    };
    p.onFight = function (e) {
        PanelManager.inst.showPanel("RoleFormationPanel", { type: 2, id: this.data });
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var weaponFbData = Config.WeaponFb[this.data];
        this.lblName.text = weaponFbData["name"];
        UserMethod.inst.secret_id = this.data;
        var rewardId = parseInt(weaponFbData["reward_1"][0]);
        this.imgType.source = UserMethod.inst.rewardJs[rewardId].icon_s;
        this.lblAward.text = MathUtil.easyNumber(Math.floor(parseFloat(weaponFbData["reward_1"][2]) * UserProxy.inst.addSecretAward));
        this.imgIcon.source = Global.getSecretIcon(weaponFbData["head_icon"]);
    };
    return SecretAreaRenderer;
}(eui.ItemRenderer));
egret.registerClass(SecretAreaRenderer,'SecretAreaRenderer');
//# sourceMappingURL=SecretAreaRenderer.js.map