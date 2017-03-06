/**
 * Created by Administrator on 12/14 0014.
 */
var FriendGetGiftRenderer = (function (_super) {
    __extends(FriendGetGiftRenderer, _super);
    function FriendGetGiftRenderer() {
        _super.call(this);
        this.skinName = FriendGetGiftRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=FriendGetGiftRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
    };
    p.onHide = function (event) {
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
    };
    p.onGet = function () {
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
    };
    return FriendGetGiftRenderer;
}(eui.ItemRenderer));
egret.registerClass(FriendGetGiftRenderer,'FriendGetGiftRenderer');
