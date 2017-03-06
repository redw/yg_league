/**
 * 英雄基类
 * Created by Administrator on 11/16 0016.
 */
enum ACTION_TYPE
{
    DO_IDLE ,         //待机
    DO_ATTACK,          //攻击
    DO_SKILL,           //技能
    DO_BEATTACKED,     //受击
    DO_BLOCK,            //格挡
}

class HeroBase extends egret.DisplayObjectContainer
{
    /**攻击对象*/
    public _target:HeroBase;
    /**当前血量*/
    protected _hp: number;
    /**攻击检测血量*/
    public _checkHp:number;
    /**最大血量*/
    public _life: number;
    /**攻击力*/
    public _atk: number;
    /**速度*/
    public _speed: number;
    /**位置*/
    public _position:number;
    /**血条*/
    protected _lifeBar: LifeBar;
    /**view MovieClip*/
    public _view: egret.MovieClip;
    /**状态标签*/
    protected _stateLabel: string;
    /**当前状态*/
    protected _curState: ACTION_TYPE;
    /**行动过标签*/
    protected _actioned:number;
   
    /**攻击伤害帧，技能移动帧，技能伤害帧*/
    public _current:number[];
    public _isHero: boolean;

    /** 固定的动作名称 */
    public _doIdle: string = "idle";              //待机
    public _doAtk: string = "attack";             //普攻
    public _doSkill: string = "skill";            //技能
    public _doBeAtked: string = "hit";            //受击
    public _doBlock: string = "block";            //格挡
    //--------------------------------------------------/

    public constructor()
    {
        super();
    }

    /**生命值变动*/
    public set hp(value:number)
    {
        this._hp = value;
    }
    public get hp():number
    {
        return this._hp;
    }
    
    public set life(value: number) 
    {
        this._life = value;
    }
    public get life(): number 
    {
        return this._life;
    }
    
    public set checkHp(value:number)
    {
        this._checkHp = value;
    }
    
    public get checkHp():number
    {
        return this._checkHp;
    }

    public set atk(value:number)
    {
        this._atk = value;
    }

    public get atk():number
    {
        return this._atk;
    }

    public set position(value:number)
    {
        this._position = value;
    }

    public get position():number
    {
        return this._position;
    }

    public set speed(value:number)
    {
        this._speed = value;
    }

    public get speed():number
    {
        return this._speed;
    }

    public get curState():ACTION_TYPE
    {
        return this._curState;
    }

    public set isHero(value:boolean)
    {
        this._isHero = value;
    }

    public get isHero():boolean
    {
        return this._isHero;
    }

    public set target(value:HeroBase)
    {
        this._target = value;
    }

    public get target():HeroBase
    {
        return this._target;
    }
    
    public set actioned(value:number)
    {
        this._actioned = value;
    }
    
    public get actioned():number
    {
        return this._actioned;
    }

    public hurt(any:HeroBase):void
    {

    }
    
    public updata():void
    {
        
    }
    /**动作*/
    public Action(action: ACTION_TYPE)
    {
        this._curState = action;
        switch(action)
        {
            case ACTION_TYPE.DO_ATTACK:
                this._stateLabel = this._doAtk;
                break;
            case ACTION_TYPE.DO_SKILL:
                this._stateLabel = this._doSkill;
                break;
            case ACTION_TYPE.DO_BEATTACKED:
                this._stateLabel = this._doBeAtked;
                break;
            case ACTION_TYPE.DO_BLOCK:
                this._stateLabel = this._doBlock;
                break;
        }
        this._view.gotoAndPlay(this._stateLabel,1);
    }
    /**待机*/
    public restore():void
    {
        this._curState = ACTION_TYPE.DO_IDLE;
        this._stateLabel = this._doIdle;
        this._view.gotoAndPlay(this._stateLabel,-1);
    }

    public destory():void
    {
        if (this.parent)
            this.parent.removeChild(this);
        this._view.stop();
    }

}
