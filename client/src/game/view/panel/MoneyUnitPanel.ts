/**
 * Created by Administrator on 2/4 0004.
 */
class MoneyUnitPanel extends BasePanel
{
    public btnClose:SimpleButton;
    public unitList:eui.List;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = MoneyUnitPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.unitList.itemRenderer = MoneyUnitRenderer;
    }

    public initData():void
    {
        var ids:number[] = [];
        for(var i:number = 0;i < 100;i++)
        {
            ids.push(i);
        }
        this.unitList.dataProvider = new eui.ArrayCollection(ids);
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("MoneyUnitPanel");
    }

    public destory():void
    {
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }
}