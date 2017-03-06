/**
 * Created by Administrator on 12/19 0019.
 */
class NetMakeMoneyCmd extends BaseCmd
{
    public execute():void
    {
        super.execute();
        EventManager.inst.dispatch(ContextEvent.ADD_EARN_MONEY,this.data["gold"]);
        // UserProxy.inst.gold = this.data["gold"];
        // EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    }
}

class NetMoneyUpCmd extends BaseCmd
{
    public execute():void
    {
        super.execute();
        UserProxy.inst.gold = this.data["gold"];
        for(var i in this.data["makeMoney"])
        {
            UserProxy.inst.makeMoney[i] = this.data["makeMoney"][i];
        }
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    }
}

class NetAutoMoneyCmd extends BaseCmd
{
    public execute():void
    {
        super.execute();
        if(this.data["gold"] != undefined)
        {
            UserProxy.inst.gold = this.data["gold"];
        }

        if(this.data["diamond"] != undefined)
        {
            UserProxy.inst.diamond = this.data["diamond"];
        }

        for(var i in this.data["makeMoney"])
        {
            UserProxy.inst.makeMoney[i] = this.data["makeMoney"][i];
        }

        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    }

}

