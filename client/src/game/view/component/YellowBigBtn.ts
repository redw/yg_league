/**
 * Created by Administrator on 11/29 0029.
 */
class YellowBigBtn extends eui.Button
{
    private _txt:string;
    private _img:string;

    public txtUp:eui.Label;
    public labelDisplay:eui.Label;
    public type:AutoBitmap;

    public constructor()
    {
        super();
        this.skinName = YellowBigBtnSkin;
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

    public set imgType(value:string)
    {
        if(!value)
        {
            this.type.visible = false;
        }
        else
        {
            this.type.visible = true;
            this._img = value;
            this.type.source = this._img;
        }

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