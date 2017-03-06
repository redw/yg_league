/**
 * Created by Administrator on 11/24 0024.
 */
class YellowCoinButton extends eui.Button
{
    private _txt:string;
    private _img:string;

    public txtUp:eui.Label;
    public labelDisplay:eui.Label;
    public imgType:AutoBitmap;

    public constructor()
    {
        super();
        this.skinName = YellowCoinButtonSkin;
        this.touchSoundEffect = true;
    }

    public set extraLabel(value:string)
    {
        this._txt = value;
        this.txtUp.text = this._txt;
    }

    public set label(value:string)
    {
        this.labelDisplay.text = value;
    }

    public set coinType(value:string)
    {
        this._img = value;
        this.imgType.source = this._img;
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
