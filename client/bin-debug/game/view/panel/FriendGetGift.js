/**
 * Created by Administrator on 12/14 0014.
 */
var FriendGetGift = (function (_super) {
    __extends(FriendGetGift, _super);
    function FriendGetGift() {
        _super.call(this);
        this.skinName = FriendGetGiftSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=FriendGetGift,p=c.prototype;
    p.onShow = function (event) {
        this.giftList.itemRenderer = FriendGetGiftRenderer;
        this.showList();
    };
    p.onHide = function (event) {
    };
    p.showList = function () {
        var ids = [1, 2, 3];
        this.giftList.dataProvider = new eui.ArrayCollection(ids);
    };
    return FriendGetGift;
}(eui.Component));
egret.registerClass(FriendGetGift,'FriendGetGift');
//# sourceMappingURL=FriendGetGift.js.map