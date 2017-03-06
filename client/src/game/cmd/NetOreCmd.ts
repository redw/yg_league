/**
 * Created by Administrator on 2/24 0024.
 */
class NetOreCmd extends BaseCmd
{
    public execute()
    {
        var bonusList:BonusList = new BonusList();
        var add:number = this.data["home"]["ore"] - UserProxy.inst.home["ore"];
        if(add > 0)
        {
            bonusList.push(BonusType.ORE, add);
        }
        bonusList.show();

        UserProxy.inst.home = this.data["home"];
        UserProxy.inst.ore = UserProxy.inst.home["ore"];
        MenuPanel.inst.checkMine();
    }
}

class NetBuildingUpCmd extends BaseCmd
{
    public execute()
    {
        UserProxy.inst.ore = this.data["ore"];
        UserProxy.inst.building = this.data["building"];

        UserMethod.inst.setExterAdd();
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);

        MenuPanel.inst.checkMine();
    }
}

class NetMineUp extends BaseCmd
{
    public execute()
    {
        UserProxy.inst.ore = this.data["ore"];
        UserProxy.inst.home["mine"] = this.data["mine"];
        MenuPanel.inst.checkMine();
    }
}