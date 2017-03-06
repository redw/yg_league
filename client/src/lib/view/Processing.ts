/**
 * 转圈
 * @author j
 * 2016/2/22
 */
class Processing extends egret.Sprite
{
    private static _instance:Processing;

    public static get inst():Processing
    {
        if (Processing._instance == null)
        {
            Processing._instance = new Processing();
        }
        return Processing._instance;
    }

    private _bitmap:AutoBitmap;

    public constructor()
    {
        super();
        this.touchEnabled = true;

        var mask:eui.Image = DisplayUtil.createMask();
        this.addChild(mask);

       /* this._bitmap = new AutoBitmap();
        this._bitmap.x = Global.getStageWidth() / 2;
        this._bitmap.y = Global.getStageHeight() / 2;
        this._bitmap.source = "loading_01";
        this._bitmap.anchorOffsetX = 28;
        this._bitmap.anchorOffsetY = 28;
        this.addChild(this._bitmap)*/

        MovieClipUtils.createMovieClip(Global.getOtherEffect("process"),"process",afterAdd1,this);
        function afterAdd1(data): void
        {
            var mc = data;
            mc.x = 240;
            mc.y = 400;
            mc.play(-1);
            mc.name = "process";
            this.addChild(mc);
        }

    }

    public show():void
    {
        // egret.Tween.removeTweens(this._bitmap);
        // egret.Tween.get(this._bitmap, {loop: true}).to({rotation: 360}, 1000);

        Global.getStage().addChild(this);
    }

    public hide():void
    {
        // egret.Tween.removeTweens(this._bitmap);

        var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this,"process");
        if(mc)
        {
            mc.stop();
            DisplayUtil.removeFromParent(mc);
        }

        DisplayUtil.removeFromParent(this);

    }
}