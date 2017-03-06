/**
 * 英雄升级
 * Created by Administrator on 11/28 0028.
 */
class NetHeroUpCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        UserProxy.inst.gold = this.data["gold"];
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);

    }
}

class NetEnhanceUpCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        UserProxy.inst.medal = this.data["medal"];
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
    }
}

class NetEnhanceResetCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserMethod.inst.showAward(this.data);
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
    }
}

class NetStarUpCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.pill = this.data["pill"];

        var needRefresh:boolean = false;
        for(var i in this.data["heroList"])
        {
            var heroData:any = UserProxy.inst.heroData.getHeroData(i);
            var heroInfo:any = this.data["heroList"][i];
            if(heroData.starLevel == 0 && heroInfo["star"])
            {
                needRefresh = true;
                PanelManager.inst.showPanel("RoleDrawInfoPanel",{id:parseInt(i),from:1});
            }
        }
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
        if(needRefresh)
        {
            EventManager.inst.dispatch(ContextEvent.HAVE_NEW_ROLE);
        }
    }

}

class NetRelationCmd extends BaseCmd
{
    public execute()
    {
        super.execute();

        var refreshId:number ;
        for(var i in this.data["relationship"])
        {
            var data:any = this.data["relationship"][i];
            var info:any = UserProxy.inst.relationship[i];
            var newLv:number = data["lv"];
            var oldLv:number = info["lv"];
            if(newLv != oldLv)
            {
                refreshId = parseInt(i);
            }
            UserProxy.inst.relationship[i] = this.data["relationship"][i];
        }

        UserMethod.inst.setExterAdd();
        EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
        EventManager.inst.dispatch(ContextEvent.HERO_SHIP_UP,refreshId);
    }
}


class NetExchangeCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserMethod.inst.showAward(this.data);
    }
}