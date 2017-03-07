/**
 * Created by Administrator on 2/20 0020.
 */
var MineInRoleRenderer = (function (_super) {
    __extends(MineInRoleRenderer, _super);
    function MineInRoleRenderer() {
        _super.call(this);
        this.skinName = MineInRoleRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=MineInRoleRenderer,p=c.prototype;
    p.onShow = function (event) {
        EventManager.inst.addEventListener(ContextEvent.MINE_NEED_UP, this.needShake, this);
        for (var i = 0; i < 6; i++) {
            var icon = DisplayUtil.getChildByName(this, "role" + i);
            icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onIcon, this);
        }
    };
    p.onHide = function (event) {
        EventManager.inst.removeEventListener(ContextEvent.MINE_NEED_UP, this.needShake, this);
        for (var i = 0; i < 6; i++) {
            var icon = DisplayUtil.getChildByName(this, "role" + i);
            icon.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onIcon, this);
        }
    };
    p.needShake = function (e) {
        for (var i = 0; i < 6; i++) {
            var icon = DisplayUtil.getChildByName(this, "role" + i);
            egret.Tween.get(icon, { loop: true }).to({ rotation: -10 }, 100).to({ rotation: 0 }, 100).to({ rotation: 10 }, 100).to({ rotation: 0 }, 100);
        }
    };
    p.stopShake = function () {
        for (var i = 0; i < 6; i++) {
            var icon = DisplayUtil.getChildByName(this, "role" + i);
            egret.Tween.removeTweens(icon);
        }
    };
    p.onIcon = function (e) {
        var icon = e.currentTarget;
        this.stopShake();
        EventManager.inst.dispatch(ContextEvent.MINE_UP_CHANGE, icon["id"]);
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        for (var i = 0; i < 6; i++) {
            var icon = DisplayUtil.getChildByName(this, "role" + i);
            icon.visible = false;
        }
        var length = this.data.length;
        for (var i = 0; i < length; i++) {
            var icon = DisplayUtil.getChildByName(this, "role" + i);
            icon.visible = true;
            var id = this.data[i];
            var roleData = UserProxy.inst.heroData.getHeroData(id);
            icon.imgIcon = Global.getChaIcon(id);
            icon["id"] = id;
            icon.setStar = roleData.starLevel;
            icon.setLv = 0;
        }
    };
    return MineInRoleRenderer;
}(eui.ItemRenderer));
egret.registerClass(MineInRoleRenderer,'MineInRoleRenderer');
//# sourceMappingURL=MineInRoleRenderer.js.map