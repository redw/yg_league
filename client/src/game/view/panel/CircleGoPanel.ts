/**
 * Created by Administrator on 2/7 0007.
 */
class CircleGoPanel extends BasePanel
{
    public lblGoCondition:eui.Label;
    public btnClose:SimpleButton;
    public lblMission:eui.Label;
    public lblTimes:eui.Label;
    public lblGetCard:eui.Label;
    public lblNowArea:eui.Label;
    public btnGo:YellowCoinButton;

    private _shakeCost:number;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = CircleGoPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init():void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.lblGetCard.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGoCard,this);
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGoNow,this);

    }

    public initData():void
    {
        this.lblGoCondition.text = Config.BaseData[68]["value"] + "关以上的轮回，可使用突进";
        var goMission:number = UserProxy.inst.circleObj["lastCircleArea"] - parseInt(Config.BaseData[69]["value"]);
        this.lblMission.text = goMission + "关";
        this.lblTimes.text = Math.floor((goMission-UserProxy.inst.curArea)/50) + "次";
        this.btnGo.extraLabel = "突 进";
        this._shakeCost = parseInt(Config.BaseData[70]["value"]) * (goMission - UserProxy.inst.curArea);
        this.btnGo.label =  this._shakeCost + "";
        this.lblNowArea.text = UserProxy.inst.curArea + "关";

        if(UserProxy.inst.vipObj["foreverVIP"])
        {
            this.btnGo.label = "免费";
        }
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("CircleGoPanel");
    }

    private onGoCard():void
    {
        PanelManager.inst.showPanel("PrivilegePanel");
        this.onClose();
    }

    private onGoNow():void
    {
        if(UserProxy.inst.vipObj["foreverVIP"])
        {
            Http.inst.send(CmdID.GET_BACK)
        }
        else
        {
            if(UserProxy.inst.costAlart)
            {
                this.showCostAlert();
            }
            else
            {
                Alert.showCost(this._shakeCost,"直接突进",true,this.showCostAlert,null,this);
            }
        }
    }

    private showCostAlert():void
    {
        if(UserProxy.inst.diamond >= this._shakeCost)
        {
            Http.inst.send(CmdID.GET_BACK)
        }
        else
        {
            ExternalUtil.inst.diamondAlert();
        }
    }

    public destory():void
    {
        super.destory();
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.lblGetCard.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGoCard,this);
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGoNow,this);
    }
}