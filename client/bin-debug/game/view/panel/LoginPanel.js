/**
 * 登陆界面
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var LoginPanel = (function (_super) {
    __extends(LoginPanel, _super);
    function LoginPanel() {
        _super.call(this);
        this.skinName = LoginPanelSkin;
        this._mutex = true;
        this._layer = PanelManager.BOTTOM_LAYER;
        this.horizontalCenter = 0;
        this.bottom = 0;
        this.height = Global.getStageHeight();
    }
    var d = __define,c=LoginPanel,p=c.prototype;
    p.destory = function () {
        this.btnLogin.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.loginClickHandler, this);
        this.btnSwitch.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchClickHandler, this);
        _super.prototype.destory.call(this);
    };
    p.init = function () {
        this.btnLogin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.loginClickHandler, this);
        this.btnSwitch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchClickHandler, this);
        _super.prototype.init.call(this);
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
        if (window['hideLoading'] != null) {
            window['hideLoading']();
        }
        Global.TOKEN = Global.TEST_TOKEN ? Global.TEST_TOKEN : ExternalUtil.inst.getToken();
        console.log("TOKEN:" + Global.TOKEN);
    };
    p.loginClickHandler = function (event) {
        this.btnLogin.visible = false;
        this.btnSwitch.visible = false;
        if (Global.DEBUG) {
            Http.inst.send(CmdID.ENTER);
        }
        else {
            window["AWY_SDK"].shareParams({ "cp_from": "msg" });
            var from = window["AWY_SDK"].getURLVar("cp_from");
            var friendId = window["AWY_SDK"].getURLVar("fuid");
            Http.inst.send(CmdID.ENTER, { yyb: ExternalUtil.inst.getIsYYB() ? 1 : 0, inviteId: friendId, from: from ? from : "" });
        }
    };
    p.switchClickHandler = function (event) {
        ExternalUtil.inst.logout();
    };
    return LoginPanel;
}(BasePanel));
egret.registerClass(LoginPanel,'LoginPanel');
//# sourceMappingURL=LoginPanel.js.map