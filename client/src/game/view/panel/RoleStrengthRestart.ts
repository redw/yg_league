/**
 * Created by Administrator on 12/27 0027.
 */
class RoleStrengthRestart extends BasePanel
{
    public lblGetJade:eui.Label;
    public roleIcon:RoleIcon;
    public lblStrength:eui.Label;
    public lblShow:eui.Label;
    public btnRestart:YellowBigBtn;
    public btnClose:SimpleButton;

    private _roleId:number;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = RoleStrengthRestartSkin;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
        this._modal = true;
    }

    public init():void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRestart,this);
    }

    public initData():void
    {
        this.lblShow.text = "\t 初始化可100%返还用于强化的灵玉；被初始化的伙伴，其强化等级重置为0";
        this._roleId = this.data;
        this.btnRestart.extraLabel = "确认重置";
        this.btnRestart.label = Config.BaseData[8]["value"];
        this.refreshNature();
    }

    private refreshNature():void
    {
        var roleData = UserProxy.inst.heroData.getHeroData(this._roleId);
        this.roleIcon.imgIcon = Global.getChaIcon(this._roleId);
        this.roleIcon.setLv = 0;
        this.lblStrength.text = "+" + roleData.strengthenLevel ;
        var getJade:number = parseInt(Config.HeroJadeCostData[roleData.strengthenLevel ]["return"]) ;
        this.lblGetJade.text = MathUtil.easyNumber(getJade);
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("RoleStrengthRestart");
    }

    private onRestart():void
    {
        if(UserProxy.inst.costAlart)
        {
            this.showCost();
        }
        else
        {
            Alert.showCost(Config.BaseData[8]["value"],"强化重置",true,this.showCost,null,this);
        }

    }

    private showCost():void
    {
        if(UserProxy.inst.diamond >= parseInt(Config.BaseData[8]["value"]))
        {
            Http.inst.send(CmdID.ENHANCE_RESET,{hid:this._roleId});
            this.onClose();
        }
    }


    public destory():void
    {
        super.destory();
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnRestart.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRestart,this);
    }

}