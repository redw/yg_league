/**
 *
 * Created by Administrator on 11/14 0014.
 */
class BattleView extends egret.DisplayObjectContainer
{
    private _heroList: HeroBase[] = [];
    private _monsterList: HeroBase[] = [];
    private _heroPosList: egret.Point[] = [new egret.Point(100, 100), new egret.Point(100, 200), new egret.Point(100, 300)];
    private _monsterPosList: egret.Point[] = [new egret.Point(400, 100), new egret.Point(400, 200), new egret.Point(400, 300)];

    private _battleArr: any[] = [];
    private _doMoveNumber: number = 0;

    private _togetherDelay: number = 200;    //同时出手间隔
    private _moveToTime: number = 150;       //移动攻击的时间
    private _moveBackTime: number = 100;     //回来的时间
    private _roundTime: number = 800;        //每回合间隔时间
    private _actionDelay: number = 300;      //下一个出手的间隔

    public constructor() {
        super();
    }

    public createCha(heroID: number, pos: number): void
    {
        var hero: Hero = new Hero(heroID);
        hero.position = pos;
        hero.hp = hero.life = 10;
        hero.atk = 2;
        hero.speed = 10;//MathUtils.rangeRandom(1,10);
        hero._current = [33, 61, 72];
        this._heroList.push(hero);
        this.addChild(hero);
        hero.x = this._heroPosList[hero.position].x;
        hero.y = this._heroPosList[hero.position].y;
    }


    public createMonster(monsterId: number, pos: number): void {
        var monster: Monster = new Monster(monsterId);
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
    }

    public startLevel(level?: number) {
        this.reset();

        this.createCha(1, 0);
        this.createCha(2, 1);
        this.createCha(3, 2);

        this.createMonster(1, 0);
        this.createMonster(2, 1);
        this.createMonster(3, 2);

        this.sortBattle();
    }

    public sortBattle(): void {
        this._battleArr = [];
        //排序
        for (var cha of this._heroList) {
            cha.checkHp = cha.hp;
            this._battleArr.push(cha);
        }

        for (var monster of this._monsterList) {
            monster.checkHp = monster.hp;
            this._battleArr.push(monster);
        }

        this._battleArr.sort(sortSpeed);

        function sortSpeed(a, b): number {
            var speed1: number = a.speed;
            var speed2: number = b.speed;

            return speed2 - speed1;
        }

        if (!this._heroList.length || !this._monsterList.length) {
            return;
        }

        this.battleAction();
    }

    private roundClear(): void {
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
    }

    private battleAction(): void {
        //按顺序出手
        if (this._battleArr.length > 0) {
            var doCha: any = this._battleArr.shift();
            this.doTogether(doCha);
        }
        else {
            egret.setTimeout(this.sortBattle, this, this._roundTime);
        }
    }

    private doTogether(cha: HeroBase): void {
        this.roundClear();
        this._doMoveNumber++;
        this.doBattle(cha);

        if (this._battleArr.length > 0 && (this._battleArr[0].isHero == cha.isHero )) {
            var nextCha: any = this._battleArr.shift();
            egret.setTimeout(function () {
                this.doTogether(nextCha);
            }, this, this._togetherDelay);
        }
    }

    private doBattle(attackCha: HeroBase): void {
        var beAttactedCha: HeroBase;
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
    }

    public removeHeroList(hero: HeroBase): void {
        this._heroList.splice(this._heroList.indexOf(hero), 1);
    }

    public removeMonsterList(monster: HeroBase): void {
        this._monsterList.splice(this._monsterList.indexOf(monster), 1);
    }

    public removeCha(hero: Hero): void {
        DisplayUtil.removeFromParent(hero);
    }

    public removeMonster(monster: Monster): void {
        DisplayUtil.removeFromParent(monster);
    }

    private doAtk(doCha: HeroBase, beAtked: HeroBase): void {
        var toX: number;
        if (doCha.isHero) {
            toX = beAtked.x - 100;
        }
        else {
            toX = beAtked.x + 100;
        }
        var toY: number = beAtked.y;
        doCha.target = beAtked;
        doCha.actioned = 1;
        egret.Tween.get(doCha).to({x: toX, y: toY}, this._moveToTime).call(action);
        function action(): void {
            doCha.Action(ACTION_TYPE.DO_ATTACK);
        }
    }

    public doAtkHurt(doCha: HeroBase): void {
        if (doCha.target) {
            doCha.target.hurt(doCha);
            doCha.target = null;
        }
    }

    private doSkill(doCha: any, beAtked: any): void {
        doCha.target = beAtked;
        doCha.actioned = 2;
        doCha.Action(ACTION_TYPE.DO_SKILL);
    }

    public doSkillMove(doCha: HeroBase): void {
        if (doCha.target) {
            var toX: number;
            if (doCha.isHero) {
                toX = doCha.target.x - 100;
            }
            else {
                toX = doCha.target.x + 100;
            }
            var toY: number = doCha.target.y;
            var moveTime: number = (doCha._current[2] - doCha._current[1]) * 50;
            egret.Tween.get(doCha).to({x: toX, y: toY}, moveTime);
        }
    }

    public restore(cha: HeroBase): void {
        var oldX: number = 0;
        var oldY: number = 0;
        if (cha.isHero) {
            oldX = this._heroPosList[cha.position].x;
            oldY = this._heroPosList[cha.position].y;
        }
        else {
            oldX = this._monsterPosList[cha.position].x;
            oldY = this._monsterPosList[cha.position].y;
        }
        egret.Tween.get(cha).to({x: oldX, y: oldY}, this._moveBackTime);

        this._doMoveNumber--;
        if (this._doMoveNumber <= 0) {
            this.roundClear();
            egret.setTimeout(this.battleAction, this, this._actionDelay);
        }
    }

    public updata(now: number): void {
        for (var hero of this._heroList) {
            hero.updata();
        }

        for (var monster of this._monsterList) {
            monster.updata();
        }
    }

    public reset()
    {
        for (var i = this._heroList.length; i--;)
        {
            this._heroList[i].destory();
        }
        for (i = this._monsterList.length; i--;)
        {
            this._monsterList[i].destory();
        }
        this._heroList = [];
        this._monsterList = [];
    }

    public destory(): void {

    }
}