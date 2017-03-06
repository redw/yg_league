/**
 *
 * @author 
 *
 */
class FeedBackPanel extends BasePanel
{
    public editText:eui.EditableText;
    public btnClose:SimpleButton;
    public lblCommun:eui.Label;
    public btnUp:eui.Button;
    
    public constructor() 
    {
        super();
        this.skinName = FeedBackPanelSkin;
        this._modal = false;
        this._layer = PanelManager.TOP_LAYER;

        this.verticalCenter = 0;
        this.horizontalCenter = 0;
    }


    public init(): void
    {

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onFeed,this);

    }

    public initData(): void
    {
        super.initData();
    }
    
    private onClose(evt:egret.Event):void
    {
        PanelManager.inst.hidePanel("FeedBackPanel");
    }
    
    private onFeed(evt:egret.Event):void
    {
        Http.inst.send(CmdID.ADVICE,{"text":this.editText.text});
        PanelManager.inst.hidePanel("FeedBackPanel");
    }

    public destory(): void 
    {
        super.destory();
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onFeed,this);
    }
}
