/**
 * Created by Administrator on 12/5 0005.
 */
class WeaponSuitRenderer extends eui.ItemRenderer
{
    public lblDec:eui.Label;

    public constructor()
    {
        super();
        this.skinName = WeaponSuitRendererSkin;
    }

    public dataChanged(): void
    {
        super.dataChanged();
        this.lblDec.text = UserMethod.inst.getAddSting(this.data["buff"]) + "(" + this.data["hadCount"] + "/" + this.data["needCount"] + ")";
        if(parseInt(this.data["hadCount"]) >= parseInt(this.data["needCount"]))
        {
            this.lblDec.textColor = 0x906C53;
        }
        else
        {
            this.lblDec.textColor = 0xAA9C89;
        }

    }
    
}