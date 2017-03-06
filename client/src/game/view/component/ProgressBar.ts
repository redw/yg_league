/**
 * 进度条
 * @author j
 * 2016/7/21
 */
class ProgressBar extends eui.Component
{
    public imageProgress:eui.Image;
    public imageProgress_2:eui.Image;
    public labelProgress:eui.Label;

    public constructor()
    {
        super();
    }

    protected childrenCreated():void
    {
        super.childrenCreated();

        this.imageProgress_2.mask = new egret.Rectangle();
    }

    public set label(value:string)
    {
        this.labelProgress.text = value;
    }

    public set value(value:number)
    {
        this.imageProgress.mask = new egret.Rectangle(0, 0, Math.min(this.width, value * this.width), this.height);
    }

    public set value_2(value:number)
    {
        this.imageProgress_2.mask = new egret.Rectangle(0, 0, Math.min(this.width, value * this.width), this.height);
    }
}