/**
 * Created by Administrator on 12/25 0025.
 */
class PVPHonorRenderer extends eui.ItemRenderer
{
    public imgHead:AutoBitmap;
    public lblName:eui.Label;
    public lblRank:eui.Label;

    public constructor()
    {
        super();
        this.skinName = PVPHonorRendererSkin;
    }

    public dataChanged(): void
    {
        super.dataChanged();
        var data:any = UserProxy.inst.pvpHonorTopRanks[this.data];
        this.lblName.text = StringUtil.decodeName(data["nickname"]);
        if(data["headimgurl"])
        {
            this.imgHead.source = UserMethod.inst.getHeadImg(data["headimgurl"]);
        }
        else
        {
            this.imgHead.source = "common_head_png";
        }

        this.lblRank.text = "第" + data["season"] + "届";
    }
}