/**
 * Created by Administrator on 12/9 0009.
 */
var ActivePrivilege = (function (_super) {
    __extends(ActivePrivilege, _super);
    function ActivePrivilege() {
        _super.call(this);
        this.skinName = ActivePrivilegeSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActivePrivilege,p=c.prototype;
    p.onShow = function (event) {
    };
    p.onHide = function (event) {
    };
    return ActivePrivilege;
}(eui.Component));
egret.registerClass(ActivePrivilege,'ActivePrivilege');
//# sourceMappingURL=ActivePrivilege.js.map