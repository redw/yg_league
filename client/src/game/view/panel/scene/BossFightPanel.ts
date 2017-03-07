/**
 * 秘镜副本
 * Created by hh on 2017/1/9.
 */
class BossFightPanel extends BasePanel{
    private fightContainer:FightContainer;
    private titleImage:AutoBitmap;
    private bgImage:AutoBitmap;
    private id:number;
    private heroArr:{id:number, side?:number, pos?:number}[];
    private monsterArr:{id:number, side?:number, pos?:number}[];
    private steps:FightReportItem[];
    private result:any;
    private isResOk:boolean = false;
    private grayLayer:egret.Shape;

    public constructor(){
        super();
        this._layer = PanelManager.TOP_LAYER;
    }

    public init(){
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
    }

    public initData(){
        this.id = this.data.id;
        let config:BossStageConfig = Config.WeaponFb[this.id];
        let heroIds = this.data.hero.concat();
        let enemyIds = config.enemy.concat();
        let bunch = fight.randomSkillTriggerBunch();

        Http.inst.send(CmdID.DUNGEON_FIGHT,{
            did:this.id,
            pos:JSON.stringify(heroIds),
            tp:bunch}
        );

        this.heroArr = [];
        for (let i = 0; i < heroIds.length; i++) {
            if (+heroIds[i]) {
                this.heroArr.push({id:+heroIds[i], side:FightSideEnum.LEFT_SIDE, pos:i})
            }
        }
        this.monsterArr = [];
        for (let i = 0; i < enemyIds.length; i++) {
            if (+enemyIds[i]) {
                this.monsterArr.push({id:+enemyIds[i], side:FightSideEnum.RIGHT_SIDE, pos:i})
            }
        }
        this.loadRes();
        this.titleImage.source = `boss_title_${Math.floor(config.id / 1000)}_png`;
    }

    private loadRes(){
        this.isResOk = false;
        this.fightContainer.loadBG(this.id);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
        fight.loadBossFightRes([].concat(this.heroArr, this.monsterArr));
    }

    private loadResComplete(e:RES.ResourceEvent) {
        if (e.groupName == "bossFight") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
            this.fightDeployment();
            this.isResOk = true;
            this.start();
        }
    }

    private fightDeployment(){
        let config:BossStageConfig = Config.WeaponFb[this.id];
        let sound = config.bgm;
        fight.playSound(sound, false);

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
            obj.level = 1;
            monsterInfoArr.push(obj);
        }
        this.fightContainer.fightDeployment([].concat(heroInfoArr, monsterInfoArr), false, this.id, true);
    }

    private onReportRes(e:egret.Event) {
        this.result = e.data;
        let res = e.data;
        let ret = res.ret;
        let battleReport = this.result.battleReport;
        this.steps = battleReport.concat();
        this.start();
    }

    private start(){
        if (this.isResOk && this.steps) {
            egret.setTimeout(()=>{
                this.fightContainer.forceStart(this.steps);
            }, this, 500);
        }
    }

    private onFightStart(){
        let config:BossStageConfig = Config.WeaponFb[this.id];
        fight.playSound(config.bgm, false);
    }

    private onFightEnd() {
        let data:any = {};
        data.ret = this.result.ret;
        data.curPanelName = "BossFightPanel";
        PanelManager.inst.showPanel("FightResultPanel", data);
 		EventManager.inst.dispatchEventWith(ContextEvent.TOGGLE_PVE_BATTLE, false, true);
        EventManager.inst.dispatch(ContextEvent.BOSS_FIGHT_END, this.result);
    }

    public destory(): void {
        this.removeEventListener("fight_start", this.onFightStart, this);
        this.removeEventListener(ContextEvent.FIGHT_END, this.onFightEnd, this, true);
        EventManager.inst.removeEventListener(ContextEvent.DUNGEON_FIGHT_DATA_RES, this.onReportRes, this);
        while (this.numChildren) {
            this.removeChildAt(0);
        }
        super.destory();
    }
}
