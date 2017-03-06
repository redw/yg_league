/**
 * Created by Administrator on 12/1 0001.
 */
class WeaponIcon extends eui.Component
{
    public imageBg:AutoBitmap;
    public imageIcon:AutoBitmap;

    private _bg:string;
    private _icon:string;

    public constructor()
    {
        super();
        this.skinName = WeaponIconSkin;
    }

    public set imgIcon(value:string)
    {
        this._icon = value;
        this.imageIcon.source = this._icon;
    }

    public set imgBg(value:string)
    {
        this._bg = value;
        this.imageBg.source = this._bg;
    }

    public set qualityBg(quality:string)
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
    }

    public set touchReward(reward:any[])
    {
        this.imageIcon["awardData"] = reward;
        this.imageIcon.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onItem,this);
    }

    private onItem(e:egret.TouchEvent):void
    {
        var awardData:any[] = e.currentTarget["awardData"];
        ShowItemTipPanel.show(awardData);
    }

}