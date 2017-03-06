/**
 * Created by Administrator on 12/28 0028.
 */
class SevenDayButton extends eui.Component
{
    private img:AutoBitmap;
    private lbl:eui.Label;

    private _imgStr:string;
    private _txt:string;

    public constructor()
    {
        super();
        this.skinName = SevenDayButtonSkin;
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

    public set btnImg(string:string)
    {
        this._imgStr = string;
        this.img.source = this._imgStr;
    }

    public set btnDay(day:number)
    {
        switch (day)
        {
            case 1:this._txt = "第一天";break;
            case 2:this._txt = "第二天";break;
            case 3:this._txt = "第三天";break;
            case 4:this._txt = "第四天";break;
            case 5:this._txt = "第五天";break;
            case 6:this._txt = "第六天";break;
            case 7:this._txt = "第七天";break;
        }
        this.lbl.text = this._txt;
    }
}