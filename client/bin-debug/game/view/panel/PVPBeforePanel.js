/**
 * Created by Administrator on 12/27 0027.
 */
var PVPBeforePanel = (function (_super) {
    __extends(PVPBeforePanel, _super);
    function PVPBeforePanel() {
        _super.call(this);
        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = PVPBeforePanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }
    var d = __define,c=PVPBeforePanel,p=c.prototype;
    p.init = function () {
        this.btnIn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onIn, this);
        this.btnInMine.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMine, this);
        EventManager.inst.addEventListener("MINE_CHECK", this.checkPoint, this);
        this.coinShow.startListener();
    };
    p.initData = function () {
        this.checkPoint();
    };
    p.checkPoint = function () {
        UserMethod.inst.removeRedPoint(this.btnInMine.parent, "upPoint");
        if (UserMethod.inst._mineBuildPoint || UserMethod.inst._mineFullPoint) {
            UserMethod.inst.addRedPoint(this.btnInMine.parent, "upPoint", new egret.Point(this.btnInMine.x + 90, this.btnInMine.y + 10));
        }
    };
    p.onIn = function () {
        UserMethod.inst.removeRedPoint(this.btnInMine.parent, "upPoint");
        var pvpBeginTime = Config.PVPData[7]["value"];
        var nowTime = UserProxy.inst.server_time;
        var divTime = nowTime - pvpBeginTime;
        var divDay = Math.floor(divTime / 86400);
        var oneSeasonTime = 7;
        var times = Math.floor(divDay / oneSeasonTime);
        var nowSeasonEnd = pvpBeginTime + (times + 1) * oneSeasonTime * 86400;
        var beginData = new Date((nowSeasonEnd + 10 * 60) * 1000);
        var beginYear = beginData.getFullYear();
        var beginMon = beginData.getMonth() + 1;
        var beginDay = beginData.getDate();
        var beginHour = beginData.getHours();
        var beginMin = beginData.getMinutes();
        if (UserProxy.inst.server_time <= nowSeasonEnd + 10 * 60 && UserProxy.inst.server_time > nowSeasonEnd) {
            Alert.show("赛季结算中\n 请" + beginYear + "年" + beginMon + "月" + beginDay + "日" + beginHour + "时" + beginMin + "分\n" + "后再来！");
        }
        else {
            PanelManager.inst.showPanel("PVPPanel");
        }
    };
    p.onMine = function () {
        if (UserProxy.inst.historyArea < 1000) {
            Notice.show("通过1000关开启！");
            return;
        }
        PanelManager.inst.showPanel("MineMainPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        EventManager.inst.removeEventListener("MINE_CHECK", this.checkPoint, this);
        this.btnIn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onIn, this);
        this.btnInMine.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMine, this);
        this.coinShow.endListener();
    };
    return PVPBeforePanel;
}(BasePanel));
egret.registerClass(PVPBeforePanel,'PVPBeforePanel');
//# sourceMappingURL=PVPBeforePanel.js.map