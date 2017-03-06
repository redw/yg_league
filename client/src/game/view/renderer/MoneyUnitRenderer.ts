/**
 * Created by Administrator on 2/4 0004.
 */
class MoneyUnitRenderer extends eui.ItemRenderer
{
    public lblDesc:eui.Label;
    public lblName:eui.Label;

    public constructor()
    {
        super();
        this.skinName = MoneyUnitRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {

    }

    private onHide(event:egret.Event):void
    {

    }

    public dataChanged(): void
    {
        super.dataChanged();

        this.lblName.text = MathUtil.unitKey[this.data];
        this.lblDesc.text = (this.data + 1)*3 + "个零";

    }
}