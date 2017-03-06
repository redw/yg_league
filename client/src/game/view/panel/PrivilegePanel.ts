/**
 * Created by Administrator on 1/9 0009.
 */
class PrivilegePanel extends BasePanel
{
    public btnClose:SimpleButton;
    public imgMonth:AutoBitmap;
    public imgLife:AutoBitmap;
    public btnBuyMonth:eui.Button;
    public imgLifeBtnBg:eui.Image;
    public btnBuyLife:eui.Button;
    public btnGet:eui.Button;
    public imgHadBuy:eui.Image;
    public btnGetLife:eui.Button;
    public lblDay:eui.Label;

    private _showMonth:boolean;
    private _showLife:boolean;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = PrivilegePanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        Http.inst.addCmdListener(CmdID.VIP_REWARD,this.onAwardBack,this);
        this.imgLife.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLifeImg,this);
        this.imgMonth.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMonthImg,this);
        this.btnBuyMonth.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuyLife.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnGetLife.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        EventManager.inst.addEventListener(ContextEvent.RECHARGE_BACK,this.showInfo,this);
    }

    public initData(): void
    {
        this._showMonth = false;
        this._showLife = false;
        this.showInfo();
    }

    private showInfo():void
    {
        if(UserProxy.inst.vipObj["monthVIP"])
        {
            this.btnGet.enabled = true;
            var divTime:number = UserProxy.inst.vipObj["monthVIPTime"] - UserProxy.inst.server_time;
            this.lblDay.text = Math.round(divTime / 86400) + "天";

            if(UserProxy.inst.vipObj["monthVIPTime"] < UserProxy.inst.server_time)
            {
                this.btnGet.enabled = false;
                this.lblDay.text = "0天";
            }
            else
            {
                if(Math.round(divTime / 86400) <= 0)
                {
                    this.lblDay.text = TimeUtil.timeToString(divTime);
                }

                if(UserProxy.inst.vipObj["monthFlag"])
                {
                    this.btnGet.label = "今日已领取";
                    this.btnGet.enabled = false;
                }
            }
        }
        else
        {
            this.btnGet.enabled = false;
        }

        if(UserProxy.inst.vipObj["foreverVIP"])
        {
            this.imgHadBuy.visible = true;
            this.btnBuyLife.visible = false;
            this.imgLifeBtnBg.visible = false;
            this.btnGetLife.enabled = true;
            if(UserProxy.inst.vipObj["foreverFlag"])
            {
                this.btnGetLife.label = "今日已领取";
                this.btnGetLife.enabled = false;
            }
        }
        else
        {
            this.imgHadBuy.visible = false;
            this.btnBuyLife.visible = true;
            this.imgLifeBtnBg.visible = true;
            this.btnGetLife.enabled = false;
        }
    }

    private onAwardBack(e:egret.Event):void
    {
        UserMethod.inst.showAward(e.data);
        UserProxy.inst.vipObj = e.data["vipObj"];
        this.showInfo();
        TopPanel.inst.showPoint(10);
    }

    private onGet(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.btnGet)
        {
            Http.inst.send(CmdID.VIP_REWARD,{type:1});
        }
        else
        {
            Http.inst.send(CmdID.VIP_REWARD,{type:2});
        }

    }

    private onBuy(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.btnBuyMonth)
        {
            ExternalUtil.inst.pay(PidType.PID_MONTH);
        }
        else
        {
            ExternalUtil.inst.pay(PidType.PID_FOREVER);
        }

    }


    private onMonthImg():void
    {
        this._showMonth = !this._showMonth;
        if(this._showMonth)
        {
            this.imgMonth.source = "month_buy_2_png";
        }
        else
        {
            this.imgMonth.source = "month_buy_1_png";
        }
    }

    private onLifeImg():void
    {
        this._showLife = !this._showLife;
        if(this._showLife)
        {
            this.imgLife.source = "life_buy_2_png";
        }
        else
        {
            this.imgLife.source = "life_buy_1_png";
        }
    }
    private onClose():void
    {
        PanelManager.inst.hidePanel("PrivilegePanel");
    }

    public destory():void
    {
        Http.inst.removeCmdListener(CmdID.VIP_REWARD,this.onAwardBack,this);
        this.btnBuyLife.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onLifeImg,this);
        this.btnBuyMonth.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMonthImg,this);
        this.btnBuyMonth.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnBuyLife.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
        this.btnGetLife.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        EventManager.inst.removeEventListener(ContextEvent.RECHARGE_BACK,this.showInfo,this);
    }
}