/**
 * Created by Administrator on 12/19 0019.
 */
var MailPanel = (function (_super) {
    __extends(MailPanel, _super);
    function MailPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this._modal = true;
        this.skinName = MailPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=MailPanel,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.MAIL_ENCLOSE, this.onGetMail, this);
        EventManager.inst.addEventListener(ContextEvent.DELETA_MAIL, this.refresh, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.mailList.itemRenderer = MailRenderer;
        this.coinShow.startListener();
    };
    p.initData = function () {
        this.refresh();
    };
    p.refresh = function () {
        var ids = [];
        var hadIds = [];
        for (var i in UserProxy.inst.mail) {
            var mailInfo = UserProxy.inst.mail[i];
            if (mailInfo["state"]) {
                hadIds.push(parseInt(i));
            }
            else {
                ids.push(parseInt(i));
            }
        }
        ids.sort(sortTime);
        function sortTime(a, b) {
            var mailInfo1 = UserProxy.inst.mail[a];
            var mailInfo2 = UserProxy.inst.mail[b];
            if (mailInfo2["createTime"] > mailInfo1["createTime"]) {
                return 1;
            }
        }
        this.mailList.dataProvider = new eui.ArrayCollection(ids.concat(hadIds));
    };
    p.onGetMail = function () {
        this.refresh();
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("MailPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        Http.inst.removeCmdListener(CmdID.MAIL_ENCLOSE, this.onGetMail, this);
        this.coinShow.endListener();
    };
    return MailPanel;
}(BasePanel));
egret.registerClass(MailPanel,'MailPanel');
