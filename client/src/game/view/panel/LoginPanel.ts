/**
 * 登陆界面
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
class LoginPanel extends BasePanel
{
    public btnLogin:SimpleButton
    public btnSwitch:SimpleButton
    public lblTitle:eui.Label;

    public constructor()
    {
        super();
        this.skinName = LoginPanelSkin;
        this._mutex = true;
        this._layer = PanelManager.BOTTOM_LAYER;
        this.horizontalCenter = 0;
        this.bottom = 0;
        this.height = Global.getStageHeight();
    }

    public destory():void
    {
        this.btnLogin.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.loginClickHandler, this);
        this.btnSwitch.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.switchClickHandler, this);
        super.destory();
    }

    public init():void
    {
        this.btnLogin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.loginClickHandler, this);
        this.btnSwitch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.switchClickHandler, this);
        super.init();

    }

    public initData():void
    {
        super.initData();
        if(window['hideLoading'] != null)
        {
            window['hideLoading']();
        }
        Global.TOKEN = Global.TEST_TOKEN ? Global.TEST_TOKEN : ExternalUtil.inst.getToken();
        console.log("TOKEN:" + Global.TOKEN );

    }

    private loginClickHandler(event:egret.TouchEvent):void
    {
        this.btnLogin.visible = false;
        this.btnSwitch.visible = false;
        if(Global.DEBUG)
        {
            Http.inst.send(CmdID.ENTER);
        }
        else
        {
            window["AWY_SDK"].shareParams({"cp_from": "msg"});
            var from:string = window["AWY_SDK"].getURLVar("cp_from");
            var friendId:string = window["AWY_SDK"].getURLVar("fuid");
            Http.inst.send(CmdID.ENTER, {yyb: ExternalUtil.inst.getIsYYB() ? 1 : 0,inviteId: friendId, from: from ? from : ""});
        }
    }

    private switchClickHandler(event:egret.TouchEvent):void
    {
        ExternalUtil.inst.logout();
    }
}