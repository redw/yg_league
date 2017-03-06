/**
 * Created by Administrator on 12/8 0008.
 */
class SmallMonsterCatch extends BasePanel
{
    public btnClose:SimpleButton;
    public lblVitality:eui.Label;
    public lblRecoverTime:eui.Label;
    public catchMonsterList:eui.List;
    public btnBack:eui.Button;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SmallMonsterCatchSkin;
        this._mutex = false;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);this.btnClose.touchScaleEffect = true;
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.catchMonsterList.itemRenderer = MonsterCatchRenderer;
    }

    public initData(): void
    {
        this.lblVitality.text = UserProxy.inst.vitality + "/" + UserProxy.inst.vitalityMax;
        if(UserProxy.inst.vitality >= UserProxy.inst.vitalityMax)
        {
            this.lblRecoverTime.visible = false;
        }
        else
        {

        }

        var ids:number[] = [];
        for(var i in Config.SmallMonsterData)
        {
            ids.push(parseInt(i));
        }
        this.catchMonsterList.dataProvider = new eui.ArrayCollection(ids);
    }



    public onClose(e:egret.TouchEvent):void
    {
        PanelManager.inst.hidePanel("SmallMonsterCatch");
    }

    public destory():void
    {
        super.destory();
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);this.btnClose.touchScaleEffect = false;
        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
    }

}