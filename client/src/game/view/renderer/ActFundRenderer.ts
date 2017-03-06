/**
 * Created by Administrator on 12/23 0023.
 */
class ActFundRenderer extends eui.ItemRenderer
{
    public lblArea:eui.Label;
    public lblAward:eui.Label;
    public btnGet:eui.Button;
    public imgGot:eui.Image;
    public imgIcon:AutoBitmap;

    public constructor()
    {
        super();
        this.skinName = ActFundRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        Http.inst.addCmdListener(CmdID.ACTIVITY,this.onBack,this);
    }

    private onHide(event: egret.Event): void
    {
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        Http.inst.removeCmdListener(CmdID.ACTIVITY,this.onBack,this);
    }

    private onBack(e:egret.Event):void
    {
        this.dataChanged();
    }

    private onGet():void
    {
        Http.inst.send(CmdID.ACTIVITY,{type:7,id:this.data});
    }

    public dataChanged(): void
    {
        super.dataChanged();
        var fundData:any = Config.DailyFundData[this.data];
        this.lblArea.text = fundData["floor"] + "关";
        var reward:any[] = fundData["reward_1"];
        var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
        this.lblAward.text = rewardData.name + "x" + reward[2];
        this.imgIcon.source = fundData["icon"] + "_png";

        if(UserProxy.inst.vipObj["fund"] )
        {
            if( UserMethod.inst.isBitGet(this.data,UserProxy.inst.vipObj["fundBit"]))
            {
                this.imgGot.visible = true;
                this.btnGet.visible = false;
            }
            else
            {
                this.imgGot.visible = false;
                this.btnGet.visible = true;
            }

            this.btnGet.enabled = UserProxy.inst.historyArea > parseInt( fundData["floor"]);

        }
        else
        {
            this.imgGot.visible = false;
            this.btnGet.enabled = false;
        }



    }

}