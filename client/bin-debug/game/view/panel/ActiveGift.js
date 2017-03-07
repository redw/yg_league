/**
 * Created by Administrator on 12/9 0009.
 */
var ActiveGift = (function (_super) {
    __extends(ActiveGift, _super);
    function ActiveGift() {
        _super.call(this);
        this.skinName = ActiveGiftSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveGift,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.GIFT_CODE, this.cmdBack, this);
        this.btnSure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSure, this);
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.GIFT_CODE, this.cmdBack, this);
        this.btnSure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSure, this);
    };
    p.cmdBack = function (e) {
        UserMethod.inst.showAward(e.data);
    };
    p.onSure = function () {
        Http.inst.send(CmdID.GIFT_CODE, { code: this.editText.text });
    };
    return ActiveGift;
}(eui.Component));
egret.registerClass(ActiveGift,'ActiveGift');
//# sourceMappingURL=ActiveGift.js.map