/**
 *
 * Created by Administrator on 11/14 0014.
 */
var BattleView = (function (_super) {
    __extends(BattleView, _super);
    function BattleView() {
        _super.call(this);
        this._heroList = [];
        this._monsterList = [];
        this._heroPosList = [new egret.Point(100, 100), new egret.Point(100, 200), new egret.Point(100, 300)];
        this._monsterPosList = [new egret.Point(400, 100), new egret.Point(400, 200), new egret.Point(400, 300)];
        this._battleArr = [];
        this._doMoveNumber = 0;
        this._togetherDelay = 200; //同时出手间隔
        this._moveToTime = 150; //移动攻击的时间
        this._moveBackTime = 100; //回来的时间
        this._roundTime = 800; //每回合间隔时间
        this._actionDelay = 300; //下一个出手的间隔
    }
    var d = __define,c=BattleView,p=c.prototype;
    p.createCha = function (heroID, pos) {
        var hero = new Hero(heroID);
        hero.position = pos;
        hero.hp = hero.life = 10;
        hero.atk = 2;
        hero.speed = 10; //MathUtils.rangeRandom(1,10);
        hero._current = [33, 61, 72];
        this._heroList.push(hero);
        this.addChild(hero);
        hero.x = this._heroPosList[hero.position].x;
        hero.y = this._heroPosList[hero.position].y;
    };
    p.createMonster = function (monsterId, pos) {
        var monster = new Monster(monsterId);
        monster.hp = monster.life = 3;
        monster.atk = 1;
        monster.position = pos;
        monster.speed = MathUtil.rangeRandom(1, 10);
        monster._current = [33, 61, 72];
        this._monsterList.push(monster);
        this.addChild(monster);
        monster.x = this._monsterPosList[monster.position].x;
        monster.y = this._monsterPosList[monster.position].y;
        monster.scaleX = -1;
    };
    p.startLevel = function (level) {
        this.reset();
        this.createCha(1, 0);
        this.createCha(2, 1);
        this.createCha(3, 2);
        this.createMonster(1, 0);
        this.createMonster(2, 1);
        this.createMonster(3, 2);
        this.sortBattle();
    };
    p.sortBattle = function () {
        this._battleArr = [];
        //排序
        for (var _i = 0, _a = this._heroList; _i < _a.length; _i++) {
            var cha = _a[_i];
            cha.checkHp = cha.hp;
            this._battleArr.push(cha);
        }
        for (var _b = 0, _c = this._monsterList; _b < _c.length; _b++) {
            var monster = _c[_b];
            monster.checkHp = monster.hp;
            this._battleArr.push(monster);
        }
        this._battleArr.sort(sortSpeed);
        function sortSpeed(a, b) {
            var speed1 = a.speed;
            var speed2 = b.speed;
            return speed2 - speed1;
        }
        if (!this._heroList.length || !this._monsterList.length) {
            return;
        }
        this.battleAction();
    };
    p.roundClear = function () {
        if (!this._heroList.length) {
            //失败
            Notice.show("fail!");
            egret.setTimeout(this.startLevel, this, 2000);
            return;
        }
        if (!this._monsterList.length) {
            //下一关
            Notice.show("next!");
            egret.setTimeout(this.startLevel, this, 2000);
            return;
        }
    };
    p.battleAction = function () {
        //按顺序出手
        if (this._battleArr.length > 0) {
            var doCha = this._battleArr.shift();
            this.doTogether(doCha);
        }
        else {
            egret.setTimeout(this.sortBattle, this, this._roundTime);
        }
    };
    p.doTogether = function (cha) {
        this.roundClear();
        this._doMoveNumber++;
        this.doBattle(cha);
        if (this._battleArr.length > 0 && (this._battleArr[0].isHero == cha.isHero)) {
            var nextCha = this._battleArr.shift();
            egret.setTimeout(function () {
                this.doTogether(nextCha);
            }, this, this._togetherDelay);
        }
    };
    p.doBattle = function (attackCha) {
        var beAttactedCha;
        /**寻怪规则*/
        if (attackCha.isHero) {
            beAttactedCha = this._monsterList[0];
        }
        else {
            beAttactedCha = this._heroList[0];
        }
        if (!beAttactedCha) {
            // debugger;
            console.log("beAttactedCha is error");
            return;
        }
        beAttactedCha.checkHp -= attackCha.atk;
        if (beAttactedCha.checkHp <= 0) {
            if (beAttactedCha.isHero) {
                this.removeHeroList(beAttactedCha);
            }
            else {
                this.removeMonsterList(beAttactedCha);
            }
            this._battleArr.splice(this._battleArr.indexOf(beAttactedCha), 1);
        }
        this.doSkill(attackCha, beAttactedCha);
    };
    p.removeHeroList = function (hero) {
        this._heroList.splice(this._heroList.indexOf(hero), 1);
    };
    p.removeMonsterList = function (monster) {
        this._monsterList.splice(this._monsterList.indexOf(monster), 1);
    };
    p.removeCha = function (hero) {
        DisplayUtil.removeFromParent(hero);
    };
    p.removeMonster = function (monster) {
        DisplayUtil.removeFromParent(monster);
    };
    p.doAtk = function (doCha, beAtked) {
        var toX;
        if (doCha.isHero) {
            toX = beAtked.x - 100;
        }
        else {
            toX = beAtked.x + 100;
        }
        var toY = beAtked.y;
        doCha.target = beAtked;
        doCha.actioned = 1;
        egret.Tween.get(doCha).to({ x: toX, y: toY }, this._moveToTime).call(action);
        function action() {
            doCha.Action(ACTION_TYPE.DO_ATTACK);
        }
    };
    p.doAtkHurt = function (doCha) {
        if (doCha.target) {
            doCha.target.hurt(doCha);
            doCha.target = null;
        }
    };
    p.doSkill = function (doCha, beAtked) {
        doCha.target = beAtked;
        doCha.actioned = 2;
        doCha.Action(ACTION_TYPE.DO_SKILL);
    };
    p.doSkillMove = function (doCha) {
        if (doCha.target) {
            var toX;
            if (doCha.isHero) {
                toX = doCha.target.x - 100;
            }
            else {
                toX = doCha.target.x + 100;
            }
            var toY = doCha.target.y;
            var moveTime = (doCha._current[2] - doCha._current[1]) * 50;
            egret.Tween.get(doCha).to({ x: toX, y: toY }, moveTime);
        }
    };
    p.restore = function (cha) {
        var oldX = 0;
        var oldY = 0;
        if (cha.isHero) {
            oldX = this._heroPosList[cha.position].x;
            oldY = this._heroPosList[cha.position].y;
        }
        else {
            oldX = this._monsterPosList[cha.position].x;
            oldY = this._monsterPosList[cha.position].y;
        }
        egret.Tween.get(cha).to({ x: oldX, y: oldY }, this._moveBackTime);
        this._doMoveNumber--;
        if (this._doMoveNumber <= 0) {
            this.roundClear();
            egret.setTimeout(this.battleAction, this, this._actionDelay);
        }
    };
    p.updata = function (now) {
        for (var _i = 0, _a = this._heroList; _i < _a.length; _i++) {
            var hero = _a[_i];
            hero.updata();
        }
        for (var _b = 0, _c = this._monsterList; _b < _c.length; _b++) {
            var monster = _c[_b];
            monster.updata();
        }
    };
    p.reset = function () {
        for (var i = this._heroList.length; i--;) {
            this._heroList[i].destory();
        }
        for (i = this._monsterList.length; i--;) {
            this._monsterList[i].destory();
        }
        this._heroList = [];
        this._monsterList = [];
    };
    p.destory = function () {
    };
    return BattleView;
}(egret.DisplayObjectContainer));
egret.registerClass(BattleView,'BattleView');
//# sourceMappingURL=BattleView.js.map