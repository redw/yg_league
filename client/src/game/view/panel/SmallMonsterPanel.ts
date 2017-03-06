/**
 * Created by Administrator on 12/7 0007.
 */
class SmallMonsterPanel extends BasePanel
{
    public lblAllLv:eui.Label;
    public lblUpNature:eui.Label;
    public allProgress:eui.ProgressBar;
    public lblProgress:eui.Label;
    public btnGoCatch:SimpleButton;
    public monsterList:eui.List;


    public constructor()
    {
        super();
        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = SmallMonsterPanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }

    public init(): void
    {
        Http.inst.addCmdListener(CmdID.MONSTER_UP,this.showMagicAdd,this);
        Http.inst.addCmdListener(CmdID.MONSTER_OPEN,this.openBack,this);

        this.btnGoCatch.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCatch,this);this.btnGoCatch.touchScaleEffect = true;
        this.monsterList.itemRenderer = MonsterRenderer;

        Http.inst.send(CmdID.MONSTER_OPEN);
    }

    public initData(): void
    {
        this.showMagicAdd();
        var ids:number[] = [];
        for(var i in UserProxy.inst.monsterList)
        {
            ids.push(parseInt(i));
        }
        this.monsterList.dataProvider = new eui.ArrayCollection(ids);

    }

    private openBack(e:egret.Event):void
    {
        if(e.data)
        {
            UserProxy.inst.vitality = e.data["vitality"];
            UserProxy.inst.lastRecoverTime = e.data["lastRecoverTime"];
        }

    }


    public showMagicAdd():void
    {

        //等级
        var nowLv:number = 0;
        var next_score:number = 0;

        var lv_base:number = Config.BaseData[32]["value"];
        var lv_para:number = Config.BaseData[33]["value"];
        var pow_base:number = Config.BaseData[34]["value"];
        var pow_para:number = Config.BaseData[35]["value"];

        for(var i:number = 0;i < 1000; i++)
        {
            var next:number = pow_base *(Math.pow(pow_para,i+1)-1)/(pow_para-1);
            if(next > UserProxy.inst.score)
            {
                nowLv = i;
                next_score = next;
                break;
            }

        }

        var nature_add:number ;
        if(nowLv)
        {
            nature_add = Math.floor(lv_base * Math.pow(lv_para,nowLv-1)) ;
        }
        else
        {
            nature_add = 0;
        }

        this.lblProgress.text = UserProxy.inst.score + "/" + next_score;
        this.allProgress.value = UserProxy.inst.score/next_score * 100;
        this.lblAllLv.text = "Lv." + nowLv + " 法力";
        this.lblUpNature.text = "全体全属性提升：" + MathUtil.easyNumber(nature_add * 100) + "%";

    }

    private onCatch(e:egret.TouchEvent):void
    {
        PanelManager.inst.showPanel("SmallMonsterCatch");
    }

    public destory():void
    {
        super.destory();
        this.btnGoCatch.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onCatch,this);this.btnGoCatch.touchScaleEffect = false;
        Http.inst.removeCmdListener(CmdID.MONSTER_UP,this.showMagicAdd,this);
    }


}