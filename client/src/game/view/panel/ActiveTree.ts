/**
 * Created by Administrator on 12/23 0023.
 */
class ActiveTree extends eui.Component
{
    public treeMcGroup:eui.Group;
    public lblTreeNum:eui.Label;
    public lblNowGetCoin:eui.Label;
    // public lblCost:YellowBigBtn;
    public btnShake:YellowBigBtn;
    // public imgBox:AutoBitmap;
    // public imgLight:eui.Image;
    // public lblOpenNum:eui.Label;

    private _treeMc:egret.MovieClip;
    private _shakeCost:number;
    private _onOpen:boolean;

    private _money:number;

    public constructor()
    {
        super();
        this.skinName = ActiveTreeSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {

        Http.inst.addCmdListener(CmdID.DAILY,this.shakeBack,this);
        Http.inst.addCmdListener(CmdID.TREE_MONEY,this.showGetMoney,this);
        this.btnShake.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShake,this);
        // this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBox,this);
        this.show();
    }

    private onHide(event:egret.Event):void
    {
        Http.inst.removeCmdListener(CmdID.DAILY,this.shakeBack,this);
        Http.inst.removeCmdListener(CmdID.TREE_MONEY,this.showGetMoney,this);
        this.btnShake.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onShake,this);
        // this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBox,this);
    }

    private show():void
    {
        Http.inst.send(CmdID.TREE_MONEY);
        this.lblNowGetCoin.visible = false;
        this._onOpen = false;

        this.showCost();

        MovieClipUtils.createMovieClip(Global.getFruitEffect("tree_shake"),"tree_shake",afterAdd,this);
        function afterAdd(data): void
        {
            this._treeMc = data;
            this._treeMc.x = 328/2;
            this._treeMc.y = 326/2;
            this._treeMc.play(-1);
            this._treeMc.frameRate = 24;
            this.treeMcGroup.addChild(this._treeMc);
        }
    }

    private showGetMoney(e:egret.Event):void
    {
        this.lblNowGetCoin.visible = true;
        var money:any = e.data["money"];
        this._money = money;
        this.lblNowGetCoin.text = MathUtil.easyNumber(money);
    }

    private showCost():void
    {
        var base:number = Config.BaseData[57]["value"];
        var addUp:number = Config.BaseData[58]["value"];
        // this.imgBox.source = "active_tree_box_close_png";
        this._shakeCost = base + addUp * UserProxy.inst.dailyObj["todayTimes"];
        this.btnShake.label = this._shakeCost + "";
        this.lblTreeNum.text = UserProxy.inst.dailyObj["todayTimes"] + "次";
        this.btnShake.extraLabel = "摇一摇";

        /*var buyTimes:number = UserProxy.inst.dailyObj["buyMoneyTimes"];
        var boxNum:number = UserProxy.inst.dailyObj["boxNum"];
        var times:number = (buyTimes - boxNum*15) / 15 ;
        var nextTimes:number =  (boxNum +1) * 15;
        if(times >= 1)
        {
            // this.showBoxOpen();
        }
        else
        {
            // this.showBoxClose();
        }*/

        // this.lblOpenNum.text = "("  + buyTimes + "/" + nextTimes + ")";

    }

   /* private showBoxOpen():void
    {
        this.imgLight.visible = true;
        this.imgBox.touchEnabled = true;
        egret.Tween.get(this.imgLight,{loop:true}).to({rotation:360},15000);
    }

    private showBoxClose():void
    {
        this.imgLight.visible = false;
        this.imgBox.touchEnabled = false;
        egret.Tween.removeTweens(this.imgLight);
    }*/

    private onBox():void
    {
        if(this._onOpen)
        {
            return;
        }

        Http.inst.send(CmdID.DAILY,{type:2});
        this._onOpen = true;
    }


   /* private onBoxAction(data:any):void
    {
        egret.Tween.get(this.imgBox).to({rotation:15},25).to({rotation:15},15).to({rotation:25},5).to({rotation:0},25).to({rotation:-15},25).to({rotation:-15},15).to({rotation:-25},5).to({rotation:0},25)
            .to({rotation:15},25).to({rotation:15},15).to({rotation:25},5).to({rotation:0},25).to({rotation:-15},25).to({rotation:-15},15).to({rotation:-25},5).to({rotation:0},25).to({rotation:15},25).to({rotation:15},15).to({rotation:25},5).to({rotation:0},25).call(openBox);
        var self = this;
        function openBox()
        {
            self.imgBox.source = "active_tree_box_open_png";
            egret.setTimeout(showOpenEnd,self,500);
        }

        function showOpenEnd()
        {
            self._onOpen = false;
            UserMethod.inst.showAward(data);
            self.imgBox.source = "active_tree_box_close_png";
            self.showCost();
        }
    }*/


    private onShake():void
    {
        if(UserProxy.inst.costAlart)
        {
            this.showCostAlert();
        }
        else
        {
            Alert.showCost(this._shakeCost,"摇一下",true,this.showCostAlert,null,this);
        }

    }

    private showCostAlert():void
    {
        if(UserProxy.inst.diamond >= this._shakeCost)
        {
            Http.inst.send(CmdID.DAILY,{type:1});
        }
        else
        {
            ExternalUtil.inst.diamondAlert();
        }
    }

    private shakeBack(e:egret.Event):void
    {
        if(e.data && e.data["type"] == 1)
        {
            UserProxy.inst.gold = e.data["gold"];
            UserProxy.inst.diamond = e.data["diamond"];
            var bonusList:BonusList = new BonusList();
            var add:string = BigNum.mul(e.data["rid"],this._money) ;
            var addGold: number = Number(add);

            bonusList.push(BonusType.COIN,addGold);

            UserProxy.inst.dailyObj = e.data["dailyObj"];
            if(this._treeMc)
            {
                this._treeMc.frameRate = 72;
                this._treeMc.play(3);
                this._treeMc.addEventListener(egret.Event.COMPLETE,this.loopEnd,this);
            }
            //掉钱表现
            egret.setTimeout(function () {
                this.showCost();
                this.showDropMoney();
            },this,200);

            egret.setTimeout(function ()
            {
                bonusList.show();
            },this,1000);
        }
        else if(e.data["type"] == 2)
        {
            // this.onBoxAction(data);
        }
    }

    private showDropMoney():void
    {
        for(var i:number = 0;i < 20 ; i++)
        {
            let icon:AutoBitmap = new AutoBitmap();
            icon.source = "reward_1_s_png";
            icon.x = MathUtil.rangeRandom(90,370);
            icon.y = MathUtil.rangeRandom(230,260);
            icon.visible = false;
            this.addChild(icon);
            egret.Tween.get(icon).wait(i*10).call(()=>{icon.visible = true;}).to({y:icon.y + 200,alpha:0},1000).call(()=>{DisplayUtil.removeFromParent(icon);});
        }
    }

    private loopEnd():void
    {
        this._treeMc.frameRate = 24;
        this._treeMc.play(-1);
        this._treeMc.removeEventListener(egret.Event.COMPLETE,this.loopEnd,this);
    }
}