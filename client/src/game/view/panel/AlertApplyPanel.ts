/**
 * Created by Administrator on 12/14 0014.
 */
class AlertApplyPanel extends BasePanel
{
    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = AlertApplyPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
        this.effectType = 2;
    }

    public init(): void
    {

    }

    public initData(): void
    {

    }

    public destory():void
    {
        super.destory();

    }

}