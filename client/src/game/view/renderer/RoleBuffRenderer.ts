/**
 * Created by Administrator on 11/28 0028.
 */
class RoleBuffRenderer extends eui.ItemRenderer
{
    private imgIcon:AutoBitmap;
    private lblDec:eui.Label;
    private lblExterAdd:eui.Label;
    private lblOpenLv:eui.Label;
    private imgMask:AutoBitmap;
    private lblOpen:eui.Label;

    public constructor()
    {
        super();
        this.skinName = RoleBuffRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        Http.inst.addCmdListener(CmdID.ENHANCE_UP,this.dataChanged,this);
        Http.inst.addCmdListener(CmdID.ENHANCE_RESET,this.dataChanged,this);

    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.ENHANCE_UP,this.dataChanged,this);
        Http.inst.removeCmdListener(CmdID.ENHANCE_RESET,this.dataChanged,this);

    }

    public dataChanged(): void
    {
        super.dataChanged();

        var data:any = this.data.concat();
        var openLv:number = data.shift();
        this.lblOpenLv.text = "Lv." + openLv;
        this.lblDec.text = UserMethod.inst.getAddSting(data);

        this.showTalentIcon(parseInt(data[1]),parseFloat(data[2]));
        this.lblExterAdd.visible = false;
        this.lblExterAdd.text = "+" + StringUtil.toFixed(data[2]*200 )+ "%(强化)" ;
        this.lblExterAdd.x = 70 + this.lblDec.width ;
        this.lblOpen.x = 70 + this.lblOpenLv.width;

        var roleInfo = UserProxy.inst.heroData.getHeroData(UserMethod.inst.roleSelectId);
        if(roleInfo.level >= openLv)
        {
            //解锁
            this.lblOpenLv.textColor = 0xA74E0D;
            this.lblOpen.textColor = 0xA74E0D;
            this.lblDec.textColor = 0x583C26;

            this.imgMask.visible = false;

            if(roleInfo.strengthenLevel >= openLv)
            {
                this.lblExterAdd.visible = true;
                this.lblExterAdd.textColor = 0x2CA87B;
            }
            else
            {
                this.lblExterAdd.textColor = 0x856D58;
            }

        }
        else
        {
            this.lblOpenLv.textColor = 0x856D58;
            this.lblOpen.textColor = 0x856D58;
            this.lblDec.textColor = 0x856D58;
            this.lblExterAdd.textColor = 0x856D58;
            this.imgMask.visible = true;
        }
    }

    private showTalentIcon(target:number,value:number):void
    {
        var iconStr:string;
       switch (target)
       {

           case 2:
               if(value < 3)
               {
                   iconStr = Global.getTalentIcon(4);
               }
               else if(value >= 3 && value < 4.5)
               {
                   iconStr = Global.getTalentIcon(5);
               }
               else
               {
                   iconStr = Global.getTalentIcon(6);
               }
               break;
           case 3:
               if(value < 4.5)
               {
                   iconStr = Global.getTalentIcon(7);
               }
               else if(value >= 4.5 && value < 6.75)
               {
                   iconStr = Global.getTalentIcon(8);
               }
               else
               {
                   iconStr = Global.getTalentIcon(9);
               }
               break;
           case 4:
               if(value < 4.5)
               {
                   iconStr = Global.getTalentIcon(10);
               }
               else if(value >= 4.5 && value < 6.75)
               {
                   iconStr = Global.getTalentIcon(11);
               }
               else
               {
                   iconStr = Global.getTalentIcon(12);
               }
               break;
           case 5:
               if(value < 4.5)
               {
                   iconStr = Global.getTalentIcon(13);
               }
               else if(value >= 4.5 && value < 6.75)
               {
                   iconStr = Global.getTalentIcon(14);
               }
               else
               {
                   iconStr = Global.getTalentIcon(15);
               }
               break;
           default:
               if(value < 7.5)
               {
                   iconStr = Global.getTalentIcon(1);
               }
               else if(value >= 7.5 && value < 11.3)
               {
                   iconStr = Global.getTalentIcon(2);
               }
               else
               {
                   iconStr = Global.getTalentIcon(3);
               }
               break;
       }

       this.imgIcon.source = iconStr;

    }

}