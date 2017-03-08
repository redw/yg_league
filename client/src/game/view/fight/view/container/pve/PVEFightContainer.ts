import getFightNeedRes = fight.getFightNeedRes;
/**
 * PVE战斗容器
 * Created by hh on 2017/3/7.
 */
class PVEFightContainer extends FightContainer {
    private dropProps:DropItem[];
    private prospect:PVEForeground;
    private ground:PVEMiddleGround;
    private background:PVEProspect;
    private isFirstBattle:boolean = false;
    private moveCount:number = 0;
    private level:number;

    public constructor() {
        super(FightTypeEnum.PVE);
        this.dropProps = [];
        for (let i = 0; i < fight.DROP_POS.length; i++) {
            let item = new DropItem();
            item.x = fight.DROP_POS[i].x;
            item.y = fight.DROP_POS[i].y;
            this.dropProps.push(item);
        }
    }

    // 添加背影
    protected addBackGround(){
        this.background = new PVEProspect();
        this.addChild(this.background);
        this.ground = new PVEMiddleGround();
        this.addChild(this.ground);
    }

    // 添加前景
    protected addProspect(){
        this.prospect = new PVEForeground();
        this.addChild(this.prospect);
    }

    // 同时出战的数量
    protected getPlayingCount() {
        let result = 1;
        let len = this.fightSteps.length;
        if (len > 1) {
            let firstPos = this.fightSteps[0].pos;
            let firstSide = fight.getSideByPos(firstPos);
            for(let i = 1; i < this.fightSteps.length; i++) {
                let curPos = this.fightSteps[i].pos;
                let curSide = fight.getSideByPos(curPos);
                if (firstSide == curSide && firstPos != curPos) {
                    firstPos = curPos;
                    result++;
                } else {
                    break;
                }
            }
        }
        return result;
    }

    public startLevel(level:number){
        this.level = level;
        this.prospect.level = level;
        this.background.level = level;
        this.ground.level = level;
        let heroArr = [{id:102, pos:10}, {id:102, pos:11}, {id:102, pos:12}, {id:102, pos:13}, {id:102, pos:14}, {id:102, pos:15},
            {id:102, pos:20}, {id:102, pos:21}, {id:102, pos:22}, {id:102, pos:23}, {id:102, pos:24}, {id:102, pos:25}];
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadRoleComplete, this);
        RES.createGroup("bone_role", fight.getRolePathArr(heroArr), true);
        RES.loadGroup("bone_role", 1);
    }

    private loadRoleComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "bone_role") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadRoleComplete, this);
            let heroArr = [{id:102, pos:10}, {id:102, pos:11}, {id:102, pos:12}, {id:102, pos:13}, {id:102, pos:14}, {id:102, pos:15},
                           {id:102, pos:20}, {id:102, pos:21}, {id:102, pos:22}, {id:102, pos:23}, {id:102, pos:24}, {id:102, pos:25}];
            this.addRoles(heroArr);
        }
    }

    // 添加角色
    protected addRoles(elements:{id:number, pos:number}[]){
        super.addRoles(elements);
        let len = elements ? elements.length : 0;
        for (let i = 0; i < len; i++) {
            let role = FightRoleFactory.createRole(this, elements[i]);
            let side = fight.getSideByPos(elements[i].pos) - 1;
            let index = fight.getPosIndexByPos(elements[i].pos);
            this.roles[side][index] = role;
        }
        this.changeRoleZIndex();
        this.tweenRoles(elements);
    }

    private tweenRoles(elements:{id:number, pos:number}[]){
        let len = elements ? elements.length : 0;
        for (let i = 0; i < len; i++) {
            let side = fight.getSideByPos(elements[i].pos);
            let index = fight.getPosIndexByPos(elements[i].pos);
            let role = this.roles[side - 1][index];
            let tox = role.x;
            if (side == FightSideEnum.LEFT_SIDE) {
                role.x = fight.WIDTH * -0.5 + role.x;
            } else {
                role.x = fight.WIDTH * 1 + role.x;
            }
            egret.Tween.get(role).to({x:tox}, fight.MIDDLE_GROUND_MOVE_TIME).call(()=>{
                this.roleMoveComplete();
            }, this);
        }
    }

    private changeRoleZIndex(){
        let orders = fight.ROLE_Z_INDEX_ARR;
        let zIndex = 0;
        for (let i = 0; i < orders.length; i++) {
            let index = orders[i];

            if (index == fight.ADD_AREA_IN_INDEX) {
                this.leftAreaCont = new egret.DisplayObjectContainer();
                this.roleLayer.addChild(this.leftAreaCont);
            }
            if (this.roles[0][index]) {
                this.roles[0][index].zIndex = zIndex;
                this.roleLayer.addChild(this.roles[0][index]);
                zIndex++;
            }

            let dropIndex = fight.ADD_DROP_IN_INDEX.indexOf(index);
            if (dropIndex > -1) {
                if (this.dropProps[dropIndex].parent)
                    this.dropProps[dropIndex].parent.removeChild(this.dropProps[dropIndex]);
                this.roleLayer.addChild(this.dropProps[dropIndex]);
            }

            if (index == fight.ADD_AREA_IN_INDEX) {
                this.rightAreaCont = new egret.DisplayObjectContainer();
                this.roleLayer.addChild(this.rightAreaCont);
            }
            if (this.roles[1][index]) {
                this.roles[1][index].zIndex = zIndex;
                this.roleLayer.addChild(this.roles[1][index]);
                zIndex++;
            }
        }
    }

    private roleMoveComplete(){
        this.moveCount++;
        if (this.moveCount >= this.elements.length) {
            this.showSceneName();
        }
    }

    private showSceneName(){
        if (!this.isFirstBattle) {
            this.isFirstBattle = true;
            let stageName:string = "";
            let eff = new NewChapterEff(stageName);
            eff.once(egret.Event.COMPLETE, this.showMonsterTip, this);
            this.fontEffLayer.addChild(eff);
        } else {
            this.showMonsterTip();
        }
    }

    private showMonsterTip(){
        if (this.level % 10 == 0) {
            let eff = new BossIncomingEff();
            eff.once(egret.Event.COMPLETE, this.generateData, this);
            this.fontEffLayer.addChild(eff);
        } else {
            this.generateData();
        }
    }

    private generateData(){
        let dataGenerator = new FightProcessGenerator();
        let fightVOArr:FightRoleVO[] = fight.generateFightRoleVOArr(this.elements);
        dataGenerator.addSceneDataVec(fightVOArr);
        let fightSteps = dataGenerator.generateData();
        this.fightStart(fightSteps)
    }
}
