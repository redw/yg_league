/**
 * Created by Administrator on 12/5 0005.
 */
class WeaponBuyRenderer extends eui.ItemRenderer
{
    public contentGroup:eui.Group;
    public btnBuy:YellowTwoCoinBtn;
    public icon:WeaponIcon;
    public lblName:eui.Label;
    public lblDec:eui.Label;
    public imgBuy:eui.Image;

    public constructor()
    {
        super();
        this.skinName = WeaponBuyRendererSkin;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    private onShow(event:egret.Event):void
    {
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onWeaponBuy,this);
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowWeapon,this);
    }

    private onHide(event:egret.Event):void
    {
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onWeaponBuy,this);
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowWeapon,this);

    }

    private onWeaponBuy(e:egret.TouchEvent):void
    {
        if(UserMethod.inst.getWeaponCount() >= UserProxy.inst.maxNum)
        {
            if(UserProxy.inst.buyNum > 7)
            {
                Notice.show("装备栏放不下装备了！");
            }
            else
            {
                this.onAdd();
            }

            return;
        }

        Http.inst.send(CmdID.WEAPON_SHOP_BUY,{idx:this.data});
    }

    private onAdd():void
    {
        var cost:number = parseInt(Config.BaseData[13]["value"][UserProxy.inst.buyNum]);

        Alert.showCost(cost,"添加装备栏",true,showCost,null,this);


        function showCost():void
        {
            if(UserProxy.inst.diamond >= cost)
            {
                Http.inst.send(CmdID.WEAPON_POS_BUY);
            }
            else
            {
                ExternalUtil.inst.diamondAlert();
            }
        }
    }


    private onShowWeapon(e:egret.TouchEvent):void
    {
        var weaponShopInfo:any = UserProxy.inst.weaponShop[this.data];
        var weaponId:number = weaponShopInfo["id"];
        PanelManager.inst.showPanel("WeaponInfoPanel", weaponId);
    }

    public dataChanged(): void
    {
        super.dataChanged();

        var weaponShopInfo:any = UserProxy.inst.weaponShop[this.data];
        var weaponId:number = weaponShopInfo["id"];
        var state:number = weaponShopInfo["state"];
        var weaponData:any = Config.WeaponData[weaponId];
        this.lblName.text = weaponData["name"];
        var dec1:string = UserMethod.inst.getAddSting(weaponData["attr_1"]);
        var dec2:string = "";
        if(weaponData["attr_2"])
        {
            dec2 = UserMethod.inst.getAddSting(weaponData["attr_2"]);
        }
        this.lblDec.text = dec1 + "\n" + dec2;
        this.icon.imageBg.source = "weapon_icon_" +  weaponData["rank"] + "_png";
        this.icon.imageIcon.source = Global.getWeaponURL(weaponId);

        var costTypes:any = UserMethod.inst.getWeaponCostType(weaponData["cost"]);
        var costType1:Object = costTypes[0];
        var costType2:Object = costTypes[1];

        this.btnBuy.visible = state == 0;
        this.imgBuy.visible = state != 0;
        if(weaponData["rank"] < 3) //一个货币
        {
            this.btnBuy.imageType.y = 14;
            this.btnBuy.labelDisplay.y = 22;
            this.btnBuy.imageType1.visible = false;
            this.btnBuy.labelDisplay1.visible = false;
            var id:number = parseInt(costType1["key"]) + 9;
            this.btnBuy.type = UserMethod.inst.rewardJs[id].icon_s;
            this.btnBuy.label = MathUtil.easyNumber(costType1["value"]);
            this.btnBuy.enabled = parseInt(costType1["value"]) <= UserProxy.inst.weaponCoin[costType1["key"]];
        }
        else
        {
            var id1:number = parseInt(costType1["key"]) + 9;
            var id2:number = parseInt(costType2["key"]) + 9;
            this.btnBuy.type = UserMethod.inst.rewardJs[id1].icon_s;
            this.btnBuy.label = MathUtil.easyNumber(costType1["value"]);
            this.btnBuy.type1 = UserMethod.inst.rewardJs[id2].icon_s;
            this.btnBuy.label1 = MathUtil.easyNumber(costType2["value"]);

            var oneCan:boolean = parseInt(costType1["value"]) <= UserProxy.inst.weaponCoin[costType1["key"]];
            var twoCan:boolean = parseInt(costType2["value"]) <= UserProxy.inst.weaponCoin[costType2["key"]];
            this.btnBuy.enabled = (oneCan && twoCan) ;
        }
    }
}
