/**
 * 战场控制器
 * Created by Administrator on 11/10 0010.
 */

class BattleController extends egret.HashObject
{
    /** 固定的动作名称 */
    public _idle: string = "idle";              //待机
    public _atk: string = "attack";             //普攻
    public _skill: string = "skill";            //技能
    public _beAtked: string = "hit";            //受击
    public _block: string = "block";            //格挡
    //--------------------------------------------------/
    
    
    private _battleView: BattleView = null;
    private static _instance:BattleController;

    public static get inst():BattleController
    {
        if (BattleController._instance == null)
        {
            BattleController._instance = new BattleController();
        }
        return BattleController._instance;
    }

    public constructor()
    {
        super();
        TickerUtil.register(this.update, this, 50);

        EventManager.inst.addEventListener(ContextEvent.CHA_RESET,this.onResetHero,this);
        EventManager.inst.addEventListener(ContextEvent.CHA_REMOVE,this.onRemoveHero,this);
        EventManager.inst.addEventListener(ContextEvent.CHA_HURT,this.onHurt,this);
        EventManager.inst.addEventListener(ContextEvent.CHA_MOVE,this.onSkillMove,this);
    }

    public clearInterval():void
    {
        TickerUtil.unregister(this.update,this);
    }

    public initBattleView():void
    {
        if(this._battleView)
        {
            this._battleView.destory();
            this._battleView = null;
        }
        this._battleView = new BattleView();
    }

    public removePlayerFightView():void
    {
        if(this._battleView)
        {
            this._battleView.destory();
            this._battleView = null;
        }
    }

    public getBattleView(): BattleView
    {
        return this._battleView;
    }

    
    
    /**
     * 还原动作
     * @param event
     */ 
    private onResetHero(event:egret.Event):void
    {
        var battleView: BattleView = this.getBattleView();
        if(battleView) 
        {
            battleView.restore(event.data);
        }
    }

    /**
     * 移除角色
     * @param event
     */
    private onRemoveHero(event:egret.Event):void
    {
        var battleView: BattleView = this.getBattleView();
        if(battleView)
        {
            if(event.data.isHero)
            {
                battleView.removeCha(event.data);
            }
            else
            {
                battleView.removeMonster(event.data);
            }

        }
    }

    /**
     * 伤害时刻
     * @param event
     */
    private onHurt(event:egret.Event):void
    {
        var battleView: BattleView = this.getBattleView();
        if(battleView)
        {
            battleView.doAtkHurt(event.data);
        }
    }
    
    /**
     * 技能移动时刻
     * @param event
     */ 
    private onSkillMove(event:egret.Event):void
    {
        var battleView: BattleView = this.getBattleView();
        if(battleView) 
        {
            battleView.doSkillMove(event.data);
        }
    }



    private update():void
    {
        var now:number = Date.now();
        var battleView: BattleView = this.getBattleView();
        if(battleView)
        {
            battleView.updata(now);
        }
    }
}