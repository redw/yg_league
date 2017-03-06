/**
 * PVE关卡面板
 * Created by hh on 2016/12/8.
 */
class PVEScenePanel extends egret.DisplayObjectContainer {
    private level:number;
    private stageProgress:StageProgress;
    private bossStageProgress:BossStageProgress;
    private fightContainer:FightContainer;
    private heroArr:{id:number, pos:number, side:number}[];
    private monsterArr:{id:number, pos:number, side:number}[];
    private cacheBattleData:any;

    private static isFirst:boolean = true;
    private static firstPlayMP3:boolean = true;

    public constructor() {
        super();

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
        EventManager.inst.addEventListener(ContextEvent.PVE_SYNC_AGAIN,this.sendCmd,this);
        EventManager.inst.addEventListener(ContextEvent.FORCE_TO_STAGE, this.forceToStage, this);
        EventManager.inst.addEventListener(ContextEvent.TOGGLE_PVE_BATTLE, this.onToggleBattle, this);
        EventManager.inst.addEventListener(ContextEvent.FIGHT_PROGRESS_POS,this.showProgress,this);
    }

    private showProgress(e:egret.Event):void
    {
        if(UserProxy.inst.historyArea < 10)
        {
            this.stageProgress.y = 30;
            this.bossStageProgress.y = 20;
        }
        else
        {
            if(e.data)
            {
                this.stageProgress.y = 90;
                this.bossStageProgress.y = 80;
            }
            else
            {
                this.stageProgress.y = 160;
                this.bossStageProgress.y = 150;
            }
        }



    }

    private onTouchTap(){
        let config:StageCommonConfig = Config.StageCommonData[Math.ceil(this.level / fight.MAP_SWITCH_SIZE)];
        fight.playSound(config.bgm, false);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }

    private onFightStart(){
        if (PVEScenePanel.firstPlayMP3) {
            SoundManager.inst.setup();
            PVEScenePanel.firstPlayMP3 = false;
            this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        } else {
            let config:StageCommonConfig = Config.StageCommonData[Math.ceil(this.level / fight.MAP_SWITCH_SIZE)];
            fight.playSound(config.bgm, false);
        }
    }

    private onFightEnd(e:egret.Event) {
        this.stageProgress.visible = false;
        this.bossStageProgress.visible = false;
        if (this.cacheBattleData) {
            this.cacheBattleData.battleReport = null;
            if (!e.data) {
                new DelayFightSyncCmd(this.cacheBattleData).execute();
            } else {
                this.startLevel(UserProxy.inst.curArea);
            }
            this.cacheBattleData = null;
        } else {
            this.sendCmd();
        }
    }

    private sendCmd():void {
        if (this.cacheBattleData)
            return;
        if (fight.TEST_BATTLE) {
            Http.inst.send("testBattle", {
                area: UserProxy.inst.curArea,
                oppos: JSON.stringify(this.fightContainer.getMonsterArr()),
                tp: this.fightContainer.getTriggerChanceType(),
                it: JSON.stringify(this.fightContainer.props || [])
            });
        } else {
            let rs = UserProxy.inst.curArea % 10 == 0 ? 1 : Math.max(0, this.fightContainer.result);
            Http.inst.send(CmdID.FIGHT_SYNC, {
                area: UserProxy.inst.curArea,
                rs: rs,
                tp: this.fightContainer.getTriggerChanceType(),
                it: JSON.stringify(this.fightContainer.props || [])
            });
            this.fightContainer.props = [];
            UserProxy.inst.startCheckBattle();
        }
    }

    private onPveSyncComplete(e:egret.Event){
        if (e.data.battleReport) {
            this.cacheBattleData = e.data;
            UserProxy.inst.endCheckBattle();
            this.startLevel(UserProxy.inst.curArea)
        } else {
            if (e.data.ret == 1 && e.data.curArea % 10 == 0) {
                UserProxy.inst.curArea = e.data.curArea;
                this.level = UserProxy.inst.curArea;
                this.sendCmd();
            } else {
                if (e.data.ret == 0) {
                    let eff = new PVEFailEff(this.fightContainer.result);
                    eff.addEventListener(egret.Event.COMPLETE, this.backStage, this);
                    this.addChild(eff);
                } else {
                    this.level = UserProxy.inst.curArea;
                    this.startLevel(this.level);
                    // 打完50关后，如果有转盘次数,则打开大转盘界面
                    if ((this.level - 1) % fight.MAP_SWITCH_SIZE == 0) {
                        if (UserProxy.inst.wheelTimes > 0 && UserProxy.inst.todayEnter)
                        {
                            UserProxy.inst.todayEnter = 0;
                            PanelManager.inst.showPanel("DialPanel");
                        }
                    }
                }
            }
        }
    }

    private backStage(e:egret.Event){
        e.target.removeEventListener(egret.Event.COMPLETE, this.backStage, this);
        this.level = UserProxy.inst.curArea;
        this.startLevel(this.level);
    }

    // private onChangeFormation(e:egret.Event=null){
    //     this.loadRes();
    // }

    private onRoleHPChange(e:egret.Event) {
        let curTotalLife = this.fightContainer.getCurTotalLife(FightSideEnum.RIGHT_SIDE);
        let ratio:number = +BigNum.div(curTotalLife, this.fightContainer.rightTotalLife);
        // this.stageProgress.visible = this.level % 10 != 0;
        // this.bossStageProgress.visible = this.level % 10 == 0;
        this.stageProgress.setProgress(ratio);
        this.bossStageProgress.setProgress(ratio);
        if (this.level % 10 == 0) {
            // TODO 处理减帧
        } else {

        }
    }

    public startLevel(level?:number) {
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
    }

    private loadRes(){
        this.fightContainer.loadBG(this.level);

        this.heroArr = UserProxy.inst.fightData.getPVEBattleHero();
        this.monsterArr = UserProxy.inst.fightData.getMonster(this.level);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
        if (PVEScenePanel.isFirst) {
            let roleArr = [].concat(this.heroArr, this.monsterArr);
            fight.firstEnterPVE(roleArr);

            PanelManager.inst.showPanel("LoadExtraPanel",
                {
                    resArray:fight.getRolePathArr(roleArr),
                    showText:"加载战斗配置",
                    groupName:"fight",
                    thisObject: this,
                    callback:this.loadDown
                });
        } else {
            fight.loadPVEFightRes([].concat(this.heroArr, this.monsterArr));
        }
    }

    public loadDown(){
        fight._needValue = [];
        PanelManager.inst.hidePanel("LoadExtraPanel");

        this.stageProgress.startLevel(this.level);
        this.bossStageProgress.startLevel(this.level);
        let heroArr = this.heroArr;
        let heroInfoArr = [];
        for (let i = 0; i < heroArr.length; i++) {
            let obj:any = {};
            obj.id = heroArr[i].id;
            obj.pos = heroArr[i].pos;
            obj.side = heroArr[i].side;
            let heroVO = UserProxy.inst.heroData.getHeroData(obj.id);
            obj.level = heroVO ? heroVO.level : 0;
            obj.starLevel = heroVO ? heroVO.starLevel : 1;
            obj.strengthenLevel = heroVO ? heroVO.strengthenLevel : 0;
            obj.starPiece = heroVO ? heroVO.starPiece : 0;
            obj.skill = heroVO ? heroVO.skill : 0;
            heroInfoArr.push(obj);
        }

        let monsterArr = this.monsterArr;
        let monsterInfoArr = [];
        for (let i = 0; i < monsterArr.length; i++) {
            let obj:any = {};
            obj.id = monsterArr[i].id;
            obj.pos = monsterArr[i].pos;
            obj.side = monsterArr[i].side;
            obj.level = this.level;
            monsterInfoArr.push(obj);
        }
        let autoFight:boolean = true;
        if (this.level % 10 == 0) {
            autoFight = false;
        } else if (Config.StageData[this.level  - 1] && Config.StageData[this.level] && Config.StageData[this.level].map != Config.StageData[this.level - 1].map) {
            autoFight = false;
        }

        this.stageProgress.visible = this.level % 10 != 0;
        this.bossStageProgress.visible = this.level % 10 == 0;

        this.stageProgress.setProgress(1);
        this.bossStageProgress.setProgress(1);
        let battleReport = this.cacheBattleData ? this.cacheBattleData.battleReport : null;
        this.fightContainer.fightDeployment([].concat(heroInfoArr, monsterInfoArr), autoFight, this.level, PVEScenePanel.isFirst, battleReport);
        PVEScenePanel.isFirst = false;
    }

    private loadResComplete(e:RES.ResourceEvent) {
        if (e.groupName == "pve_fight_role") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
            this.stageProgress.startLevel(this.level);
            this.bossStageProgress.startLevel(this.level);
            let heroArr = this.heroArr;
            let heroInfoArr = [];
            for (let i = 0; i < heroArr.length; i++) {
                let obj:any = {};
                obj.id = heroArr[i].id;
                obj.pos = heroArr[i].pos;
                obj.side = heroArr[i].side;
                let heroVO = UserProxy.inst.heroData.getHeroData(obj.id);
                obj.level = heroVO ? heroVO.level : 0;
                obj.starLevel = heroVO ? heroVO.starLevel : 1;
                obj.strengthenLevel = heroVO ? heroVO.strengthenLevel : 0;
                obj.starPiece = heroVO ? heroVO.starPiece : 0;
                obj.skill = heroVO ? heroVO.skill : 0;
                heroInfoArr.push(obj);
            }

            let monsterArr = this.monsterArr;
            let monsterInfoArr = [];
            for (let i = 0; i < monsterArr.length; i++) {
                let obj:any = {};
                obj.id = monsterArr[i].id;
                obj.pos = monsterArr[i].pos;
                obj.side = monsterArr[i].side;
                obj.level = this.level;
                monsterInfoArr.push(obj);
            }
            let autoFight:boolean = true;
            if (this.level % 10 == 0) {
                autoFight = false;
            } else if (Config.StageData[this.level  - 1] && Config.StageData[this.level] && Config.StageData[this.level].map != Config.StageData[this.level - 1].map) {
                autoFight = false;
            }
            this.stageProgress.visible = this.level % 10 != 0;
            this.bossStageProgress.visible = this.level % 10 == 0;
            this.stageProgress.setProgress(1);
            this.bossStageProgress.setProgress(1);
            let battleReport = this.cacheBattleData ? this.cacheBattleData.battleReport : null;
            this.fightContainer.fightDeployment([].concat(heroInfoArr, monsterInfoArr), autoFight, this.level, PVEScenePanel.isFirst, battleReport);
            PVEScenePanel.isFirst = false;
        }
    }

    private onPVEGuideComplete(){
        EventManager.inst.removeEventListener("GUIDE_CLOSE_FORMATION", this.onPVEGuideComplete, this);
        this.fightContainer.forceStart();
    }

    private forceToStage(e:Event) {
        this.fightContainer.forceToStage();
    }

    private onToggleBattle(e:egret.Event){
        let value = e.data;
        if (value) {
            let config:StageCommonConfig = Config.StageCommonData[Math.ceil(this.level / fight.MAP_SWITCH_SIZE)];
            fight.playSound(config.bgm, false);
        }
        this.fightContainer.visible = value;
    }

    private reset() {

    }
}
