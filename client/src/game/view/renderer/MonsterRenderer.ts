/**
 * Created by Administrator on 12/7 0007.
 */
class MonsterRenderer extends eui.ItemRenderer
{
    public imgHead:AutoBitmap;
    public lblName:eui.Label;
    public lblMagic:eui.Label;
    public bar:eui.ProgressBar;
    public lblBar:eui.Label;
    public lblDec:eui.Label;
    public btnCall:eui.Button;
    public btnLook:eui.Button;
    public imgUnHad:eui.Image;
    public lblLv:eui.BitmapLabel;


    public constructor()
    {
        super();
        this.skinName = MonsterRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnCall.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnLook.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);

        Http.inst.addCmdListener(CmdID.MONSTER_UP,this.refreshMonster,this);
    }

    private onHide(event:egret.Event):void
    {
        this.btnCall.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnLook.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        Http.inst.removeCmdListener(CmdID.MONSTER_UP,this.refreshMonster,this);
    }

    private onTouch(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.btnCall)
        {
            Http.inst.send(CmdID.MONSTER_UP,{mid:this.data});
        }
        else
        {
            PanelManager.inst.showPanel("SmallMonsterInfo",this.data);
        }

    }

    public refreshMonster(e:egret.Event):void
    {
        for(var i in e.data["monsterList"])
        {
            if(parseInt(i) == this.data)
            {
                this.dataChanged();
            }
        }
    }

    public dataChanged(): void
    {
        super.dataChanged();
        var monsterData:any = Config.SmallMonsterData[this.data];
        this.lblName.text = monsterData["name"];
        var monsterInfo:any = UserProxy.inst.monsterList[this.data];
        var nextUpData:any = Config.MonsterLvUpData[monsterInfo["lv"] + 1];
        this.lblLv.text = "+" + monsterInfo["lv"];
        var para:number = parseFloat(monsterData["attr_1"][2]) * monsterData["lv"];
        this.lblDec.text = UserMethod.inst.getAddSting(monsterData["attr_1"],para);
        var hadPiece:number = monsterInfo["piece"];
        var needPiece:number = parseInt(nextUpData["num"]);
        this.bar.value = hadPiece/needPiece*100;
        this.lblBar.text = MathUtil.easyNumber(hadPiece) + "/" + MathUtil.easyNumber(needPiece);

        if(monsterInfo["lv"])
        {
            this.imgUnHad.visible = false;
            this.lblMagic.visible = true;
            this.btnLook.visible = true;
            this.btnCall.visible = false;
            this.lblLv.visible = true;

            var score:number = 0;
            var index:number = monsterInfo["lv"];
            for(var i:number = 1; i <= index;i++)
            {
                var value:number = parseInt(Config.MonsterLvUpData[i]["scores"])
                score += value;
            }
            this.lblMagic.text = "法力：" + score;
        }
        else
        {
            this.lblMagic.visible = false;
            this.btnLook.visible = false;
            this.lblLv.visible = false;

            if(hadPiece >= needPiece)
            {
                this.btnCall.visible = true;
                this.imgUnHad.visible = false;
            }
            else
            {
                this.btnCall.visible = false;
                this.imgUnHad.visible = true;
            }
        }
    }
}