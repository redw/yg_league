/**
 * @货币类
 * Created by Administrator on 11/24 0024.
 */
var CoinPanel = (function (_super) {
    __extends(CoinPanel, _super);
    function CoinPanel() {
        _super.call(this);
        CoinPanel._inst = this;
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = CoinPanelSkin;
        this.horizontalCenter = 0;
    }
    var d = __define,c=CoinPanel,p=c.prototype;
    d(CoinPanel, "inst"
        ,function () {
            return CoinPanel._inst;
        }
    );
    p.hideCoinPanel = function (show) {
        this.visible = show;
    };
    p.setCoinBottom = function (type, showClose, className, isWeapon) {
        if (showClose === void 0) { showClose = false; }
        if (className === void 0) { className = ""; }
        if (isWeapon === void 0) { isWeapon = false; }
        this._className = className;
        var bottom;
        switch (type) {
            case 1:
                bottom = Global.COIN_BOTTOM_HEIGHT;
                break;
            case 2:
                bottom = Global.COIN_TOP_HEIGHT;
                break;
            case 3:
                bottom = 800 - this.height;
                break;
        }
        this.bottom = bottom;
        this.isShowCommon(isWeapon);
        this.btnClose.visible = showClose;
    };
    p.isShowCommon = function (showCommon) {
        if (!showCommon) {
            this.commonGroup.visible = true;
            this.weaponGroup.visible = false;
            this.btnClose.y = 0;
        }
        else {
            this.commonGroup.visible = false;
            this.weaponGroup.visible = true;
            this.btnClose.y = -50;
        }
    };
    p.init = function () {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_BASE, this.refresh, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.initData = function () {
        this.refresh();
    };
    p.refresh = function () {
        this.lblDiamond.text = MathUtil.easyNumber(UserProxy.inst.diamond);
        this.lblGold.text = MathUtil.easyNumber(UserProxy.inst.gold);
        this.lblMedal.text = MathUtil.easyNumber(UserProxy.inst.medal);
        this.refreshWeaponCoin();
    };
    p.refreshWeaponCoin = function () {
        this.lblWeaponCoin0.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[0]);
        this.lblWeaponCoin1.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[1]);
        this.lblWeaponCoin2.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[2]);
        this.lblWeaponCoin3.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[3]);
        this.lblWeaponCoin4.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[4]);
        this.lblDiamond1.text = this.lblDiamond.text;
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel(this._className);
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_BASE, this.refresh, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    return CoinPanel;
}(BasePanel));
egret.registerClass(CoinPanel,'CoinPanel');
