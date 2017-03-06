/**
 * Created by Administrator on 12/1 0001.
 */
var WeaponPanel = (function (_super) {
    __extends(WeaponPanel, _super);
    function WeaponPanel() {
        _super.call(this);
        this._moving = false;
        this._lastVerticalScrollPos = 0;
        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = WeaponPanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }
    var d = __define,c=WeaponPanel,p=c.prototype;
    p.init = function () {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON_COIN, this.refreshWeaponCoin, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpDown, this);
        this.btnWeaponShop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWeaponShop, this);
        this.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelp, this);
        this.weaponList.itemRenderer = WeaponRenderer;
    };
    p.initData = function () {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON, this.onWeaponRefresh, this);
        Http.inst.addCmdListener(CmdID.WEAPON_POS_BUY, this.refresh, this);
        this.refresh();
        this.refreshWeaponCoin();
        this._upDown = MenuPanel.inst.menuUp;
        if (MenuPanel.inst.menuUp) {
            this.btnUp.source = "menu_down_png";
            this.height = 616;
            this.weaponScroller.height = 494;
        }
        else {
            this.btnUp.source = "menu_up_png";
            this.height = 282;
            this.weaponScroller.height = 160;
        }
    };
    p.refreshWeaponCoin = function () {
        this.lblWeaponCoin0.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[0]);
        this.lblWeaponCoin1.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[1]);
        this.lblWeaponCoin2.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[2]);
        this.lblWeaponCoin3.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[3]);
        this.lblWeaponCoin4.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[4]);
    };
    p.onWeaponRefresh = function (event) {
        this._lastVerticalScrollPos = this.weaponList.scrollV;
        this.refresh();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    };
    p.onEnterFrame = function (event) {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.weaponList.scrollV = this._lastVerticalScrollPos;
    };
    p.onUpDown = function () {
        if (this._moving) {
            return;
        }
        this._moving = true;
        this._upDown = !this._upDown;
        var time = 500;
        if (this._upDown) {
            this.btnUp.source = "menu_down_png";
            egret.Tween.get(this).to({ height: 616 }, time);
            egret.Tween.get(this.weaponScroller).to({ height: 494 }, time);
            MenuPanel.inst.menuUp = true;
        }
        else {
            this.btnUp.source = "menu_up_png";
            egret.Tween.get(this).to({ height: 282 }, time);
            egret.Tween.get(this.weaponScroller).to({ height: 150 }, time);
            MenuPanel.inst.menuUp = false;
        }
        egret.setTimeout(function () { this._moving = false; }, this, time);
    };
    p.refresh = function () {
        this.showWeaponCell();
        var weaponIds = [];
        for (var i in UserProxy.inst.weaponList) {
            weaponIds.push(parseInt(i));
        }
        if (UserMethod.inst.getWeaponCount() >= UserProxy.inst.maxNum && UserProxy.inst.buyNum < Config.BaseData[9]["value"]) {
            weaponIds.push(0);
        }
        this.weaponList.dataProvider = new eui.ArrayCollection(weaponIds);
    };
    p.onWeaponShop = function (e) {
        PanelManager.inst.showPanel("WeaponBuyPanel");
    };
    p.showWeaponCell = function () {
        this.weaponCell.text = "(" + UserMethod.inst.getWeaponCount() + "/" + UserProxy.inst.maxNum + ")";
    };
    p.onHelp = function () {
        PanelManager.inst.showPanel("HelpPanel", 4);
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_WEAPON_COIN, this.refreshWeaponCoin, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpDown, this);
        this.btnWeaponShop.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onWeaponShop, this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_WEAPON, this.refresh, this);
        Http.inst.removeCmdListener(CmdID.WEAPON_POS_BUY, this.refresh, this);
        this.btnHelp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelp, this);
    };
    return WeaponPanel;
}(BasePanel));
egret.registerClass(WeaponPanel,'WeaponPanel');
