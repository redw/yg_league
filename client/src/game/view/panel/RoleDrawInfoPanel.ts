/**
 * Created by Administrator on 12/15 0015.
 */
class RoleDrawInfoPanel extends BasePanel
{
    public contentGroup:eui.Group;
    public firstShowGroup:eui.Group;
    public nextShowGroup:eui.Group;
    public endShowGroup:eui.Group;
    public imgRotate:eui.Image;
    public lblSay:eui.Label;
    public lblName:eui.Label;
    public lblWeaponName:eui.Label;
    public lblWeaponDesc:eui.Label;
    public lblAtkType:eui.Label;
    public imgRace:AutoBitmap;
    public lblRace:eui.Label;
    public imgSex:AutoBitmap;
    public lblSex:eui.Label;

    public imgWeapon:AutoBitmap;
    public atkType:AutoBitmap;
    public imgScale:eui.Image;
    public imgBody:AutoBitmap;
    public lblOut:eui.Label;
    public btnShare:SimpleButton;
    public imgFirst:eui.Image;

    private _heroId:number;
    private _from:number;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = RoleDrawInfoPanelSkin;
        this._modal = true;
        this._modalAlpha = 1;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);

        this.firstShowGroup.alpha = 0;
        this.nextShowGroup.alpha = 0;
        this.endShowGroup.alpha = 0;

        egret.Tween.get(this.firstShowGroup).to({alpha:1},500);
        egret.Tween.get(this.nextShowGroup).wait(500).to({alpha:1},500);
        egret.Tween.get(this.endShowGroup).wait(1000).to({alpha:1},500);
    }

    public canHeroShare():boolean
    {
        var roleData = UserProxy.inst.heroData.getHeroData(this._heroId);
        if(roleData.evolution == 0 && (roleData.starLevel || this._from == 1) && this._heroId == 103)
        {
            return true;
        }
        return false;
    }

    public initData(): void
    {
        this._heroId = this.data["id"];
        this._from = this.data["from"];

        var roleData = UserProxy.inst.heroData.getHeroData(this._heroId);
        this.lblName.text = roleData.config.name;

        this.lblSay.text = roleData.config.slogan;
        this.imgBody.source = Global.getHerobody(this._heroId);
        this.imgWeapon.source = Global.getHeroWeapon(this._heroId);

        this.lblWeaponName.text = roleData.config.weapon_name;
        this.lblWeaponDesc.text = roleData.config.weapon_disc;

        var job:string;
        switch (parseInt(roleData.config.job))
        {
            case 1:job = "职业：战士"; break;
            case 2:job = "职业：法师"; break;
            case 3:job = "职业：射手"; break;
            case 4:job = "职业：辅助"; break;
            case 5:job = "职业：刺客"; break;
        }
        this.lblAtkType.text = job;

        switch (parseInt(roleData.config.race))
        {
            case 3:this.lblRace.text = "种族：人"; break;
            case 4:this.lblRace.text = "种族：妖"; break;
            case 5:this.lblRace.text = "种族：仙"; break;
        }
        this.lblSex.text = parseInt(roleData.config.sex) == 1 ? "性别：男" : "性别：女";
        this.atkType.source = "job_" + roleData.config.job + "_png";
        this.imgRace.source = "race_" + roleData.config.race + "_png";
        this.imgSex.source = "sex_"+ roleData.config.sex +"_png";

       /* MovieClipUtils.createMovieClip(Global.getChaStay(this.data),this.data,afterAdd,this);
        function afterAdd(data): void
        {
            var mc = data;
            mc.x = 30;
            mc.y = 80;
            mc.scaleX = 1.8;
            mc.scaleY = 1.8;
            mc.play(-1);
            this.mcGroup.addChild(mc);
        }*/

        egret.Tween.get(this.imgRotate,{loop:true}).to({rotation:360},10000);
        egret.Tween.get(this.imgScale,{loop:true}).to({rotation:-360},10000);
        egret.Tween.get(this.lblOut,{loop:true}).to({alpha:0},1000).to({alpha:1},1000);

        SoundManager.inst.playEffect(this._heroId + "_choose_mp3");


        this.btnShare.visible = this.canHeroShare();
        this.imgFirst.visible = this.btnShare.visible;

        if(ExternalUtil.inst.getIsYYB())
        {
            this.btnShare.visible = false;
            this.imgFirst.visible = false;
        }
    }

    private onShare():void
    {
        UserMethod.inst.shareHeroId = this._heroId;
        ExternalUtil.inst.showInvite();
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("RoleDrawInfoPanel");
    }
    public destory():void
    {
        super.destory();
        egret.Tween.removeTweens(this.imgRotate);
        egret.Tween.removeTweens(this.imgScale);
        egret.Tween.removeTweens(this.lblOut);
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnShare.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
        EventManager.inst.dispatch(ContextEvent.CONTINUE_MOVE);
    }
}