/**
 * Created by Administrator on 12/5 0005.
 */
class SecretAreaRenderer extends eui.ItemRenderer
{
    public lblName:eui.Label;
    public btnFight:eui.Button;
    public lblAward:eui.Label;
    public imgType:AutoBitmap;
    public imgIcon:AutoBitmap;

    public constructor()
    {
        super();
        this.skinName = SecretAreaRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnFight.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onFight,this);
    }

    private onHide(event:egret.Event):void
    {
        this.btnFight.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onFight,this);
    }

    private onFight(e:egret.TouchEvent):void
    {
        PanelManager.inst.showPanel("RoleFormationPanel",{type:2, id:this.data});
    }

    public dataChanged(): void
    {
        super.dataChanged();
        var weaponFbData:any = Config.WeaponFb[this.data];
        this.lblName.text = weaponFbData["name"];
        UserMethod.inst.secret_id = this.data;
        var rewardId:number = parseInt(weaponFbData["reward_1"][0]);
        this.imgType.source = UserMethod.inst.rewardJs[rewardId].icon_s;
        this.lblAward.text = MathUtil.easyNumber(Math.floor(parseFloat(weaponFbData["reward_1"][2]) * UserProxy.inst.addSecretAward));
        this.imgIcon.source = Global.getSecretIcon(weaponFbData["head_icon"]);
    }
}