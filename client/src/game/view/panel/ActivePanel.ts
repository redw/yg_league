/**
 * Created by Administrator on 12/8 0008.
 */
/*
    0，签到
    1，每日邀请
    2，成长基金
    3, 摇钱树
    4，人参果
    5，礼品吗
 */
class ActivePanel extends BasePanel
{
    public imgCloud1: eui.Image;
    public imgCloud2: eui.Image;
    public imgCloud3: eui.Image;

    public btnRight: SimpleButton;
    public btnLeft: SimpleButton;
    public btnClose:SimpleButton;

    /**simpleButton*/
    public btnSign:SimpleButton;
    public btnDayInvite:SimpleButton;
    public btnFund:SimpleButton;
    public btnTree:SimpleButton;
    public btnFruit:SimpleButton;
    public btnGift:SimpleButton;

    private _actGroups:SimpleButton[] = [];
    public contentGroup:eui.Group;
    public activeGroup:eui.Group;
    public coinShow:CoinShowPanel;

    private _lastIndex:number = -1;
    private _maxIndex:number = 0;

    private _scrollEnd:number = 216;
    private _scrollStart:number = 0;


    public static _inst:ActivePanel;
    static  get inst():ActivePanel
    {
        return ActivePanel._inst;
    }
    public constructor()
    {
        super();
        ActivePanel._inst = this;
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = ActivePanelSkin;
        this._mutex = false;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        this.btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);

        this.coinShow.startListener();
        //sign
        this.checkPoint(1);
        this.btnSign.name = "btn0";
        this._actGroups.push(this.btnSign);


        //invite
        this.checkPoint(2);
        this.btnDayInvite.name = "btn1";
        this._actGroups.push(this.btnDayInvite);

        //fund
        this.checkPoint(3);
        this.btnFund.name = "btn2";
        this._actGroups.push(this.btnFund);

        //tree
        this.btnTree.name = "btn3";
        this._actGroups.push(this.btnTree);

        //fruit
        this.checkPoint(4);
        this.btnFruit.name = "btn4";
        this._actGroups.push(this.btnFruit);

        //gift
        this.btnGift.name = "btn5";
        this._actGroups.push(this.btnGift);

        this._maxIndex = this._actGroups.length;
        for(var i:number = 0 ;i < this._maxIndex ; i++)
        {
            var btn:SimpleButton = this.btnByIndex(i);
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onActive, this);
        }
    }

    public initData(): void
    {
        var idx:number = this.data ? this.data : 0;
        var firstBtn:SimpleButton = this.btnByIndex(idx);
        firstBtn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        this.cloudMove();
    }


    public checkPoint(type?:number):void
    {
        var showAll:boolean = type ? false : true;
        if(type == 1 || showAll) //签到
        {
            var btn:SimpleButton = this.btnSign;
            UserMethod.inst.removeRedPoint(btn.parent,"sign");
            if(UserMethod.inst.signCheck())
            {
                UserMethod.inst.addRedPoint(btn.parent,"sign",new egret.Point(btn.x + 80,btn.y + 18));
            }
        }
        if(type == 2 || showAll)
        {
            var btn:SimpleButton = this.btnDayInvite;
            UserMethod.inst.removeRedPoint(btn.parent,"dayInvite");
            if(UserMethod.inst._inviteShowPoint)
            {
                UserMethod.inst.addRedPoint(btn.parent,"dayInvite",new egret.Point(btn.x + 80,btn.y + 18));
            }
        }
        if(type == 3 || showAll)
        {
            var btn:SimpleButton = this.btnFund;
            UserMethod.inst.removeRedPoint(btn.parent,"fund");
            if(UserMethod.inst._fundPointShow)
            {
                UserMethod.inst.addRedPoint(btn.parent,"fund",new egret.Point(btn.x + 80,btn.y + 18));
            }
        }
        if(type == 4 || showAll)
        {
            var btn:SimpleButton = this.btnFruit;
            UserMethod.inst.removeRedPoint(btn.parent,"fruit");
            if(UserMethod.inst._fruitPointShow)
            {
                UserMethod.inst.addRedPoint(btn.parent,"fruit",new egret.Point(btn.x + 80,btn.y + 18));
            }
        }
    }


    private btnByIndex(index:number):SimpleButton
    {
        var btn:SimpleButton = <SimpleButton>this._actGroups[index];
        return btn;
    }

    private onActive(e: egret.TouchEvent): void
    {
        var index: number = parseInt(e.currentTarget.name.replace("btn",""));

        if(index == 4)
        {
            if(UserProxy.inst.circleObj["circleTimes"] < 1)
            {
                Notice.show("轮回后开启！");
                return;
            }
        }

        if(this._lastIndex > -1)
        {
            if(this._lastIndex == index)
            {
                return;
            }
            else
            {
                this.removeActive();
                this.removeSelect(this._lastIndex);
            }
        }
        this._lastIndex = index;
        this.addSelect(this._lastIndex);
        var layer:eui.Component;
        switch (index)
        {
            case 0:
                layer = new ActiveSign();
                break;
            case 5:
                layer = new ActiveGift();
                break;
            case 1:
                layer = new ActiveDayInvite();
                break;
            case 2:
                layer = new ActiveFund();
                break;
            case 4:
                layer = new ActiveFruit();
                break;
            case 3:
                layer = new ActiveTree();
                break;
        }

        layer.name = "layer";
        this.activeGroup.addChild(layer);

    }


    private onChange(e:egret.TouchEvent):void
    {
        var nowIndex:number = this._lastIndex;
        if(e.currentTarget == this.btnLeft)
        {
            if(this._lastIndex == 0)
            {
                nowIndex = this._maxIndex - 1;
            }
            else
            {
                nowIndex--;
            }
            var btn:SimpleButton = this.btnByIndex(nowIndex);
            btn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
        else
        {
            if(this._lastIndex == this._maxIndex-1)
            {
                nowIndex = 0;
            }
            else
            {
                nowIndex++;
            }
            var btn:SimpleButton = this.btnByIndex(nowIndex);
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

    private addSelect(index:number):void
    {
        var group:eui.Group = <eui.Group>this.contentGroup.getChildAt(index);
        var selectImg:AutoBitmap = new AutoBitmap();
        selectImg.source = "active_select_png";
        selectImg.name = "select";
        group.addChildAt(selectImg,0);
    }

    private removeSelect(index:number):void
    {
        var group:eui.Group = <eui.Group>this.contentGroup.getChildAt(index);
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
        PanelManager.inst.hidePanel("ActivePanel");
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
            var btn:SimpleButton = this.btnByIndex(i);
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onActive, this);
        }
        this.coinShow.endListener();
    }
}