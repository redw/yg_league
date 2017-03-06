/**
 * 秘镜副本
 * Created by hh on 2017/1/9.
 */
var BossFightPanel = (function (_super) {
    __extends(BossFightPanel, _super);
    function BossFightPanel() {
        _super.call(this);
        this.isResOk = false;
        this._layer = PanelManager.TOP_LAYER;
    }
    var d = __define,c=BossFightPanel,p=c.prototype;
    p.init = function () {
        this.grayLayer = new egret.Shape();
        this.grayLayer.graphics.beginFill(0x0, 1);
        this.grayLayer.graphics.drawRect(0, 134, fight.WIDTH, fight.HEIGHT);
        this.grayLayer.graphics.endFill();
        this.addChild(this.grayLayer);
        this.fightContainer = new FightContainer(FightTypeEnum.BOSS);
        this.addChild(this.fightContainer);
        this.fightContainer.y = 134;
        this.bgImage = new AutoBitmap("boss_title_bg_png");
        this.addChild(this.bgImage);
        this.titleImage = new AutoBitmap();
        this.addChild(this.titleImage);
        this.titleImage.x = 140;
        this.titleImage.y = 50;
        EventManager.inst.addEventListener(ContextEvent.DUNGEON_FIGHT_DATA_RES, this.onReportRes, this);
        EventManager.inst.dispatchEventWith(ContextEvent.TOGGLE_PVE_BATTLE, false, false);
        this.addEventListener("fight_start", this.onFightStart, this);
        this.addEventListener(ContextEvent.FIGHT_END, this.onFightEnd, this, true);
    };
    p.initData = function () {
        this.id = this.data.id;
        var config = Config.WeaponFb[this.id];
        var heroIds = this.data.hero.concat();
        var enemyIds = config.enemy.concat();
        var bunch = fight.randomSkillTriggerBunch();
        Http.inst.send(CmdID.DUNGEON_FIGHT, {
            did: this.id,
            pos: JSON.stringify(heroIds),
            tp: bunch });
        this.heroArr = [];
        for (var i = 0; i < heroIds.length; i++) {
            if (+heroIds[i]) {
                this.heroArr.push({ id: +heroIds[i], side: FightSideEnum.LEFT_SIDE, pos: i });
            }
        }
        this.monsterArr = [];
        for (var i = 0; i < enemyIds.length; i++) {
            if (+enemyIds[i]) {
                this.monsterArr.push({ id: +enemyIds[i], side: FightSideEnum.RIGHT_SIDE, pos: i });
            }
        }
        this.loadRes();
        this.titleImage.source = "boss_title_" + Math.floor(config.id / 1000) + "_png";
    };
    p.loadRes = function () {
        this.isResOk = false;
        this.fightContainer.loadBG(this.id);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
        fight.loadBossFightRes([].concat(this.heroArr, this.monsterArr));
    };
    p.loadResComplete = function (e) {
        if (e.groupName == "bossFight") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
            this.fightDeployment();
            this.isResOk = true;
            this.start();
        }
    };
    p.fightDeployment = function () {
        var config = Config.WeaponFb[this.id];
        var sound = config.bgm;
        fight.playSound(sound, false);
        var heroArr = this.heroArr;
        var heroInfoArr = [];
        for (var i = 0; i < heroArr.length; i++) {
            var obj = {};
            obj.id = heroArr[i].id;
            obj.pos = heroArr[i].pos;
            obj.side = heroArr[i].side;
            var heroVO = UserProxy.inst.heroData.getHeroData(obj.id);
            obj.level = heroVO ? heroVO.level : 0;
            obj.starLevel = heroVO ? heroVO.starLevel : 1;
            obj.strengthenLevel = heroVO ? heroVO.strengthenLevel : 0;
            obj.starPiece = heroVO ? heroVO.starPiece : 0;
            obj.skill = heroVO ? heroVO.skill : 0;
            heroInfoArr.push(obj);
        }
        var monsterArr = this.monsterArr;
        var monsterInfoArr = [];
        for (var i = 0; i < monsterArr.length; i++) {
            var obj = {};
            obj.id = monsterArr[i].id;
            obj.pos = monsterArr[i].pos;
            obj.side = monsterArr[i].side;
            obj.level = 1;
            monsterInfoArr.push(obj);
        }
        this.fightContainer.fightDeployment([].concat(heroInfoArr, monsterInfoArr), false, this.id, true);
    };
    p.onReportRes = function (e) {
        this.result = e.data;
        var res = e.data;
        var ret = res.ret;
        var battleReport = this.result.battleReport;
        this.steps = battleReport.concat();
        this.start();
    };
    p.start = function () {
        var _this = this;
        if (this.isResOk && this.steps) {
            egret.setTimeout(function () {
                _this.fightContainer.forceStart(_this.steps);
            }, this, 500);
        }
    };
    p.onFightStart = function () {
        var config = Config.WeaponFb[this.id];
        fight.playSound(config.bgm, false);
    };
    p.onFightEnd = function () {
        var data = {};
        data.ret = this.result.ret;
        data.curPanelName = "BossFightPanel";
        PanelManager.inst.showPanel("FightResultPanel", data);
        EventManager.inst.dispatchEventWith(ContextEvent.TOGGLE_PVE_BATTLE, false, true);
        EventManager.inst.dispatch(ContextEvent.BOSS_FIGHT_END, this.result);
    };
    p.destory = function () {
        this.removeEventListener("fight_start", this.onFightStart, this);
        this.removeEventListener(ContextEvent.FIGHT_END, this.onFightEnd, this, true);
        EventManager.inst.removeEventListener(ContextEvent.DUNGEON_FIGHT_DATA_RES, this.onReportRes, this);
        while (this.numChildren) {
            this.removeChildAt(0);
        }
        _super.prototype.destory.call(this);
    };
    return BossFightPanel;
}(BasePanel));
egret.registerClass(BossFightPanel,'BossFightPanel');
