/**
 * Created by Administrator on 2/8 0008.
 */
class RoleChangePanel extends BasePanel
{
    private imgSell:AutoBitmap;
    private imgBuy:AutoBitmap;
    private list:eui.List;
    private btnClose:SimpleButton;
    private lblShow:eui.Label;

    private lblSoulCoin1:eui.Label;
    private lblSoulCoin2:eui.Label;
    private lblSoulCoin3:eui.Label;
    private lblSoulCoin4:eui.Label;


    private _lastSelect:AutoBitmap;
    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = RoleChangePanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
        this._modal = true;
    }

    public init():void
    {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_SOUL_COIN,this.soulCoin,this);
        this.imgSell.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.imgBuy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.list.itemRenderer = RoleChangeRenderer;
    }

    public initData():void
    {
        this.imgSell.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        this.soulCoin();
    }

    private soulCoin():void
    {
        this.lblSoulCoin1.text = UserProxy.inst.soulCoin[0] +"";
        this.lblSoulCoin2.text = UserProxy.inst.soulCoin[1] +"";
        this.lblSoulCoin3.text = UserProxy.inst.soulCoin[2] +"";
        this.lblSoulCoin4.text = UserProxy.inst.soulCoin[3] +"";

    }

    private onTouch(e:egret.TouchEvent):void
    {
        if(this._lastSelect && this._lastSelect == e.currentTarget)
        {
            return;
        }
        if(e.currentTarget == this.imgSell)
        {
            this.imgSell.source = "role_draw_sell_light_png";
            this.imgBuy.source = "role_draw_change_png";
            UserMethod.inst.sell_change = 1;
            this.lblShow.text = "回收闲置的伙伴元神，获得神魂";
        }
        else
        {
            this.imgSell.source = "role_draw_sell_png";
            this.imgBuy.source = "role_draw_change_light_png";
            UserMethod.inst.sell_change = 2;
            this.lblShow.text = "用神魂兑换指定伙伴元神";
        }
        this._lastSelect = e.currentTarget;
        this.refresh();

    }


    private refresh():void
    {
        var ids:number[] = [];
        var upIds:number[] = [];
        var downs:number[] = [];

        if(UserMethod.inst.sell_change == 1)
        {
            for(var i in Config.DrawShopSellData)
            {
                var sellData:any = Config.DrawShopSellData[i];
                if(parseInt(sellData["is_sell"]))
                {
                    ids.push(parseInt(i));
                }
            }

            ids.sort(orderSort);

            function orderSort(a,b)
            {
                var sell1:any = Config.DrawShopSellData[a];
                var sell2:any = Config.DrawShopSellData[b];
                return parseInt(sell2["order"]) - parseInt(sell1["order"]);
            }

            for(var c in ids)
            {
                var sell:any = Config.DrawShopSellData[ids[c]];
                if(ids[c] > 100)
                {
                    var roleData:HeroVO = UserProxy.inst.heroData.getHeroData(ids[c]);
                    if(roleData.starPiece >= parseInt(sell["sell_num"]))
                    {
                        upIds.push(ids[c]);
                    }
                    else
                    {
                        downs.push(ids[c]);
                    }
                }
                else
                {
                    if(UserProxy.inst.pill >= parseInt(sellData["sell_num"]))
                    {
                        upIds.push(ids[c]);
                    }
                    else
                    {
                        downs.push(ids[c]);
                    }
                }

            }

        }
        else
        {
            for(var i in Config.DrawShopBuyData)
            {
                var buyData:any = Config.DrawShopBuyData[i];
                if(parseInt(buyData["is_buy"]))
                {
                    ids.push(parseInt(i));
                }
            }

            ids.sort(buyOrderSort);

            function buyOrderSort(a,b)
            {
                var buy1:any = Config.DrawShopBuyData[a];
                var buy2:any = Config.DrawShopBuyData[b];
                return parseInt(buy2["order"]) - parseInt(buy1["order"]);
            }

            for(var c in ids)
            {
                var buy:any = Config.DrawShopBuyData[ids[c]];
                if(UserProxy.inst.soulCoin[parseInt(buy["cost_type"]) - 1] >= parseInt(buy["cost_num"]))
                {
                    upIds.push(ids[c]);
                }
                else
                {
                    downs.push(ids[c]);
                }


            }

        }

        this.list.dataProvider = new eui.ArrayCollection(upIds.concat(downs));
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("RoleChangePanel");
    }

    public destory():void
    {
        super.destory();
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_SOUL_COIN,this.soulCoin,this);
        this.imgSell.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.imgBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }
}
