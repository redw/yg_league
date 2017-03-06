/**
 * Created by Administrator on 2/16 0016.
 */
class MineInPanel extends BasePanel
{
    private lblStone:eui.Label;
    private btnBack:SimpleButton;
    private cavernList:eui.List;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = MineInPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        Http.inst.addCmdListener(CmdID.FARM_ORE,this.refreshStone,this);
        Http.inst.addCmdListener(CmdID.MINE_UP,this.refreshStone,this);
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBack,this);
        this.cavernList.itemRenderer = MineInRenderer;
    }

    public initData():void
    {
        this.refreshStone();
        this.refresh();
    }

    private refreshStone():void
    {
        this.lblStone.text = StringUtil.toFixed(UserProxy.inst.ore,0) + "";
    }

    private refresh():void
    {
        var ids:number[] = [];
        for(var i in UserProxy.inst.home["mine"])
        {
            ids.push(parseInt(i));
        }
        this.cavernList.dataProvider = new eui.ArrayCollection(ids);

    }

    private onBack():void
    {
        PanelManager.inst.hidePanel("MineInPanel");
    }

    public destory():void
    {
        super.destory();
        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBack,this);
        Http.inst.removeCmdListener(CmdID.MINE_UP,this.refreshStone,this);
        Http.inst.removeCmdListener(CmdID.FARM_ORE,this.refreshStone,this);
    }
}