/**
 * Created by Administrator on 12/8 0008.
 */
class MonsterCatchRenderer extends eui.ItemRenderer
{
    public imgHead:AutoBitmap;
    public lblName:eui.Label;
    public lblDifficulty:eui.Label;
    public lblCostEnergy:eui.Label;
    public lblFightTimes:eui.Label;
    public lblGet:eui.Label;
    public btnFight:eui.Button;
    public btnReset:eui.Button;
    public btnSweep:eui.Button;
    public nextGroup:eui.Group;
    public lblGetLast:eui.Label;
    public btnGroup:eui.Group;

    public constructor()
    {
        super();
        this.skinName = MonsterCatchRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnFight.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnSweep.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);

    }

    private onHide(event:egret.Event):void
    {
        this.btnFight.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnReset.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnSweep.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
    }


    private onTouch(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.btnFight)
        {

        }
        else if(e.currentTarget == this.btnSweep)
        {

        }
        else
        {

        }

    }

    public dataChanged(): void
    {
        super.dataChanged();

        this.lblCostEnergy.text = "-" + Config.BaseData[21]["value"];
        var monsterInfo:any = UserProxy.inst.monsterList[this.data];
        var monsterData:any = Config.SmallMonsterData[this.data];
        this.lblName.text = monsterData["name"];
        var difficult:number = monsterInfo["difficult"] + 1;

        this.lblDifficulty.text = "难度：" + difficult;
        this.lblFightTimes.text = "剩余次数：" + monsterInfo["challenge"] + "/" + 3;
        var nowGet:any = Config.MonsterFb[difficult]["num"];
        var nextGet:any = Config.MonsterFb[difficult + 1]["num"];
        this.lblGet.text = "*" + nowGet;
        this.lblGetLast.text = "*" + nextGet;

        if(monsterInfo["challenge"])
        {
            this.btnReset.visible = false;
            this.btnGroup.x = 222;
            this.btnSweep.enabled = true;
            this.btnFight.enabled = true;
        }
        else
        {
            this.btnReset.visible = true;
            this.btnGroup.x = 120;
            this.btnSweep.enabled = false;
            this.btnFight.enabled = false;
        }

        if(difficult > 1)
        {
            this.nextGroup.visible = true;
            this.btnSweep.visible = true;
        }
        else
        {
            this.nextGroup.visible = false;
            this.btnSweep.visible = false;
        }

    }
}