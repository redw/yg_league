/**
 * Created by Administrator on 11/28 0028.
 */
class RoleShipRenderer extends eui.ItemRenderer
{
    private contentGroup:eui.Group;
    private btnShipUp:YellowCoinButton;
    private lblDic:eui.Label;
    private lblNextAdd:eui.Label;
    private lblName:eui.Label;
    private lblLv:eui.Label;
    private _length:number;

    public constructor()
    {
        super();
        this.skinName = RoleShipRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnShipUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpShip,this);
        EventManager.inst.addEventListener(ContextEvent.HERO_SHIP_UP,this.onUpShipBack,this);
        Http.inst.addCmdListener(CmdID.STAR_UP,this.dataChanged,this);

        for(var i:number = 0;i < 5 ; i++)
        {
            var roleIcon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this.contentGroup,"roleIcon" + i);
            roleIcon.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHead,this);
        }

    }

    private onHide(event:egret.Event):void
    {
        this.btnShipUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpShip,this);
        EventManager.inst.removeEventListener(ContextEvent.HERO_SHIP_UP,this.onUpShipBack,this);
        Http.inst.removeCmdListener(CmdID.STAR_UP,this.dataChanged,this);
        for(var i:number = 0;i < 5 ; i++)
        {
            var roleIcon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this.contentGroup,"roleIcon" + i);
            roleIcon.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHead,this);
        }
    }

    private onUpShip():void
    {
        Http.inst.send(CmdID.RELATIONSHIP,{rid:this.data});
    }

    private onHead(e:egret.TouchEvent):void
    {
        var id:number = e.currentTarget["id"];
        if(id)
        {
            PanelManager.inst.showPanel("RoleDrawInfoPanel",{id:id,from:0});
        }

    }

    private onUpShipBack(e:egret.Event):void
    {
        if(e.data == this.data)
        {
            for(let i:number = 0;i < this._length ; i++)
            {
                MovieClipUtils.createMovieClip(Global.getOtherEffect("rise_ship"),"rise_ship",afterAdd,this);
                function afterAdd(data): void
                {
                    let mc = data;
                    mc.x = 10 + i * 60;
                    mc.y = 6 ;
                    mc.touchEnabled = false;
                    this.contentGroup.addChild(mc);
                    MovieClipUtils.playMCOnce(mc,function(): void
                    {
                        DisplayUtil.removeFromParent(mc);
                    },this);
                }
            }
            this.dataChanged();
        }
    }

    public dataChanged(): void
    {
        super.dataChanged();
        for(var i:number = 0;i < 5 ; i++)
        {
            var roleIcon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this.contentGroup,"roleIcon" + i);
            var roleGray:eui.Image = <eui.Image>DisplayUtil.getChildByName(this.contentGroup,"roleGray" + i);
            roleIcon.visible = false;
            roleGray.visible = false;
            roleIcon["id"] = null;
        }

        var shipId:number = this.data;
        var shipData:any = Config.FriendshipData[shipId];
        var shipInfo:any = UserProxy.inst.relationship[shipId];
        this.lblName.text = shipData["name"];
        this.lblLv.text = "Lv." + shipInfo["lv"];
        this._length = shipData["herogroup"].length;
        var starCount:number = 0;
        var notHad:boolean = true;
        for(var i:number = 0;i < this._length ; i++)
        {
            var roleId:number = shipData["herogroup"][i];
            var roleIcon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this.contentGroup,"roleIcon" + i);
            var roleGray:eui.Image = <eui.Image>DisplayUtil.getChildByName(this.contentGroup,"roleGray" + i);
            roleIcon.visible = true;
            var roleInfo = UserProxy.inst.heroData.getValue(roleId);
            roleIcon["id"] = roleId;
            roleIcon.setLv = 0;
            roleIcon.setStar = roleInfo.starLevel;
            roleIcon.imgIcon = Global.getChaIcon(roleId);

            starCount += roleInfo.starLevel;
            if(!roleInfo.starLevel)
            {
                notHad = false;
                roleGray.visible = true;
            }
        }

        var shipLv:number = shipInfo["lv"];
        var value:number[] = shipData["attr_1"];
        var par:number = value[2]*(Math.pow(parseFloat(shipData["attr_parm"]),shipLv - 1) );
        var nextPar:number = value[2]*(Math.pow(parseFloat(shipData["attr_parm"]),shipLv) );
        var needStar:number = shipData["stars"][shipLv];
        this.lblDic.text = UserMethod.inst.getAddSting(value,shipLv?par:0);
        this.lblNextAdd.x = 16 + this.lblDic.width;

        if(shipLv >= 10)
        {
            this.lblNextAdd.visible = false;
            this.btnShipUp.label = "MAX";
            this.btnShipUp.enabled = false;
        }
        else
        {
            this.lblNextAdd.text = "(+" + StringUtil.toFixed(nextPar * 100) + "%)";
            this.btnShipUp.label = starCount + "/" + needStar;
        }


        this.btnShipUp.coinType = "common_star_png";

        if(shipLv)
        {
            this.btnShipUp.extraLabel = "情缘进阶";
        }
        else
        {
            this.btnShipUp.extraLabel = "情缘激活";
        }

        this.btnShipUp.enabled = (starCount >= needStar && notHad);

    }
}