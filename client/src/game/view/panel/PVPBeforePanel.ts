/**
 * Created by Administrator on 12/27 0027.
 */
class PVPBeforePanel extends BasePanel
{
    public btnIn:eui.Button;
    public coinShow:CoinShowPanel;
    public btnInMine:eui.Button;

    public constructor()
    {
        super();

        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = PVPBeforePanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }

    public init():void
    {
        this.btnIn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onIn,this);
        this.btnInMine.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMine,this);
        EventManager.inst.addEventListener("MINE_CHECK",this.checkPoint,this);
        this.coinShow.startListener();
    }

    public initData():void
    {
        this.checkPoint();
    }

    private checkPoint():void
    {
        UserMethod.inst.removeRedPoint(this.btnInMine.parent,"upPoint");
        if(UserMethod.inst._mineBuildPoint || UserMethod.inst._mineFullPoint)
        {
            UserMethod.inst.addRedPoint(this.btnInMine.parent,"upPoint",new egret.Point(this.btnInMine.x + 90 ,this.btnInMine.y + 10));
        }
    }

    private onIn():void
    {
        UserMethod.inst.removeRedPoint(this.btnInMine.parent,"upPoint");
        var pvpBeginTime:number = Config.PVPData[7]["value"];
        var nowTime:number = UserProxy.inst.server_time;
        var divTime:number = nowTime - pvpBeginTime;
        var divDay:number = Math.floor(divTime/86400);
        var oneSeasonTime:number = 7;
        var times:number = Math.floor(divDay / oneSeasonTime);
        var nowSeasonEnd:number = pvpBeginTime + (times+1) * oneSeasonTime*86400;

        var beginData:Date = new Date((nowSeasonEnd + 10*60) *1000);
        var beginYear:number = beginData.getFullYear();
        var beginMon:number = beginData.getMonth()+1;
        var beginDay:number = beginData.getDate();
        var beginHour:number =  beginData.getHours();
        var beginMin:number =  beginData.getMinutes();
        if(UserProxy.inst.server_time <= nowSeasonEnd + 10*60 && UserProxy.inst.server_time > nowSeasonEnd )
        {
            Alert.show("赛季结算中\n 请" + beginYear + "年" +beginMon + "月" + beginDay + "日" + beginHour + "时" + beginMin + "分\n" + "后再来！" );
        }
        else
        {
            PanelManager.inst.showPanel("PVPPanel");
        }
    }

    private onMine():void
    {
        if(UserProxy.inst.historyArea < 1000)
        {
            Notice.show("通过1000关开启！");
            return;
        }
        PanelManager.inst.showPanel("MineMainPanel");
    }

    public destory():void
    {
        super.destory();
        EventManager.inst.removeEventListener("MINE_CHECK",this.checkPoint,this);
        this.btnIn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onIn,this);
        this.btnInMine.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMine,this);
        this.coinShow.endListener();
    }

}