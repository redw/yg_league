/**
 * Created by Administrator on 12/22 0022.
 */
class RankPanel extends BasePanel
{
    public imgAll:AutoBitmap;
    public imgPvp:AutoBitmap;
    public rankList:eui.List;

    public imgRank:AutoBitmap;
    public imgHead:AutoBitmap;
    public imgHeadAdd:AutoBitmap;
    public lblName:eui.Label;
    public lblRank:eui.Label;
    public lblScore:eui.Label;
    public lblNoRank:eui.Label;
    public lblType:eui.Label;
    public btnClose:SimpleButton;

    private _lastSelect:AutoBitmap;
    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = RankPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }


    public init():void
    {
        this.imgAll.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.imgPvp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);

        Http.inst.addCmdListener(CmdID.RANK,this.onRankBack,this);
        Http.inst.addCmdListener(CmdID.LAST_PVP_RANK,this.onPVPRankBack,this);

        this.rankList.itemRenderer = RankRenderer;

    }

    public initData():void
    {
        this.imgAll.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    }

    private onPVPRankBack(e:egret.Event):void
    {
        UserProxy.inst.pvpTopRanks = e.data["topranks"];
        UserProxy.inst.pvpMyTopRank = e.data["myrank"];
        UserProxy.inst.myScore = e.data["myscore"];
        this.refresh();
    }

    private onRankBack(e:egret.Event):void
    {
        UserProxy.inst.topRanks = e.data["topRanks"];
        UserProxy.inst.myTopRank = e.data["myTopRank"];
        this.refresh();
    }

    private onTouch(e:egret.TouchEvent):void
    {
        if(this._lastSelect && this._lastSelect == e.currentTarget)
        {
            return;
        }

        this._lastSelect = e.currentTarget;
        if(e.currentTarget == this.imgAll)
        {
            this.imgAll.source = "rank_all_touch_png";
            this.imgPvp.source = "rank_pvp_png";
            UserMethod.inst.rank_pvp = 1;
        }
        else
        {
            this.imgPvp.source = "rank_pvp_touch_png";
            this.imgAll.source = "rank_all_png";
            UserMethod.inst.rank_pvp = 2;
        }

        if(this._lastSelect == this.imgAll)
        {
            if(UserProxy.inst.server_time > UserProxy.inst.rankTime + 30)
            {
                UserProxy.inst.rankTime = UserProxy.inst.server_time;
                Http.inst.send(CmdID.RANK);
            }
            else
            {
                this.refresh();
            }
        }
        else
        {
            if(UserProxy.inst.server_time > UserProxy.inst.pvpRankTime + 30)
            {
                UserProxy.inst.pvpRankTime = UserProxy.inst.server_time;
                Http.inst.send(CmdID.LAST_PVP_RANK);
            }
            else
            {
                this.refresh();
            }
        }



    }

    public refresh():void
    {
        var ids:number[] = [];
        if(UserMethod.inst.rank_pvp == 1)
        {
            for(var i in UserProxy.inst.topRanks)
            {
                ids.push(parseInt(i));
            }
        }
        else
        {
            for(var i in UserProxy.inst.pvpTopRanks)
            {
                ids.push(parseInt(i));
            }
        }

        if(!ids.length)
        {
            if(UserMethod.inst.rank_pvp == 2)
            {
                this.lblNoRank.visible = true;
                this.lblNoRank.text = "第一赛季尚未结束！";
                this.rankList.visible = false;
            }
            else
            {
                this.lblNoRank.visible = true;
                this.lblNoRank.text = "目前没有人上榜哟！";
                this.rankList.visible = false;
            }

        }
        else
        {
            this.lblNoRank.visible = false;
            this.rankList.visible = true;
        }


        this.rankList.dataProvider = new eui.ArrayCollection(ids);
        this.changeMine();
    }

    public changeMine():void
    {
        this.lblName.text = StringUtil.decodeName(UserProxy.inst.nickname);
        this.lblScore.text = MathUtil.easyNumber(UserProxy.inst.curArea);
        if (UserProxy.inst.headimgurl)
        {
            this.imgHead.source = UserMethod.inst.getHeadImg(UserProxy.inst.headimgurl);
        }
        else
        {
            this.imgHead.source = "common_head_png";
        }

        this.lblRank.visible = true;
        this.imgRank.visible = false;
        this.lblRank.text = UserProxy.inst.myTopRank + "";
        this.lblType.text = "最大关卡：";
        this.lblScore.text = UserProxy.inst.historyArea + "";
        if (UserMethod.inst.rank_pvp == 1)
        {
            if(!UserProxy.inst.myTopRank)
            {
                this.lblRank.text = "未上榜";
            }
            else if (UserProxy.inst.myTopRank < 4)
            {
                this.lblRank.visible = false;
                this.imgRank.visible = true;

                switch (UserProxy.inst.myTopRank)
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
        }
        else
        {
            this.lblType.text = "积分：";
            this.lblScore.text = "0";
            this.lblScore.text = UserProxy.inst.myScore + "";
            this.lblRank.text = UserProxy.inst.pvpMyTopRank + "";
            if(!UserProxy.inst.pvpMyTopRank)
            {
                this.lblRank.text = "未上榜";
            }
            else if (UserProxy.inst.pvpMyTopRank < 4)
            {
                this.lblRank.visible = false;
                this.imgRank.visible = true;
                switch (UserProxy.inst.pvpMyTopRank)
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
        }
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("RankPanel");
    }

    public destory():void
    {
        super.destory();
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.imgAll.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.imgPvp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);

        Http.inst.removeCmdListener(CmdID.RANK,this.onRankBack,this);
        Http.inst.removeCmdListener(CmdID.PVP_RANK,this.onPVPRankBack,this);
    }

}