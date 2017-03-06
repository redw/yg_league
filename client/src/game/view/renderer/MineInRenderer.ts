/**
 * Created by Administrator on 2/16 0016.
 */
class MineInRenderer extends eui.ItemRenderer
{
    private contentGroup:eui.Group;
    private lockGroup:eui.Group;
    private btnGet:SimpleButton;
    private btnStay:SimpleButton;
    private btnUp:SimpleButton;
    private lblOutPut:eui.Label;
    private imgBar:eui.Image;
    private lblBar:eui.Label;
    private lblOpen:eui.Label;
    private _barWidth: number = 160;
    private _fullPut:number;

    public constructor()
    {
        super();
        this.skinName = MineInRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_CAVE_STONE,this.refreshNowStone,this);
        EventManager.inst.addEventListener(ContextEvent.MiNE_FORMATION_CLOSE,this.dataChanged,this);
        Http.inst.addCmdListener(CmdID.FARM_ORE,this.dataChanged,this);
        Http.inst.addCmdListener(CmdID.MINE_UP,this.refreshUpMine,this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        this.btnStay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStay,this);
        this.lockGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLock,this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUp,this);
    }

    private onHide(event: egret.Event): void
    {
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_CAVE_STONE,this.refreshNowStone,this);
        EventManager.inst.removeEventListener(ContextEvent.MiNE_FORMATION_CLOSE,this.dataChanged,this);
        Http.inst.removeCmdListener(CmdID.FARM_ORE,this.dataChanged,this);
        Http.inst.removeCmdListener(CmdID.MINE_UP,this.refreshUpMine,this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        this.btnStay.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onStay,this);
        this.lockGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onLock,this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUp,this);
    }

    private onUp():void
    {
        PanelManager.inst.showPanel("MineCaveUpPanel",this.data);
    }

    private onLock():void
    {
        var openArr:number[] = Config.BaseData[76]["value"];
        Notice.show("轮回" + openArr[this.data - 1] + "次后自动解锁！");
    }

    private onGet():void
    {
        var point:number = parseFloat(Config.BaseData[78]["value"]);
        // var mineFullArr:string[] = Config.BaseData[77]["value"];
        var outPutMax:number = this._fullPut ;//parseInt(mineFullArr[this.data - 1]);
        var outPut:number = UserProxy.inst.mineOutputAry[this.data - 1];
        var need:number = outPutMax * point;
        if(outPut < need)
        {
            Notice.show("需要累积 " + need + " 以上，才可收取灵矿");
            return;
        }
        Http.inst.send(CmdID.FARM_ORE,{id:this.data});
    }

    private onStay():void
    {
        PanelManager.inst.showPanel("MineFormationPanel",this.data);
    }

    private showBar(now,max):void
    {
        var redPoint:RedPoint = <RedPoint>DisplayUtil.getChildByName(this.btnGet.parent,"upPoint");
        if(now >= max)
        {
            if(!redPoint)
            {
                UserMethod.inst.addRedPoint(this.btnGet.parent,"upPoint",new egret.Point(this.btnGet.x + 55  ,this.btnGet.y + 10));
            }
        }
        else
        {
            UserMethod.inst.removeRedPoint(this.btnGet.parent,"upPoint");
        }
        this.imgBar.width = MathUtil.clamp(Math.floor(now * this._barWidth / max),0,this._barWidth);
        this.lblBar.text =  StringUtil.toFixed(now,0) + "/" + max;
        this._fullPut = max;
    }

    private refreshNowStone(e:egret.Event):void
    {
        var data:any = e.data;
        var mineData:any = UserProxy.inst.home["mine"][this.data];
        mineData["nowOutput"] = data[this.data - 1];
        this.showBar(mineData["nowOutput"],mineData["maxOutput"]);
    }

    private refreshUpMine():void
    {
        var mineData:any = UserProxy.inst.home["mine"][this.data];
        this.showBar(mineData["nowOutput"],mineData["maxOutput"]);
    }

    public dataChanged(): void
    {
        super.dataChanged();

        var productOut:number = 0;
        var mineData:any = UserProxy.inst.home["mine"][this.data];
        var openArr:string[] = Config.BaseData[76]["value"];
        if(UserProxy.inst.circleObj["circleTimes"] >= parseInt(openArr[this.data - 1]))
        {
            this.contentGroup.visible = true;
            this.lockGroup.visible = false;

            this.showBar(mineData["nowOutput"],mineData["maxOutput"]);

            for(var i:number = 0;i < 6;i++)
            {
                var posGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.contentGroup,"pos" + i);
                posGroup.removeChildren();
            }


            for(var i:number = 0;i < 6;i++)
            {
                var id:number = mineData["pos"][i];
                if(id)
                {
                    var roleData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
                    var oreData:any = Config.OreData[roleData.starLevel];
                    var number:number = parseInt(oreData["num_" + roleData.config.quality]);
                    productOut += number;

                    var posGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.contentGroup,"pos" + i);
                    this.addMc(id,posGroup);
                }

            }

            this.lblOutPut.text = productOut + "";
        }
        else
        {
            this.contentGroup.visible = false;
            this.lockGroup.visible = true;
            var openArr:string[] = Config.BaseData[76]["value"];
            this.lblOpen.text = "当前轮回次数：" + UserProxy.inst.circleObj["circleTimes"] + "/" + openArr[this.data - 1];
        }
    }

    private addMc(id:number,posGroup:eui.Group):void
    {
        posGroup.removeChildren();
        if(id)
        {
            MovieClipUtils.createMovieClip(Global.getChaStay(id),""+id,afterAdd,this);
            function afterAdd(data): void
            {
                var mc = data;
                mc.x = 50;
                mc.y = 80;
                mc.name = "mc";
                mc.scaleX = -1;
                mc.play(-1);
                posGroup.addChild(mc);
            }
        }
    }

}