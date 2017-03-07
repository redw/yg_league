/**
 * Created by Administrator on 12/23 0023.
 */
var ActiveTree = (function (_super) {
    __extends(ActiveTree, _super);
    function ActiveTree() {
        _super.call(this);
        this.skinName = ActiveTreeSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveTree,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.DAILY, this.shakeBack, this);
        Http.inst.addCmdListener(CmdID.TREE_MONEY, this.showGetMoney, this);
        this.btnShake.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShake, this);
        // this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBox,this);
        this.show();
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.DAILY, this.shakeBack, this);
        Http.inst.removeCmdListener(CmdID.TREE_MONEY, this.showGetMoney, this);
        this.btnShake.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShake, this);
        // this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBox,this);
    };
    p.show = function () {
        Http.inst.send(CmdID.TREE_MONEY);
        this.lblNowGetCoin.visible = false;
        this._onOpen = false;
        this.showCost();
        MovieClipUtils.createMovieClip(Global.getFruitEffect("tree_shake"), "tree_shake", afterAdd, this);
        function afterAdd(data) {
            this._treeMc = data;
            this._treeMc.x = 328 / 2;
            this._treeMc.y = 326 / 2;
            this._treeMc.play(-1);
            this._treeMc.frameRate = 24;
            this.treeMcGroup.addChild(this._treeMc);
        }
    };
    p.showGetMoney = function (e) {
        this.lblNowGetCoin.visible = true;
        var money = e.data["money"];
        this._money = money;
        this.lblNowGetCoin.text = MathUtil.easyNumber(money);
    };
    p.showCost = function () {
        var base = Config.BaseData[57]["value"];
        var addUp = Config.BaseData[58]["value"];
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
    };
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
    p.onBox = function () {
        if (this._onOpen) {
            return;
        }
        Http.inst.send(CmdID.DAILY, { type: 2 });
        this._onOpen = true;
    };
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
    p.onShake = function () {
        if (UserProxy.inst.costAlart) {
            this.showCostAlert();
        }
        else {
            Alert.showCost(this._shakeCost, "摇一下", true, this.showCostAlert, null, this);
        }
    };
    p.showCostAlert = function () {
        if (UserProxy.inst.diamond >= this._shakeCost) {
            Http.inst.send(CmdID.DAILY, { type: 1 });
        }
        else {
            ExternalUtil.inst.diamondAlert();
        }
    };
    p.shakeBack = function (e) {
        if (e.data && e.data["type"] == 1) {
            UserProxy.inst.gold = e.data["gold"];
            UserProxy.inst.diamond = e.data["diamond"];
            var bonusList = new BonusList();
            var add = BigNum.mul(e.data["rid"], this._money);
            var addGold = Number(add);
            bonusList.push(BonusType.COIN, addGold);
            UserProxy.inst.dailyObj = e.data["dailyObj"];
            if (this._treeMc) {
                this._treeMc.frameRate = 72;
                this._treeMc.play(3);
                this._treeMc.addEventListener(egret.Event.COMPLETE, this.loopEnd, this);
            }
            //掉钱表现
            egret.setTimeout(function () {
                this.showCost();
                this.showDropMoney();
            }, this, 200);
            egret.setTimeout(function () {
                bonusList.show();
            }, this, 1000);
        }
        else if (e.data["type"] == 2) {
        }
    };
    p.showDropMoney = function () {
        var _loop_1 = function() {
            var icon = new AutoBitmap();
            icon.source = "reward_1_s_png";
            icon.x = MathUtil.rangeRandom(90, 370);
            icon.y = MathUtil.rangeRandom(230, 260);
            icon.visible = false;
            this_1.addChild(icon);
            egret.Tween.get(icon).wait(i * 10).call(function () { icon.visible = true; }).to({ y: icon.y + 200, alpha: 0 }, 1000).call(function () { DisplayUtil.removeFromParent(icon); });
        };
        var this_1 = this;
        for (var i = 0; i < 20; i++) {
            _loop_1();
        }
    };
    p.loopEnd = function () {
        this._treeMc.frameRate = 24;
        this._treeMc.play(-1);
        this._treeMc.removeEventListener(egret.Event.COMPLETE, this.loopEnd, this);
    };
    return ActiveTree;
}(eui.Component));
egret.registerClass(ActiveTree,'ActiveTree');
//# sourceMappingURL=ActiveTree.js.map