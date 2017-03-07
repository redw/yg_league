/**
 * PVE关卡面板
 * Created by hh on 2016/12/8.
 */
var PVEScenePanel = (function (_super) {
    __extends(PVEScenePanel, _super);
    function PVEScenePanel() {
        _super.call(this);
        this.fightContainer = new FightContainer();
        this.addChild(this.fightContainer);
        this.stageProgress = new StageProgress();
        this.stageProgress.x = 150;
        this.stageProgress.y = 96;
        this.stageProgress.visible = false;
        this.addChild(this.stageProgress);
        this.bossStageProgress = new BossStageProgress();
        this.bossStageProgress.x = 142;
        this.bossStageProgress.y = 84;
        this.bossStageProgress.visible = false;
        this.addChild(this.bossStageProgress);
        this.addEventListener("role_hp_change", this.onRoleHPChange, this, true);
        this.addEventListener("fight_start", this.onFightStart, this);
        this.addEventListener(ContextEvent.FIGHT_END, this.onFightEnd, this, true);
        EventManager.inst.addEventListener(ContextEvent.PVE_SYNC_RES, this.onPveSyncComplete, this);
        EventManager.inst.addEventListener(ContextEvent.PVE_SYNC_AGAIN, this.sendCmd, this);
        EventManager.inst.addEventListener(ContextEvent.FORCE_TO_STAGE, this.forceToStage, this);
        EventManager.inst.addEventListener(ContextEvent.TOGGLE_PVE_BATTLE, this.onToggleBattle, this);
        EventManager.inst.addEventListener(ContextEvent.FIGHT_PROGRESS_POS, this.showProgress, this);
    }
    var d = __define,c=PVEScenePanel,p=c.prototype;
    p.showProgress = function (e) {
        if (UserProxy.inst.historyArea < 10) {
            this.stageProgress.y = 30;
            this.bossStageProgress.y = 20;
        }
        else {
            if (e.data) {
                this.stageProgress.y = 90;
                this.bossStageProgress.y = 80;
            }
            else {
                this.stageProgress.y = 160;
                this.bossStageProgress.y = 150;
            }
        }
    };
    p.onTouchTap = function () {
        var config = Config.StageCommonData[Math.ceil(this.level / fight.MAP_SWITCH_SIZE)];
        fight.playSound(config.bgm, false);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    };
    p.onFightStart = function () {
        if (PVEScenePanel.firstPlayMP3) {
            SoundManager.inst.setup();
            PVEScenePanel.firstPlayMP3 = false;
            this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        }
        else {
            var config = Config.StageCommonData[Math.ceil(this.level / fight.MAP_SWITCH_SIZE)];
            fight.playSound(config.bgm, false);
        }
    };
    p.onFightEnd = function (e) {
        this.stageProgress.visible = false;
        this.bossStageProgress.visible = false;
        if (this.cacheBattleData) {
            this.cacheBattleData.battleReport = null;
            if (!e.data) {
                new DelayFightSyncCmd(this.cacheBattleData).execute();
            }
            else {
                this.startLevel(UserProxy.inst.curArea);
            }
            this.cacheBattleData = null;
        }
        else {
            this.sendCmd();
        }
    };
    p.sendCmd = function () {
        if (this.cacheBattleData)
            return;
        if (fight.TEST_BATTLE) {
            Http.inst.send("testBattle", {
                area: UserProxy.inst.curArea,
                oppos: JSON.stringify(this.fightContainer.getMonsterArr()),
                tp: this.fightContainer.getTriggerChanceType(),
                it: JSON.stringify(this.fightContainer.props || [])
            });
        }
        else {
            var rs = UserProxy.inst.curArea % 10 == 0 ? 1 : Math.max(0, this.fightContainer.result);
            Http.inst.send(CmdID.FIGHT_SYNC, {
                area: UserProxy.inst.curArea,
                rs: rs,
                tp: this.fightContainer.getTriggerChanceType(),
                it: JSON.stringify(this.fightContainer.props || [])
            });
            this.fightContainer.props = [];
            UserProxy.inst.startCheckBattle();
        }
    };
    p.onPveSyncComplete = function (e) {
        if (e.data.battleReport) {
            this.cacheBattleData = e.data;
            UserProxy.inst.endCheckBattle();
            this.startLevel(UserProxy.inst.curArea);
        }
        else {
            if (e.data.ret == 1 && e.data.curArea % 10 == 0) {
                UserProxy.inst.curArea = e.data.curArea;
                this.level = UserProxy.inst.curArea;
                this.sendCmd();
            }
            else {
                if (e.data.ret == 0) {
                    var eff = new PVEFailEff(this.fightContainer.result);
                    eff.addEventListener(egret.Event.COMPLETE, this.backStage, this);
                    this.addChild(eff);
                }
                else {
                    this.level = UserProxy.inst.curArea;
                    this.startLevel(this.level);
                    // 打完50关后，如果有转盘次数,则打开大转盘界面
                    if ((this.level - 1) % fight.MAP_SWITCH_SIZE == 0) {
                        if (UserProxy.inst.wheelTimes > 0 && UserProxy.inst.todayEnter) {
                            UserProxy.inst.todayEnter = 0;
                            PanelManager.inst.showPanel("DialPanel");
                        }
                    }
                }
            }
        }
    };
    p.backStage = function (e) {
        e.target.removeEventListener(egret.Event.COMPLETE, this.backStage, this);
        this.level = UserProxy.inst.curArea;
        this.startLevel(this.level);
    };
    // private onChangeFormation(e:egret.Event=null){
    //     this.loadRes();
    // }
    p.onRoleHPChange = function (e) {
        var curTotalLife = this.fightContainer.getCurTotalLife(FightSideEnum.RIGHT_SIDE);
        var ratio = +BigNum.div(curTotalLife, this.fightContainer.rightTotalLife);
        // this.stageProgress.visible = this.level % 10 != 0;
        // this.bossStageProgress.visible = this.level % 10 == 0;
        this.stageProgress.setProgress(ratio);
        this.bossStageProgress.setProgress(ratio);
        if (this.level % 10 == 0) {
        }
        else {
        }
    };
    p.startLevel = function (level) {
        this.reset();
        if (!level) {
            level = UserProxy.inst.curArea;
            if (level % 10 == 0) {
                this.sendCmd();
            }
        }
        this.level = level;
        // if (!UserProxy.inst.fightData.syncPVEFormation()) {
        this.loadRes();
        // }
    };
    p.loadRes = function () {
        this.fightContainer.loadBG(this.level);
        this.heroArr = UserProxy.inst.fightData.getPVEBattleHero();
        this.monsterArr = UserProxy.inst.fightData.getMonster(this.level);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
        if (PVEScenePanel.isFirst) {
            var roleArr = [].concat(this.heroArr, this.monsterArr);
            fight.firstEnterPVE(roleArr);
            PanelManager.inst.showPanel("LoadExtraPanel", {
                resArray: fight.getRolePathArr(roleArr),
                showText: "加载战斗配置",
                groupName: "fight",
                thisObject: this,
                callback: this.loadDown
            });
        }
        else {
            fight.loadPVEFightRes([].concat(this.heroArr, this.monsterArr));
        }
    };
    p.loadDown = function () {
        fight._needValue = [];
        PanelManager.inst.hidePanel("LoadExtraPanel");
        this.stageProgress.startLevel(this.level);
        this.bossStageProgress.startLevel(this.level);
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
            obj.level = this.level;
            monsterInfoArr.push(obj);
        }
        var autoFight = true;
        if (this.level % 10 == 0) {
            autoFight = false;
        }
        else if (Config.StageData[this.level - 1] && Config.StageData[this.level] && Config.StageData[this.level].map != Config.StageData[this.level - 1].map) {
            autoFight = false;
        }
        this.stageProgress.visible = this.level % 10 != 0;
        this.bossStageProgress.visible = this.level % 10 == 0;
        this.stageProgress.setProgress(1);
        this.bossStageProgress.setProgress(1);
        var battleReport = this.cacheBattleData ? this.cacheBattleData.battleReport : null;
        this.fightContainer.fightDeployment([].concat(heroInfoArr, monsterInfoArr), autoFight, this.level, PVEScenePanel.isFirst, battleReport);
        PVEScenePanel.isFirst = false;
    };
    p.loadResComplete = function (e) {
        if (e.groupName == "pve_fight_role") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
            this.stageProgress.startLevel(this.level);
            this.bossStageProgress.startLevel(this.level);
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
                obj.level = this.level;
                monsterInfoArr.push(obj);
            }
            var autoFight = true;
            if (this.level % 10 == 0) {
                autoFight = false;
            }
            else if (Config.StageData[this.level - 1] && Config.StageData[this.level] && Config.StageData[this.level].map != Config.StageData[this.level - 1].map) {
                autoFight = false;
            }
            this.stageProgress.visible = this.level % 10 != 0;
            this.bossStageProgress.visible = this.level % 10 == 0;
            this.stageProgress.setProgress(1);
            this.bossStageProgress.setProgress(1);
            var battleReport = this.cacheBattleData ? this.cacheBattleData.battleReport : null;
            this.fightContainer.fightDeployment([].concat(heroInfoArr, monsterInfoArr), autoFight, this.level, PVEScenePanel.isFirst, battleReport);
            PVEScenePanel.isFirst = false;
        }
    };
    p.onPVEGuideComplete = function () {
        EventManager.inst.removeEventListener("GUIDE_CLOSE_FORMATION", this.onPVEGuideComplete, this);
        this.fightContainer.forceStart();
    };
    p.forceToStage = function (e) {
        this.fightContainer.forceToStage();
    };
    p.onToggleBattle = function (e) {
        var value = e.data;
        if (value) {
            var config = Config.StageCommonData[Math.ceil(this.level / fight.MAP_SWITCH_SIZE)];
            fight.playSound(config.bgm, false);
        }
        this.fightContainer.visible = value;
    };
    p.reset = function () {
    };
    PVEScenePanel.isFirst = true;
    PVEScenePanel.firstPlayMP3 = true;
    return PVEScenePanel;
}(egret.DisplayObjectContainer));
egret.registerClass(PVEScenePanel,'PVEScenePanel');
//# sourceMappingURL=PVEFightContainer.js.map