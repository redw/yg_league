/**
 * Created by Administrator on 12/1 0001.
 */
class WeaponRenderer extends eui.ItemRenderer
{
    public weaponUnlockGroup:SimpleGroup;
    public lblUnlockCost1:eui.Label;
    public contentGroup:eui.Group;
    public icon:WeaponIcon;
    public lblName:eui.Label;
    public lblDec:eui.Label;
    public btnUp:YellowTwoCoinBtn;
    public lblLv:eui.Label;


    public constructor()
    {
        super();
        this.skinName = WeaponRendererSkin;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onWeaponUp,this);
        this.weaponUnlockGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAddWeaponCell,this);
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowWeapon,this);
        Http.inst.addCmdListener(CmdID.WEAPON_UP,this.dataChanged,this);
    }

    private onHide(event:egret.Event):void
    {
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onWeaponUp,this);
        this.weaponUnlockGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onAddWeaponCell,this);
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onShowWeapon,this);
        Http.inst.removeCmdListener(CmdID.WEAPON_UP,this.dataChanged,this);
    }

    private onWeaponUp(e:egret.TouchEvent):void
    {
        Http.inst.send(CmdID.WEAPON_UP,{wid:this.data});
    }

    private onAddWeaponCell(e:egret.TouchEvent):void
    {
        this.onAdd();
    }

    private onAdd():void
    {
        var cost:number = parseInt(Config.BaseData[13]["value"][UserProxy.inst.buyNum]);
        if(UserProxy.inst.costAlart)
        {
            showCost();
        }
        else
        {
            Alert.showCost(cost,"添加装备栏",true,showCost,null,this);
        }

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
        PanelManager.inst.showPanel("WeaponInfoPanel",this.data);
    }


    public dataChanged(): void
    {
        super.dataChanged();

        if(this.data)
        {
            this.weaponUnlockGroup.visible = false;
            this.contentGroup.visible = true;
            this.btnUp.visible = true;
            var weaponInfo:any = UserProxy.inst.weaponList[this.data];
            var weaponData:any = Config.WeaponData[this.data];
            this.lblName.text = weaponData["name"];
            var addNature1:number = parseFloat(weaponData["attr_1"][2]) * (1+0.1*weaponInfo["lv"]);
            var dec1:string = UserMethod.inst.getAddSting(weaponData["attr_1"],addNature1);

            var dec2:string = "";
            if(weaponData["attr_2"])
            {
                var addNature2:number =  parseFloat(weaponData["attr_2"][2]) * (1+0.1*weaponInfo["lv"]);
                dec2 =  UserMethod.inst.getAddSting(weaponData["attr_2"],addNature2);
            }
            this.lblDec.text = dec1 + "\n" + dec2;
            this.lblLv.text = "+" + weaponInfo["lv"];
            this.lblLv.visible = weaponInfo["lv"] > 0;
            this.icon.imageBg.source = "weapon_icon_" +  weaponData["rank"] + "_png";
            this.icon.imageIcon.source = Global.getWeaponURL(this.data);

            var costTypes:any = UserMethod.inst.getWeaponCostType(weaponData["cost"]);
            var costType1:Object = costTypes[0];
            var costType2:Object = costTypes[1];

            this.btnUp.labelDisplay.x = 42;
            if(weaponData["rank"] < 3) //一个货币
            {
                this.btnUp.imageType.y = 14;
                this.btnUp.labelDisplay.y = 22;
                this.btnUp.labelDisplay.visible = true;
                this.btnUp.imageType.visible = true;
                this.btnUp.imageType1.visible = false;
                this.btnUp.labelDisplay1.visible = false;
                var id:number = parseInt(costType1["key"]) + 9;
                this.btnUp.type = UserMethod.inst.rewardJs[id].icon_s;
                var cost:number = parseInt(costType1["value"]) * 0.2 * (parseInt(weaponInfo["lv"]) + 1);
                this.btnUp.label = MathUtil.easyNumber(cost);

                this.btnUp.enabled = UserProxy.inst.weaponCoin[costType1["key"]] >= cost;
            }
            else
            {
                this.btnUp.labelDisplay.visible = true;
                this.btnUp.imageType.visible = true;
                this.btnUp.imageType1.visible = true;
                this.btnUp.labelDisplay1.visible = true;

                this.btnUp.imageType.y = 4;
                this.btnUp.labelDisplay.y = 11;

                this.btnUp.imageType1.y = 26;
                this.btnUp.labelDisplay1.y = 33;


                var id1:number = parseInt(costType1["key"]) + 9;
                var id2:number = parseInt(costType2["key"]) + 9;
                this.btnUp.type = UserMethod.inst.rewardJs[id1].icon_s;
                this.btnUp.type1 = UserMethod.inst.rewardJs[id2].icon_s;
                var cost1:number =  parseInt(costType1["value"]) * 0.2 * (parseInt(weaponInfo["lv"])+1);
                var cost2:number =  parseInt(costType2["value"]) * 0.2 * (parseInt(weaponInfo["lv"])+1);
                this.btnUp.label = MathUtil.easyNumber(cost1);
                this.btnUp.label1 = MathUtil.easyNumber(cost2);
                this.btnUp.enabled = UserProxy.inst.weaponCoin[costType1["key"]] >= cost1 && UserProxy.inst.weaponCoin[costType2["key"]] >= cost2;

            }


            if(weaponInfo["lv"] >= weaponData["maxlv"])
            {
                this.btnUp.labelDisplay.y = 22;
                this.btnUp.labelDisplay.x = 32;
                this.btnUp.imageType1.visible = false;
                this.btnUp.labelDisplay1.visible = false;
                this.btnUp.imageType.visible = false;
                this.btnUp.label = "MAX";

                this.btnUp.enabled = false;
            }


        }
        else
        {
            this.contentGroup.visible = false;
            this.weaponUnlockGroup.visible = true;
            this.btnUp.visible = false;
            if(UserProxy.inst.buyNum >= 8)
            {
                this.weaponUnlockGroup.visible = false;
            }
            else
            {
                this.lblUnlockCost1.text = Config.BaseData[13]["value"][UserProxy.inst.buyNum];
            }

        }

    }
}