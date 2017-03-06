/**
 * Created by Administrator on 12/21 0021.
 */
class PVPHonor extends eui.Component
{
    public honorList:eui.List;
    public lblNoRank:eui.Label;

    public constructor()
    {
        super();
        this.skinName = PVPHonorSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.honorList.itemRenderer = PVPHonorRenderer;
        Http.inst.addCmdListener(CmdID.PVP_TOPS,this.honorBack,this);

        if(UserProxy.inst.server_time > UserProxy.inst.pvpHonorTime + 30)
        {
            UserProxy.inst.pvpHonorTime = UserProxy.inst.server_time;
            Http.inst.send(CmdID.PVP_TOPS);
        }
        else
        {
            this.refresh();
        }

    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.PVP_TOPS,this.honorBack,this);
    }

    private honorBack(e:egret.Event):void
    {
        UserProxy.inst.pvpHonorTopRanks = e.data["topranks"];
        this.refresh();
    }

    private refresh():void
    {
        var ids:number[] = [];

        for(var i in UserProxy.inst.pvpHonorTopRanks)
        {
            ids.push(parseInt(i));
        }

        if(!ids.length)
        {
            this.lblNoRank.visible = true;
            this.honorList.visible = false;
        }
        else
        {
            this.lblNoRank.visible = false;
            this.honorList.visible = true;
        }
        this.honorList.dataProvider = new eui.ArrayCollection(ids);
    }
}