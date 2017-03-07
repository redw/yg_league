/**
 * Created by Administrator on 2/16 0016.
 */
var MineInPanel = (function (_super) {
    __extends(MineInPanel, _super);
    function MineInPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = MineInPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=MineInPanel,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.FARM_ORE, this.refreshStone, this);
        Http.inst.addCmdListener(CmdID.MINE_UP, this.refreshStone, this);
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
        this.cavernList.itemRenderer = MineInRenderer;
    };
    p.initData = function () {
        this.refreshStone();
        this.refresh();
    };
    p.refreshStone = function () {
        this.lblStone.text = StringUtil.toFixed(UserProxy.inst.ore, 0) + "";
    };
    p.refresh = function () {
        var ids = [];
        for (var i in UserProxy.inst.home["mine"]) {
            ids.push(parseInt(i));
        }
        this.cavernList.dataProvider = new eui.ArrayCollection(ids);
    };
    p.onBack = function () {
        PanelManager.inst.hidePanel("MineInPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
        Http.inst.removeCmdListener(CmdID.MINE_UP, this.refreshStone, this);
        Http.inst.removeCmdListener(CmdID.FARM_ORE, this.refreshStone, this);
    };
    return MineInPanel;
}(BasePanel));
egret.registerClass(MineInPanel,'MineInPanel');
//# sourceMappingURL=MineInPanel.js.map