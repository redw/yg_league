/**
 * Created by Administrator on 12/21 0021.
 */
class PVPRank extends eui.Component
{
    public rankList:eui.List;
    public imgBg:AutoBitmap;
    public imgRank:AutoBitmap;
    public imgHead:AutoBitmap;
    public lblName:eui.Label;
    public lblRank:eui.Label;
    public lblNoRank:eui.Label;

    public imgMyLevel:AutoBitmap;
    public myStar1:eui.Image;
    public myStar2:eui.Image;
    public myStar3:eui.Image;

    public constructor()
    {
        super();
        this.skinName = PVPRankSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.rankList.itemRenderer = PVPRankRenderer;
        Http.inst.addCmdListener(CmdID.PVP_RANK,this.onRankBack,this);

        if(UserProxy.inst.server_time > UserProxy.inst.pvpNowRankTime + 30)
        {
            UserProxy.inst.pvpNowRankTime = UserProxy.inst.server_time;
            Http.inst.send(CmdID.PVP_RANK);
        }
        else
        {
            this.refresh();
        }
    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.PVP_RANK,this.onRankBack,this);
    }

    private onRankBack(e:egret.Event):void
    {
        UserProxy.inst.pvpNowTopRanks = e.data["topranks"];
        UserProxy.inst.pvpNowMyTopRank = e.data["myrank"];
        UserProxy.inst.pvpNowMyTopScore = e.data["myscore"];

        this.refresh();
    }

    public refresh():void
    {
        var ids:number[] = [];

        for(var i in UserProxy.inst.pvpNowTopRanks)
        {
            ids.push(parseInt(i));
        }

        if(!ids.length)
        {
            this.lblNoRank.visible = true;
            this.rankList.visible = false;
        }
        else
        {
            this.lblNoRank.visible = false;
            this.rankList.visible = true;
        }


        this.rankList.dataProvider = new eui.ArrayCollection(ids);
        this.showMine();
    }

    private showMine():void
    {
        this.lblName.text = StringUtil.decodeName(UserProxy.inst.nickname);

        if (UserProxy.inst.headimgurl)
        {
            this.imgHead.source = UserMethod.inst.getHeadImg(UserProxy.inst.headimgurl);
        }
        else
        {
            this.imgHead.source = "common_head_png";
        }

        this.showLevelStar(UserProxy.inst.pvpNowMyTopScore);
        this.lblRank.visible = true;
        this.imgRank.visible = false;
        this.lblRank.text = UserProxy.inst.pvpNowMyTopRank + "";
        if(!UserProxy.inst.pvpNowMyTopRank)
        {
            this.lblRank.text = "未上榜";
        }
        else if (UserProxy.inst.myTopRank < 4)
        {
            this.lblRank.visible = false;
            this.imgRank.visible = true;

            switch (UserProxy.inst.pvpNowMyTopRank)
            {
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
        else
        {
            if(UserProxy.inst.pvpNowMyTopRank > 10000)
            {
                this.lblRank.text = "10000+";
            }
            else
            {
                this.lblRank.text = UserProxy.inst.pvpNowMyTopRank  + "";
            }

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