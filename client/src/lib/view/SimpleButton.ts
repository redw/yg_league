/**
 * 简单按钮
 * @author j
 * 2016/1/7
 */
class SimpleButton extends eui.Image
{


    public constructor()
    {
        super();

        this.touchEnabled = true;
        this.touchScaleEffect = true;
    }

    public set touchScaleEffect(enabled:boolean)
    {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
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

    protected onTouchTap(event:egret.TouchEvent):void
    {
        SoundManager.inst.playEffect("click_mp3");
    }
}