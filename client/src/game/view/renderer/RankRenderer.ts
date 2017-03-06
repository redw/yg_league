/**
 * Created by Administrator on 12/22 0022.
 */
class RankRenderer extends eui.ItemRenderer
{
    public imgBg:AutoBitmap;
    public imgRank:AutoBitmap;
    public imgHead:AutoBitmap;
    public lblName:eui.Label;
    public lblRank:eui.Label;
    public lblScore:eui.Label;
    public btnShow:eui.Button;
    public lblType:eui.Label;

    public constructor()
    {
        super();
        this.skinName = RankRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        this.btnShow.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
    }

    private onHide(event: egret.Event): void
    {
        this.btnShow.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
    }

    public onTouch(e:egret.TouchEvent):void
    {


    }

    public dataChanged(): void
    {
        super.dataChanged();
        this.btnShow.visible = false;
        var data:any ;
        if(UserMethod.inst.rank_pvp == 1)
        {
            this.lblType.text = "最大关卡：";
            data = UserProxy.inst.topRanks[this.data];
            if(data["historyArea"])
            {

                if(UserProxy.inst.myTopRank <= 3000)
                {
                    this.lblScore.text = (data["historyArea"]);
                }
                else
                {
                    this.lblScore.text = "***（前3000名可见）";
                }
            }
            else
            {
                this.lblScore.text = "0";
            }
            if(UserProxy.inst.myTopRank == data["rank"])
            {
                this.imgBg.source = "rank_cell_mine_png";
            }
            else
            {
                this.imgBg.source = "common_cell_png";
            }
        }
        else
        {
            this.lblType.text = "积分：";
            data = UserProxy.inst.pvpTopRanks[this.data];
            if(data["score"])
            {
                this.lblScore.text = MathUtil.easyNumber(data["score"]);
            }
            else
            {
                this.lblScore.text = "0";
            }

            if(UserProxy.inst.pvpMyTopRank == data["rank"])
            {
                this.imgBg.source = "rank_cell_mine_png";
            }
            else
            {
                this.imgBg.source = "common_cell_png";
            }
        }

        this.lblName.text = StringUtil.decodeName(data["nickname"]);

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
}