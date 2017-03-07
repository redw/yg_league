/**
 * 基本的战斗容器
 * Created by hh on 2017/3/7.
 */
class FightContainer extends egret.DisplayObjectContainer{
    private type:number = FightTypeEnum.PVE;                                    // 战斗类型
    private state:number = FightStateEnum.Wait;                                 // 战斗状态
    private oldLifeRatio:number = -1;
    private meanWhileStep:number = 1;                                           // 同时可出战的步数
    public leftTotalLife:string = "1";                                          // 左方总生命
    public rightTotalLife:string = "1";                                         // 右方总生命
    private fightSteps:any[] = [];                                              // 战斗步骤
    private fightStepsDup:any[] = [];                                           // 战斗步骤副本
    protected elements:{id:number, pos:number}[];                               // 角色数据

    private warnEff:FightWarnEff;                                               // 血量不足20%时的警告效果
    private shakeScreenEff:ShakeScreenEff;                                      // 震屏效果
    protected fontEffLayer:eui.Group;                                             // 文字效果层
    private damageEffLayer:eui.Group;                                           // 伤害层
    private grayLayer:egret.Shape;                                              // 灰色层
    private dustLayer:eui.Group;                                                // 灰尘层

    protected roleLayer:eui.Group;                                              // 角色层
    protected leftAreaCont:egret.DisplayObjectContainer;                        // 左侧area效果层
    protected rightAreaCont:egret.DisplayObjectContainer;                       // 右侧area效果层
    protected roles:FightRole[][] = [Array(fight.ROLE_UP_LIMIT), Array(fight.ROLE_UP_LIMIT)];

    public constructor(type:number = FightTypeEnum.PVE) {
        super();
        this.type = type;
        this.addBackGround();
        this.grayLayer = new egret.Shape();
        this.addChild(this.grayLayer);
        this.dustLayer = new eui.Group();
        this.addChild(this.dustLayer);
        this.roleLayer = new eui.Group();
        this.addChild(this.roleLayer);
        this.damageEffLayer = new eui.Group();
        this.addChild(this.damageEffLayer);
        this.addProspect();
        this.fontEffLayer = new eui.Group();
        this.addChild(this.fontEffLayer);
        this.addListeners();
    }

    // 添加背影
    protected addBackGround(){

    }

    // 添加前景
    protected addProspect(){

    }

    // 同时出战的数量
    protected getPlayingCount() {
        return 1;
    }

    // 添加角色
    protected addRoles(elements:{id:number, pos:number}[]){
        this.elements = elements;
    }

    // 显示技能名字效果
    protected showSkillFlyTxt(content:string) {

    }

    // 显示警告效果
    protected showWarnEff(){

    }

    // 开始抖动
    public startShake(range:number){

    }

    protected addListeners(){
        this.addEventListener("role_one_step_complete", this.onOneStepComplete, this, true);
        this.addEventListener("role_die", this.onRoleDie, this, true);
        this.addEventListener("role_hp_change", this.onRoleHPChange, this, true);
    }

    public fightStart(steps:any[]){
        if (!this.elements || this.elements.length <= 0) {
            fight.recordLog("no role data,cannot start", fight.LOG_FIGHT_WARN);
        } else {
            if (this.state != FightStateEnum.Fight) {
                this.dispatchEventWith("fight_start", true);
                if (steps) {
                    for (let i = 0; i < steps.length; i++) {
                        steps[i].index = i;
                        let pos = steps[i].pos;
                        let newPos:number = 0;
                        if ((typeof pos == "string") && pos.indexOf("_") > 0) {
                            let posArr = pos.split("_");
                            newPos = Number(10 * posArr[0]) + Number(posArr[1]);
                        }
                        steps[i].pos = newPos;
                    }
                    this.fightStepsDup = steps.concat();
                    this.fightSteps = steps;
                    this.startStep();
                }
            }
        }
    }

    public forceFightEnd(){
        this.fightSteps.length = 0;
    }

    private fightComplete(){
        this.state = FightStateEnum.End;
        egret.setTimeout(() => {
            // this.dispatchEventWith(ContextEvent.FIGHT_END, true);
        }, this, 200);
    }

    private startStep() {
        if (this.fightSteps.length <= 0) {
            this.fightComplete();
        } else {
            let count = this.getPlayingCount();
            this.meanWhileStep = count;
            let delayTime = 0;
            while (count--) {
                let data = this.fightSteps.shift();
                let startRole = this.getRoleByPos(data.pos);
                if (startRole) {
                    startRole.fight(data, delayTime);
                } else {
                    fight.recordLog(`第${data.index}步出错`, fight.LOG_FIGHT_WARN);
                }
                delayTime += fight.MEANWHILE_FIGHT_DELAY_TIME;
            }
        }
    }

    public onOneStepComplete() {
        this.meanWhileStep--;
        if (this.meanWhileStep <= 0)
            egret.setTimeout(() => {
                this.startStep();
            }, this, fight.STEP_DELAY_TIME);
    }

    private onRoleDie(e:egret.Event) {
        let role:FightRole = e.data;
        this.roleDie(role);
    }

    public roleDie(role:FightRole) {
        let side = role.side - 1;
        let pos = role.pos;
        delete this.roles[side][pos];
        role.dispose();
    }

    public getRoleByPos(pos:number) {
        let side = fight.getSideByPos(pos) - 1;
        let index =  fight.getPosIndexByPos(pos);
        return this.roles[side][index];
    }

    public getCurTotalLife(side:number) {
        let curLife:string = "0";
        let roleArr = this.roles[side - 1];
        let len = roleArr ? roleArr.length:0;
        for (let i = 0; i < len; i++) {
            let role = roleArr[i];
            if (role) {
                curLife = BigNum.add(curLife, role.curHP);
            }
        }
        return curLife;
    }

    public getTotalLife(side:number) {
        let totalLife:string = "0";
        let roleArr = this.roles[side - 1];
        let len = roleArr ? roleArr.length : 0;
        for (let i = 0; i < len; i++) {
            let role = roleArr[i];
            if (role) {
                totalLife = BigNum.add(totalLife, role.maxHP);
            }
        }
        return totalLife;
    }

    public shake(range:number) {
        if (range > 0) {
            if (!this.shakeScreenEff) {
                this.shakeScreenEff = new ShakeScreenEff(this);
            }
            this.shakeScreenEff.startShake(range);
        }
    }

    public showMoveDustEff(value:{x:number,y:number, side:number}) {
        let eff = new MoveDustEff();
        eff.x = value.x;
        eff.y = value.y;
        this.dustLayer.addChild(eff);
    }

    public showGrayEff(){
        this.drawGrayEff();
        this.addEventListener(egret.Event.ENTER_FRAME, this.drawGrayEff, this);
        egret.setTimeout(() => {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.drawGrayEff, this);
            this.grayLayer.graphics.clear();
        }, this, 1000);
    }

    private drawGrayEff(){
        this.grayLayer.graphics.clear();
        this.grayLayer.graphics.beginFill(0x0, 0.4);
        this.grayLayer.graphics.drawRect(-30, -30, this.stage.width + 60, this.stage.height + 60);
        this.grayLayer.graphics.endFill();
    }

    public showAreaEff(eff:egret.DisplayObject, side:number) {
        let scaleX = (side == FightSideEnum.LEFT_SIDE ? -1:1);
        eff.scaleX = scaleX;
        if (side == FightSideEnum.LEFT_SIDE) {
            this.leftAreaCont.addChild(eff);
        } else {
            this.rightAreaCont.addChild(eff);
        }
    }

    public showDamageEff(eff:egret.DisplayObject) {
        this.damageEffLayer.addChild(eff);
    }

    public flyTxt(content:any, fntname:string) {
        let fontEff = new FontEff(fntname);
        fontEff.x = content.x || 0;
        fontEff.y = content.y || 0;
        fontEff.show(content);
        this.fontEffLayer.addChild(fontEff);
    }

    private onRoleHPChange() {
        let curTotalLife = this.getCurTotalLife(FightSideEnum.LEFT_SIDE);
        let ratio:number = +BigNum.div(curTotalLife, this.leftTotalLife);
        if (this.oldLifeRatio > 0) {
            if (ratio <= 0.3 && ratio < this.oldLifeRatio) {
                this.showWarnEff();
                this.oldLifeRatio = ratio;
            }
        } else {
            this.oldLifeRatio = ratio;
        }
    }

    protected reset() {
        for (let i = 0; i < this.roles.length; i++) {
            for (let j = 0; j < this.roles[i].length; j++) {
                if (this.roles[i][j]) {
                    this.roles[i][j].dispose();
                    this.roles[i][j] = null;
                }
            }
        }
    }

    public dispose(){
        this.reset();
        this.removeEventListener("role_one_step_complete", this.onOneStepComplete, this, true);
        this.removeEventListener("role_die", this.onRoleDie, this, true);
        this.removeEventListener("role_hp_change", this.onRoleHPChange, this, true);
    }
}