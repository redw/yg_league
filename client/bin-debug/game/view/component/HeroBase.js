/**
 * 英雄基类
 * Created by Administrator on 11/16 0016.
 */
var ACTION_TYPE;
(function (ACTION_TYPE) {
    ACTION_TYPE[ACTION_TYPE["DO_IDLE"] = 0] = "DO_IDLE";
    ACTION_TYPE[ACTION_TYPE["DO_ATTACK"] = 1] = "DO_ATTACK";
    ACTION_TYPE[ACTION_TYPE["DO_SKILL"] = 2] = "DO_SKILL";
    ACTION_TYPE[ACTION_TYPE["DO_BEATTACKED"] = 3] = "DO_BEATTACKED";
    ACTION_TYPE[ACTION_TYPE["DO_BLOCK"] = 4] = "DO_BLOCK";
})(ACTION_TYPE || (ACTION_TYPE = {}));
var HeroBase = (function (_super) {
    __extends(HeroBase, _super);
    //--------------------------------------------------/
    function HeroBase() {
        _super.call(this);
        /** 固定的动作名称 */
        this._doIdle = "idle"; //待机
        this._doAtk = "attack"; //普攻
        this._doSkill = "skill"; //技能
        this._doBeAtked = "hit"; //受击
        this._doBlock = "block"; //格挡
    }
    var d = __define,c=HeroBase,p=c.prototype;
    d(p, "hp"
        ,function () {
            return this._hp;
        }
        /**生命值变动*/
        ,function (value) {
            this._hp = value;
        }
    );
    d(p, "life"
        ,function () {
            return this._life;
        }
        ,function (value) {
            this._life = value;
        }
    );
    d(p, "checkHp"
        ,function () {
            return this._checkHp;
        }
        ,function (value) {
            this._checkHp = value;
        }
    );
    d(p, "atk"
        ,function () {
            return this._atk;
        }
        ,function (value) {
            this._atk = value;
        }
    );
    d(p, "position"
        ,function () {
            return this._position;
        }
        ,function (value) {
            this._position = value;
        }
    );
    d(p, "speed"
        ,function () {
            return this._speed;
        }
        ,function (value) {
            this._speed = value;
        }
    );
    d(p, "curState"
        ,function () {
            return this._curState;
        }
    );
    d(p, "isHero"
        ,function () {
            return this._isHero;
        }
        ,function (value) {
            this._isHero = value;
        }
    );
    d(p, "target"
        ,function () {
            return this._target;
        }
        ,function (value) {
            this._target = value;
        }
    );
    d(p, "actioned"
        ,function () {
            return this._actioned;
        }
        ,function (value) {
            this._actioned = value;
        }
    );
    p.hurt = function (any) {
    };
    p.updata = function () {
    };
    /**动作*/
    p.Action = function (action) {
        this._curState = action;
        switch (action) {
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
        this._view.gotoAndPlay(this._stateLabel, 1);
    };
    /**待机*/
    p.restore = function () {
        this._curState = ACTION_TYPE.DO_IDLE;
        this._stateLabel = this._doIdle;
        this._view.gotoAndPlay(this._stateLabel, -1);
    };
    p.destory = function () {
        if (this.parent)
            this.parent.removeChild(this);
        this._view.stop();
    };
    return HeroBase;
}(egret.DisplayObjectContainer));
egret.registerClass(HeroBase,'HeroBase');
//# sourceMappingURL=HeroBase.js.map