/**
 * Created by Administrator on 12/25 0025.
 */
var PVPRankRenderer = (function (_super) {
    __extends(PVPRankRenderer, _super);
    function PVPRankRenderer() {
        _super.call(this);
        this.skinName = PVPRankRendererSkin;
    }
    var d = __define,c=PVPRankRenderer,p=c.prototype;
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var data;
        data = UserProxy.inst.pvpNowTopRanks[this.data];
        if (UserProxy.inst.pvpNowMyTopRank == data["rank"]) {
            this.imgBg.source = "rank_cell_mine_png";
        }
        else {
            this.imgBg.source = "common_cell_png";
        }
        this.lblName.text = StringUtil.decodeName(data["nickname"]);
        this.showLevelStar(data["score"]);
        if (data["headimgurl"]) {
            this.imgHead.source = UserMethod.inst.getHeadImg(data["headimgurl"]);
        }
        else {
            this.imgHead.source = "common_head_png";
        }
        if (data["rank"] < 4) {
            this.lblRank.visible = false;
            this.imgRank.visible = true;
            switch (data["rank"]) {
                case 1:
                    this.imgRank.source = "pvp_rank_1_png";
                    break;
                case 2:
                    this.imgRank.source = "pvp_rank_2_png";
                    break;
                case 3:
                    this.imgRank.source = "pvp_rank_3_png";
                    break;
            }
        }
        else {
            this.lblRank.visible = true;
            this.imgRank.visible = false;
            this.lblRank.text = data["rank"];
        }
    };
    p.showLevelStar = function (score) {
        var nowIdx = 0;
        for (var i in Config.PVPPointData) {
            var data = Config.PVPPointData[i];
            var point = parseInt(data["point"]);
            if (score >= point) {
                nowIdx = parseInt(i);
                break;
            }
        }
        this.imgMyLevel.source = "pvp_level_" + Math.ceil(nowIdx / 4) + "_png";
        switch (nowIdx % 4) {
            case 0:
                this.myStar1.visible = false;
                this.myStar2.visible = false;
                this.myStar3.visible = false;
                break;
            case 1:
                this.myStar1.visible = true;
                this.myStar2.visible = true;
                this.myStar3.visible = true;
                break;
            case 2:
                this.myStar1.visible = true;
                this.myStar2.visible = true;
                this.myStar3.visible = false;
                break;
            case 3:
                this.myStar1.visible = true;
                this.myStar2.visible = false;
                this.myStar3.visible = false;
                break;
        }
    };
    return PVPRankRenderer;
}(eui.ItemRenderer));
egret.registerClass(PVPRankRenderer,'PVPRankRenderer');
//# sourceMappingURL=PVPRankRenderer.js.map