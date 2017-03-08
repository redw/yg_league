/**
 * Created by Administrator on 12/19 0019.
 */
var MailRenderer = (function (_super) {
    __extends(MailRenderer, _super);
    function MailRenderer() {
        _super.call(this);
        this.skinName = MailRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=MailRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnShow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowInfo, this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowInfo, this);
    };
    p.onHide = function (event) {
        this.btnShow.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowInfo, this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowInfo, this);
    };
    p.onShowInfo = function () {
        PanelManager.inst.showPanel("MailInfoPanel", this.data);
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var mailInfo = UserProxy.inst.mail[this.data];
        this.lblName.text = mailInfo["title"];
        var date = new Date(mailInfo["createTime"] * 1000);
        this.lblTime.text = StringUtil.dateToString(date);
        this.imgType.source = mailInfo["type"] == 1 ? "mail_notice_png" : "mail_gift_png";
        if (mailInfo["state"]) {
            this.btnGet.visible = true;
            this.btnShow.visible = false;
        }
        else {
            this.btnGet.visible = false;
            this.btnShow.visible = true;
        }
    };
    return MailRenderer;
}(eui.ItemRenderer));
egret.registerClass(MailRenderer,'MailRenderer');
