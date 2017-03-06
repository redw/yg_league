/**
 * Created by Administrator on 12/5 0005.
 */
class SecretAreaPanel extends BasePanel
{
    public areaList:eui.List;
    public btnUp:eui.Button;
    public btnDown:eui.Button;
    public btnClose:SimpleButton;
    public lblDesc:eui.Label;

    private lblWeaponCoin0:eui.Label;
    private lblWeaponCoin1:eui.Label;
    private lblWeaponCoin2:eui.Label;
    private lblWeaponCoin3:eui.Label;
    private lblWeaponCoin4:eui.Label;

    private _index:number;


    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SecretAreaPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
        this._modal = true;
    }

    public init(): void
    {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_WEAPON_COIN,this.refreshWeaponCoin,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);
        this.btnDown.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);

        this.areaList.itemRenderer = SecretAreaRenderer;
    }

    public onChange(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.btnUp)
        {
            this._index ++;
        }
        else
        {
            this._index --;
        }

        this.showIndex(this._index);
    }

    public initData(): void
    {
        UserMethod.inst.secret_type = this.data;
        this._index = 0;

        var dungeonInfo:any = UserProxy.inst.dungeonList[this.data];
        var nowId:number = dungeonInfo["dungeonId"];
        this._index = Math.floor(nowId/5);

        this.showIndex(this._index);
        // var secretData:any = Config.WeaponFbOp[this.data];
        this.lblDesc.text = "秘境挑战，不计伙伴等级和天赋加成属性";//secretData["disc"];

        this.refreshWeaponCoin();
    }

    private refreshWeaponCoin():void
    {
        this.lblWeaponCoin0.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[0]);
        this.lblWeaponCoin1.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[1]);
        this.lblWeaponCoin2.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[2]);
        this.lblWeaponCoin3.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[3]);
        this.lblWeaponCoin4.text = MathUtil.easyNumber(UserProxy.inst.weaponCoin[4]);
    }

    public showIndex(index:number):void
    {
        this.btnDown.visible = true;
        this.btnUp.visible = true;
        if(index == 0)
        {
            this.btnDown.visible = false;
        }
        if(index == 5)
        {
            this.btnUp.visible = false;
        }

        var dungeonInfo:any = UserProxy.inst.dungeonList[this.data];
        var nowId:number = dungeonInfo["dungeonId"];//0,1,2,3...
        var ids:number[] = [];
        var begin:number = (1000 * this.data + 1);
        var start:number = (1000 * this.data + 1) + index * 5;
        var end:number = (1000 * this.data + 5) + index * 5;
        for(var i:number = start; i<= end; i++ )
        {
            var id:number = i - begin;
            if(nowId >= id)
            {
                ids.push(i);
            }
        }
        this.areaList.dataProvider = new eui.ArrayCollection(ids);

        var canUp:boolean = (nowId / ((index+1) * 5)) >= 1;

        this.btnUp.visible = ids.length >= 5 && canUp;

    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("SecretAreaPanel");
    }

    public destory():void
    {
        super.destory();
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_WEAPON_COIN,this.refreshWeaponCoin,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);
        this.btnDown.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onChange,this);
    }


}