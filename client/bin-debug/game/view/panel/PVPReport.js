/**
 * Created by Administrator on 12/21 0021.
 */
var PVPReport = (function (_super) {
    __extends(PVPReport, _super);
    function PVPReport() {
        _super.call(this);
        this.skinName = PVPReportSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=PVPReport,p=c.prototype;
    p.onShow = function (event) {
    };
    p.onHide = function (event) {
    };
    return PVPReport;
}(eui.Component));
egret.registerClass(PVPReport,'PVPReport');
