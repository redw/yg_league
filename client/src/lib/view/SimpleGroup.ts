/**
 * Created by Administrator on 12/1 0001.
 */
class SimpleGroup extends eui.Group
{
    public constructor()
    {
        super();

        this.touchEnabled = true;
        this.touchScaleEffect = true;
    }

    public set touchScaleEffect(enabled:boolean)
    {
        if (enabled)
        {
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }
        else
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }
    }

    protected onTouchBegin(event:egret.TouchEvent):void
    {
        EffectUtil.playScaleEffect(this, 0.9);
    }
}