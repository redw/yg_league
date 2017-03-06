/**
 * Created by Administrator on 12/5 0005.
 */
class GreenButton extends eui.Button
{
    public labelDisplay:eui.Label;

    public constructor()
    {
        super();
        this.skinName = GreenButtonSkin;
    }


    public set label(value:string)
    {
        this.labelDisplay.text = value;
    }

}