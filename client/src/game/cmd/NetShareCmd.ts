/**
 * Created by Administrator on 1/12 0012.
 */
class NetShareCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.shareObj = this.data["shareObj"];
        UserMethod.inst.showAward(this.data);
    }
}

class NetInviteCmd extends  BaseCmd
{
    public execute()
    {
        UserProxy.inst.inviteUserInfos = this.data["userInfos"];
        TopPanel.inst.showPoint(2);
        TopPanel.inst.checkHide();
    }
}

class NetInvitePriceCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.inviteObj = this.data["inviteObj"];
        UserMethod.inst.showAward(this.data);
        TopPanel.inst.showPoint(2);
        TopPanel.inst.checkHide();
    }
}

class NetSharePriceCmd extends BaseCmd
{
    public execute()
    {
        UserMethod.inst.showAward(this.data);
        UserProxy.inst.shareObj = this.data["shareObj"];
        TopPanel.inst.showPoint(11,2);
        ActivePanel.inst.checkPoint(2);
    }
}

class NetShareHeroPriceCmd extends BaseCmd
{
    public execute()
    {
        var bonusList:BonusList = new BonusList();
        if(this.data["diamond"])
        {
            var addDiamond:number = this.data["diamond"] - UserProxy.inst.diamond;
            UserProxy.inst.diamond = this.data["diamond"];
            if(addDiamond > 0)
            {
                bonusList.push(BonusType.GOLD, addDiamond);
            }
        }
        bonusList.show();

        var roleData = UserProxy.inst.heroData.getHeroData(this.data["id"]);
        roleData.evolution = 1;
    }

}

class NetRechargeCmd extends BaseCmd
{
    public execute()
    {
        super.execute();

        if(this.data["rechargeFlag"])
        {
            UserProxy.inst.rechargeFlag = this.data["rechargeFlag"];
        }
        if(this.data["vipObj"])
        {
            UserProxy.inst.vipObj = this.data["vipObj"];
        }

        if(this.data["rmbDays"])
        {
            UserProxy.inst.rmbDays = this.data["rmbDays"];
        }

        if(this.data["rmbAct"])
        {
            var actWord:any = UserProxy.inst.activityObj[102];
            actWord["rmbAct"] = this.data["rmbAct"];
            TopPanel.inst.showPoint(8,1);
        }

        if(this.data["todayRMB"])
        {
            var actWord:any = UserProxy.inst.activityObj[106];
            actWord["todayRMB"] = this.data["todayRMB"];
            TopPanel.inst.showPoint(8,4);
        }


        UserMethod.inst.showAward(this.data);
        EventManager.inst.dispatch(ContextEvent.RECHARGE_BACK);
    }

}