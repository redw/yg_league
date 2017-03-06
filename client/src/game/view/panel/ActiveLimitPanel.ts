/**
 * Created by Administrator on 1/25 0025.
 */
/*
 0，集字
 1，充值
 2，消费
 3，单笔
 4，邀请
 3, 寻仙
 4，竞技场
 */
class ActiveLimitPanel extends BasePanel
{
    public imgCloud1: eui.Image;
    public imgCloud2: eui.Image;
    public imgCloud3: eui.Image;
    public btnRight: SimpleButton;
    public btnLeft: SimpleButton;
    public btnClose:SimpleButton;

    public contentGroup:eui.Group;
    public activeGroup:eui.Group;
    public coinShow:CoinShowPanel;

    /**act btn*/
    public btnWord:SimpleButton;
    public btnRecharge:SimpleButton;
    public btnCost:SimpleButton;
    public btnOnePay:SimpleButton;
    public btnShareDouble:SimpleButton;
    public btnFestival:SimpleButton;


    private _actGroups:SimpleButton[] = [];
    private _lastBtn:SimpleButton = null;
    private _maxIndex:number = 0;

    private _scrollEnd:number = 216;
    private _scrollStart:number = 0;


    public static _inst:ActiveLimitPanel;
    static  get inst():ActiveLimitPanel
    {
        return ActiveLimitPanel._inst;
    }
    public constructor()
    {
        super();
        ActiveLimitPanel._inst = this;
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = ActiveLimitPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {

        this.btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.coinShow.startListener();

        if(UserMethod.inst.isWordOpen())
        {
            this.checkPoint(1);
            this.btnWord.name = "btn0";
            this._actGroups.push(this.btnWord);

        }
        else
        {
            DisplayUtil.removeFromParent(this.btnWord.parent);
        }

        if(UserMethod.inst.isRechargeOpen())
        {
            this.checkPoint(2);
            this.btnRecharge.name = "btn1";
            this._actGroups.push(this.btnRecharge);
        }
        else
        {
            DisplayUtil.removeFromParent(this.btnRecharge.parent);
        }

        if(UserMethod.inst.isCostOpen())
        {
            this.checkPoint(3);
            this.btnCost.name = "btn2";
            this._actGroups.push(this.btnCost);
        }
        else
        {
            DisplayUtil.removeFromParent(this.btnCost.parent);
        }

        if(UserMethod.inst.isOnePayOpen())
        {
            this.checkPoint(4);
            this.btnOnePay.name = "btn3";
            this._actGroups.push(this.btnOnePay);
        }
        else
        {
            DisplayUtil.removeFromParent(this.btnOnePay.parent);
        }

        if(UserMethod.inst.isInviteDoubleOpen())
        {
            if(ExternalUtil.inst.getIsYYB())
            {
                this.btnShareDouble.source = "limit_doubel_invite_yyb_png";
            }

            this.btnShareDouble.name = "btn4";
            this._actGroups.push(this.btnShareDouble);
        }
        else
        {
            DisplayUtil.removeFromParent(this.btnShareDouble.parent);
        }

        if(UserMethod.inst.isFestivalOpen())
        {
            this.checkPoint(5);
            this.btnFestival.name = "btn5";
            this._actGroups.push(this.btnFestival);
        }
        else
        {
            DisplayUtil.removeFromParent(this.btnFestival.parent);
        }


        this._maxIndex = this._actGroups.length;
        for(var i:number = 0 ;i < this._maxIndex ; i++)
        {
            var btn:SimpleButton = this._actGroups[i];
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onActive, this);
        }
    }

    public initData(): void
    {
        var firstBtn:SimpleButton = this._actGroups[0];
        firstBtn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        this.cloudMove();
    }



    public checkPoint(type?:number):void
    {
        var showAll:boolean = type ? false : true;
        if(type == 1 || showAll) //集字
        {
            UserMethod.inst.removeRedPoint(this.btnWord.parent,"word");
            if(UserMethod.inst._actWordShow)
            {
                UserMethod.inst.addRedPoint(this.btnWord.parent,"word",new egret.Point(this.btnWord.x + 80,this.btnWord.y + 18));
            }
        }
        if(type == 2 || showAll) //充值
        {
            UserMethod.inst.removeRedPoint(this.btnRecharge.parent,"recharge");
            if(UserMethod.inst._actRechargeShow)
            {
                UserMethod.inst.addRedPoint(this.btnRecharge.parent,"recharge",new egret.Point(this.btnRecharge.x + 80,this.btnRecharge.y + 18));
            }
        }
        if(type == 3 || showAll) //消费
        {
            UserMethod.inst.removeRedPoint(this.btnCost.parent,"cost");
            if(UserMethod.inst._actCostShow)
            {
                UserMethod.inst.addRedPoint(this.btnCost.parent,"cost",new egret.Point(this.btnCost.x + 80,this.btnCost.y + 18));
            }
        }
        if(type == 4 || showAll) //消费
        {
            UserMethod.inst.removeRedPoint(this.btnOnePay.parent,"onePay");
            if(UserMethod.inst._actOnePayShow)
            {
                UserMethod.inst.addRedPoint(this.btnOnePay.parent,"onePay",new egret.Point(this.btnOnePay.x + 80,this.btnOnePay.y + 18));
            }
        }
        if(type == 5 || showAll) //红利
        {
            UserMethod.inst.removeRedPoint(this.btnFestival.parent,"festival");
            if(UserMethod.inst._actFestivalShow)
            {
                UserMethod.inst.addRedPoint(this.btnFestival.parent,"festival",new egret.Point(this.btnFestival.x + 80,this.btnFestival.y + 18));
            }
        }
    }


    private onActive(e: egret.TouchEvent): void
    {
        var index: number = parseInt(e.currentTarget.name.replace("btn",""));

        if(this._lastBtn)
        {
            if(this._lastBtn == e.currentTarget)
            {
                return;
            }
            else
            {
                this.removeActive();
                this.removeSelect(this._lastBtn);
            }
        }
        this._lastBtn = e.currentTarget;
        this.addSelect(this._lastBtn);
        var layer:eui.Component;
        switch (index)
        {
            case 0:
                layer = new ActiveLimitWord();
                break;
            case 1:
                UserMethod.inst.recharge_cost = 1;
                layer = new ActiveLimitRecharge();
                break;
            case 2:
                UserMethod.inst.recharge_cost = 2;
                layer = new ActiveLimitCost();
                break;
            case 3:
                UserMethod.inst.recharge_cost = 3;
                layer = new ActiveLimitOnePay();
                break;
            case 4:
                layer = new ActiveLimitInvite();
                break;
            case 5:
                layer = new ActiveLimitFestival();
                break;
        }

        layer.name = "layer";
        this.activeGroup.addChild(layer);
    }


    private onChange(e:egret.TouchEvent):void
    {

        if(this._maxIndex <= 1)
        {
            return;
        }

        var nowIndex:number = this._actGroups.indexOf(this._lastBtn);

        if(e.currentTarget == this.btnLeft)
        {
            if(nowIndex == 0)
            {
                nowIndex = this._maxIndex - 1;
            }
            else
            {
                nowIndex--;
            }
            var btn:SimpleButton = this._actGroups[nowIndex];
            btn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
        else
        {
            if(nowIndex == this._maxIndex-1)
            {
                nowIndex = 0;
            }
            else
            {
                nowIndex++;
            }
            var btn:SimpleButton =  this._actGroups[nowIndex];
            btn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }

        this.contentGroup.scrollH = nowIndex > 3 ? this._scrollEnd : this._scrollStart;
    }

    private removeActive():void
    {
        var layer:eui.Component = <eui.Component>DisplayUtil.getChildByName(this.activeGroup,"layer");
        if(layer)
        {
            DisplayUtil.removeFromParent(layer);
        }
    }

    private addSelect(nowBtn:SimpleButton):void
    {
        var group:eui.Group = <eui.Group>nowBtn.parent;
        var selectImg:AutoBitmap = new AutoBitmap();
        selectImg.source = "active_select_png";
        selectImg.name = "select";
        group.addChildAt(selectImg,0);
    }

    private removeSelect(lastBtn:SimpleButton):void
    {
        var group:eui.Group = <eui.Group>lastBtn.parent;
        var selectImg:AutoBitmap = <AutoBitmap>DisplayUtil.getChildByName(group,"select");
        if(selectImg)
        {
            group.removeChild(selectImg);
        }
    }

    private cloudMove():void
    {
        egret.Tween.get(this.imgCloud2,{loop:true}).to({x:100},55000).wait(4800).to({x:282},37000).wait(6800);
        egret.Tween.get(this.imgCloud1,{loop:true}).to({x:32},32000).wait(3800).to({x:-212},59000).wait(1800);
        egret.Tween.get(this.imgCloud3,{loop:true}).to({x:-250},39000).wait(5300).to({x:-50},21000).wait(2800);
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("ActiveLimitPanel");
    }

    public destory():void
    {
        super.destory();

        egret.Tween.removeTweens(this.imgCloud2);
        egret.Tween.removeTweens(this.imgCloud1);
        egret.Tween.removeTweens(this.imgCloud3);
        this.btnLeft.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnRight.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        for(var i:number = 0 ;i < this._maxIndex ; i++)
        {
            var btn:SimpleButton = this._actGroups[i];
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onActive, this);
        }
        this.coinShow.endListener();

    }
}