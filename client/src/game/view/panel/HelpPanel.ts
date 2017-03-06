/**
 * Created by Administrator on 1/19 0019.
 */
class HelpPanel extends BasePanel
{
    private contentGroup:eui.Group;
    private imgType:AutoBitmap;
    private lblOut:eui.Label;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = HelpPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }

    public initData():void
    {
        this.contentGroup.alpha = 0;
        egret.Tween.get(this.contentGroup).to({alpha:1},500);
        switch (this.data)
        {
            case 1:
                this.imgType.source = "help_money_png";
                break;
            case 2:
                this.imgType.source = "help_friend_png";
                break;
            case 3:
                this.imgType.source = "help_secret_png";
                break;
            case 4:
                this.imgType.source = "help_weapon_png";
                break;
        }
        egret.Tween.get(this.lblOut,{loop:true}).to({alpha:0},1000).to({alpha:1},1000);
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("HelpPanel");
    }

    public destory():void
    {
        super.destory();
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        egret.Tween.removeTweens(this.lblOut);
    }
}