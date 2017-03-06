/**
 * Created by Administrator on 12/9 0009.
 */
class ActiveFruit extends eui.Component
{
    private imgNotDone:eui.Image;
    private mcGroup:eui.Group;
    public _view: egret.MovieClip;
    public lblMsg:eui.Label;

    private _say1:number;
    private _eatId:number;
    private _state:number;

    public constructor()
    {
        super();
        this.skinName = ActiveFruitSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        Http.inst.addCmdListener(CmdID.DAILY,this.onEatBack,this);
        this.mcGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMc,this);
        this.imgNotDone.visible = false;
        this.lblMsg.visible = false;
        this.showFirstFruit();
    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeEventListener(CmdID.DAILY,this.onEatBack,this);
        this.mcGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMc,this);
        this._view.removeEventListener(egret.Event.COMPLETE,this.changeAction,this);
    }

    private showFirstFruit():void
    {
        this._state = 0;//0-----叶子 1-------果子
        var date:Date = new Date(UserProxy.inst.server_time*1000);
        var hour:number = date.getHours();
        if(hour < 11)
        {
            this._state = 0;
        }
        else if(hour >= 11 && hour < 15)
        {
            if(!BitUtil.isBitTrueByString(0,UserProxy.inst.dailyObj["freeVitBit"]))
            {
                this._state = 1;
                this._eatId = 1;
            }
            else
            {
                this._state = 2;
            }
        }
        else if(hour >= 15 && hour < 19)
        {
            if(!BitUtil.isBitTrueByString(1,UserProxy.inst.dailyObj["freeVitBit"]))
            {
                this._state = 1;
                this._eatId = 2;
            }
            else
            {
                this._state = 2;
            }
        }
        else if(hour >= 19 && hour < 23)
        {
            if(!BitUtil.isBitTrueByString(2,UserProxy.inst.dailyObj["freeVitBit"]))
            {
                this._state = 1;
                this._eatId = 3;
            }
            else
            {
                this._state = 2;
            }
        }

        if(this._view)
        {
            this._view.stop();
            DisplayUtil.removeFromParent(this._view);
        }

        if(this._state != 1)
        {
           this.showLeaf();
        }
        else
        {
           this.showStay();
        }
    }


    private onEatBack(e:egret.Event):void
    {
        if(e.data && e.data["type"] == 3)
        {
            UserProxy.inst.dailyObj = e.data["dailyObj"];
            UserProxy.inst.freeTimes = e.data["freeTimes"];
            this.showFirstFruit();

            TopPanel.inst.showPoint(11,4);
            ActivePanel.inst.checkPoint(4);

            EventManager.inst.dispatch(ContextEvent.REFRESH_DUNGEON_INFO);
        }


    }

    private onMc():void
    {
        if(this._state == 1)
        {
            this.showSmile();
        }
        else if(this._state == 2)
        {
            if(this._say1)
            {
                egret.clearTimeout(this._say1);
            }
            this.imgNotDone.visible = true;
            this.lblMsg.visible = true;
            this.lblMsg.text = "吃过了！等下次~";
            this._say1 = egret.setTimeout(function ()
            {
                this.imgNotDone.visible = false;
                this.lblMsg.visible = false;
            },this,3000);
        }
        else
        {
            if(this._say1)
            {
                egret.clearTimeout(this._say1);
            }
            this.imgNotDone.visible = true;
            this.lblMsg.visible = true;
            this.lblMsg.text = "宝宝还没熟呢！看时间~";
            this._say1 = egret.setTimeout(function ()
            {
                this.imgNotDone.visible = false;
                this.lblMsg.visible = false;
            },this,3000);
        }
    }

    private changeAction():void
    {
        if(UserProxy.inst.freeTimes >= UserProxy.inst.maxTimes)
        {
            this.showStay();
            if(this._say1)
            {
                egret.clearTimeout(this._say1);
            }
            this.imgNotDone.visible = true;
            this.lblMsg.visible = true;
            this.lblMsg.text = "秘境挑战次数满了，不能吃我~";
            this._say1 = egret.setTimeout(function ()
            {
                this.imgNotDone.visible = false;
                this.lblMsg.visible = false;
            },this,3000);
        }
        else
        {
            if(this._say1)
            {
                egret.clearTimeout(this._say1);
            }
            this.imgNotDone.visible = true;
            this.lblMsg.visible = true;
            this.lblMsg.text = "哎呀！被吃掉了~";
            this._say1 = egret.setTimeout(function ()
            {
                this.imgNotDone.visible = false;
                this.lblMsg.visible = false;
                Http.inst.send(CmdID.DAILY,{type:3,id:this._eatId});
            },this,800);
        }
    }


    private showStay():void
    {
        this.removeMc();
        MovieClipUtils.createMovieClip(Global.getFruitEffect("fruit_stay"),"fruit_stay",afterAdd,this);
        function afterAdd(data): void
        {
            this._view = data;
            this._view.x = 100;
            this.mcGroup.addChild(this._view);
            this._view.play(-1);
            this._view.addEventListener(egret.Event.COMPLETE,this.changeAction,this);
        }
    }

    private showSmile():void
    {
        this.removeMc();
        var self = this;
        MovieClipUtils.createMovieClip(Global.getFruitEffect("fruit_smile"),"fruit_smile",afterAdd,this);
        function afterAdd(data): void
        {
            this._view = data;
            this._view.x = 100;
            this.mcGroup.addChild(this._view);
            MovieClipUtils.playMCOnce(this._view,function(): void
            {
                DisplayUtil.removeFromParent(this._view);
                self.changeAction();

            },this);
        }
    }

    private showLeaf():void
    {
        this.removeMc();
        MovieClipUtils.createMovieClip(Global.getFruitEffect("fruit_leaf"),"fruit_leaf",afterLeaf,this);
        function afterLeaf(data): void
        {
            this._view = data;
            this._view.x = 100;
            this._view.y = 50;
            this._view.play(-1);
            this.mcGroup.addChild( this._view);
        }
    }

    private removeMc():void
    {
        if(this._view)
        {
            this._view.stop();
            DisplayUtil.removeFromParent(this._view);
        }
    }
}