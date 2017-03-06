/**
 * Created by Administrator on 12/1 0001.
 */
class WeaponInfoPanel extends BasePanel
{
    public weaponIcon:WeaponIcon;
    public lblLv:eui.Label;
    public lblName:eui.Label;
    public lblMaxLv:eui.Label;
    public weaponEffectList:eui.List;
    public lblDec:eui.Label;
    public groupGroup:eui.Group;
    public btnRecover:YellowBigBtn;
    public suitGroup:eui.Group;
    public btnGroup:eui.Group;
    public lblSuitName:eui.Label;
    public icon:WeaponIcon;
    public btnClose:SimpleButton;
    public lblBack:eui.Label;
    public imgBack1:AutoBitmap;
    public imgBack2:AutoBitmap;
    public lblBackDes2:eui.Label;
    public lblBack2:eui.Label;
    public coinShow:CoinShowPanel;

    private _isHad:boolean ;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = WeaponInfoPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnRecover.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRecover,this);
        this.weaponEffectList.itemRenderer = WeaponSuitRenderer;

        this.coinShow.startListener();
    }

    public initData(): void
    {
        var weaponInfo:any = UserProxy.inst.weaponList[this.data];
        var weaponData:any = Config.WeaponData[this.data];
        var addNature1:number = parseFloat(weaponData["attr_1"][2]);
        var addNature2:number = 0;
        if(weaponData["attr_2"])
        {
            addNature2 =  parseFloat(weaponData["attr_2"][2]);
        }
        if(weaponInfo)
        {
            this.btnGroup.visible = true;
            this._isHad = true;

            var nowLv:number = weaponInfo["lv"];
            addNature1 *= (1+0.1*weaponInfo["lv"]);

            addNature2 *= (1+0.1*weaponInfo["lv"]);
        }
        else
        {
            this._isHad = false;
            this.btnGroup.visible = false;
        }


        var dec1:string = UserMethod.inst.getAddSting(weaponData["attr_1"],addNature1);
        var dec2:string = "";
        if(addNature2)
        {
            dec2 =  UserMethod.inst.getAddSting(weaponData["attr_2"],addNature2);
        }

        this.lblDec.text = dec1 + "\n" + dec2;

        this.icon.imageBg.source = "weapon_icon_" +  weaponData["rank"] + "_png";
        this.icon.imageIcon.source = Global.getWeaponURL(this.data);

        if(weaponInfo &&nowLv)
        {
            this.lblLv.text = "+" + nowLv;
        }
        else
        {
            this.lblLv.visible = false;
        }

        this.btnRecover.label = Config.BaseData[19]["value"];
        this.btnRecover.extraLabel = "熔炼装备";

        this.lblMaxLv.text = "maxLv:" + weaponData["maxlv"];
        this.lblName.text = weaponData["name"];



        var costTypes:any = UserMethod.inst.getWeaponCostType(weaponData["cost"]);
        var costType1:Object = costTypes[0];
        var costType2:Object = costTypes[1];
        if(weaponData["rank"] < 3) //一个货币
        {
            var cost1:number = parseFloat(costType1["value"]) * (1 + 0.2 * nowLv *( nowLv + 1)/2);
            var id:number = parseFloat(costType1["key"]) + 9;
            this.imgBack1.source = UserMethod.inst.rewardJs[id].icon_s;
            this.lblBack.text = MathUtil.easyNumber(cost1)  +"（100%返还材料）";

            this.lblBack2.visible = false;
            this.imgBack2.visible = false;
            this.lblBackDes2.visible = false;
        }
        else
        {
            var cost1:number = parseFloat(costType1["value"]) * (1 + 0.2 *(1 + nowLv) * nowLv/2);
            var cost2:number = parseFloat(costType2["value"]) * (1 + 0.2 *(1 + nowLv) * nowLv/2);
            var id1:number = parseInt(costType1["key"]) + 9;
            var id2:number = parseInt(costType2["key"]) + 9;
            this.imgBack1.source = UserMethod.inst.rewardJs[id1].icon_s;
            this.imgBack2.source = UserMethod.inst.rewardJs[id2].icon_s;
            this.lblBack.text = MathUtil.easyNumber(cost1)  +"（100%返还材料）";
            this.lblBack2.text = MathUtil.easyNumber(cost2)  +"（100%返还材料）";

        }


        if(weaponData["suit"])
        {
            this.suitGroup.visible = true;
            this.btnGroup.y = 550;
            var suitData:any = Config.WeaponSuit[weaponData["suit"]];
            this.lblSuitName.text = suitData["name"];

            var hadCount:number = 0;
            //套装物品
            var length:number = suitData["itemgroup"].length;
            for(var i:number = 0; i < length; i++)
            {
                var weaponIcon:WeaponIcon = <WeaponIcon>DisplayUtil.getChildByName(this.groupGroup,"weapon" + i);
                weaponIcon.visible = true;
                var weaponId:number = suitData["itemgroup"][i];
                var weaponData:any = Config.WeaponData[weaponId];
                var weaponInfo:any = UserProxy.inst.weaponList[weaponId];
                weaponIcon.imgBg = "weapon_icon_" +  weaponData["rank"] + "_png";
                weaponIcon.imgIcon = Global.getWeaponURL(weaponId);

                if(weaponInfo )
                {
                    hadCount++;
                }
            }

            //效果
            var attrs:any[] = [];
            for(var i:number = 1; i<= parseInt(suitData["attr_count"]); i++)
            {
                var attr:Object = {"buff":suitData["attr_" + i],"needCount":suitData["suitnum"][i-1],"hadCount":hadCount};
                attrs.push(attr);
            }
            this.weaponEffectList.dataProvider = new eui.ArrayCollection(attrs);
        }
        else
        {
            this.suitGroup.visible = false;
            this.btnGroup.y = 310;
        }

    }


    private onRecover(e:egret.TouchEvent):void
    {
        if(UserProxy.inst.costAlart)
        {
            this.showCost();
        }
        else
        {
            Alert.showCost(Config.BaseData[19]["value"],"熔炼装备",true,this.showCost,null,this);
        }
    }

    private showCost():void
    {
        if(UserProxy.inst.diamond >= parseInt(Config.BaseData[19]["value"]))
        {
            Http.inst.send(CmdID.WEAPON_SHOP_SELL,{wid:this.data});
            this.onClose();
        }
        else
        {
            ExternalUtil.inst.diamondAlert();
        }
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("WeaponInfoPanel");
    }

    public destory():void
    {
        super.destory();
        this.btnRecover.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRecover,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.coinShow.endListener();
    }


}