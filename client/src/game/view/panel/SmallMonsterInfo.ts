/**
 * Created by Administrator on 12/7 0007.
 */
class SmallMonsterInfo extends BasePanel
{
    public btnLvUp:eui.Button;
    public lblName:eui.Label;
    public imgHead:AutoBitmap;
    public lblMagic:eui.Label;
    public lblDec:eui.Label;
    public imgAddBar:AutoBitmap;
    public imgBar:AutoBitmap;
    public lblBar:eui.Label;
    public btnAdd:SimpleButton;
    public imgSelect:eui.Image;
    public lblAllPiece:eui.Label;
    public btnClose:SimpleButton;
    public btnSelect:SimpleButton;
    public lblLv:eui.BitmapLabel;

    private _monsterData:any;
    private _monsterInfo:any;
    private _nextUpData:any;
    private _barWidth:number = 239;
    private _canUp:boolean = false;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SmallMonsterInfoSkin;
        this._mutex = false;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init(): void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);this.btnClose.touchScaleEffect = true;
        this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);this.btnAdd.touchScaleEffect = true;
        this.btnSelect.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSelect,this);this.btnSelect.touchScaleEffect = true;
        this.btnLvUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this);
        this.imgSelect.visible = false;

        Http.inst.addCmdListener(CmdID.MONSTER_UP,this.initData,this);
    }

    public initData(): void
    {
        this._monsterData = Config.SmallMonsterData[this.data];
        this.lblName.text = this._monsterData["name"];
        this.lblAllPiece.text = UserProxy.inst.allKindPiece + "";
        this._monsterInfo = UserProxy.inst.monsterList[this.data];
        this._nextUpData = Config.MonsterLvUpData[this._monsterInfo["lv"] + 1];
        this.lblLv.text =  "+" + this._monsterInfo["lv"];
        var para:number = parseFloat(this._monsterData["attr_1"][2]) * this._monsterData["lv"];
        this.lblDec.text = UserMethod.inst.getAddSting(this._monsterData["attr_1"],para);
        var score:number = 0;
        var index:number = this._monsterInfo["lv"];
        for(var i:number = 1; i <= index;i++)
        {
            var value:number = parseInt(Config.MonsterLvUpData[i]["scores"]);
            score += value;
        }
        this.lblMagic.text = "法力：" + score;
        this.changePercent();
    }

    private changePercent():void
    {

        var hadPiece:number = this._monsterInfo["piece"];
        var needPiece:number = parseInt(this._nextUpData["num"]);
        var userAllPiece:number = UserProxy.inst.allKindPiece + hadPiece;

        this.imgAddBar.visible = this.imgSelect.visible;
        this.imgBar.width = MathUtil.clamp(Math.floor(hadPiece * this._barWidth / needPiece),0,this._barWidth);
        this.imgAddBar.width = MathUtil.clamp(Math.floor(userAllPiece * this._barWidth / needPiece),0,this._barWidth);
        this._canUp = false;

        if(this.imgSelect.visible)
        {
            this.lblBar.text = userAllPiece + "/" + needPiece;
            if(userAllPiece >= needPiece)
            {
                this._canUp = true;
            }
        }
        else
        {
            this.lblBar.text = hadPiece + "/" + needPiece;
            if(hadPiece >= needPiece)
            {
                this._canUp = true;
            }
        }

        this.btnLvUp.enabled = this._canUp;

    }

    private onLvUp():void
    {
        Http.inst.send(CmdID.MONSTER_UP,{mid:this.data});
    }

    private onAdd():void
    {
        PanelManager.inst.showPanel("SmallMonsterCatch");
    }

    private onSelect():void
    {
        this.imgSelect.visible = !this.imgSelect.visible;
        this.changePercent();
    }

    private onClose(e:egret.TouchEvent):void
    {
        PanelManager.inst.hidePanel("SmallMonsterInfo");
    }

    public destory():void
    {
        super.destory();

        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);this.btnClose.touchScaleEffect = false;
        this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onAdd,this);this.btnAdd.touchScaleEffect = false;
        this.btnSelect.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSelect,this);this.btnSelect.touchScaleEffect = false;
        this.btnLvUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this);
        Http.inst.removeEventListener(CmdID.MONSTER_UP,this.initData,this);
    }

}