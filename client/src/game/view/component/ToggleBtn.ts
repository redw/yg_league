/**
 * Created by Administrator on 11/30 0030.
 */
class ToggleBtn extends eui.Component
{

    public _select:boolean = true;

    public imageDown:eui.Image;
    public imageUp:eui.Image;
    public labelDisplay:eui.Label;

    public constructor()
    {
        super();
        this.skinName = ToggleBtnSkin;
    }

    public set select(value:boolean)
    {
        this._select = value;
        this.imageDown.visible = this._select;
        this.imageUp.visible = !this._select;
    }

}