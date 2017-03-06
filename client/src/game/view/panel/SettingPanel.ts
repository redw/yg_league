/**
 * Created by Administrator on 1/13 0013.
 */
class SettingPanel extends BasePanel
{
    public lblName:eui.Label;
    public lblUID:eui.Label;
    public lblVersion:eui.Label;
    public imgPaySure:eui.Image;
    public imgSound:eui.Image;
    public imgMusic:eui.Image;
    public btnSound:SimpleButton;
    public btnMusic:SimpleButton;
    public btnPaySure:SimpleButton;
    public btnCopy:eui.Button;
    public btnClose:eui.Button;
    public btnChange:SimpleButton;
    public imgHead:AutoBitmap;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SettingPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        this.btnCopy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCopy,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnSound.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSound,this);
        this.btnPaySure.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onPaySure,this);
        this.btnMusic.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMusic,this);
        this.btnChange.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);
        Http.inst.addCmdListener(CmdID.SET_HEAD,this.onHeadBack,this);
    }

    public initData():void
    {
        this.imgMusic.visible = UserProxy.inst.musicOpen;
        this.imgSound.visible = UserProxy.inst.soundOpen;
        this.imgPaySure.visible = UserProxy.inst.costAlart;
        this.lblName.text = StringUtil.decodeName(UserProxy.inst.nickname);
        this.lblUID.text = "UID：" + UserProxy.inst.uid;
        this.lblVersion.text = "版本号：" + ExternalUtil.inst.getVersion();
        this.imgHead.source = UserMethod.inst.getHeadImg(UserProxy.inst.headimgurl);

        SoundManager.inst.musicSwitch = !UserProxy.inst.musicOpen;
        SoundManager.inst.effectSwitch = !UserProxy.inst.soundOpen;

    }

    public onHeadBack(e:egret.Event):void
    {
        UserProxy.inst.headimgurl = e.data["headimgurl"];
        this.imgHead.source = UserMethod.inst.getHeadImg(UserProxy.inst.headimgurl);
    }

    private onCopy():void
    {
        ExternalUtil.inst.copyUID();
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("SettingPanel");
    }

    private onSound():void
    {
        UserProxy.inst.soundOpen = !UserProxy.inst.soundOpen;
        SoundManager.inst.effectSwitch = !UserProxy.inst.soundOpen;
        this.imgSound.visible = UserProxy.inst.soundOpen;

        UserProxy.inst.setSetting(3,UserProxy.inst.soundOpen);
    }

    private onPaySure():void
    {
        UserProxy.inst.costAlart = !UserProxy.inst.costAlart;
        this.imgPaySure.visible = UserProxy.inst.costAlart;

        UserProxy.inst.setSetting(1,UserProxy.inst.costAlart);
    }

    private onMusic():void
    {
        UserProxy.inst.musicOpen = !UserProxy.inst.musicOpen;
        SoundManager.inst.musicSwitch = !UserProxy.inst.musicOpen;
        this.imgMusic.visible = UserProxy.inst.musicOpen;

        UserProxy.inst.setSetting(2,UserProxy.inst.musicOpen);
    }

    private onChange():void
    {
        PanelManager.inst.showPanel("SettingHeadPanel");
    }

    public destory():void
    {
        super.destory();
        this.btnCopy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onCopy,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnSound.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSound,this);
        this.btnPaySure.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onPaySure,this);
        this.btnMusic.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMusic,this);
        this.btnChange.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);
        Http.inst.removeCmdListener(CmdID.SET_HEAD,this.onHeadBack,this);
    }

}
