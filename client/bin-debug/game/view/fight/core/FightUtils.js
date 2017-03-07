/**
 * 战斗里的一些工具方法
 * Created by hh on 2016/11/30.
 */
var fight;
(function (fight) {
    var dragonFactory = new dragonBones.EgretFactory();
    var mcFactory = new egret.MovieClipDataFactory();
    var curSoundPath = "";
    var TEST_UID_ARR = ["300667664", "309782584", "292758853", "287057268", "307276412", "296705951", "287127041"];
    /**
     * 选取目标通用规则
     * @param value 排或列
     * @returns {[number,number,number]}
     */
    function getCommonOrders(value) {
        if (value == 1) {
            return [1, 0, 2];
        }
        else if (value == 2) {
            return [2, 1, 0];
        }
        else {
            return [0, 1, 2];
        }
    }
    fight.getCommonOrders = getCommonOrders;
    /**
     * 验证主动技能
     * @param value
     */
    function verifyActiveSkill(value) {
        if (value) {
            if (value.type == "passive") {
                recordLog("\u6280\u80FD" + value.id + "\u5E94\u8BE5\u662F\u4E3B\u52A8\u914D\u7F6E", fight.LOG_FIGHT_WARN);
            }
            if (!value.trigger_chance || value.trigger_chance > 1) {
                recordLog("\u6280\u80FD" + value.id + "\u7684\u4E32\u914D\u7F6E\u9519\u8BEF", fight.LOG_FIGHT_WARN);
            }
            if (!value.repeat || value.repeat > 10) {
                recordLog("\u6280\u80FD" + value.id + "\u7684repeat\u914D\u7F6E\u9519\u8BEF", fight.LOG_FIGHT_WARN);
            }
            if (!value.damage_frame) {
                recordLog("\u6280\u80FD" + value.id + "\u6CA1\u6709\u914D\u4F24\u5BB3\u5E27", fight.LOG_FIGHT_WARN);
            }
            if (value.action_type == fight.ATTACK_ACTION_JUMP && !value.jump_frame) {
                recordLog("\u6280\u80FD" + value.id + "\u7684\u8DF3\u8DC3\u653B\u51FB\u6CA1\u6709\u914D\u8DF3\u8DC3\u5E27", fight.LOG_FIGHT_WARN);
            }
            if (value.action_type == fight.ATTACK_ACTION_AREA || value.action_type == fight.ATTACK_ACTION_TURN) {
                if (!value.effect_damage_frame) {
                    recordLog("\u6280\u80FD" + value.id + "\u7684" + value.action_type + "\u653B\u51FB\u4F24\u5BB3\u5E27\u914D\u7F6E\u9519\u8BEF", fight.LOG_FIGHT_WARN);
                }
            }
        }
    }
    fight.verifyActiveSkill = verifyActiveSkill;
    /**
     * 是否是英雄
     * @param roleId
     * @returns {boolean}
     */
    function isHero(roleId) {
        return roleId < 200;
    }
    fight.isHero = isHero;
    /**
     * 是否是boss
     * @param roleId
     * @returns {boolean}
     */
    function isBoss(roleId) {
        var result = false;
        if (!isHero(roleId)) {
            result = Config.EnemyData[roleId].boss;
        }
        return result;
    }
    fight.isBoss = isBoss;
    /**
     * 是否是加血技能
     */
    function isAddHPSkill(value) {
        return value && value.damage < 0;
    }
    fight.isAddHPSkill = isAddHPSkill;
    /**
     * 得到近战攻击玩家时的攻击位置
     * @param role
     * @param targets
     * @param skill
     * @returns {Point}
     */
    function getNearFightPoint(pos, targets, skill) {
        var point = new egret.Point();
        var offPoint = (skill && skill.move_position) || [0, 0];
        if (skill.action_type == fight.ATTACK_ACTION_ROW || skill.target_cond == "row") {
            var newPos = (3 - Math.floor(pos / 10)) * 10 + targets[0].pos % 10 % 3;
            point = getRoleInitPoint(newPos);
        }
        else {
            var curRole = targets[0];
            var minValue = Math.abs(pos - curRole.pos);
            for (var i = 1; i < targets.length; i++) {
                var curValue = Math.abs(pos - targets[i].pos);
                if (curValue < minValue) {
                    curRole = targets[i];
                }
            }
            point = getRoleInitPoint(curRole.pos);
        }
        if (fight.getSideByPos(pos) == FightSideEnum.RIGHT_SIDE) {
            point.x += (fight.MOVE_ATTACK_OFF + (+offPoint[0]));
        }
        else {
            point.x -= (fight.MOVE_ATTACK_OFF + (+offPoint[0]));
        }
        point.y += (+offPoint[1]);
        return point;
    }
    fight.getNearFightPoint = getNearFightPoint;
    /**
     * 得到角色出生位置
     * @param pos  角色数据
     * @returns {Point}
     */
    function getRoleInitPoint(pos) {
        var side = fight.getSideByPos(pos) - 1;
        var index = fight.getPosIndexByPos(pos);
        return fight.POS_MAP[side][index].clone();
    }
    fight.getRoleInitPoint = getRoleInitPoint;
    /**
     * 记录日志
     * @param content
     * @param level
     */
    function recordLog(content, level) {
        if (level === void 0) { level = 0; }
        if (TEST_UID_ARR.indexOf(String(UserProxy.inst.uid)) >= 0 || Global.DEBUG) {
            if (level >= fight.LOG_FIGHT_ERROR) {
                console.error(content);
            }
            else if (level >= fight.LOG_FIGHT_WARN) {
                console.warn(content);
            }
            else {
                console.log(content);
            }
        }
    }
    fight.recordLog = recordLog;
    /**
     * 需要移动攻击
     * @param action
     */
    function needMoveAttack(action) {
        return action == fight.ATTACK_ACTION_NORMAL ||
            action == fight.ATTACK_ACTION_ROW;
    }
    fight.needMoveAttack = needMoveAttack;
    /**
     * 需要回退
     * @param action
     * @returns {boolean}
     */
    function needRetreat(action) {
        return action == fight.ATTACK_ACTION_NORMAL ||
            action == fight.ATTACK_ACTION_JUMP ||
            action == fight.ATTACK_ACTION_ROW ||
            action == fight.ATTACK_ACTION_JUMP_AREA ||
            action == fight.ATTACK_JUMP_ATTACK2;
    }
    fight.needRetreat = needRetreat;
    /**
     * mc上是否存在标签
     * @param label
     * @param mc
     * @returns {boolean}
     */
    function existMCLabel(label, mc) {
        var result = false;
        if (mc && "frameLabels" in mc) {
            var arr = mc["frameLabels"];
            var len = arr ? arr.length : 0;
            for (var i = 0; i < len; i++) {
                var frameLabel = arr[i];
                if (frameLabel.name == label) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
    fight.existMCLabel = existMCLabel;
    /**
     * 随机技能触发串
     * @returns {string|string|string|string|string}
     */
    function randomSkillTriggerBunch() {
        var bunch = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"];
        var index = Math.floor(Math.random() * bunch.length);
        return fight.TEST_BUNCH || bunch[index];
    }
    fight.randomSkillTriggerBunch = randomSkillTriggerBunch;
    /**
     * 显示伤害,飘字等效果
     * @param parent
     * @param content
     * @param fntname
     */
    function showTxt(parent, content, fntname) {
        var fontEff = new FontEff(fntname);
        parent.addChild(fontEff);
        fontEff.show(content);
    }
    fight.showTxt = showTxt;
    function playSound(url, isMusicEff) {
        if (isMusicEff === void 0) { isMusicEff = true; }
        if (url) {
            try {
                if (isMusicEff) {
                    SoundManager.inst.playEffect(URLConfig.getSoundURL(url));
                }
                else {
                    if (curSoundPath != url) {
                        SoundManager.inst.playMusic(URLConfig.getSoundURL(url));
                        curSoundPath = url;
                    }
                }
            }
            catch (e) {
                recordLog("\u64AD\u653E{url}\u58F0\u97F3\u51FA\u9519", fight.LOG_FIGHT_WARN);
            }
        }
    }
    fight.playSound = playSound;
    function getEnterSideMaxHP(result, side) {
        var len = result ? result.length : 0;
        var total = "0";
        for (var i = 0; i < len; i++) {
            if (result[i].round == 0 && +result[i].pos.substr(0, 1) == side) {
                total = BigNum.add(total, result[i].maxhp);
            }
        }
        return BigNum.max(1, total);
    }
    fight.getEnterSideMaxHP = getEnterSideMaxHP;
    /**
     * 生成战斗角色数据
     * @param obj   角色数据
     * @param pos   角色位置
     * @param side  角色所有边
     * @returns {FightRoleVO[]}
     */
    function generatePVPFightHeroVOArr(obj, pos, side) {
        var result = [];
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            var fightRoleVO = new FightRoleVO();
            var key = keys[i];
            if (!obj[key].id) {
                obj[key].id = +key;
            }
            fightRoleVO.parse(obj[key]);
            fightRoleVO.side = side;
            fightRoleVO.pos = 0;
            var heroVO = new HeroVO(obj[key]);
            fightRoleVO.copyProp(heroVO);
            for (var j = 0; !!pos && j < pos.length; j++) {
                if (fightRoleVO.id == pos[j]) {
                    fightRoleVO.pos = j;
                    break;
                }
            }
            result.push(fightRoleVO);
        }
        return result;
    }
    fight.generatePVPFightHeroVOArr = generatePVPFightHeroVOArr;
    /**
     * 生成战斗角色数据数组
     * @returns {FightRoleVO[]}
     */
    function generateFightRoleVOArr(value) {
        var result = [];
        var keys = Object.keys(value);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var fightRoleVO = generateFightRoleVO(value[key]);
            result.push(fightRoleVO);
        }
        return result;
    }
    fight.generateFightRoleVOArr = generateFightRoleVOArr;
    /**
     * 生成战斗角色数据
     * @returns {FightRoleVO}
     */
    function generateFightRoleVO(value) {
        var result = new FightRoleVO(value);
        if (fight.isHero(value.id)) {
            var heroVO = new HeroVO(value);
            result.copyProp(heroVO);
        }
        else {
            var monsterVO = new MonsterVO(value);
            result.copyProp(monsterVO);
        }
        return result;
    }
    fight.generateFightRoleVO = generateFightRoleVO;
    /**
     * 子弹缓冲方法
     * @param ratio tween的0到1的进度
     * @returns {number}
     */
    function bulletEase(time) {
        return function (ratio) {
            var duration = time;
            var x = ratio;
            var t = ratio * duration;
            var b = 0;
            var c = 1;
            var d = duration;
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        };
    }
    fight.bulletEase = bulletEase;
    /**
     * 是否是超过20轮,挑战失败
     * @param steps
     * @returns {boolean}
     */
    function isOverRound(steps) {
        var result = false;
        var len = steps ? steps.length : 0;
        if (len > 1) {
            var side = getSideByPos(steps[len - 1].pos);
            if (steps[len - 1].round >= 20 && side == FightSideEnum.RIGHT_SIDE) {
                result = true;
            }
        }
        return result;
    }
    fight.isOverRound = isOverRound;
    function getSideByPos(pos) {
        return Math.floor(pos / 10);
    }
    fight.getSideByPos = getSideByPos;
    function getPosIndexByPos(pos) {
        return pos % 10;
    }
    fight.getPosIndexByPos = getPosIndexByPos;
    function needFlipped(pos) {
        return getSideByPos(pos) == FightSideEnum.LEFT_SIDE;
    }
    fight.needFlipped = needFlipped;
    /**
     * 获取角色的高度
     * @param id
     * @returns {number}
     */
    function getRoleHeight(id) {
        return (Config.HeroData[id] || Config.EnemyData).modle_height;
    }
    fight.getRoleHeight = getRoleHeight;
    /**
     * 检测帧是否相等或接近相等
     * @param curFrame
     * @param targetFrame
     * @param range
     * @returns {boolean}
     */
    function checkFrameEquip(curFrame, targetFrame, range) {
        if (range === void 0) { range = 0; }
        var off = curFrame - targetFrame;
        return off >= 0 && off <= range;
    }
    fight.checkFrameEquip = checkFrameEquip;
    /**
     * 创建骨格动画
     * @param name
     * @returns {Armature}
     */
    function createArmature(name) {
        var boneData = RES.getRes(name + "_ske_json");
        dragonFactory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(boneData));
        var texture = RES.getRes(name + "_tex_png");
        var textureData = RES.getRes(name + "_tex_json");
        dragonFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
        var armature = dragonFactory.buildArmature(name);
        return armature;
    }
    fight.createArmature = createArmature;
    /**
     * 创建普通的mc
     * @param name
     * @returns {egret.MovieClip}
     */
    function createMovieClip(name) {
        var dataRes = RES.getRes(name + "_json");
        var textureRes = RES.getRes(name + "_png");
        mcFactory.mcDataSet = dataRes;
        mcFactory.texture = textureRes;
        return new egret.MovieClip(mcFactory.generateMovieClipData(name));
    }
    fight.createMovieClip = createMovieClip;
})(fight || (fight = {}));
//# sourceMappingURL=FightUtils.js.map