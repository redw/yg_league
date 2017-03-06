/**
 * Created by Administrator on 12/9 0009.
 */
class ActiveDayInvite extends eui.Component
{
    public btnBuy:eui.Button;
    public awardList:eui.List;
    public imgTitle:AutoBitmap;

    public constructor()
    {
        super();
        this.skinName = ActiveDayInviteSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.awardList.itemRenderer = ActDayInviteRenderer;

        if(ExternalUtil.inst.getIsYYB())
        {
            this.imgTitle.source = "d_show_dec_yyb_png";
        }


        this.refresh();
    }

    private onHide(event:egret.Event):void
    {
    }

    private refresh():void
    {
        var ids:number[] = [];
        var doneIds:number[] = [];
        for (var i in Config.DailyInviteData)
        {
            if(UserMethod.inst.isBitGet(parseInt(i),UserProxy.inst.shareObj["shareBit"]))
            {
                doneIds.push(parseInt(i));
            }
            else
            {
                ids.push(parseInt(i));
            }

        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids.concat(doneIds));

    }




}