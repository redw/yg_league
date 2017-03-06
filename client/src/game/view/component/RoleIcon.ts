/**
 * Created by Administrator on 12/26 0026.
 */
class RoleIcon extends eui.Component
{
    private imageIcon:AutoBitmap;
    private lblLv:eui.Label;
    private imageStar:eui.Image;
    private lblStar:eui.Label;

    private _icon:string;
    private _lv:number;
    private _star:number;

    public constructor()
    {
        super();
        this.skinName = RoleIconSkin;
    }

    public set imgIcon(value:string)
    {
        this._icon = value;
        this.imageIcon.source = this._icon;
    }

    /*public set qualityBg(quality:string)
    {
        var qly:number = parseInt(quality);
        switch (qly)
        {
            case 1:this._bg = "role_icon_1_png"; break;
            case 2:this._bg = "role_icon_2_png"; break;
            case 3:this._bg = "role_icon_3_png"; break;
            case 4:this._bg = "role_icon_4_png"; break;
        }
        this.imageBg.source = this._bg;
    }*/

    public set setLv(lv:number)
    {
        this._lv = lv;
        if( this._lv = lv)
        {
            this.lblLv.text = "Lv." + this._lv;
            this.lblLv.visible = true;
        }
        else
        {
            this.lblLv.visible = false;
        }
    }

    public set setStar(star:number)
    {
        this._star = star;
        if(this._star)
        {
            this.lblStar.text = "" + this._star;
            this.lblStar.visible = true;
            this.imageStar.visible = true;
        }
        else
        {
            this.lblStar.visible = false;
            this.imageStar.visible = false;
        }
    }

}