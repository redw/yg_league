/**
 * Created by Administrator on 1/17 0017.
 */
class CircleSuccessPanel extends BasePanel
{
    private imgWhite:eui.Image;
    private completeGroup:eui.Group;
    private awardIcon:WeaponIcon;
    private lblNum:eui.Label;

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = CircleSuccessPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init():void
    {
        this.imgWhite.visible = false;
        this.completeGroup.visible = false;
        this.completeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }

    public initData():void
    {
        this.awardIcon.imgIcon = "reward_4_png";
        this.lblNum.text = "x" + MathUtil.easyNumber(this.data - UserProxy.inst.medal);
        var self = this;
        MovieClipUtils.createMovieClip(Global.getOtherEffect("circle_light"),"circle_light",afterAdd,this);
        function afterAdd(data): void
        {
            var mc = data;
            mc.x = -149;
            mc.y = -50;
            mc.scaleX = 3;
            mc.scaleY = 3;
            this.addChild(mc);
            MovieClipUtils.playMCOnce(mc,function(): void
            {
                DisplayUtil.removeFromParent(mc);
                showWhite();
                egret.setTimeout(self.startShow,this,800);
            },this);
        }

        function showWhite():void
        {
            self.imgWhite.visible = true;
            egret.Tween.get(self.imgWhite).to({alpha:0},800);
        }
    }

    private startShow():void
    {
        this.imgWhite.visible = false;
        this.completeGroup.visible = true;
        MovieClipUtils.createMovieClip(Global.getOtherEffect("circle_star"),"circle_star",afterAdd1,this);
        function afterAdd1(data): void
        {
            var mc = data;
            mc.x = 80;
            mc.y = 140;
            mc.play(-1);
            mc.touchEnabled = false;
            mc.name = "star";
            mc.scaleX = 2.5;
            mc.scaleY = 2.5;
            this.completeGroup.addChild(mc);
        }

        for(var i:number = 0;i < 12 ; i++)
        {
            var star:eui.Image = <eui.Image>DisplayUtil.getChildByName(this.completeGroup,"star" + i);
            if(i%2 == 0)
            {
                star.alpha = 0;
                egret.Tween.get(star,{loop:true}).to({alpha:1},1000).to({alpha:0},1000);
            }
            else
            {
                egret.Tween.get(star,{loop:true}).to({alpha:0},1000).to({alpha:1},1000);
            }
        }
    }

    private onClose():void
    {
        var data = {};
        data["medal"] = this.data;
        UserMethod.inst.showAward(data);
        PanelManager.inst.hidePanel("CircleSuccessPanel");

        if(UserProxy.inst.circleObj["circleTimes"] == 1)
        {
            PanelManager.inst.showPanel("DeblockPanel",1);

        }

    }

    public destory():void
    {
        super.destory();

        var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this.completeGroup,"star");
        if(mc)
        {
            mc.stop();
            DisplayUtil.removeFromParent(mc);
        }

        for(var i:number = 0;i < 12 ; i++)
        {
            var star:eui.Image = <eui.Image>DisplayUtil.getChildByName(this.completeGroup,"star" + i);
            egret.Tween.removeTweens(star);
        }



    }

}