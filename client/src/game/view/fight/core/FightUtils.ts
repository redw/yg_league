/**
 * 战斗里的一些工具方法
 * Created by hh on 2016/11/30.
 */
module fight {
    let bonesDataMap = {};
    let dragonFactory = new dragonBones.EgretFactory();
    let mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory();
    let curSoundPath:string = "";

    const TEST_UID_ARR:string[] = ["300667664", "309782584", "292758853", "287057268", "307276412", "296705951", "287127041"];

    export function init(){
        egret.Ticker.getInstance().register(()=>{
            dragonBones.WorldClock.clock.advanceTime(0.02);
        }, this);
    }

    /**
     * 选取目标通用规则
     * @param value 排或列
     * @returns {[number,number,number]}
     */
    export function getCommonOrders(value:number) {
        if (value == 1) {
            return [1, 0, 2];
        } else if (value == 2) {
            return [2, 1, 0];
        } else {
            return [0, 1, 2];
        }
    }

    /**
     * 验证主动技能
     * @param value
     */
    export function verifyActiveSkill(value:SkillConfig) {
        if (value) {
            if (value.type == "passive") {
                recordLog(`技能${value.id}应该是主动配置`, fight.LOG_FIGHT_WARN);
            }
            if (!value.trigger_chance || value.trigger_chance > 1) {
                recordLog(`技能${value.id}的串配置错误`, fight.LOG_FIGHT_WARN);
            }
            if (!value.repeat || value.repeat > 10) {
                recordLog(`技能${value.id}的repeat配置错误`, fight.LOG_FIGHT_WARN);
            }
            if (!value.damage_frame) {
                recordLog(`技能${value.id}没有配伤害帧`, fight.LOG_FIGHT_WARN);
            }
            if (value.action_type == fight.ATTACK_ACTION_JUMP && !value.jump_frame) {
                recordLog(`技能${value.id}的跳跃攻击没有配跳跃帧`, fight.LOG_FIGHT_WARN);
            }
            if (value.action_type == fight.ATTACK_ACTION_AREA || value.action_type == fight.ATTACK_ACTION_TURN) {
                if (!value.effect_damage_frame) {
                    recordLog(`技能${value.id}的${value.action_type}攻击伤害帧配置错误`, fight.LOG_FIGHT_WARN);
                }
            }
        }
    }

    /**
     * 是否是英雄
     * @param roleId
     * @returns {boolean}
     */
    export function isHero(roleId:number) {
        return roleId < 200;
    }

    /**
     * 是否是boss
     * @param roleId
     * @returns {boolean}
     */
    export function isBoss(roleId:number) {
        let result = false;
        if (!isHero(roleId)) {
            result = Config.EnemyData[roleId].boss
        }
        return result;
    }

    /**
     * 是否是加血技能
     */
    export function isAddHPSkill(value:SkillConfig) {
        return value && value.damage < 0;
    }

    /**
     * 得到近战攻击玩家时的攻击位置
     * @param role
     * @param targets
     * @param skill
     * @returns {Point}
     */
    export function getNearFightPoint(pos:number, targets:{pos:number}[], skill:SkillConfig) {
        let point = new egret.Point();
        let offPoint = (skill && skill.move_position) || [0, 0];
        if (skill.action_type == fight.ATTACK_ACTION_ROW || skill.target_cond == "row") {
            let newPos = (3 - Math.floor(pos / 10)) * 10 + targets[0].pos % 10 % 3;
            point = getRoleInitPoint(newPos);
        } else {
            let curRole = targets[0];
            let minValue = Math.abs(pos - curRole.pos);
            for (let i = 1; i < targets.length; i++) {
                let curValue = Math.abs(pos - targets[i].pos);
                if (curValue < minValue) {
                    curRole = targets[i];
                }
            }
            point = getRoleInitPoint(curRole.pos);
        }
        if (fight.getSideByPos(pos) == FightSideEnum.RIGHT_SIDE) {
            point.x += (MOVE_ATTACK_OFF + (+offPoint[0]));
        } else {
            point.x -= (MOVE_ATTACK_OFF + (+offPoint[0]));
        }
        point.y += (+offPoint[1]);
        return point;
    }

    /**
     * 得到角色出生位置
     * @param pos  角色数据
     * @returns {Point}
     */
    export function getRoleInitPoint(pos:number) {
        let side = fight.getSideByPos(pos) - 1;
        let index = fight.getPosIndexByPos(pos);
        return POS_MAP[side][index].clone();
    }

    /**
     * 记录日志
     * @param content
     * @param level
     */
    export function recordLog(content:any, level:number = 0) {
        if (TEST_UID_ARR.indexOf(String(UserProxy.inst.uid)) >= 0 || Global.DEBUG) {
            if (level >= LOG_FIGHT_ERROR) {
                console.error(content);
            } else if (level >= LOG_FIGHT_WARN) {
                console.warn(content);
            } else {
                console.log(content);
            }
        }
    }

    /**
     * 需要移动攻击
     * @param action
     */
    export function needMoveAttack(action:string) {
        return action == fight.ATTACK_ACTION_NORMAL ||
            action == fight.ATTACK_ACTION_ROW;
    }

    /**
     * 需要回退
     * @param action
     * @returns {boolean}
     */
    export function needRetreat(action:string) {
        return action == fight.ATTACK_ACTION_NORMAL ||
            action == fight.ATTACK_ACTION_JUMP ||
            action == fight.ATTACK_ACTION_ROW ||
            action == fight.ATTACK_ACTION_JUMP_AREA ||
            action == fight.ATTACK_JUMP_ATTACK2;
    }

    /**
     * mc上是否存在标签
     * @param label
     * @param mc
     * @returns {boolean}
     */
    export function existMCLabel(label:string, mc:egret.MovieClip){
        let result = false;
        if (mc && "frameLabels" in mc) {
            let arr = mc["frameLabels"];
            let len = arr ? arr.length : 0;
            for (let i = 0; i < len; i++) {
                let frameLabel:egret.FrameLabel = arr[i];
                if (frameLabel.name == label) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 随机技能触发串
     * @returns {string|string|string|string|string}
     */
    export function randomSkillTriggerBunch() {
        let bunch = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"];
        let index = Math.floor(Math.random() * bunch.length);
        return fight.TEST_BUNCH || bunch[index];
    }

    /**
     * 显示伤害,飘字等效果
     * @param parent
     * @param content
     * @param fntname
     */
    export function showTxt(parent:egret.DisplayObjectContainer, content:any, fntname:string) {
        let fontEff = new FontEff(fntname);
        parent.addChild(fontEff);
        fontEff.show(content);
    }

    export function playSound(url:string, isMusicEff:boolean = true) {
        if (url) {
            try {
                if (isMusicEff) {
                    SoundManager.inst.playEffect(URLConfig.getSoundURL(url));
                } else {
                    if (curSoundPath != url) {
                        SoundManager.inst.playMusic(URLConfig.getSoundURL(url));
                        curSoundPath = url;
                    }
                }
            } catch (e) {
                recordLog(`播放{url}声音出错`, LOG_FIGHT_WARN);
            }
        }
    }

    export function getEnterSideMaxHP(result:{maxhp:string, round:number, pos:string}[], side:number) {
        let len = result ? result.length : 0;
        let total:string = "0";
        for (let i = 0; i < len; i++) {
            if (result[i].round == 0 && +result[i].pos.substr(0, 1) == side) {
                total = BigNum.add(total, result[i].maxhp);
            }
        }
        return BigNum.max(1, total);
    }

    /**
     * 生成战斗角色数据
     * @param obj   角色数据
     * @param pos   角色位置
     * @param side  角色所有边
     * @returns {FightRoleVO[]}
     */
    export function generatePVPFightHeroVOArr(obj:any[], pos:number[], side:number) {
        let result:FightRoleVO[] = [];
        let keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            let fightRoleVO = new FightRoleVO();
            let key = keys[i];
            if (!obj[key].id) {
                obj[key].id = +key;
            }
            fightRoleVO.parse(obj[key]);
            fightRoleVO.side = side;
            fightRoleVO.pos = 0;
            let heroVO = new HeroVO(obj[key]);
            fightRoleVO.copyProp(heroVO);
            for (let j = 0; !!pos && j < pos.length; j++) {
                if (fightRoleVO.id == pos[j]) {
                    fightRoleVO.pos = j;
                    break;
                }
            }
            result.push(fightRoleVO);
        }
        return result;
    }

    /**
     * 生成战斗角色数据数组
     * @returns {FightRoleVO[]}
     */
    export function generateFightRoleVOArr(value:{id:number, pos:number}[]) {
        let result:FightRoleVO[] = [];
        let keys = Object.keys(value);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let fightRoleVO = generateFightRoleVO(value[key]);
            result.push(fightRoleVO)
        }
        return result;
    }

    /**
     * 生成战斗角色数据
     * @returns {FightRoleVO}
     */
    export function generateFightRoleVO(value:{id:number, pos:number}) {
        let result = new FightRoleVO(value);
        if (fight.isHero(value.id)) {
            let heroVO = new HeroVO(value);
            result.copyProp(heroVO);
        } else {
            let monsterVO = new MonsterVO(value);
            result.copyProp(monsterVO);
        }
        return result;
    }

    /**
     * 子弹缓冲方法
     * @param ratio tween的0到1的进度
     * @returns {number}
     */
    export function bulletEase(time:number) {
        return function (ratio:number) {
            let duration = time;
            let x = ratio;
            let t = ratio * duration;
            let b = 0;
            let c = 1;
            let d = duration;
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        }
    }

    /**
     * 是否是超过20轮,挑战失败
     * @param steps
     * @returns {boolean}
     */
    export function isOverRound(steps:FightReportItem[]) {
        let result = false;
        let len = steps ? steps.length : 0;
        if (len > 1) {
            let side = getSideByPos(steps[len - 1].pos);
            if (steps[len - 1].round >= 20 && side == FightSideEnum.RIGHT_SIDE) {
                result = true;
            }
        }
        return result;
    }

    export function getSideByPos(pos:number){
        return Math.floor(pos / 10);
    }

    export function getPosIndexByPos(pos:number){
        return pos % 10;
    }

    export function needFlipped(pos:number) {
        return getSideByPos(pos) == FightSideEnum.LEFT_SIDE;
    }

    /**
     * 获取角色的高度
     * @param id
     * @returns {number}
     */
    export function getRoleHeight(id:number) {
        return (Config.HeroData[id] || Config.EnemyData).modle_height;
    }

    /**
     * 检测帧是否相等或接近相等
     * @param curFrame
     * @param targetFrame
     * @param range
     * @returns {boolean}
     */
    export function checkFrameEquip(curFrame:number, targetFrame:number, range:number=0) {
        let off = curFrame - targetFrame;
        return off >= 0 && off <= range;
    }

    /**
     * 创建骨格动画
     * @param name
     * @returns {Armature}
     */
    export function createArmature(name) {
        if (!bonesDataMap[name]) {
            bonesDataMap[name] = true;
            let boneJson = RES.getRes(`${name}_ske_json`);
            let dragonBonesData = dragonBones.DataParser.parseDragonBonesData(boneJson)
            dragonFactory.addDragonBonesData(dragonBonesData);
            let texture = RES.getRes(`${name}_tex_png`);
            let textureData = RES.getRes(`${name}_tex_json`);
            dragonFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
        }
        let armature = dragonFactory.buildFastArmature(name);
        armature.enableAnimationCache(30);
        return armature;
    }

    /**
     * 创建普通的mc
     * @param name
     * @returns {egret.MovieClip}
     */
    export function createMovieClip(name:string):egret.MovieClip {
        let dataRes:any = RES.getRes(name + "_json");
        let textureRes:any = RES.getRes(name + "_png");
        mcFactory.mcDataSet = dataRes;
        mcFactory.texture = textureRes;
        return new egret.MovieClip(mcFactory.generateMovieClipData(name));
    }
}