/**
 * Created by Administrator on 3/2 0002.
 */
var SettingHeadRenderer = (function (_super) {
    __extends(SettingHeadRenderer, _super);
    function SettingHeadRenderer() {
        _super.call(this);
        this.skinName = SettingHeadRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=SettingHeadRenderer,p=c.prototype;
    p.onShow = function (event) {
        EventManager.inst.addEventListener("CHANGE_HEAD", this.showSelect, this);
        for (var i = 0; i < 6; i++) {
            var group = DisplayUtil.getChildByName(this, "group" + i);
            group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onIcon, this);
        }
    };
    p.onHide = function (event) {
        EventManager.inst.removeEventListener("CHANGE_HEAD", this.showSelect, this);
        for (var i = 0; i < 6; i++) {
            var group = DisplayUtil.getChildByName(this, "group" + i);
            group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onIcon, this);
        }
    };
    p.onIcon = function (e) {
        var group = e.currentTarget;
        UserMethod.inst.settingHeadId = group["id"] - 88;
        EventManager.inst.dispatch("CHANGE_HEAD", UserMethod.inst.settingHeadId);
    };
    p.showSelect = function (e) {
        var id = e.data;
        var length = this.data.length;
        for (var i = 0; i < length; i++) {
            var group = DisplayUtil.getChildByName(this, "group" + i);
            var select = DisplayUtil.getChildByName(group, "select");
            if (id + 88 == this.data[i]) {
                select.visible = true;
            }
            else {
                select.visible = false;
            }
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        for (var i = 0; i < 6; i++) {
            var group = DisplayUtil.getChildByName(this, "group" + i);
            group.visible = false;
        }
        var length = this.data.length;
        for (var i = 0; i < length; i++) {
            var group = DisplayUtil.getChildByName(this, "group" + i);
            var select = DisplayUtil.getChildByName(group, "select");
            var role = DisplayUtil.getChildByName(group, "role");
            var id = this.data[i];
            role.source = Global.getChaIcon(id);
            group["id"] = id;
            group.visible = true;
            select.visible = false;
            if (UserMethod.inst.settingHeadId + 88 == id) {
                select.visible = true;
            }
        }
    };
    return SettingHeadRenderer;
}(eui.ItemRenderer));
egret.registerClass(SettingHeadRenderer,'SettingHeadRenderer');
//# sourceMappingURL=SettingHeadRenderer.js.map