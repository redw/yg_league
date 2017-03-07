/**
 * Created by Administrator on 12/27 0027.
 */
var RoleStrengthRestart = (function (_super) {
    __extends(RoleStrengthRestart, _super);
    function RoleStrengthRestart() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = RoleStrengthRestartSkin;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
        this._modal = true;
    }
    var d = __define,c=RoleStrengthRestart,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRestart, this);
    };
    p.initData = function () {
        this.lblShow.text = "\t 初始化可100%返还用于强化的灵玉；被初始化的伙伴，其强化等级重置为0";
        this._roleId = this.data;
        this.btnRestart.extraLabel = "确认重置";
        this.btnRestart.label = Config.BaseData[8]["value"];
        this.refreshNature();
    };
    p.refreshNature = function () {
        var roleData = UserProxy.inst.heroData.getHeroData(this._roleId);
        this.roleIcon.imgIcon = Global.getChaIcon(this._roleId);
        this.roleIcon.setLv = 0;
        this.lblStrength.text = "+" + roleData.strengthenLevel;
        var getJade = parseInt(Config.HeroJadeCostData[roleData.strengthenLevel]["return"]);
        this.lblGetJade.text = MathUtil.easyNumber(getJade);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("RoleStrengthRestart");
    };
    p.onRestart = function () {
        if (UserProxy.inst.costAlart) {
            this.showCost();
        }
        else {
            Alert.showCost(Config.BaseData[8]["value"], "强化重置", true, this.showCost, null, this);
        }
    };
    p.showCost = function () {
        if (UserProxy.inst.diamond >= parseInt(Config.BaseData[8]["value"])) {
            Http.inst.send(CmdID.ENHANCE_RESET, { hid: this._roleId });
            this.onClose();
        }
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnRestart.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRestart, this);
    };
    return RoleStrengthRestart;
}(BasePanel));
egret.registerClass(RoleStrengthRestart,'RoleStrengthRestart');
//# sourceMappingURL=RoleStrengthRestart.js.map