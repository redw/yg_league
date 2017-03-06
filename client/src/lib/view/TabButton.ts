/**
 * TabButton
 * @author j
 * 2016/11/14
 */
class TabButton extends eui.Component
{
    public _label:string = "";
    public _select:boolean = true;

    public imageDown:eui.Image;
    public imageUp:eui.Image;
    public labelDisplay:eui.Label;

    public constructor()
    {
        super();
        this.touchChildren = false;
        this.skinName = TabButtonSkin;
    }

    public set label(value:string)
    {
        this._label = value;
        this.labelDisplay.text = this._label;
    }

    public set select(value:boolean)
    {
        this._select = value;
        this.imageDown.visible = this._select;
        this.imageUp.visible = !this._select;
    }
}