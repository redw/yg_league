/**
 * Created by Administrator on 12/14 0014.
 */
var FriendApplyRenderer = (function (_super) {
    __extends(FriendApplyRenderer, _super);
    function FriendApplyRenderer() {
        _super.call(this);
        this.skinName = FriendApplyRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=FriendApplyRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnNo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnYes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    };
    p.onHide = function (event) {
        this.btnNo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnYes.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    };
    p.onTouch = function (e) {
        var type = 0;
        if (e.currentTarget == this.btnYes) {
            type = 1;
        }
        else {
            type = 2;
        }
        Http.inst.send(CmdID.ANSWER_FRIEND, { fuid: this.data, type: type });
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var applyInfo = UserProxy.inst.newMsg[this.data];
        this.lblName.text = StringUtil.decodeName(applyInfo["nickname"]);
        // if(applyInfo["headimgurl"])
        // {
        //     this.imgIcon.source = applyInfo["headimgurl"];
        // }
    };
    return FriendApplyRenderer;
}(eui.ItemRenderer));
egret.registerClass(FriendApplyRenderer,'FriendApplyRenderer');
