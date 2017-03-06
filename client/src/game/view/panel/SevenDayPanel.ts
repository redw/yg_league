/**
 * Created by Administrator on 12/12 0012.
 */
class SevenDayPanel extends BasePanel
{
    public btnGroup:eui.Group;
    public togBtnDaily:eui.ToggleButton;
    public togBtnBuy:eui.ToggleButton;
    public lblEndTime:eui.Label;
    public lblEndGetTime:eui.Label;
    public dayList:eui.List;
    public dayScroll:eui.Scroller;
    public discountGroup:eui.Group;
    public imgSevenSelect:eui.Image;
    public lblName:eui.Label;
    public lblOldCost:eui.Label;
    public lblNowCost:eui.Label;
    public btnBuy:eui.Button;
    public imgHadBuy:eui.Image;
    public btnClose:SimpleButton;
    public imgBox:AutoBitmap;
    public coinShow:CoinShowPanel;

    private _buyDay:number;
    private _today:number;
    private _selectPos:egret.Point[];

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SevenDayPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        var today:number = UserMethod.inst.activeDay();
        this._today = today;
        if(!this._today)
        {
            if(UserMethod.inst.activeDayEndTime() > UserProxy.inst.server_time)
            {
                this._today = 7;
                today = 7;
            }
        }

        this._selectPos = [];
        for(var i:number = 1;i < 8; i++)
        {
            var dayBtn:SevenDayButton = <SevenDayButton>DisplayUtil.getChildByName(this.btnGroup,"btnDay" + i);
            dayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSelectDay,this);
            dayBtn.btnDay = i;
            this._selectPos[i] = new egret.Point(dayBtn.x-2,dayBtn.y-2);
            if(today == i)
            {
                dayBtn.btnImg = "seven_day_button_high_png";
            }
            else if(today > i)
            {
                dayBtn.btnImg = "seven_day_button_normal_png";
            }
            else
            {
                dayBtn.btnImg = "seven_day_button_disable_png";
            }
        }

        Http.inst.addCmdListener(CmdID.SEVEN_DAY_GIFT,this.onBuyBack,this);
        this.togBtnDaily.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onToggon,this);
        this.togBtnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onToggon,this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShow,this);

        this.dayList.itemRenderer = SevenDayRenderer;
        this.togBtnDaily.selected = true;
        this.togBtnBuy.selected = false;
        this.changeToggon();
        this.coinShow.startListener();
    }

    public initData(): void
    {
        var date:Date = new Date(UserMethod.inst.activeDayEndTime()*1000);
        this.lblEndGetTime.text = StringUtil.dateToString(date);
        this.lblEndTime.text = StringUtil.dateToString(date);
        if(!this._today)
        {
            this.dayScroll.visible = false;
            this.discountGroup.visible = false;
        }
        else
        {
            this.refresh(this._today);
            this.showTodayBuy(this._today);
            var dayBtn:SevenDayButton = <SevenDayButton>DisplayUtil.getChildByName(this.btnGroup,"btnDay" + this._today);
            dayBtn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
    }


    private showTodayBuy(day:number):void
    {
        this._buyDay = day;
        var buyData:any = Config.SevenBuyData[day];
        this.lblName.text = buyData["name"];
        this.lblNowCost.text = buyData["price"];
        this.lblOldCost.text = parseInt(buyData["price"]) * 2 + "";
        this.btnBuy.enabled = parseFloat(UserProxy.inst.gold) >= parseInt(buyData["price"]);
        this.imgBox.source = "sevenDay_box_" + day +"_png";
        this.imgBox["id"] = day;
        if(UserMethod.inst.isBitGet(day,UserProxy.inst.sevenBuyBit))
        {
            this.btnBuy.visible = false;
            this.imgHadBuy.visible = true;
        }
        else
        {
            this.btnBuy.visible = true;
            this.imgHadBuy.visible = false;
        }

    }

    private onBuy():void
    {
        Http.inst.send(CmdID.SEVEN_DAY_GIFT,{id:this._buyDay });
    }

    private onBuyBack(e:egret.Event):void
    {
        UserMethod.inst.showAward(e.data);
        UserProxy.inst.gold = e.data["gold"];
        UserProxy.inst.sevenBuyBit = e.data["sevenBuyBit"];
        this.showTodayBuy(this._buyDay);
    }

    public onSelectDay(e:egret.TouchEvent):void
    {
        var index: number = parseInt(e.currentTarget.name.replace("btnDay",""));
        if(index > this._today)
        {
            Notice.show("敬请期待！");
            return;
        }

        this.imgSevenSelect.x = this._selectPos[index].x;
        this.imgSevenSelect.y = this._selectPos[index].y;

        this.refresh(index);
        this.showTodayBuy(index);
    }

    private refresh(day:number):void
    {
        var todayDatas:number[] = [];
        var todayDowns:number[] = [];
        var todayFinishs:number[] = [];

        for(var i in Config.SevenDayData)
        {
            var data:any = Config.SevenDayData[i];
            var endValue: number = data["task_num"];
            var nowValue:number = UserMethod.inst.sevenDayFinish(data);
            if(Number(data["day"]) == day)
            {
                if(UserMethod.inst.isBitGet(parseInt(data["id"]),UserProxy.inst.sevenDayBit))
                {
                    todayDowns.push(Config.SevenDayData[i]["id"]);
                }
                else if(endValue <= nowValue)
                {
                    todayFinishs.push(Config.SevenDayData[i]["id"]);
                }
                else
                {
                    todayDatas.push(Config.SevenDayData[i]["id"]);
                }
            }
        }
        this.dayList.dataProvider = new eui.ArrayCollection(todayFinishs.concat(todayDatas,todayDowns));
    }

    private onToggon(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.togBtnDaily)
        {
            this.togBtnDaily.selected  = true;
            this.togBtnBuy.selected  = !this.togBtnDaily.selected;
        }
        else
        {
            this.togBtnBuy.selected  = true;
            this.togBtnDaily.selected  = !this.togBtnBuy.selected;
        }

        this.changeToggon();
    }

    private changeToggon():void
    {
        if(this.togBtnDaily.selected)
        {
            this.dayScroll.visible = true;
            this.discountGroup.visible = false;
        }
        else
        {
            this.dayScroll.visible = false;
            this.discountGroup.visible = true;
        }
    }

    public onClose():void
    {
        PanelManager.inst.hidePanel("SevenDayPanel");
    }

    public onShow(e:egret.TouchEvent):void
    {
        var day = e.currentTarget["id"];
        var buyData:any = Config.SevenBuyData[day];
        var string:string = buyData["disc"];
        Alert.show(StringUtil.replaceDescribe(string));
    }

    public destory():void
    {
        super.destory();
        for(var i:number = 1;i < 8; i++)
        {
            var dayBtn:eui.Button = <eui.Button>DisplayUtil.getChildByName(this.btnGroup,"btnDay" + i);
            dayBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSelectDay,this);
        }
        Http.inst.removeCmdListener(CmdID.SEVEN_DAY_GIFT,this.onBuyBack,this);
        this.togBtnDaily.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onToggon,this);
        this.togBtnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onToggon,this);
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.imgBox.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onShow,this);
        TopPanel.inst.showPoint(7);
        this.coinShow.endListener();
    }
}
