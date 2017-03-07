/**
 * Created by Administrator on 12/5 0005.
 */
var SecretAreaPanel = (function (_super) {
    __extends(SecretAreaPanel, _super);
    function SecretAreaPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SecretAreaPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
        this._modal = true;
    }
    var d = __define,c=SecretAreaPanel,p=c.prototype;
    p.init = function () {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON_COIN, this.refreshWeaponCoin, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnDown.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.areaList.itemRenderer = SecretAreaRenderer;
    };
    p.onChange = function (e) {
        if (e.currentTarget == this.btnUp) {
            this._index++;
        }
        else {
            this._index--;
        }
        this.showIndex(this._index);
    };
    p.initData = function () {
        UserMethod.inst.secret_type = this.data;
        this._index = 0;
        var dungeonInfo = UserProxy.inst.dungeonList[this.data];
        var nowId = dungeonInfo["dungeonId"];
        this._index = Math.floor(nowId / 5);
        this.showIndex(this._index);
        // var secretData:any = Config.WeaponFbOp[this.data];
        this.lblDesc.text = "秘境挑战，不计伙伴等级和天赋加成属性"; //secretData["disc"];
        this.refreshWeaponCoin();
    };
    p.refreshWeaponCoin = function () {
        this.lblWeaponCoin0.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[0]);
        this.lblWeaponCoin1.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[1]);
        this.lblWeaponCoin2.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[2]);
        this.lblWeaponCoin3.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[3]);
        this.lblWeaponCoin4.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[4]);
    };
    p.showIndex = function (index) {
        this.btnDown.visible = true;
        this.btnUp.visible = true;
        if (index == 0) {
            this.btnDown.visible = false;
        }
        if (index == 5) {
            this.btnUp.visible = false;
        }
        var dungeonInfo = UserProxy.inst.dungeonList[this.data];
        var nowId = dungeonInfo["dungeonId"]; //0,1,2,3...
        var ids = [];
        var begin = (1000 * this.data + 1);
        var start = (1000 * this.data + 1) + index * 5;
        var end = (1000 * this.data + 5) + index * 5;
        for (var i = start; i <= end; i++) {
            var id = i - begin;
            if (nowId >= id) {
                ids.push(i);
            }
        }
        this.areaList.dataProvider = new eui.ArrayCollection(ids);
        var canUp = (nowId / ((index + 1) * 5)) >= 1;
        this.btnUp.visible = ids.length >= 5 && canUp;
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("SecretAreaPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_WEAPON_COIN, this.refreshWeaponCoin, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnDown.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
    };
    return SecretAreaPanel;
}(BasePanel));
egret.registerClass(SecretAreaPanel,'SecretAreaPanel');
//# sourceMappingURL=SecretAreaPanel.js.map