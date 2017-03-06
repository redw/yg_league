/**
 * Created by Administrator on 11/24 0024.
 */
class GreenCoinButton extends eui.Button
{
    public imgType:AutoBitmap;
    public labelDisplay:eui.Label;

    public constructor()
    {
        super();
        this.skinName = GreenCoinButtonSkin;
        this.touchSoundEffect = true;
    }


    public set type(type:number)
    {
        if(type == 1)
        {
            this.imgType.source = "reward_1_s_png";
        }
        else if(type == 2)
        {
            this.imgType.source = "reward_3_s_png";
        }

    }

    public set label(value:string)
    {
        this.labelDisplay.text = value;
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