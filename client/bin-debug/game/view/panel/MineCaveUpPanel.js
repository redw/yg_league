/**
 * Created by Administrator on 3/1 0001.
 */
var MineCaveUpPanel = (function (_super) {
    __extends(MineCaveUpPanel, _super);
    function MineCaveUpPanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = MineCaveUpPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=MineCaveUpPanel,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.MINE_UP, this.initData, this);
        this.btnLvUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.initData = function () {
        var mineInfo = UserProxy.inst.home["mine"][this.data];
        var lv = 1;
        if (mineInfo["lv"]) {
            lv = mineInfo["lv"];
        }
        var oreUpData = Config.OreUpData[lv];
        var oreUpNextData = Config.OreUpData[lv + 1];
        this.lblLv.text = "Lv." + lv;
        var nowMax = parseInt(oreUpData["value"]);
        this.lblNow.text = "当前：灵矿的存量上限为：" + MathUtil.easyNumber(nowMax);
        if (!oreUpNextData) {
            this.lblNext.text = "已经升到满级！";
            this.btnLvUp.enabled = false;
            this.lblBar.text = "MAX";
            this.imgBar.width = 272;
        }
        else {
            var nextMax = parseInt(oreUpNextData["value"]);
            this.lblNext.text = "下级：灵矿的存量上限为：" + MathUtil.easyNumber(nextMax);
            var now = UserProxy.inst.ore;
            var cost = parseInt(oreUpNextData["cost"]);
            this.lblBar.text = StringUtil.toFixed(now, 0) + "/" + cost;
            this.imgBar.width = MathUtil.clamp(Math.floor(now * 272 / cost), 0, 272);
            this.btnLvUp.enabled = now >= cost;
        }
    };
    p.onAdd = function () {
        Http.inst.send(CmdID.MINE_UP, { id: this.data });
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("MineCaveUpPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        Http.inst.removeCmdListener(CmdID.MINE_UP, this.initData, this);
        this.btnLvUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    return MineCaveUpPanel;
}(BasePanel));
egret.registerClass(MineCaveUpPanel,'MineCaveUpPanel');
//# sourceMappingURL=MineCaveUpPanel.js.map