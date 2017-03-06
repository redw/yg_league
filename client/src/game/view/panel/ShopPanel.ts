/**
 * Created by Administrator on 12/28 0028.
 */
class ShopPanel extends BasePanel
{
    public shopList:eui.List;
    public scroll:eui.Scroller;
    public btnUp:SimpleButton;
    public imgBag:AutoBitmap;
    public imgRecharge:AutoBitmap;
    public coinShow:CoinShowPanel;

    private _lastSelect:AutoBitmap;
    private _upDown:boolean;
    private _moving:boolean = false;
    public constructor()
    {
        super();

        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = ShopPanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }

    public init():void
    {
        this.imgBag.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);
        this.imgRecharge.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.shopList.itemRenderer = ShopItemRenderer;
        this.coinShow.startListener();
    }

    public initData():void
    {
        this.imgRecharge.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);

        this._upDown = MenuPanel.inst.menuUp;
        if(MenuPanel.inst.menuUp)
        {
            this.btnUp.source = "menu_down_png";
            this.height = 616;
            this.scroll.height = 494;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            this.height = 282;
            this.scroll.height = 160;
        }

    }

    private onChange(e:egret.TouchEvent):void
    {
        if(this._lastSelect && this._lastSelect == e.currentTarget)
        {
            return;
        }

        this._lastSelect = e.currentTarget;
        if(e.currentTarget == this.imgBag)
        {
            this.imgBag.source = "show_bag_light_png";
            this.imgRecharge.source = "show_recharge_png";

        }
        else
        {
            this.imgBag.source = "show_bag_png";
            this.imgRecharge.source = "show_recharge_light_png";

        }
        this.refresh();

    }

    private refresh():void
    {
        var ids:number[] = [];
        var shopDatas:any[] = [];
        var buyIds:number[] = [];

        for(var i in Config.ShopData)
        {
            shopDatas.push(Config.ShopData[i]);
        }

        shopDatas.sort(shopSort);
        function shopSort(a,b)
        {
            return parseInt(a["sort"]) - parseInt(b["sort"]);
        }

        for(var i in shopDatas)
        {
            var id:number = shopDatas[i]["id"];
            var shopData:any = Config.ShopData[id];
            var shopInfo:any = UserProxy.inst.shopObj[id];

            if(this._lastSelect == this.imgBag)
            {
                if(shopDatas[i]["type"] == 2)
                {
                    if(parseInt(shopData["daytimes"]) - shopInfo["todayTimes"] == 0)
                    {
                        buyIds.push(id);
                    }
                    else
                    {
                        ids.push(id);
                    }
                }
            }
            else
            {
                if(shopDatas[i]["type"] == 1)
                {
                    ids.push(id);
                }
            }
        }
        this.shopList.dataProvider = new eui.ArrayCollection(ids.concat(buyIds));

        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
    }

    private onEnterFrame(): void
    {
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        var turnId: number = UserMethod.inst.shopMoveTo;
        if (turnId > 2)
        {
            this.shopList.scrollV = (turnId - 1) * 73;
        }
    }

    private onUpDown():void
    {
        if(this._moving)
        {
            return;
        }
        this._moving = true;
        this._upDown = !this._upDown;
        var time:number = 500;
        if(this._upDown)
        {
            this.btnUp.source = "menu_down_png";
            egret.Tween.get(this).to({height:616},time);
            egret.Tween.get(this.scroll).to({height:494},time);
            MenuPanel.inst.menuUp = true;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            egret.Tween.get(this).to({height:282},time);
            egret.Tween.get(this.scroll).to({height:150},time);
            MenuPanel.inst.menuUp = false;
        }
        egret.setTimeout(function () {  this._moving = false;},this,time);

    }

    public destory():void
    {
        super.destory();
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.coinShow.endListener();
    }
}