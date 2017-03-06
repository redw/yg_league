/**
 * Created by Administrator on 11/28 0028.
 */
class RoleSkillRenderer extends eui.ItemRenderer
{
    private contentGroup:eui.Group;
    private imgTouchShow:eui.Image;
    private imgMask:eui.Image;
    private lblName:eui.Label;
    private lblDec:eui.Label;
    private imgStar:eui.Image;
    private lblStar:eui.Label;
    private lblOpen:eui.Label;
    private imgIcon:AutoBitmap;

    public constructor()
    {
        super();
        this.skinName = RoleSkillRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.imgTouchShow.visible = false;
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
    }

    private onHide(event:egret.Event):void
    {
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
    }

    private onTouch(e:egret.TouchEvent):void
    {
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().addEventListener(egret.TouchEvent.TOUCH_END, this.onCloseSkillTip, this);
    }

    private onEnterFrame(event:egret.Event):void
    {
        if(!this.imgTouchShow.visible)
        {
            this.imgTouchShow.visible = true;
        }
    }

    private onCloseSkillTip():void
    {
        this.imgTouchShow.visible = false;
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().removeEventListener(egret.TouchEvent.TOUCH_END, this.onCloseSkillTip, this);
    }

    public dataChanged(): void
    {
        super.dataChanged();

        var roleInfo:HeroVO = UserProxy.inst.heroData.getValue(UserMethod.inst.roleSelectId);
        var skillData:any = Config.SkillData[this.data["skillId"]];
        var openStar:number = parseInt(this.data["openStar"]);
        this.imgIcon.source = Global.getSkillIcon(this.data["skillId"]);
        this.lblStar.text = this.data["openStar"];
        if(roleInfo.starLevel >= openStar)
        {
            this.imgMask.visible = false;
            this.imgStar.visible = false;
            this.lblOpen.visible = false;
            this.lblStar.visible = false;
        }
        else
        {
            this.imgMask.visible = true;
            this.imgStar.visible = true;
            this.lblOpen.visible = true;
            this.lblStar.visible = true;
        }

        this.lblName.text = skillData["name"];
        this.lblDec.text = skillData["tip"];

    }
}
