/**
 * Created by Administrator on 1/13 0013.
 */
var SettingPanel = (function (_super) {
    __extends(SettingPanel, _super);
    function SettingPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SettingPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=SettingPanel,p=c.prototype;
    p.init = function () {
        this.btnCopy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCopy, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnSound.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSound, this);
        this.btnPaySure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPaySure, this);
        this.btnMusic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMusic, this);
        this.btnChange.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        Http.inst.addCmdListener(CmdID.SET_HEAD, this.onHeadBack, this);
    };
    p.initData = function () {
        this.imgMusic.visible = UserProxy.inst.musicOpen;
        this.imgSound.visible = UserProxy.inst.soundOpen;
        this.imgPaySure.visible = UserProxy.inst.costAlart;
        this.lblName.text = StringUtil.decodeName(UserProxy.inst.nickname);
        this.lblUID.text = "UID：" + UserProxy.inst.uid;
        this.lblVersion.text = "版本号：" + ExternalUtil.inst.getVersion();
        this.imgHead.source = UserMethod.inst.getHeadImg(UserProxy.inst.headimgurl);
        SoundManager.inst.musicSwitch = !UserProxy.inst.musicOpen;
        SoundManager.inst.effectSwitch = !UserProxy.inst.soundOpen;
    };
    p.onHeadBack = function (e) {
        UserProxy.inst.headimgurl = e.data["headimgurl"];
        this.imgHead.source = UserMethod.inst.getHeadImg(UserProxy.inst.headimgurl);
    };
    p.onCopy = function () {
        ExternalUtil.inst.copyUID();
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("SettingPanel");
    };
    p.onSound = function () {
        UserProxy.inst.soundOpen = !UserProxy.inst.soundOpen;
        SoundManager.inst.effectSwitch = !UserProxy.inst.soundOpen;
        this.imgSound.visible = UserProxy.inst.soundOpen;
        UserProxy.inst.setSetting(3, UserProxy.inst.soundOpen);
    };
    p.onPaySure = function () {
        UserProxy.inst.costAlart = !UserProxy.inst.costAlart;
        this.imgPaySure.visible = UserProxy.inst.costAlart;
        UserProxy.inst.setSetting(1, UserProxy.inst.costAlart);
    };
    p.onMusic = function () {
        UserProxy.inst.musicOpen = !UserProxy.inst.musicOpen;
        SoundManager.inst.musicSwitch = !UserProxy.inst.musicOpen;
        this.imgMusic.visible = UserProxy.inst.musicOpen;
        UserProxy.inst.setSetting(2, UserProxy.inst.musicOpen);
    };
    p.onChange = function () {
        PanelManager.inst.showPanel("SettingHeadPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnCopy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCopy, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnSound.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSound, this);
        this.btnPaySure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPaySure, this);
        this.btnMusic.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMusic, this);
        this.btnChange.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        Http.inst.removeCmdListener(CmdID.SET_HEAD, this.onHeadBack, this);
    };
    return SettingPanel;
}(BasePanel));
egret.registerClass(SettingPanel,'SettingPanel');
//# sourceMappingURL=SettingPanel.js.map