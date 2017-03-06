/**
 * Created by Administrator on 2/21 0021.
 */
class MineFormationPanel extends BasePanel
{
    private btnBack:eui.Button;
    private lblProduct:eui.Label;
    private roleList:eui.List;

    private _action:boolean = false;
    private _selectIdx:number;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = MineFormationPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init():void
    {
        EventManager.inst.addEventListener(ContextEvent.MINE_UP_CHANGE,this.onAddRole,this);
        Http.inst.addCmdListener(CmdID.MINE_HERO,this.onFormationBack,this);

        for(var i:number = 0;i < 6; i++)
        {
            var roleGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"role" + i);
            roleGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDown,this);
            var btnPos:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this,"btnPos" + i);
            btnPos.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUp,this);
        }

        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBackSure,this);
        this.roleList.itemRenderer = MineInRoleRenderer;

    }

    public initData():void
    {
        var cavernId:number = this.data;
        var mineData:any = UserProxy.inst.home["mine"];
        var cavernData:any = mineData[cavernId];
        this.lblProduct.text = cavernData["outputPerSec"];

        UserMethod.inst.home_up_arr = [];
        UserMethod.inst.home_up_arr = cavernData["pos"].concat();
        this.changeNow();
    }

    private onAddRole(e:egret.Event):void
    {
        if(this._selectIdx < 0)
        {
            Notice.show("没有合适的位置！");
            return;
        }
        UserMethod.inst.home_up_arr[this._selectIdx] = parseInt(e.data);

        this.changeNow();
    }

    private changeNow():void
    {
        this.showStay(UserMethod.inst.home_up_arr);
        this.refresh();
    }

    private showStay(pos:number[]):void
    {
        var productOut:number = 0;
        this._selectIdx = -1;
        for(var i:number = 0;i < 6; i++)
        {
            var roleGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"role" + i);
            var icon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(roleGroup,"icon");
            var produce:eui.Label = <eui.Label>DisplayUtil.getChildByName(roleGroup,"produce");
            icon.y = 0;
            icon.alpha = 1;
            var btnPos1:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this,"btnPos" + i);

            if(pos[i])
            {
                btnPos1.visible = false;
                roleGroup.visible = true;

                var id:number = pos[i];
                roleGroup["id"] = id;
                var roleData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
                icon.imgIcon = Global.getChaIcon(id);
                icon.setStar = roleData.starLevel;
                icon.setLv = 0;

                var oreData:any = Config.OreData[roleData.starLevel];
                var number:number = parseInt(oreData["num_" + roleData.config.quality]);
                produce.text = number + "";
                productOut += number;
            }
            else
            {
                if(this._selectIdx < 0)
                {
                    this._selectIdx = i;
                }

                btnPos1.visible = true;
                roleGroup.visible = false;
            }
        }

        this.lblProduct.text = productOut + "";

    }

    private refresh():void
    {
        var heroIds:number[] = UserProxy.inst.heroData.getHeroIds();
        var idsLength:number = heroIds.length;
        var useIds:number[] = [];
        var notUseIds:number[] = [];
        var idArrays:any[] = [];
        var mineData:any = UserProxy.inst.home["mine"];
        for(var i in mineData)
        {
            if(this.data == parseInt(i))
            {
                for(var c in UserMethod.inst.home_up_arr)
                {
                    var id:number = UserMethod.inst.home_up_arr[c];
                    if(id)
                    {
                        useIds.push(id);
                    }
                }
            }
            else
            {
                for(var c in mineData[i]["pos"])
                {
                    var id:number = mineData[i]["pos"][c];
                    if(Number(id))
                    {
                        useIds.push(Number(id));
                    }
                }
            }
        }

        for(var j:number = 0; j < idsLength ;j++)
        {
            var id:number = Number(heroIds[j]);
            var roleData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
            if(useIds.indexOf(id) <= -1 && roleData.starLevel)
            {
                notUseIds.push(id);

                if(notUseIds.length == 6)
                {
                    idArrays.push(notUseIds);
                    notUseIds = [];
                }
            }
        }
        idArrays.push(notUseIds);


        this.roleList.dataProvider = new eui.ArrayCollection(idArrays);
    }

    private onBackSure():void
    {
        if(this._action)
        {
            return;
        }

        var ids:number[] = [];
        for(var i:number = 0; i < 9; i++)
        {
            var id:number = Number(UserMethod.inst.home_up_arr[i]);
            if(id)
            {
                ids.push(id);
            }
            else
            {
                ids.push(0);
            }
        }
        Http.inst.send(CmdID.MINE_HERO,{id:this.data,pos:JSON.stringify(ids)});

    }

    private onDown(e:egret.TouchEvent):void
    {
        var roleGroup:eui.Group = e.currentTarget;
        var icon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(roleGroup,"icon");
        egret.Tween.get(icon).to({y:icon.y + 20,alpha:0},400);
        this._action = true;
        var id:number = roleGroup["id"];
        UserMethod.inst.home_up_arr[UserMethod.inst.home_up_arr.indexOf(id)] = 0;

        egret.setTimeout(function ()
        {
            this._action = false;
            this.changeNow();
        },this,400);
    }

    private onUp(e:egret.TouchEvent):void
    {
        var index: number = parseInt(e.currentTarget.name.replace("btnPos",""));
        this._selectIdx = index;
        EventManager.inst.dispatch(ContextEvent.MINE_NEED_UP,index);

    }

    private onFormationBack(e:egret.Event):void
    {
        var cavernId:number = this.data;
        var mineData:any = UserProxy.inst.home["mine"];
        var cavernData:any = mineData[cavernId];
        cavernData["outputPerSec"] = e.data["outputPerSec"];
        cavernData["pos"] = e.data["pos"];
        EventManager.inst.dispatch(ContextEvent.MiNE_FORMATION_CLOSE);

        PanelManager.inst.hidePanel("MineFormationPanel");
    }



    public destory():void
    {
        super.destory();
        EventManager.inst.removeEventListener(ContextEvent.MINE_UP_CHANGE,this.onAddRole,this);
        Http.inst.removeCmdListener(CmdID.MINE_HERO,this.onFormationBack,this);

        for(var i:number = 0;i < 6; i++)
        {
            var roleGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"role" + i);
            roleGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDown,this);
            var btnPos:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this,"btnPos" + i);
            btnPos.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUp,this);
        }

        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBackSure,this);
    }
}