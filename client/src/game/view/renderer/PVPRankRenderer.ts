/**
 * Created by Administrator on 12/25 0025.
 */
class PVPRankRenderer extends eui.ItemRenderer
{
    public imgBg:AutoBitmap;
    public imgRank:AutoBitmap;
    public imgHead:AutoBitmap;
    public lblName:eui.Label;
    public lblRank:eui.Label;
    public imgMyLevel:eui.Image;
    public myStar1:eui.Image;
    public myStar2:eui.Image;
    public myStar3:eui.Image;

    public constructor()
    {
        super();
        this.skinName = PVPRankRendererSkin;
    }

    public dataChanged(): void
    {
        super.dataChanged();

        var data:any ;
        data = UserProxy.inst.pvpNowTopRanks[this.data];
        if(UserProxy.inst.pvpNowMyTopRank == data["rank"])
        {
            this.imgBg.source = "rank_cell_mine_png";
        }
        else
        {
            this.imgBg.source = "common_cell_png";
        }

        this.lblName.text = StringUtil.decodeName(data["nickname"]);
        this.showLevelStar(data["score"]);
        if(data["headimgurl"])
        {
            this.imgHead.source = UserMethod.inst.getHeadImg(data["headimgurl"]);
        }
        else
        {
            this.imgHead.source = "common_head_png";
        }

        if(data["rank"] < 4)
        {
            this.lblRank.visible = false;
            this.imgRank.visible = true;
            switch (data["rank"])
            {
                case 1:this.imgRank.source = "pvp_rank_1_png";break;
                case 2:this.imgRank.source = "pvp_rank_2_png";break;
                case 3:this.imgRank.source = "pvp_rank_3_png";break;
            }
        }
        else
        {
            this.lblRank.visible = true;
            this.imgRank.visible = false;
            this.lblRank.text = data["rank"];
        }
    }

    private showLevelStar(score:number):void
    {
        var nowIdx:number = 0;
        for(var i in Config.PVPPointData)
        {
            var data:any = Config.PVPPointData[i];
            var point:number = parseInt(data["point"]);
            if(score >= point)
            {
                nowIdx = parseInt(i);
                break;
            }
        }
        this.imgMyLevel.source = "pvp_level_" + Math.ceil(nowIdx/4) +"_png";
        switch (nowIdx % 4)
        {
            case 0:this.myStar1.visible = false;this.myStar2.visible = false;this.myStar3.visible = false;break;
            case 1:this.myStar1.visible = true;this.myStar2.visible = true;this.myStar3.visible = true;break;
            case 2:this.myStar1.visible = true;this.myStar2.visible = true;this.myStar3.visible = false;break;
            case 3:this.myStar1.visible = true;this.myStar2.visible = false;this.myStar3.visible = false;break;
        }
    }
}