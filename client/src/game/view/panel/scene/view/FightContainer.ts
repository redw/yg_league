/**
 * 战斗角色容器
 * @author hh
 */
class FightContainer extends egret.DisplayObjectContainer {
    private bunch:string = "a";                                                 // 串
    private level:number = -1;                                                  // 战斗配置id(pvp战斗无视)
    private steps:any[] = [];                                                   // 战斗步骤(副本)
    private autoFight:boolean = false;                                          // 是否自动战斗
    private firstEnter:boolean = false;                                         // 是否第一次进
    private type:number = FightTypeEnum.PVE;                                    // 战斗类型
    private forceEnd:boolean = false;                                           // 强制结束
    private dataGenerator:FightProcessGenerator;                                // 战斗过程生成器(如果需前端算)
    private playSteps:FightReportItem[];                                        // 战斗报告(服务器端)
    public result:number = 0;                                                   // 战斗结果(-1超过20回合,0失败,1胜利)

    private state:number = FightStateEnum.Wait;                                 // 战斗状态
    public oldLifeRatio:number = -1;                                            // 生命进度条
    private initRoleCount:number = 0;                                           // 初始角色数量
    private meanWhileStep:number = 1;                                           // 同时可出战的步数
    public leftTotalLife:string = "1";                                          // 左方总生命
    public rightTotalLife:string = "1";                                         // 右方总生命
    private fightSteps:any[] = [];                                              // 战斗步骤
    public props:number[] = [];                                                 // 道具

    private warnEff:FightWarnEff;                                               // 血量不足20%时的警告效果
    private shakeScreenEff:ShakeScreenEff;                                      // 震屏效果
    private fontEffLayer:eui.Group;                                             // 文字效果层
    private damageEffLayer:eui.Group;                                           // 伤害层
    private roleLayer:eui.Group;                                                // 角色层
    private grayLayer:egret.Shape;                                              // 灰色层
    private dustLayer:eui.Group;                                                // 灰尘层
    private foregroundLayer:PVEForeground;                                      // 前景层
    private middleGroundLayer:PVEMiddleGround;                                  // 中景层
    private prospectLayer:PVEProspect;                                          // 远景层
    private transitionLayer:PVETransitionEff;                                   // 场景切换层
    private leftAreaCont:egret.DisplayObjectContainer;                          // 左侧area效果层
    private rightAreaCont:egret.DisplayObjectContainer;                         // 右侧area效果层
    private palmEff:BuddhaPalmEff;                                              // 如来神掌
    private dropProps:DropItem[];                                               // 掉落的道具数组

    private originalElements:{id:number, side:number, pos:number}[] = [];
    private leftRoles:FightRole[] = Array(fight.ROLE_UP_LIMIT);
    private rightRoles:FightRole[] = Array(fight.ROLE_UP_LIMIT);
    private roles:FightRole[][] = [this.leftRoles, this.rightRoles];

    public constructor(type:number = FightTypeEnum.PVE) {
        super();
        this.type = type;
        let hasTween = type == FightTypeEnum.PVE;
        if (type == FightTypeEnum.PVE) {
            this.dropProps = [];
            for (let i = 0; i < fight.DROP_POS.length; i++) {
                let dropItem = new DropItem();
                dropItem.x = fight.DROP_POS[i].x;
                dropItem.y = fight.DROP_POS[i].y;
                this.dropProps.push(dropItem);
            }
        }

        if (type == FightTypeEnum.PVE || type == FightTypeEnum.BOSS) {
            this.prospectLayer = new PVEProspect(hasTween);
            this.addChild(this.prospectLayer);
            this.middleGroundLayer = new PVEMiddleGround(hasTween);
            this.addChild(this.middleGroundLayer);
        } else {
            let areaImage = new PriorityImage(fight.LOAD_PRIORITY_AREA_BG, "arena_background_png");
            areaImage.x = -30;
            areaImage.y = 140;
            this.addChild(areaImage);
        }

        this.grayLayer = new egret.Shape();
        this.addChild(this.grayLayer);

        this.dustLayer = new eui.Group();
        this.addChild(this.dustLayer);

        this.roleLayer = new eui.Group();
        this.addChild(this.roleLayer);

        this.damageEffLayer = new eui.Group();
        this.addChild(this.damageEffLayer);

        if (type == FightTypeEnum.PVE || type == FightTypeEnum.BOSS) {
            this.foregroundLayer = new PVEForeground(hasTween);
            this.addChild(this.foregroundLayer);
            this.transitionLayer = new PVETransitionEff({x: fight.WIDTH, y: fight.HEIGHT});
            this.addChild(this.transitionLayer);
        }

        this.fontEffLayer = new eui.Group();
        this.addChild(this.fontEffLayer);

        this.addEventListener("role_one_step_complete", this.onOneStepComplete, this, true);
        this.addEventListener("role_die", this.onRoleDie, this, true);
        this.addEventListener("role_hp_change", this.onRoleHPChange, this, true);
        this.addEventListener("fight_ready_complete", this.onReadyComplete, this, true);
    }

    public loadBG(level:number) {
        if (this.type == FightTypeEnum.PVE) {
            this.foregroundLayer.level = level;
            this.middleGroundLayer.level = level;
            this.prospectLayer.level = level;
            if (this.level < 0 || Config.StageCommonData[Math.ceil(this.level / fight.MAP_SWITCH_SIZE)].map != Config.StageCommonData[Math.ceil(this.level / fight.MAP_SWITCH_SIZE)].map) {
                this.transitionLayer.level = level;
            }
            this.level = level;
        } else if (this.type == FightTypeEnum.BOSS) {
            this.foregroundLayer.source = Config.WeaponFb[level].map;
            this.middleGroundLayer.source = Config.WeaponFb[level].map;
            this.prospectLayer.source = Config.WeaponFb[level].map;
        }
    }

    /**
     * 布署角色
     * @param data  角色的数据
     * @param auto  是否自动开战(只对pve有用)
     * @param level 场景等级(只对pve和秘镜有用)
     * @param firstEnter 是否第一次进
     * @param steps  战斗报告
     */
    public fightDeployment(data:{id:number, pos:number, side:number}[], auto:boolean = true, level:number = 1,firstEnter:boolean = false, steps:FightReportItem[] = null) {
        this.fightSteps = [];
        this.shakeScreenEff && this.shakeScreenEff.stopShake();
        this.autoFight = auto;
        this.firstEnter = firstEnter;
        this.bunch = fight.randomSkillTriggerBunch();
        this.originalElements = data.concat();
        if (steps) {
            for (let i = 0; i < steps.length; i++) {
                steps[i].index = i;
            }
            this.fightSteps = steps.concat();
        }
        if (this.type == FightTypeEnum.PVE) {
            this.level = level;
            if (!firstEnter) {
                this.tweenRemoveRole();
            } else {
                if (auto) {
                    this.tweenRemoveRole();
                }
            }
        } else if (this.type == FightTypeEnum.PVP) {
            this.level = level;
            this.reset();
            let eff = new BattleStartEff();
            eff.addEventListener(egret.Event.COMPLETE, this.bornRoles, this);
            this.damageEffLayer.addChild(eff);
        } else if (this.type == FightTypeEnum.BOSS) {
            this.level = level;
            this.reset();
        }
    }

    /**
     * 开始战斗
     * @param steps
     */
    public forceStart(steps:FightReportItem[] = null) {
        this.playSteps = steps;
        this.autoFight = true;
        this.tweenRemoveRoleComplete(null);
    }

    /**
     * 添加角色
     * @param elements
     * @param withTween
     */
    private isAddingRole:boolean = false;
    private addRoles(elements:FightRoleVO[], withTween:boolean) {
        if (this.isAddingRole) return;
        this.isAddingRole = true;
        let arr = elements;
        this.moveCount = 0;
        this.initRoleCount = 0;
        for (let i = 0; i < arr.length; i++) {
            egret.setTimeout((index) => {
                let roleData = arr[i];
                let role = FightRoleFactory.createRole(this, roleData);
                this.initRoleCount++;
                let side = roleData.side - 1;
                let pos = roleData.pos;
                this.roles[side][pos] = role;
                if (this.initRoleCount >= arr.length) {
                    this.initRoleCount = 0;
                    this.addPVEOther(withTween);
                }
                if (withTween) {
                    let tox = role.x;
                    if (roleData.side == FightSideEnum.LEFT_SIDE) {
                        role.x = fight.WIDTH * -0.5 + role.x;
                    } else {
                        role.x = fight.WIDTH * 1.5 + role.x;
                    }
                    egret.Tween.get(role).to({x: tox}, fight.MIDDLE_GROUND_MOVE_TIME).call(() => {
                        egret.Tween.removeTweens(role);
                        this.roleMoveComplete();
                    }, this);
                }
            }, this, i * 50, i);
        }

        // for (let i = 0; i < arr.length; i++) {
        //     let roleData = arr[i];
        //     let role = FightRoleFactory.createRole(this, roleData);
        //     this.initRoleCount++;
        //     let side = roleData.side - 1;
        //     let pos = roleData.pos;
        //     this.roles[side][pos] = role;
        //     if (withTween) {
        //         let tox = role.x;
        //         if (roleData.side == FightSideEnum.LEFT_SIDE) {
        //             role.x = fight.WIDTH * -0.5 + role.x;
        //         } else {
        //             role.x = fight.WIDTH * 1.5 + role.x;
        //         }
        //         egret.Tween.get(role).to({x: tox}, fight.MIDDLE_GROUND_MOVE_TIME).call(() => {
        //             egret.Tween.removeTweens(role);
        //             this.roleMoveComplete();
        //         }, this);
        //     }
        // }
    }

    private addPVEOther(withTween:boolean) {
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

            if (this.type == FightTypeEnum.PVE) {
                let dropIndex = fight.ADD_DROP_IN_INDEX.indexOf(index);
                if (dropIndex > -1) {
                    if (this.dropProps[dropIndex].parent)
                        this.dropProps[dropIndex].parent.removeChild(this.dropProps[dropIndex]);
                    this.roleLayer.addChild(this.dropProps[dropIndex]);
                }
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
        if (!withTween && this.autoFight) {
            this.start(this.playSteps);
        }
    }

    /**
     * 开始战斗
     * @param steps
     */
    public start(steps?:FightReportItem[]) {
        if (!this.originalElements || this.originalElements.length <= 0) {
            fight.recordLog("no role data,cannot start", fight.LOG_FIGHT_WARN);
        } else {
            if (this.state != FightStateEnum.Fight) {
                this.state = FightStateEnum.Fight;

                let hasDrop = false;
                let len = this.dropProps ? this.dropProps.length:0;
                for (let i = 0; i < len; i++) {
                    if (this.dropProps[i].dropId > 0) {
                        hasDrop = true;
                        break;
                    }
                }
                if (!hasDrop) {
                    let drops = UserProxy.inst.fightData.generateDrop();
                    let dropIndex:number = 0;
                    for (let i = 0; i < drops.length; i++) {
                        if (this.dropProps && this.dropProps[i]) {
                            this.dropProps[dropIndex].dropId = drops[i];
                            dropIndex++;
                        }
                    }
                }

                this.dispatchEventWith("fight_start", true);
                if (steps) {
                    for (let i = 0; i < steps.length; i++) {
                        steps[i].index = i;
                    }
                    this.fightSteps = steps.concat();
                    let isOverRound = fight.isOverRound(this.fightSteps);
                    this.result = isOverRound ? -1 : 0;
                } else if (this.type == FightTypeEnum.PVE && this.level % 10) {
                    this.dataGenerator = new FightProcessGenerator();
                    let arr = this.originalElements;
                    let roleArr:FightRoleVO[] = fight.generateFightRoleVOArr(arr);
                    this.dataGenerator.addSceneDataVec(roleArr);
                    this.fightSteps = this.dataGenerator.generateData(this.bunch);
                    this.result = this.dataGenerator.result;
                }
                if (this.forceEnd) {
                    this.forceEnd = false;
                    this.fightSteps = [];
                }
                this.steps = this.fightSteps.concat();
                this.dispatchEventWith("fight_ready_complete", true, [fight.getEnterSideMaxHP(this.steps, FightSideEnum.LEFT_SIDE), fight.getEnterSideMaxHP(this.steps, FightSideEnum.RIGHT_SIDE)]);

                let hero = Array(fight.ROLE_UP_LIMIT);
                let monsterIds = Array(fight.ROLE_UP_LIMIT);
                for (let i = 0; i < this.originalElements.length; i++) {
                    if (this.originalElements[i]) {
                        if (this.originalElements[i].side == 1) {
                            hero[this.originalElements[i].pos] = this.originalElements[i].id;
                        }
                        if (this.originalElements[i].side == 2) {
                            monsterIds[this.originalElements[i].pos] = this.originalElements[i].id;
                        }
                    }
                }
                if (Global.DEBUG) {
                    console.groupCollapsed("-----------------------战斗信息---------------");
                    console.log("英雄id:", hero);
                    console.log("串:", this.bunch);
                    console.log("怪物id:", monsterIds);
                    console.log("步骤:", this.steps);
                    console.groupEnd();
                }

                if (this.type != FightTypeEnum.PVP) {
                    if (this.autoFight) {
                        this.addEnterBuffs();
                        this.startStep();
                    }
                }
            }
            this.playSteps = null;
        }
    }

    private addEnterBuffs() {
        if (this.fightSteps && this.fightSteps.length > 0) {
            for (let i = 0; i < this.fightSteps.length; i++) {
                if (this.fightSteps[i].round == 0) {
                    let id = this.fightSteps[i].id;
                    let buffs = this.fightSteps[i].buff;
                    let role:RoleConfig = Config.HeroData[id] || Config.EnemyData[id];
                    let enterAddBuffs = [];
                    if (role && role.begin_skill) {
                        for (let j = 0; j < role.begin_skill.length; j++) {
                            let skill:SkillConfig = Config.SkillData[role.begin_skill[j]];
                            if (skill) {
                                let buffId = skill.buff_id;
                                if (buffs.indexOf(+buffId) >= 0 || buffs.indexOf(buffId + "") >= 0) {
                                    enterAddBuffs.push(buffId);
                                }
                            }
                        }
                    }
                    if (enterAddBuffs.length > 0) {
                        let fightRole = this.getRoleByPos(this.fightSteps[i].pos);
                        fightRole.enterAddBuffs(enterAddBuffs);
                    }
                } else {
                    break;
                }
            }
        }
    }

    private moveCount:number = 0;
    private roleMoveComplete() {
        this.moveCount++;
        if (this.moveCount >= this.originalElements.length) {
            if (this.autoFight)
                this.start(this.playSteps);
        }
    }

    private startStep(e:egret.Event = null) {
        this.isAddingRole = false;
        if (e) {
            e.target.removeEventListener(egret.Event.COMPLETE, this.startStep, this);
        }
        if (this.forceEnd) {
            this.forceEnd = false;
            this.fightSteps = [];
            this.reset();
            this.state = FightStateEnum.End;
            this.dispatchEventWith(ContextEvent.FIGHT_END, true, true);
            return;
        }
        if (this.fightSteps.length <= 0) {
            this.oldLifeRatio = -1;
            this.addEventListener(egret.Event.ENTER_FRAME, this.checkFightEnd, this);
        } else {
            let count = this.getPlayingCount();
            this.meanWhileStep = count;
            let delayTime = 0;
            while (count--) {
                let data = this.fightSteps.shift();
                this.doStep(data, delayTime);
                delayTime += fight.MEANWHILE_FIGHT_DELAY_TIME;
            }
        }
    }

    private doStep(data:FightReportItem, delay:number) {
        let startRole = this.getRoleByPos(data.pos);
        if (startRole) {
            startRole.fight(data, delay);
        } else {
            fight.recordLog(`第${data.index}步出错`, fight.LOG_FIGHT_WARN);
        }
    }

    public onOneStepComplete() {
        if (this.palmEff) {
            this.palmEff.free();
        } else {
            this.meanWhileStep--;
            if (this.meanWhileStep <= 0)
                egret.setTimeout(() => {
                    if (this.forceEnd) {
                        this.forceEnd = false;
                        this.fightSteps = [];
                        this.reset();
                        this.state = FightStateEnum.End;
                        this.dispatchEventWith(ContextEvent.FIGHT_END, true, true);
                    } else {
                        this.startStep();
                    }
                }, this, fight.STEP_DELAY_TIME);
        }
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

    public getRoleByPos(str:string) {
        let side = +str.substr(0, 1) - 1;
        let pos = +str.substr(2, 1);
        return this.roles[side][pos];
    }

    public getRole(value:{side:number, pos:number}) {
        let side = value.side;
        let pos = value.pos;
        if (side < 1 || side > 2 || pos < 0 || pos > 8) {
            fight.recordLog("获取角色参数不对", fight.LOG_FIGHT_WARN);
            return null;
        }
        return this.roles[side - 1][pos];
    }

    private getPlayingCount() {
        let result = 1;
        if (this.type != FightTypeEnum.PVE) {
            return result;
        }
        let posArr = [];
        if (this.fightSteps.length > 1) {
            let firstPos = this.fightSteps[0].pos;
            posArr.push(firstPos.substr(2, 1));
            let firstSide = firstPos.substr(0, 1);
            for (let i = 1; i < this.fightSteps.length; i++) {
                let curPos = this.fightSteps[i].pos;
                let curSide = curPos.substr(0, 1);
                let curIndex = curPos.substr(2, 1);
                if ((firstSide == curSide) && (firstPos != curPos)) {
                    firstPos = curPos;
                    if (posArr.indexOf(curIndex) < 0) {
                        posArr.push(curIndex);
                        result++;
                    }
                } else {
                    break;
                }
            }
        }
        return fight.CAN_MEANWHILE_FIGHT ? result:1;
    }

    /**
     * 检测战斗结束
     */
    private checkFightEnd() {
        let canEnd:boolean = true;
        if (canEnd) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.checkFightEnd, this);
            this.state = FightStateEnum.End;
            egret.setTimeout(() => {
                this.dispatchEventWith(ContextEvent.FIGHT_END, true);
            }, this, 200);
        }
    }

    /**
     * 得到触发的串
     * @returns {string}
     */
    public getTriggerChanceType() {
        return this.bunch;
    }

    /**
     * 得到step
     */
    public getSteps() {
        return this.steps.concat();
    }

    /**
     * 得到参加战斗的怪
     */
    public getMonsterArr() {
        let result = [];
        for (let i = 0; i < fight.ROLE_UP_LIMIT; i++) {
            result[i] = 0;
        }
        for (let i = 0; i < this.originalElements.length; i++) {
            if (!fight.isHero(this.originalElements[i].id)) {
                let pos = this.originalElements[i].pos;
                result[pos] = +(this.originalElements[i].id);
            }
        }
        return result;
    }

    // 移除角色
    private tweenRemoveRole() {
        let off:number = 0;
        for (let i = 0; i < fight.ROLE_UP_LIMIT; i++) {
            if (this.rightRoles[i] && this.rightRoles[i].side == FightSideEnum.RIGHT_SIDE) {
                off = fight.WIDTH;
                for (let i = 0; i < this.leftRoles.length; i++) {
                    if (this.leftRoles[i]) {
                        this.leftRoles[i].dispose();
                    }
                }
                break;
            }
            if (this.leftRoles[i] && this.leftRoles[i].side == FightSideEnum.LEFT_SIDE) {
                off = fight.WIDTH * -1;
                break;
            }
        }
        if (off) {
            let tween = egret.Tween.get(this.roleLayer);
            tween.to({x: this.roleLayer.x + off}, fight.MIDDLE_GROUND_MOVE_TIME);
            tween.call(() => {
                this.roleLayer.x = 0;
                this.reset();
                this.tweenRemoveRoleComplete();
            }, this);
        } else {
            this.reset();
            this.tweenRemoveRoleComplete();
        }
    }

    private bornRoles(e:egret.Event) {
        if (e) {
            e.target.removeEventListener(egret.Event.COMPLETE, this.bornRole, this);
        }
        let arr = this.originalElements;
        let roleArr:FightRoleVO[] = fight.generateFightRoleVOArr(arr);
        for (let i = 0; i < roleArr.length; i++) {
            if (roleArr[i]) {
                egret.setTimeout((index) => {
                    let eff = new MCEff("role_born");
                    this.bornRole(roleArr[index]);
                    eff.x = fight.getRoleInitPoint(roleArr[index]).x;
                    eff.y = fight.getRoleInitPoint(roleArr[index]).y;
                    this.damageEffLayer.addChild(eff);
                }, this, i * 200, i);
            }
        }
    }

    private bornRole(roleData:FightRoleVO) {
        let role = FightRoleFactory.createRole(this, roleData);
        // let role = new FightRole(this, roleData);
        let side = roleData.side - 1;
        let pos = roleData.pos;
        this.roles[side][pos] = role;
        this.roleLayer.addChild(role);
        let sideRoles = this.roles[side].concat();

        let zIndexArr = fight.ROLE_Z_INDEX_ARR;
        role["z__index"] = zIndexArr[pos];
        sideRoles.sort((a, b) => {
            return a["z__index"] - b["z__index"]
        });
        sideRoles = sideRoles.filter((value) => {
            return !!value
        });
        for (let i = 0; i < sideRoles.length; i++) {
            if (!sideRoles[i].parent) {
                // sideRoles[i].parent.removeChild(sideRoles[i]);
                this.roleLayer.addChild(sideRoles[i]);
                sideRoles[i].idle();
            }
            // this.roleLayer.addChild(sideRoles[i]);
            // sideRoles[i].idle();
        }
        this.initRoleCount++;
        if (this.initRoleCount >= this.originalElements.length) {
            this.leftAreaCont = new egret.DisplayObjectContainer();
            this.roleLayer.addChildAt(this.leftAreaCont, 0);
            this.rightAreaCont = new egret.DisplayObjectContainer();
            this.roleLayer.addChildAt(this.rightAreaCont, 0);
            egret.setTimeout(this.startStep, this, 200);
        }
    }

    // 目前只有pve有跟着场景移除角色
    private tweenRemoveRoleComplete(e:egret.Event = null) {
        if (e) {
            e.target.removeEventListener(egret.Event.COMPLETE, this.tweenRemoveRole, this);
        }
        let arr = this.originalElements;
        let roleArr:FightRoleVO[] = fight.generateFightRoleVOArr(arr);
        if (this.firstEnter) {
            if (this.level % 10 == 0 && this.type == FightTypeEnum.PVE) {
                let eff = new BossIncomingEff();
                eff.addEventListener(egret.Event.COMPLETE, this.stageEffComplete, this);
                this.damageEffLayer.addChild(eff);
            } else {
                let eff;
                if (this.type == FightTypeEnum.PVE) {
                    let stageName = Config.StageCommonData[Math.ceil(this.level / fight.MAP_SWITCH_SIZE)].title;
                    eff = new NewChapterEff(stageName);
                } else {
                    eff = new BattleStartEff();
                }
                eff.addEventListener(egret.Event.COMPLETE, this.stageEffComplete, this);
                this.damageEffLayer.addChild(eff);
            }
            return;
        }
        if (this.autoFight) {
            this.addRoles(roleArr, true);
        } else {
            if (this.level % 10 == 0 && this.type == FightTypeEnum.PVE) {
                let eff = new BossIncomingEff();
                eff.addEventListener(egret.Event.COMPLETE, this.stageEffComplete, this);
                this.damageEffLayer.addChild(eff);
            }
            // else if (Config.StageData[this.level - 1] && Config.StageData[this.level] && Config.StageData[this.level].map != Config.StageData[this.level - 1].map && this.type == FightTypeEnum.PVE) {
            //     let eff = new NewChapterEff(Config.StageData[this.level].title);
            //     eff.addEventListener(egret.Event.COMPLETE, this.stageEffComplete, this);
            //     this.damageEffLayer.addChild(eff);
            // }
            else {
                this.addRoles(roleArr, true);
            }
        }
    }

    // 场景特效(例如开启新地图,boss关)
    private stageEffComplete(e:egret.Event = null) {
        if (e)
            e.target.removeEventListener(egret.Event.COMPLETE, this.stageEffComplete, this);
        if (this.forceEnd) {
            this.forceEnd = false;
            this.fightSteps = [];
            this.reset();
            this.state = FightStateEnum.End;
            this.dispatchEventWith(ContextEvent.FIGHT_END, true, true);
            return;
        }
        this.autoFight = true;
        let arr = this.originalElements;
        let roleArr:FightRoleVO[] = fight.generateFightRoleVOArr(arr);
        this.addRoles(roleArr, true);
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
        let len = roleArr ? roleArr.length:0;
        for (let i = 0; i < len; i++) {
            let role = roleArr[i];
            if (role) {
                totalLife = BigNum.add(totalLife, role.maxHP);
            }
        }
        return totalLife;
    }

    /**
     * 开始抖动
     * @param 抖动幅度
     */
    public startShake(range:number) {
        if (range > 0) {
            if (!this.shakeScreenEff) {
                this.shakeScreenEff = new ShakeScreenEff(this);
            }
            this.shakeScreenEff.startShake(range);
        }
    }

    /**
     * 显示灰尘效果
     * @param value
     */
    public showMoveDustEff(value:{x:number,y:number, side:number}) {
        let eff = new MoveDustEff();
        eff.x = value.x;
        eff.y = value.y;
        this.showEff(this.dustLayer, eff, value);
    }

    /**
     * 释放技能前的效果
     * @param parent
     * @param eff
     * @param needMode
     */
    public showFreeSkillEff(parent:egret.DisplayObjectContainer, eff:egret.DisplayObject, needMode:boolean) {
        this.grayLayer.graphics.clear();
        if (needMode && this.stage) {
            this.grayLayer.graphics.beginFill(0x0, 0.4);
            this.grayLayer.graphics.drawRect(-30, -30, this.stage.width + 60, this.stage.height + 60);
            egret.setTimeout(() => {
                this.grayLayer.graphics.clear();
            }, this, 1000);
        }
        parent.addChild(eff);
    }

    /**
     * area攻击效果
     * @param eff
     * @param value
     */
    public showAreaEff(eff:egret.DisplayObject, value:{side:number}) {
        let scaleX = (value.side == FightSideEnum.LEFT_SIDE ? -1:1);
        eff.scaleX = scaleX;
        if (value.side == FightSideEnum.LEFT_SIDE) {
            this.leftAreaCont.addChild(eff);
        } else {
            this.rightAreaCont.addChild(eff);
        }
    }

    /**
     * 显示伤害效果
     * @param eff
     * @param value
     */
    public showDamageEff(eff:egret.DisplayObject, value?:any) {
        this.showEff(this.damageEffLayer, eff, value);
    }

    /**
     * 显示效果
     * @param parent
     * @param eff
     * @param value
     */
    public showEff(parent:egret.DisplayObjectContainer, eff:egret.DisplayObject, value?:any) {
        if (parent && eff) {
            if (value) {
                if (typeof value == "number") {
                    eff.scaleX = value;
                } else {
                    eff.scaleX = value.side == FightSideEnum.RIGHT_SIDE ? -1:1;
                }
            }
            parent.addChild(eff);
        }
    }

    /**
     * 显示飘字效果
     * @param content
     * @param type
     */
    public flyTxt(content:any, fntname:string) {
        let fontEff = new FontEff(fntname);
        fontEff.x = content.x || 0;
        fontEff.y = content.y || 0;
        fontEff.show(content);
        this.showEff(this.fontEffLayer, fontEff);
    }

    /** 显示技能名字效果 */
    public showSkillFlyTxt(content:string) {
        if (this.type != FightTypeEnum.PVE) {
            let skillEff = new SkillNameEff(content);
            skillEff.x = 72;
            skillEff.y = 50;
            this.addChild(skillEff);
        }
    }

    /**
     * 显示升级效果
     * @param value
     */
    public showUPLevelEff(value:{id:number, level:number}) {
        if (value) {
            for (let i = 0; i < fight.ROLE_UP_LIMIT; i++) {
                if (this.leftRoles[i]) {

                }
            }
        }
    }

    private onRoleHPChange() {
        let curTotalLife = this.getCurTotalLife(FightSideEnum.LEFT_SIDE);
        let ratio:number = +BigNum.div(curTotalLife, this.leftTotalLife);
        let w = fight.WIDTH;
        let h = fight.HEIGHT;
        if (this.type != FightTypeEnum.PVE) {
            h = 860;
        }
        if (this.oldLifeRatio > 0) {
            if (ratio <= 0.3 && ratio < this.oldLifeRatio) {
                if (!this.warnEff) {
                    this.warnEff = new FightWarnEff(this);
                }
                this.warnEff.show(w, h);
                this.oldLifeRatio = ratio;
            }
        } else {
            this.oldLifeRatio = ratio;
        }
    }

    public forceToStage() {
        this.forceEnd = true;
    }

    private onReadyComplete(e:egret.Event) {
        this.leftTotalLife = e.data[0] || "1";
        this.rightTotalLife = e.data[1] || "1";
    }

    public reset() {
        let len = this.dropProps ? this.dropProps.length:0;
        for (let i = 0; i < len; i++) {
            if (this.dropProps[i]) {
                this.dropProps[i].stop();
                if (this.dropProps[i].parent)
                    this.dropProps[i].parent.removeChild(this.dropProps[i]);
            }
        }
        if (this.leftAreaCont && this.leftAreaCont.parent) {
            this.leftAreaCont.parent.removeChild(this.leftAreaCont);
            this.leftAreaCont = null;
        }
        if (this.rightAreaCont && this.rightAreaCont.parent) {
            this.rightAreaCont.parent.removeChild(this.rightAreaCont);
            this.rightAreaCont = null;
        }
        for (let i = 0; i < this.leftRoles.length; i++) {
            if (this.leftRoles[i]) {
                this.leftRoles[i].dispose();
                delete this.leftRoles[i];
            }
        }
        for (let i = 0; i < this.rightRoles.length; i++) {
            if (this.rightRoles[i]) {
                this.rightRoles[i].dispose();
                delete this.rightRoles[i];
            }
        }
    }

    public dispose() {
        this.reset();
        this.removeEventListener("role_one_step_complete", this.onOneStepComplete, this, true);
        this.removeEventListener("role_die", this.onRoleDie, this, true);
        this.removeEventListener("role_hp_change", this.onRoleHPChange, this, true);
        this.removeEventListener("fight_ready_complete", this.onReadyComplete, this, true);
    }
}
