/**
 * Created by Administrator on 12/5 0005.
 */
class NetWeaponShopCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        if(this.data["diamond"] || this.data["diamond"] == 0)
        {
            UserProxy.inst.diamond = this.data["diamond"];
        }

        UserProxy.inst.weaponShop = this.data["weaponShop"];
        if(this.data["weaponShopResetLastTime"])
        {
            UserProxy.inst.weaponShopResetLastTime = this.data["weaponShopResetLastTime"];
        }
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    }
}

class NetWeaponBuyCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.weaponCoin = this.data["weaponCoin"];
        for(var i in this.data["weaponList"])
        {
            UserProxy.inst.weaponList[i] = this.data["weaponList"][i];
        }

        UserMethod.inst.setExterAdd();
        UserProxy.inst.weaponShop = this.data["weaponShop"];
        // EventManager.inst.dispatch(ContextEvent.ROLE_DATA_UPDATE);
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON);
        EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON_COIN);


    }

}

class NetWeaponUpCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.weaponCoin = this.data["weaponCoin"];
        for(var i in this.data["weaponList"])
        {
            UserProxy.inst.weaponList[i] = this.data["weaponList"][i];
        }
        UserMethod.inst.setExterAdd();
        // EventManager.inst.dispatch(ContextEvent.ROLE_DATA_UPDATE);
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON_COIN);


    }
}

class NetWeaponSellCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.weaponList = this.data["weaponList"];
        UserMethod.inst.setExterAdd();
        EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON);

        UserMethod.inst.showAward(this.data);
        // EventManager.inst.dispatch(ContextEvent.ROLE_DATA_UPDATE);
    }
}

class NetWeaponPosBuyCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.maxNum = this.data["maxNum"];
        UserProxy.inst.buyNum = this.data["buyNum"];
        UserProxy.inst.diamond = this.data["diamond"];
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    }
}
