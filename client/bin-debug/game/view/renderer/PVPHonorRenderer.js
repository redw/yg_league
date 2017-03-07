/**
 * Created by Administrator on 12/25 0025.
 */
var PVPHonorRenderer = (function (_super) {
    __extends(PVPHonorRenderer, _super);
    function PVPHonorRenderer() {
        _super.call(this);
        this.skinName = PVPHonorRendererSkin;
    }
    var d = __define,c=PVPHonorRenderer,p=c.prototype;
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var data = UserProxy.inst.pvpHonorTopRanks[this.data];
        this.lblName.text = StringUtil.decodeName(data["nickname"]);
        if (data["headimgurl"]) {
            this.imgHead.source = UserMethod.inst.getHeadImg(data["headimgurl"]);
        }
        else {
            this.imgHead.source = "common_head_png";
        }
        this.lblRank.text = "第" + data["season"] + "届";
    };
    return PVPHonorRenderer;
}(eui.ItemRenderer));
egret.registerClass(PVPHonorRenderer,'PVPHonorRenderer');
//# sourceMappingURL=PVPHonorRenderer.js.map