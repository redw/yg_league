/**
 * 怪物显示
 * Created by Administrator on 11/14 0014.
 */
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(heroID) {
        _super.call(this);
        this._heroID = heroID;
        this._isHero = false;
        this.init();
    }
    var d = __define,c=Monster,p=c.prototype;
    Monster.createMovieClip = function (heroId) {
        if (Monster._chaFactoryInst == null) {
            var dataRes = RES.getRes("1_json");
            var textureRes = RES.getRes("1_png");
            Monster._chaFactoryInst = new egret.MovieClipDataFactory(dataRes, textureRes);
        }
        return new egret.MovieClip(Monster._chaFactoryInst.generateMovieClipData("1"));
    };
    p.init = function () {
        //后面根据id 读取不同资源
        this._view = Monster.createMovieClip(this._heroID);
        this.addChild(this._view);
        //血条
        this._lifeBar = new LifeBar();
        this.addChild(this._lifeBar);
        this._lifeBar.x = -30;
        this._lifeBar.y = -this._view.height - 10;
        this.restore();
        this._view.addEventListener(egret.Event.COMPLETE, this.changeAction, this);
        this.initNature();
    };
    p.initNature = function () {
        this._lifeBar.reSet();
        this._lifeBar.visible = true;
    };
    d(p, "currentDoing"
        ,function () {
            return this._current;
        }
    );
    d(p, "isHero"
        ,function () {
            return this._isHero;
        }
    );
    p.hurt = function (monster) {
        this.Action(ACTION_TYPE.DO_BEATTACKED);
        this.hp -= monster.atk;
        this._lifeBar.setProgress(this._hp, this._life);
    };
    p.changeAction = function () {
        if (this._curState != ACTION_TYPE.DO_IDLE) {
            if (this._curState == ACTION_TYPE.DO_ATTACK || this._curState == ACTION_TYPE.DO_SKILL) {
                EventManager.inst.dispatch(ContextEvent.CHA_RESET, this);
            }
            else if (this._curState == ACTION_TYPE.DO_BEATTACKED) {
                if (this.hp <= 0) {
                    this._lifeBar.visible = false;
                    EventManager.inst.dispatch(ContextEvent.CHA_REMOVE, this);
                }
            }
            this.restore();
        }
    };
    p.updata = function () {
        if (this.curState == ACTION_TYPE.DO_ATTACK) {
            if (this._view.currentFrame >= this._current[0] && this.actioned) {
                //攻击对象收到伤害
                EventManager.inst.dispatch(ContextEvent.CHA_HURT, this);
                this.actioned--;
            }
        }
        else if (this.curState == ACTION_TYPE.DO_SKILL) {
            if (this._view.currentFrame >= this._current[1] && this.actioned > 1) {
                //移动帧
                EventManager.inst.dispatch(ContextEvent.CHA_MOVE, this);
                this.actioned--;
            }
            if (this._view.currentFrame >= this._current[2] && this.actioned) {
                //伤害帧
                EventManager.inst.dispatch(ContextEvent.CHA_HURT, this);
                this.actioned--;
            }
        }
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this._view.removeEventListener(egret.Event.COMPLETE, this.changeAction, this);
    };
    return Monster;
}(HeroBase));
egret.registerClass(Monster,'Monster');
