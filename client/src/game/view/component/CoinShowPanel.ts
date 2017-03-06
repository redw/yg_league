/**
 * Created by Administrator on 2/22 0022.
 */
class CoinShowPanel extends eui.Component
{
    public lblGold:eui.Label;
    public lblDiamond:eui.Label;
    public lblMedal:eui.Label;
    public imgShow:eui.Image;
    public imgShow1:eui.Image;

    public constructor()
    {
        super();
        this.skinName = CoinShowPanelSkin;
    }

    public startListener():void
    {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_BASE,this.refresh,this);
        this.imgShow.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUtil,this);
        this.imgShow1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUtil,this);
        EventManager.inst.addEventListener(ContextEvent.ADD_EARN_MONEY,this.showAdd,this);
        this.refresh();
    }

    public refresh():void
    {
        if(UserProxy.inst.gold == undefined || UserProxy.inst.medal == undefined)
        {
            return;
        }
        this.lblDiamond.text = UserProxy.inst.diamond + "";
        this.lblGold.text = MathUtil.easyNumber(UserProxy.inst.gold);
        this.lblMedal.text = MathUtil.easyNumber(UserProxy.inst.medal);
    }

    public endListener():void
    {
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_BASE,this.refresh,this);
        this.imgShow.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUtil,this);
        this.imgShow1.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUtil,this);
        EventManager.inst.removeEventListener(ContextEvent.ADD_EARN_MONEY,this.showAdd,this);
    }


    public onUtil():void
    {
        PanelManager.inst.showPanel("MoneyUnitPanel");
    }

    private showAdd(e:egret.Event):void
    {
        var showAdd:eui.Label = new eui.Label();
        showAdd.fontFamily = Global.SYS_FONT;
        showAdd.size = 12;
        showAdd.bold = true;
        showAdd.stroke = 1;
        showAdd.strokeColor = 0x432A00;
        showAdd.textColor = 0xFFDB5F;

        var add:any = BigNum.sub(e.data,UserProxy.inst.gold);
        if(BigNum.greaterOrEqual(add,1))
        {
            showAdd.text = "+" + MathUtil.easyNumber(add);
            showAdd.x = 400;
            showAdd.y = 23;
            this.addChild(showAdd);

            UserProxy.inst.gold = e.data;
            egret.Tween.get(showAdd).to({y:1,alpha:0},800).call(removeShow);

            function removeShow():void
            {
                DisplayUtil.removeFromParent(showAdd);
            }
            EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        }

    }
}