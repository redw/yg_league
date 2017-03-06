/**
 * 提示框
 * @author j
 * 2016/8/29
 */
class QuickAlert extends BasePanel
{
    private static alertList:any[] = [];

    public static show(msg:any, select?:boolean, quick?:boolean, okFunc?:any, cancelFunc?:any, quickFunc?:any, thisObject?:any, okLabel?:string, cancelLabel?:string):void
    {
        var data:any = {msg:msg, select:select, quick:quick, okFunc:okFunc, cancelFunc:cancelFunc, quickFunc:quickFunc, thisObject:thisObject, okLabel:okLabel, cancelLabel:cancelLabel};

        if (PanelManager.inst.isShow("QuickAlert"))
        {
            QuickAlert.alertList.push(data);
        }
        else
        {
            PanelManager.inst.showPanel("QuickAlert", data);
        }
    }

    private static next():void
    {
        if (QuickAlert.alertList.length > 0)
        {
            PanelManager.inst.showPanel("QuickAlert", QuickAlert.alertList.shift());
        }
        else
        {
            PanelManager.inst.hidePanel("QuickAlert");
        }
    }

    //----------------------------------------//

    public checkBoxQuick:CheckBox;
    public okBtn:eui.Button;
    public sureBtn:eui.Button;
    public cancelBtn:eui.Button;
    public msgTxt:eui.Label;

    public constructor()
    {
        super();

        this._layer = PanelManager.ALERT_LAYER;
        this._modal = true;

        this.skinName = "resource/skin/lib/QuickAlertSkin.exml";
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        this.checkBoxQuick.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCheckBoxTouch, this);
        this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSureTouch, this);
        this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSureTouch, this);
        this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelTouch, this);
    }

    public initData():void
    {
        if(this.data["quick"])
        {
            this.checkBoxQuick.setSelect(this.data["quick"]);
        }
        else
        {
            this.checkBoxQuick.setSelect(false);
        }

        if(this.data["okLabel"])
        {
            this.okBtn.label = this.data["okLabel"];
            this.sureBtn.label = this.data["okLabel"];
        }
        else
        {
            this.okBtn.label = "确定";
            this.sureBtn.label = "确定";
        }

        if(this.data["cancelLabel"])
        {
            this.cancelBtn.label = this.data["cancelLabel"];
        }
        else
        {
            this.cancelBtn.label = "取消";
        }

        if (typeof(this.data["msg"]) == "string")
        {
            this.msgTxt.text = this.data["msg"];
        }
        else
        {
            this.msgTxt.textFlow = this.data["msg"];
        }

        if (this.data["select"])
        {
            this.okBtn.visible = false;
            this.sureBtn.visible = true;
            this.cancelBtn.visible = true;
        }
        else
        {
            this.okBtn.visible = true;
            this.sureBtn.visible = false;
            this.cancelBtn.visible = false;
        }
    }

    public destory(): void
    {
        this.checkBoxQuick.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCheckBoxTouch, this);
        this.okBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSureTouch, this);
        this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSureTouch, this);
        this.cancelBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelTouch, this);
    }

    private onCheckBoxTouch(event: egret.TouchEvent):void
    {
        var quick:boolean = this.checkBoxQuick.getSelect() == false;
        this.checkBoxQuick.setSelect(quick);

        if (this.data["quickFunc"] != null)
        {
            this.data["quickFunc"].call(this.data["thisObject"], quick);
        }
    }

    private onSureTouch(event: egret.TouchEvent):void
    {
        if (this.data["okFunc"] != null)
        {
            this.data["okFunc"].call(this.data["thisObject"]);
        }
        QuickAlert.next();
    }

    private onCancelTouch(event: egret.TouchEvent):void
    {
        if (this.data["cancelFunc"] != null)
        {
            this.data["cancelFunc"].call(this.data["thisObject"]);
        }
        QuickAlert.next();
    }
}