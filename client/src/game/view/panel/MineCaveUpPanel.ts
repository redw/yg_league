/**
 * Created by Administrator on 3/1 0001.
 */
class MineCaveUpPanel extends BasePanel
{
    public btnLvUp:eui.Button;
    public btnClose:SimpleButton;
    public imgBar:eui.Image;
    public lblBar:eui.Label;
    public lblNow:eui.Label;
    public lblNext:eui.Label;
    public lblLv:eui.Label;


    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = MineCaveUpPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        Http.inst.addCmdListener(CmdID.MINE_UP,this.initData,this);
        this.btnLvUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }

    public initData():void
    {
        var mineInfo:any = UserProxy.inst.home["mine"][this.data];

        var lv:number = 1;
        if(mineInfo["lv"])
        {
           lv = mineInfo["lv"];
        }
        var oreUpData:any = Config.OreUpData[lv];
        var oreUpNextData:any = Config.OreUpData[lv + 1];
        this.lblLv.text = "Lv." + lv ;
        var nowMax:number = parseInt(oreUpData["value"]);
        this.lblNow.text = "当前：灵矿的存量上限为：" + MathUtil.easyNumber(nowMax);
        if(!oreUpNextData)
        {
            this.lblNext.text = "已经升到满级！";
            this.btnLvUp.enabled = false;
            this.lblBar.text = "MAX";
            this.imgBar.width = 272;
        }
        else
        {
            var nextMax:number = parseInt(oreUpNextData["value"]);
            this.lblNext.text = "下级：灵矿的存量上限为：" + MathUtil.easyNumber(nextMax);
            var now:number = UserProxy.inst.ore;
            var cost:number = parseInt(oreUpNextData["cost"]);
            this.lblBar.text = StringUtil.toFixed(now,0) + "/" + cost;
            this.imgBar.width = MathUtil.clamp(Math.floor(now * 272 / cost),0,272);
            this.btnLvUp.enabled = now >= cost;
        }
    }


    public onAdd():void
    {
        Http.inst.send(CmdID.MINE_UP,{id:this.data});
    }

    public onClose():void
    {
        PanelManager.inst.hidePanel("MineCaveUpPanel");
    }

    public destory():void
    {
        super.destory();
        Http.inst.removeCmdListener(CmdID.MINE_UP,this.initData,this);
        this.btnLvUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }
}