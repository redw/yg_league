/**
 * 小红点
 * @author j
 * 2016/1/25
 */
class RedPoint extends egret.Sprite
{
    private static POINT_RADIUS:number = 20;

    public jump:boolean = true;
    public bitmap:AutoBitmap;

    public constructor()
    {
        super();

        this.bitmap = new AutoBitmap();
        this.bitmap.x = -RedPoint.POINT_RADIUS / 2;
        this.bitmap.y = -RedPoint.POINT_RADIUS / 2;
        this.bitmap.source = "red_point_png";
        this.addChild(this.bitmap);

        this.startJump();
    }

    public setJump(bool:boolean):void
    {
        this.jump = bool;
        this.startJump();
    }

    public startJump():void
    {
        if (this.jump)
        {
            egret.Tween.get(this.bitmap).to({y: -20}, 200, egret.Ease.sineIn).to({y: -RedPoint.POINT_RADIUS / 2}, 500, egret.Ease.bounceOut).wait(5000).call(function()
            {
                this.startJump();
            }, this);
        }
        else
        {
            this.bitmap.x = -RedPoint.POINT_RADIUS / 2;
            this.bitmap.y = -RedPoint.POINT_RADIUS / 2;
            egret.Tween.removeTweens(this.bitmap);
        }
    }

    public clear():void
    {
        egret.Tween.removeTweens(this.bitmap);
    }
}