/**
 * Created by Administrator on 1/9 0009.
 */
class DialPanel extends BasePanel
{
    public btnClose:SimpleButton;
    public rotationGroup:eui.Group;
    public btnTurnOne:SimpleButton;
    public btnTurnTen:SimpleButton;
    public imgPoint:eui.Image;

    private _startPos:egret.Point;
    private _endPos:egret.Point;
    private lblTimes:eui.Label;
    private _strength:number;

    private helpGroup:eui.Group;
    private helpHand:eui.Image;

    private _helping:boolean;
    private _award:any;
    private _nowValue:number;
    private _times:number;
    private _isDialing:boolean;

    private _awardGold:string;

    private _trunTimes:number;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = DialPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init(): void
    {
        Http.inst.addCmdListener(CmdID.DAILY,this.drawBack,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onStart,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this);
        this.btnTurnOne.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTurn,this);
        this.btnTurnTen.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTurn,this);

    }

    public initData(): void
    {
        this._isDialing = false;
       for(var i:number = 1; i < 13; i++)
        {
            var wheelData:any = Config.WheelFloorData[i];
            var award:eui.Image = <eui.Image>DisplayUtil.getChildByName(this.rotationGroup,"award" + i);
            var reward:any[] = wheelData["reward_1"].concat();
            // var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
            award["awardData"] = reward;
            award.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onItem,this);
        }
        this.lblTimes.text = UserProxy.inst.wheelTimes + "次";


        this._helping = true;
        this.helpGroup.visible = true;


        this._nowValue = 0;
        this._times = 0;
        TickerUtil.register(this.handMove, this, 100);

    }

    private handMove():void
    {
        this._nowValue += 0.1;
        if(this._nowValue >= 1)
        {
            this._nowValue = 0;
            this._times++;

            if(this._times > 0)
            {
                TickerUtil.unregister(this.handMove,this);
                this._helping = false;
                this.helpGroup.visible = false;
            }

        }
        this.helpHand.x = (1 - this._nowValue) * (1 - this._nowValue) * 0 + 2 * this._nowValue * (1 - this._nowValue) * 150 + this._nowValue * this._nowValue * 90;
        this.helpHand.y = (1 - this._nowValue) * (1 - this._nowValue) * 0 + 2 * this._nowValue * (1 - this._nowValue) * 75 + this._nowValue * this._nowValue * 152;
    }



    private onStart(e:egret.TouchEvent):void //开始转动
    {
        if(this._helping || this._isDialing || this._trunTimes)
        {
            return;
        }

        if(UserProxy.inst.wheelTimes <= 0)
        {
            return;
        }

        this._startPos = new egret.Point(e.localX,e.localY);
    }

    private onEnd(e:egret.TouchEvent):void //滑动结束
    {
        if(this._helping || this._isDialing || !this._startPos || this._trunTimes)
        {
            return;
        }

        if(UserProxy.inst.wheelTimes <= 0)
        {
            return;
        }
        this._endPos = new egret.Point(e.localX,e.localY);

        var posDis:number = MathUtil.pointDistance(this._startPos,this._endPos);
        if(posDis < 20)
        {
            return;
        }
        if(posDis < 50)
        {
            this._strength = 1;
        }
        else if(posDis >= 50 && posDis < 150)
        {
            this._strength = 2;
        }
        else if(posDis >= 150 && posDis < 250)
        {
            this._strength = 3;
        }
        else if(posDis >= 250 && posDis < 300)
        {
            this._strength = 4;
        }
        else
        {
            this._strength = 5;
        }

        this._isDialing = true;
        Http.inst.send(CmdID.DAILY,{type:4});

    }

    private drawBack(e:egret.Event):void
    {
        if(e.data && e.data["type"] == 4)
        {
            UserProxy.inst.wheelTimes = e.data["wheelTimes"];
            this.lblTimes.text = UserProxy.inst.wheelTimes + "次";
            this._award = e.data;
            var id:number = e.data["retData"];
            this.startRotate(id);
            TopPanel.inst.showPoint(6);
            TopPanel.inst.showPoint(9);
            this._awardGold  = "0";
            this._awardGold = "0";
            if(this._award["gold"])
            {
                this._awardGold = BigNum.sub(this._award["gold"],UserProxy.inst.gold) ;
            }
        }


    }

    private startRotate(id:number):void
    {
        var endRotation: number =  30 - id * 30;
        var self = this;

        var turnNeedTime:number;
        if(this._trunTimes)
        {
            turnNeedTime = 1400;
        }
        else
        {
            turnNeedTime = 2000;
        }

        egret.Tween.get(this.imgPoint,{loop:true}).to({rotation:-1-self._strength*2},60).to({rotation:-3-self._strength*2},60);
        egret.Tween.get(this.rotationGroup).to({ rotation: self._strength * 360 + 360 + endRotation },turnNeedTime).call(function ()
        {
            self.nowShowAward();
        },self);
    }

    private nowShowAward():void
    {
        this._isDialing = false;
        egret.Tween.removeTweens(this.imgPoint);
        this.imgPoint.rotation = 0;
        var add:number = Number(this._awardGold);
        if(add)
        {
            var bonusList:BonusList = new BonusList();
            bonusList.push(BonusType.COIN,add);
            bonusList.show();
        }
        else
        {
            UserMethod.inst.showAward(this._award);
        }

        if(this._trunTimes)
        {
            this._trunTimes--;
            if(this._trunTimes > 0 && UserProxy.inst.wheelTimes > 0)
            {
                this.onBtnTurn();
            }
        }
    }

    private onClose():void
    {
        if(this._helping)
        {
            return;
        }
        PanelManager.inst.hidePanel("DialPanel");
    }

    private onItem(e:egret.TouchEvent):void
    {
        var awardData:any[] = e.currentTarget["awardData"];
        ShowItemTipPanel.show(awardData);
    }

    private onTurn(e:egret.TouchEvent):void
    {
        if(this._helping || this._isDialing || this._trunTimes)
        {
            return;
        }

        if(e.currentTarget == this.btnTurnOne)
        {
            this._trunTimes = 1;
        }
        else
        {
            this._trunTimes = 10;
        }

        this.onBtnTurn();
    }

    private onBtnTurn():void
    {
        this._strength = 1;
        Http.inst.send(CmdID.DAILY,{type:4});
    }


    public destory():void
    {
        super.destory();
        Http.inst.removeCmdListener(CmdID.DAILY,this.drawBack,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.rotationGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onStart,this);
        this.rotationGroup.removeEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this);
        this.btnTurnOne.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTurn,this);
        this.btnTurnTen.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTurn,this);

        for(var i:number = 1; i < 13; i++)
        {
            var award:eui.Image = <eui.Image>DisplayUtil.getChildByName(this.rotationGroup,"award" + i);
            award.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onItem,this);
        }
        egret.Tween.removeTweens(this.imgPoint);
    }
}