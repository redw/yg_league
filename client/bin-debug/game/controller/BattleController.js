/**
 * 战场控制器
 * Created by Administrator on 11/10 0010.
 */
var BattleController = (function (_super) {
    __extends(BattleController, _super);
    function BattleController() {
        _super.call(this);
        /** 固定的动作名称 */
        this._idle = "idle"; //待机
        this._atk = "attack"; //普攻
        this._skill = "skill"; //技能
        this._beAtked = "hit"; //受击
        this._block = "block"; //格挡
        //--------------------------------------------------/
        this._battleView = null;
        TickerUtil.register(this.update, this, 50);
        EventManager.inst.addEventListener(ContextEvent.CHA_RESET, this.onResetHero, this);
        EventManager.inst.addEventListener(ContextEvent.CHA_REMOVE, this.onRemoveHero, this);
        EventManager.inst.addEventListener(ContextEvent.CHA_HURT, this.onHurt, this);
        EventManager.inst.addEventListener(ContextEvent.CHA_MOVE, this.onSkillMove, this);
    }
    var d = __define,c=BattleController,p=c.prototype;
    d(BattleController, "inst"
        ,function () {
            if (BattleController._instance == null) {
                BattleController._instance = new BattleController();
            }
            return BattleController._instance;
        }
    );
    p.clearInterval = function () {
        TickerUtil.unregister(this.update, this);
    };
    p.initBattleView = function () {
        if (this._battleView) {
            this._battleView.destory();
            this._battleView = null;
        }
        this._battleView = new BattleView();
    };
    p.removePlayerFightView = function () {
        if (this._battleView) {
            this._battleView.destory();
            this._battleView = null;
        }
    };
    p.getBattleView = function () {
        return this._battleView;
    };
    /**
     * 还原动作
     * @param event
     */
    p.onResetHero = function (event) {
        var battleView = this.getBattleView();
        if (battleView) {
            battleView.restore(event.data);
        }
    };
    /**
     * 移除角色
     * @param event
     */
    p.onRemoveHero = function (event) {
        var battleView = this.getBattleView();
        if (battleView) {
            if (event.data.isHero) {
                battleView.removeCha(event.data);
            }
            else {
                battleView.removeMonster(event.data);
            }
        }
    };
    /**
     * 伤害时刻
     * @param event
     */
    p.onHurt = function (event) {
        var battleView = this.getBattleView();
        if (battleView) {
            battleView.doAtkHurt(event.data);
        }
    };
    /**
     * 技能移动时刻
     * @param event
     */
    p.onSkillMove = function (event) {
        var battleView = this.getBattleView();
        if (battleView) {
            battleView.doSkillMove(event.data);
        }
    };
    p.update = function () {
        var now = Date.now();
        var battleView = this.getBattleView();
        if (battleView) {
            battleView.updata(now);
        }
    };
    return BattleController;
}(egret.HashObject));
egret.registerClass(BattleController,'BattleController');
