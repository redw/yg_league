/**
 * Created by Administrator on 12/1 0001.
 */
class YellowTwoCoinBtn extends eui.Button
{
    public imageType:AutoBitmap;
    public imageType1:AutoBitmap;
    public labelDisplay:eui.Label;
    public labelDisplay1:eui.Label;

    private _type:string;
    private _type1:string;
    private _label1:string;
    private _label2:string;

    public constructor()
    {
        super();
        this.skinName = YellowTwoCoinBtnSkin;
        this.touchSoundEffect = true;
    }

    public set label(value:string)
    {
        this._label1 = value;
        this.labelDisplay.text =  this._label1;
    }

    public set label1(value:string)
    {
        this._label2 = value;
        this.labelDisplay1.text =  this._label2;
    }

    public set type(value:string)
    {
        this._type = value;
        this.imageType.source = this._type;
    }

    public set type1(value:string)
    {
        this._type1 = value;
        this.imageType1.source = this._type1;
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