/**
 * Created by Administrator on 12/21 0021.
 */
var PVPHonor = (function (_super) {
    __extends(PVPHonor, _super);
    function PVPHonor() {
        _super.call(this);
        this.skinName = PVPHonorSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=PVPHonor,p=c.prototype;
    p.onShow = function (event) {
        this.honorList.itemRenderer = PVPHonorRenderer;
        Http.inst.addCmdListener(CmdID.PVP_TOPS, this.honorBack, this);
        if (UserProxy.inst.server_time > UserProxy.inst.pvpHonorTime + 30) {
            UserProxy.inst.pvpHonorTime = UserProxy.inst.server_time;
            Http.inst.send(CmdID.PVP_TOPS);
        }
        else {
            this.refresh();
        }
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.PVP_TOPS, this.honorBack, this);
    };
    p.honorBack = function (e) {
        UserProxy.inst.pvpHonorTopRanks = e.data["topranks"];
        this.refresh();
    };
    p.refresh = function () {
        var ids = [];
        for (var i in UserProxy.inst.pvpHonorTopRanks) {
            ids.push(parseInt(i));
        }
        if (!ids.length) {
            this.lblNoRank.visible = true;
            this.honorList.visible = false;
        }
        else {
            this.lblNoRank.visible = false;
            this.honorList.visible = true;
        }
        this.honorList.dataProvider = new eui.ArrayCollection(ids);
    };
    return PVPHonor;
}(eui.Component));
egret.registerClass(PVPHonor,'PVPHonor');
