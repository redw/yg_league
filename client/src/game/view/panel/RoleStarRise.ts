/**
 * Created by Administrator on 12/27 0027.
 */
class RoleStarRise extends BasePanel
{
    public imgJob:AutoBitmap;
    public lblName:eui.Label;
    public lblNameChip:eui.Label;
    public imgIconBg:AutoBitmap;
    public imageIcon:AutoBitmap;
    public lblStar:eui.Label;
    public lblStarCoin:eui.Label;
    public btnClose:SimpleButton;
    public lblFragmentNum:eui.Label;
    public btnRise:eui.Button;
    public imgEnoughChip:eui.Image;
    public imgEnoughPill:eui.Image;
    public chipIcon:WeaponIcon;
    public starIcon:WeaponIcon;
    public riseBg:eui.Image;
    public riseShowStar:eui.Image;
    public contentGroup:eui.Group;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = RoleStarRiseSkin;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
        this._modal = true;
    }

    public init():void
    {
        Http.inst.addCmdListener(CmdID.STAR_UP,this.showEffect,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnRise.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRise,this);
    }

    private showEffect():void
    {
        this.riseBg.visible = true;
        this.riseShowStar.visible = true;
        this.riseShowStar.scaleX = 8;
        this.riseShowStar.scaleY = 8;
        var self = this;
        egret.Tween.get(this.riseShowStar).to({scaleX:1,scaleY:1},300).call(showEffect);

        function showEffect():void
        {
            self.riseShowStar.visible = false;
            MovieClipUtils.createMovieClip(Global.getOtherEffect("rise_star"),"rise_star",afterAdd,this);
            function afterAdd(data): void
            {
                var mc = data;
                mc.x = 108;
                mc.y = 100;
                self.contentGroup.addChild(mc);
                MovieClipUtils.playMCOnce(mc,function(): void
                {
                    DisplayUtil.removeFromParent(mc);
                    self.riseBg.visible = false;
                    self.initData();
                },this);
            }
        }
    }

    public initData():void
    {
        var roleData = UserProxy.inst.heroData.getHeroData(this.data);
        this.imgJob.source = "job_" + roleData.config.job + "_png";
        this.lblName.text = roleData.config.name;
        this.lblNameChip.text = roleData.config.name + "元神";
        this.lblStar.text = roleData.starLevel + "";
        this.imageIcon.source = Global.getChaIcon(this.data);
        var quality:number = parseInt(roleData.config.quality);
        this.imgIconBg.source = "role_icon_" + quality + "_png";


        var starData:any = Config.HeroStarData[roleData.starLevel + 1];
        var needChip:number = starData["rank_chip_" + quality];
        var needPill:number = starData["rank_pill_" + quality];

        var starPiece:number = roleData.starPiece;
        this.lblFragmentNum.text = starPiece + "/" + needChip;
        this.lblStarCoin.text = UserProxy.inst.pill + "/" + needPill;

        var chipEnough:number = 0;
        var pillEnough:number = 0;
        if( starPiece >= needChip)
        {
            chipEnough = 1;
        }
        if(UserProxy.inst.pill >= needPill)
        {
            pillEnough = 1;
        }
        this.imgEnoughChip.visible = !!chipEnough;
        this.imgEnoughPill.visible = !!pillEnough;

        this.btnRise.enabled = (!!chipEnough && !!pillEnough);
        var starMax:number = parseInt(Config.BaseData[67]["value"][quality-1]);
        if(roleData.starLevel >= starMax)
        {
            this.btnRise.enabled = false;
            this.btnRise.label = "MAX";
        }


        this.chipIcon.imgIcon = Global.getChaChipIcon(this.data);
        this.chipIcon.qualityBg = roleData.config.quality;
        this.starIcon.imgIcon = "reward_22_png";

    }

    private onRise():void
    {
        Http.inst.send(CmdID.STAR_UP,{hid:this.data});
    }


    private onClose():void
    {
        PanelManager.inst.hidePanel("RoleStarRise");
    }

    public destory():void
    {
        super.destory();
        Http.inst.removeCmdListener(CmdID.STAR_UP,this.initData,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnRise.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRise,this);
    }
}