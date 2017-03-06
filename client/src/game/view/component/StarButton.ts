/**
 * Created by Administrator on 11/29 0029.
 */
class StarButton extends eui.Button
{
    public labelTxt:eui.Label;

    public constructor()
    {
        super();
        this.skinName = StarButtonSkin;
        this.touchSoundEffect = true;
    }


    public set label(value:string)
    {
        this.labelTxt.text = value;
    }


    public set touchSoundEffect(enabled:boolean)
    {
        if(enabled)
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        }
        else
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        }
    }

    protected onTouchTap(event:egret.TouchEvent):void
    {
        SoundManager.inst.playEffect("click_mp3");
    }
}