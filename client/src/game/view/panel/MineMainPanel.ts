/**
 * Created by Administrator on 2/16 0016.
 */
class MineMainPanel extends BasePanel
{
    public lblStone:eui.Label;
    public btnGoIn:SimpleButton;
    public btnClose:SimpleButton;
    public dingGroup:eui.Group;
    public poolGroup:eui.Group;
    public towerGroup:eui.Group;
    public imgTitle:AutoBitmap;
    public lblLv:eui.Label;
    public lblNow:eui.Label;
    public lblNext:eui.Label;
    public btnUp:eui.Button;
    public imgBar:eui.Image;
    public lblBar:eui.Label;

    private _selectId:number;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = MineMainPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        Http.inst.addCmdListener(CmdID.OPEN_HOME,this.showInfo,this);
        Http.inst.addCmdListener(CmdID.FARM_ORE,this.refreshStone,this);
        Http.inst.addCmdListener(CmdID.BUILDING_UP,this.buildingUp,this);
        Http.inst.addCmdListener(CmdID.MINE_UP,this.refreshStone,this);
        this.btnGoIn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.dingGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDing,this);
        this.poolGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onPool,this);
        this.towerGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTower,this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUp,this);

        this.lblStone.visible = false;
    }

    public initData():void
    {
        Http.inst.send(CmdID.OPEN_HOME);
    }

    private buildingUp():void
    {
        this.refreshStone();
        this.onSelect(this._selectId);
    }


    /**tower*/
    private towerAction():void
    {
        this.showTowerSelect(false);
        egret.Tween.get(this.towerGroup,{loop:true}).to({y:115},1000).to({y:125},1000);
    }

    private showTowerSelect(show:boolean):void
    {
        var tower_select:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this.towerGroup,"tower_select");
        if(tower_select)
        {
            tower_select.visible = show;
        }
        else
        {
            this.createTowerSelect(show);
        }
    }

    private createTowerSelect(show:boolean):void
    {
        MovieClipUtils.createMovieClip(Global.getOtherEffect("tower_select"),"tower_select",afterAdd,this);
        function afterAdd(data): void
        {
            var mc = data;
            mc.name = "tower_select";
            this.towerGroup.addChild(mc);
            mc.play(-1);
            mc.visible = show;
        }
    }

    private towerSelect():void
    {
        egret.Tween.removeTweens(this.towerGroup);
        this.towerGroup.y = 125;
        this.showTowerSelect(true);
    }

    /**pool*/
    private poolAction():void
    {
        this.showPoolSelect(false);
        var pool:egret.MovieClip = this.poolData();
        if(pool)
        {
            pool.play(-1);
        }

    }

    private poolData():egret.MovieClip
    {
        var pool:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this.poolGroup,"pool");
        if(pool)
        {
            return pool;
        }
        else
        {
            MovieClipUtils.createMovieClip(Global.getOtherEffect("pool"),"pool",afterAdd,this);
            function afterAdd(data): void
            {
                var mc = data;
                mc.name = "pool";
                this.poolGroup.addChild(mc);
                mc.play(-1);

                this.onPool();
                return mc;
            }
        }
    }

    private showPoolSelect(show:boolean):any
    {
        var pool_select:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this.poolGroup,"pool_select");
        if(pool_select)
        {
            pool_select.visible = show;
        }
        else
        {
            this.createPoolSelect(show);
        }
    }

    private createPoolSelect(show:boolean):void
    {
        MovieClipUtils.createMovieClip(Global.getOtherEffect("pool_select"),"pool_select",afterAdd,this);
        function afterAdd(data): void
        {
            var mc = data;
            mc.name = "pool_select";
            this.poolGroup.addChild(mc);
            mc.play(-1);
            mc.visible = show;
        }
    }

    private poolSelect():void
    {
        this.showPoolSelect(true);
        var pool:egret.MovieClip = this.poolData();
        if(pool)
        {
            pool.gotoAndStop(1);
        }

    }

    /**ding*/
    private dingAction():void
    {
        var dingFire:egret.MovieClip = this.dingFireData();
        if(dingFire)
        {
            dingFire.visible = true;
        }

        this.showDingSelect(false);
    }

    private dingFireData():egret.MovieClip
    {
        var dingFire:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this.dingGroup,"ding_fire");
        if(dingFire)
        {
            return dingFire;
        }
        else
        {
            MovieClipUtils.createMovieClip(Global.getOtherEffect("ding_fire"),"ding_fire",afterAdd,this);
            function afterAdd(data): void
            {
                var mc = data;
                mc.x = 110;
                mc.y = -10;
                mc.name = "ding_fire";
                this.dingGroup.addChild(mc);
                mc.play(-1);
                return mc;
            }
        }
    }

    private showDingSelect(show:boolean):any
    {
        var ding_select:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this.dingGroup,"ding_select");
        if(ding_select)
        {
            ding_select.visible = show;
        }
        else
        {
            this.createDingSelect(show);
        }
    }

    private createDingSelect(show:boolean):void
    {
        MovieClipUtils.createMovieClip(Global.getOtherEffect("ding_select"),"ding_select",afterAdd,this);
        function afterAdd(data): void
        {
            var mc = data;
            mc.name = "ding_select";
            this.dingGroup.addChild(mc);
            mc.play(-1);
            mc.visible = show;
        }
    }

    private dingSelect():void
    {
        this.showDingSelect(true);
        var fire:egret.MovieClip = this.dingFireData();
        if(fire)
        {
            fire.visible = false;
        }
    }

    private onDing():void
    {
        this.dingSelect();

        this.towerAction();
        this.poolAction();

        this.onSelect(2);
    }

    private onTower():void
    {
        this.towerSelect();

        this.dingAction();
        this.poolAction();
        this.onSelect(3);
    }

    private onPool():void
    {
        this.poolSelect();

        this.towerAction();
        this.dingAction();
        this.onSelect(1);
    }

    private showInfo(e:egret.Event):void
    {
        this.lblStone.visible = true;
        UserProxy.inst.home = e.data["home"];
        UserProxy.inst.ore = UserProxy.inst.home["ore"];
        UserProxy.inst.building = e.data["home"]["building"];
        this.lblStone.text = StringUtil.toFixed(UserProxy.inst.ore,0) + "";
        this.setInit();
    }

    private refreshStone():void
    {
        this.lblStone.text = StringUtil.toFixed(UserProxy.inst.ore,0) + "";
        this.onSelect(this._selectId);
    }

    private setInit():void
    {
        this.poolData();
        this.dingFireData();

        if(UserMethod.inst._mineFullPoint)
        {
            UserMethod.inst.addRedPoint(this.btnGoIn.parent,"upPoint",new egret.Point(this.btnGoIn.x + 80  ,this.btnGoIn.y + 10));
        }
    }




    private onSelect(type:number):void
    {
        this._selectId = type;

        var lv:number;
        var caveData:any;
        var nextCaveData:any;
        var cost:number;
        switch (type)
        {
            case 1:
                this.imgTitle.source = "mine_pool_title_png";
                lv = UserProxy.inst.building[1]["lv"];

                break;
            case 2:
                this.imgTitle.source = "mine_ding_title_png";
                lv = UserProxy.inst.building[2]["lv"];
                break;
            case 3:
                this.imgTitle.source = "mine_tower_title_png";
                lv = UserProxy.inst.building[3]["lv"];
                break;
        }

        this.lblLv.text = "Lv." + lv;
        if(!lv)
        {
            caveData = Config.CaveData[1];
            nextCaveData = Config.CaveData[1];
        }
        else
        {
            caveData = Config.CaveData[lv];
            nextCaveData= Config.CaveData[lv+1];
        }

        var addNature:number = parseFloat(caveData["attr_" + type][2]) - 1;
        if(!lv)
        {
            addNature = 0;
        }
        var dec:string = UserMethod.inst.getAddSting(caveData["attr_" + type],addNature );
        this.lblNow.text = "当前：" +dec;


        if(!nextCaveData)
        {
            this.lblNext.text = "已到达顶级！";
            this.btnUp.enabled = false;
            this.lblBar.text = "MAX";
            this.imgBar.width = 272;
            this.btnUp.label = "升 级";
        }
        else
        {
            cost = nextCaveData["build_cost_" + type];
            if(!lv)
            {
                cost = 0;
                this.btnUp.label = "开 启";
            }
            else
            {
                this.btnUp.label = "升 级";
            }
            var addNature2:number = parseFloat(nextCaveData["attr_" + type][2]) - 1;
            var dec2:string = UserMethod.inst.getAddSting(nextCaveData["attr_" + type],addNature2);
            this.lblNext.text = "下级：" + dec2;

            var now:number = UserProxy.inst.ore;
            this.lblBar.text = StringUtil.toFixed(now,0) + "/" + cost;
            this.imgBar.width = MathUtil.clamp(Math.floor(now * 272 / cost),0,272);
            this.btnUp.enabled = now >= cost

        }
    }

    private onUp():void
    {
        var openArea:string[] = Config.BaseData[74]["value"];
        if(this._selectId == 2)
        {
            if(UserProxy.inst.historyArea < parseInt(openArea[1]))
            {
                Notice.show("通关" + openArea[1] + "关后开启");
                return;
            }
        }
        else if(this._selectId == 3)
        {
            if(UserProxy.inst.historyArea < parseInt(openArea[2]))
            {
                Notice.show("通关" + openArea[2] + "关后开启");
                return;
            }
        }

        Http.inst.send(CmdID.BUILDING_UP,{id:this._selectId});
    }

    private onGo():void
    {
        UserMethod.inst.removeRedPoint(this.btnGoIn.parent,"upPoint");
        PanelManager.inst.showPanel("MineInPanel");
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("MineMainPanel");
    }

    public destory():void
    {
        super.destory();
        Http.inst.removeCmdListener(CmdID.OPEN_HOME,this.showInfo,this);
        Http.inst.removeCmdListener(CmdID.FARM_ORE,this.refreshStone,this);
        Http.inst.removeCmdListener(CmdID.BUILDING_UP,this.buildingUp,this);
        Http.inst.removeCmdListener(CmdID.MINE_UP,this.refreshStone,this);
        this.btnGoIn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.dingGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDing,this);
        this.poolGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onPool,this);
        this.towerGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTower,this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUp,this);

        //removeMC
        var pool:egret.MovieClip = this.poolData();
        if(pool)
        {
            pool.stop();
            DisplayUtil.removeFromParent(pool);
        }
        var pool_select:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this.poolGroup,"pool_select");
        if(pool_select)
        {
            pool_select.stop();
            DisplayUtil.removeFromParent(pool_select);
        }

        var dingFire:egret.MovieClip = this.dingFireData();
        if(dingFire)
        {
            dingFire.stop();
            DisplayUtil.removeFromParent(dingFire);
        }
        var ding_select:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this.dingGroup,"ding_select");
        if(ding_select)
        {
            ding_select.stop();
            DisplayUtil.removeFromParent(ding_select);
        }

        egret.Tween.removeTweens(this.towerGroup);
        var tower_select:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this.towerGroup,"tower_select");
        if(tower_select)
        {
            tower_select.stop();
            DisplayUtil.removeFromParent(tower_select);
        }

        EventManager.inst.dispatch("MINE_CHECK");

    }
}