/**
 * 战斗角色
 * Created by hh on 2017/2/7.
 */
var FightRole = (function (_super) {
    __extends(FightRole, _super);
    function FightRole(fightContainer, roleData) {
        _super.call(this);
        // 角色的zIndex,处理角色在角色容器中的顺序
        this._zIndex = 0;
        this.firedHitMap = {};
        this.firedBulletCount = 0;
        // buff效果map
        this.buffEffMap = {};
        this.buffIdArr = [];
        this.oldBuffIdArr = [];
        // 目标对象
        this.targets = null;
        // 攻击或伤害时使用的技能
        this.curSkill = null;
        // 角色的信息
        this.roleData = null;
        // 战斗信息
        this.reportItem = null;
        // 是否正在播放行为(攻击,技能...)
        this.isPlayingAction = false;
        // 是正在播放伤害效果
        this.isPlayingDamage = false;
        // 正在播放死效果
        this.isPlayingDie = false;
        // 能移除死亡角色
        this.isCanMoveRole = true;
        // 正在移动
        this.isMoving = false;
        // 血条
        this.lifeBar = null;
        // 角色显示对象
        this.body = null;
        // 角色所在的容器
        this.fightContainer = null;
        // 作用于身体脚下的buff容器
        this.buffContainer0 = null;
        // 作用于身体中间的buff容器
        this.buffContainer1 = null;
        // 作用于身体头部的buff容器
        this.buffContainer2 = null;
        // 除buff外的效果容器
        this.effContainer = null;
        this.timeId = -1;
        this.shadowBitmap = new egret.Bitmap(RES.getRes("role_shadow_png"));
        this.addChild(this.shadowBitmap);
        this.buffContainer0 = new egret.DisplayObjectContainer();
        this.addChild(this.buffContainer0);
        var config = Config.HeroData[roleData.id] || Config.EnemyData[roleData.id];
        if (config && config.resource && config.resource.indexOf(",") > 0) {
            var resourceArr = config.resource.split(",");
            this.haloEff = new MCEff(resourceArr[1], false);
            var part = +resourceArr[2] || 1;
            this.haloEff.y = part * config.modle_height * -0.5;
            this.haloEff.x = 0;
            this.addChild(this.haloEff);
            this.haloEff.stop();
        }
        this.body = new RoleBody(roleData.id);
        this.addChild(this.body);
        this.buffContainer1 = new egret.DisplayObjectContainer();
        this.addChild(this.buffContainer1);
        this.buffContainer2 = new egret.DisplayObjectContainer();
        this.addChild(this.buffContainer2);
        this.effContainer = new egret.DisplayObjectContainer();
        this.addChild(this.effContainer);
        this.lifeBar = new RoleHPBar(roleData.side);
        this.addChild(this.lifeBar);
        this.active(fightContainer, roleData);
    }
    var d = __define,c=FightRole,p=c.prototype;
    p.active = function (fightContainer, roleData) {
        this.fightContainer = fightContainer;
        this.roleData = roleData;
        if (this.roleData.config == null) {
            this.roleData.config = Config.HeroData[roleData.id] || Config.EnemyData[roleData.id];
        }
        this.updateRoleUI();
        this.idle();
        egret.startTick(this.onTick, this);
        this.addEventListener("enter_frame", this.onEnterFrame, this, true);
    };
    p.updateRoleUI = function () {
        var point = fight.getRoleInitPoint(this.roleData);
        this.x = point.x;
        this.y = point.y;
        var shadowScaleSize = this.roleData.config.modle_height / 100;
        this.shadowBitmap.scaleX = this.shadowBitmap.scaleY = shadowScaleSize;
        this.shadowBitmap.y = fight.ROLE_SHADOW_OFF * shadowScaleSize;
        this.shadowBitmap.x = this.shadowBitmap.width * -0.5 * shadowScaleSize;
        if (this.haloEff) {
            this.haloEff.start();
        }
        this.body.flipped = this.roleData.side == FightSideEnum.LEFT_SIDE;
        this.body.active();
        this.buffContainer1.y = -0.5 * this.roleData.config.modle_height;
        this.buffContainer2.y = -this.roleData.config.modle_height;
        this.lifeBar.x = RoleHPBar.WIDTH * -0.5;
        this.lifeBar.y = -(this.roleData.config.modle_height) - RoleHPBar.HEIGHT - 2;
        this.lifeBar.active(this.roleData.side);
    };
    p.fight = function (data, delay) {
        this.reportItem = data;
        var items = data.target;
        this.updateRoleHP(BigNum.add(data.hp, data.damage || 0), data.maxhp);
        this.addBuff(data);
        this.targets = [];
        this.checkBuff(data.buff);
        this.body.reset();
        for (var i = 0; i < items.length; i++) {
            var role = this.fightContainer.getRoleByPos(items[i].pos);
            if (role)
                role.checkBuff(items[i].buff);
            var id = items[i].id;
            var side = +items[i].pos.substr(0, 1);
            var pos = +items[i].pos.substr(2, 1);
            var point = fight.getRoleInitPoint({ side: side, pos: pos });
            var config = Config.HeroData[id] || Config.EnemyData[id];
            this.targets.push({ side: side, pos: pos, id: id, height: config.modle_height, x: point.x, y: point.y });
        }
        var skillId = this.reportItem.skillId;
        this.curSkill = Config.SkillData[skillId];
        if (!FightRoleVO.canAction(data.buff)) {
            this.selfInjury();
        }
        else {
            if (this.targets.length == 0) {
                this.nextStep();
            }
            else {
                egret.setTimeout(this.showSkillEff, this, delay);
            }
        }
    };
    p.showSkillEff = function () {
        this.firedHitMap = {};
        this.firedBulletCount = 0;
        var showInfo = (this.curSkill.skill_free_effect || "").split(",");
        var needMode = !!showInfo[1];
        var source = showInfo[0];
        if (this.curSkill.skill_name) {
            this.fightContainer.showSkillFlyTxt("skillname_" + this.curSkill.skill_name);
        }
        if (source && source != "0") {
            var eff = new MCEff(source);
            eff.registerBack(0, this.doAction, this, null);
            eff.y = (this.roleData.config.modle_height) * -0.5;
            this.fightContainer.showFreeSkillEff(this, eff, needMode);
        }
        else {
            this.doAction();
        }
    };
    p.doAction = function () {
        fight.verifyActiveSkill(this.curSkill);
        if (this.reportItem) {
            var action = this.curSkill.action_type;
            fight.recordLog("\u7B2C" + this.reportItem.index + "\u6B65\u89D2\u8272id" + this.reportItem.id + " \u4F4D\u7F6E" + this.reportItem.pos + " " + action + "\u653B\u51FB\u76EE\u6807", fight.LOG_FIGHT_PLAY);
            if (fight.needMoveAttack(action)) {
                var point = fight.getNearFightPoint(this, this.targets, this.curSkill);
                this.fightContainer.showMoveDustEff({ x: this.x, y: this.y, side: this.roleData.side });
                this.isMoving = true;
                var tween = egret.Tween.get(this);
                tween.to({ x: point.x, y: point.y }, fight.MOVE_TIME);
                tween.call(this.attack, this);
            }
            else {
                this.attack();
            }
        }
        else {
            fight.recordLog("\u6218\u6597\u6B65\u9AA4\u63D0\u524D\u8DF3\u8FC7\u4E86", fight.LOG_FIGHT_WARN);
        }
    };
    p.attack = function () {
        egret.Tween.removeTweens(this);
        this.isMoving = false;
        if (this.curSkill) {
            this.isPlayingAction = true;
            this.body.addEventListener("attack_complete", this.attackComplete, this);
            this.body.attack(this.curSkill);
        }
        else {
            fight.recordLog("\u6218\u6597\u6B65\u9AA4\u63D0\u524D\u8DF3\u8FC7\u4E86", fight.LOG_FIGHT_WARN);
        }
    };
    p.attackComplete = function () {
        this.body.removeEventListener("attack_complete", this.attackComplete, this);
        this.isMoving = false;
        if (this.curSkill) {
            this.isPlayingAction = false;
            if (fight.needRetreat(this.curSkill.action_type)) {
                this.retreat();
            }
            else {
                this.selfInjury();
            }
        }
        else {
            fight.recordLog("\u6218\u6597\u6B65\u9AA4\u63D0\u524D\u8DF3\u8FC7\u4E86", fight.LOG_FIGHT_WARN);
        }
    };
    p.retreat = function () {
        var _this = this;
        var tween = egret.Tween.get(this);
        var point = fight.getRoleInitPoint(this.roleData);
        this.isMoving = true;
        tween.to({ x: point.x, y: point.y }, fight.RETREAT_TIME);
        tween.call(function () {
            _this.selfInjury();
        }, this);
    };
    p.selfInjury = function () {
        this.isMoving = false;
        if (this.reportItem) {
            if (BigNum.greater(this.reportItem.damage || 0, 0)) {
                this.updateRoleHP(this.reportItem.hp, this.reportItem.maxhp);
                this.hit();
            }
            else {
                this.updateRoleHP(this.reportItem.hp, this.reportItem.maxhp);
                this.idle();
            }
        }
        else {
            fight.recordLog("\u81EA\u6B8B\u65F6reportItem\u4E0D\u80FD\u4E3Anull", fight.LOG_FIGHT_WARN);
        }
    };
    p.addBuff = function (item, force) {
        if (force === void 0) { force = false; }
        var isSelf = "target" in item;
        var canAdd = isSelf || force;
        if (canAdd) {
            this.buffIdArr = item.buff.filter(function (value) {
                if (value && Config.BuffData[value])
                    return Config.BuffData[value].id;
            });
            var buffArr = this.buffIdArr || [];
            var keys = Object.keys(this.buffEffMap);
            for (var i = 0; i < buffArr.length; i++) {
                var buffConfig = Config.BuffData[buffArr[i]];
                if (buffConfig) {
                    var type = buffConfig.effect + "";
                    if (!this.buffEffMap[type]) {
                        if (keys.indexOf(type) < 0 && buffConfig.resource && fight.isMCResourceLoaded(buffConfig.resource) && !this.buffEffMap[type]) {
                            var eff = new MCEff(buffConfig.resource, false);
                            var container = this["buffContainer" + buffConfig.point];
                            container.addChild(eff);
                            this.buffEffMap[type] = eff;
                        }
                    }
                }
            }
            var nowBuffIdArr = this.buffIdArr.concat();
            for (var i = 0; i < this.oldBuffIdArr.length; i++) {
                if (this.oldBuffIdArr.indexOf(nowBuffIdArr[i]) >= 0) {
                    nowBuffIdArr.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < nowBuffIdArr.length; i++) {
                var buffConfig = Config.BuffData[nowBuffIdArr[i]];
                if (buffConfig && buffConfig.word && this.fightContainer) {
                    this.fightContainer.flyTxt({
                        str: buffConfig.word,
                        x: this.x,
                        y: this.y + this.roleData.config.modle_height * -1
                    }, fight.FONT_SYSTEM);
                }
            }
            this.oldBuffIdArr = this.buffIdArr.concat();
        }
    };
    p.enterAddBuffs = function (buffs) {
        this.buffIdArr = buffs.concat();
        var buffArr = this.buffIdArr || [];
        var keys = Object.keys(this.buffEffMap);
        for (var i = 0; i < buffArr.length; i++) {
            var buffConfig = Config.BuffData[buffArr[i]];
            if (buffConfig) {
                var type = buffConfig.effect + "";
                if (!this.buffEffMap[type]) {
                    if (keys.indexOf(type) < 0 && buffConfig.resource && fight.isMCResourceLoaded(buffConfig.resource) && !this.buffEffMap[type]) {
                        var eff = new MCEff(buffConfig.resource, false);
                        var container = this["buffContainer" + buffConfig.point];
                        container.addChild(eff);
                        this.buffEffMap[type] = eff;
                    }
                }
            }
        }
    };
    p.nextStep = function () {
        fight.recordLog("\u7B2C" + this.reportItem.index + "\u6B65\u5B8C\u6210", fight.LOG_FIGHT_INFO);
        this.updateRoleHP(this.reportItem.hp, this.reportItem.maxhp);
        this.updateTargets();
        if (this.timeId > -1) {
            egret.clearTimeout(this.timeId);
            this.timeId = -1;
        }
        var round = this.reportItem.round;
        this.body.reset();
        this.curSkill = null;
        this.reportItem = null;
        this.targets = [];
        this.isPlayingDie = false;
        this.dispatchEventWith("role_one_step_complete", true, round);
    };
    p.updateRoleHP = function (cur, max) {
        this.maxHP = max;
        this.curHP = cur;
        this.lifeBar.update(this.curHP, this.maxHP);
        this.dispatchEventWith("role_hp_change", true);
    };
    p.updateTargets = function () {
        if (this.reportItem) {
            var len = this.targets ? this.targets.length : 0;
            for (var i = 0; i < len; i++) {
                var role = this.fightContainer.getRole(this.targets[i]);
                var hitInfo = this.reportItem.target[i];
                if (role) {
                    role.updateRoleHP(hitInfo.hp, hitInfo.maxhp);
                }
            }
        }
    };
    p.addEff = function (dis, part, off) {
        if (part === void 0) { part = 1; }
        if (off === void 0) { off = null; }
        var position = new egret.Point(0, (0 - part) * this.roleData.config.modle_height * 0.5);
        if (off) {
            position.x += off.x;
            position.y += off.y;
        }
        dis.x = position.x;
        dis.y = position.y;
        this.addChild(dis);
    };
    p.startJump = function () {
        if (this.needSkipFrame())
            return;
        if (this.targets && this.targets.length > 0 && this.curSkill) {
            var point = new egret.Point();
            if (this.curSkill.action_type == fight.ATTACK_ACTION_JUMP_AREA) {
                var offPoint = (!!this.curSkill.area_effect_point) ? this.curSkill.area_effect_point.split(",") : [0, 0];
                point.x = fight.AREA_POS[this.roleData.side - 1].x + (Number(offPoint[0]) || 0);
                point.y = fight.AREA_POS[this.roleData.side - 1].y + (Number(offPoint[1]) || 0);
            }
            else {
                point = fight.getNearFightPoint(this, this.targets, this.curSkill);
            }
            var tween = egret.Tween.get(this);
            var frameCount = +this.curSkill.damage_frame - this.curSkill.jump_frame;
            var frameRate = this.body.frameRate;
            var time = frameCount / frameRate * 1000;
            this.isMoving = true;
            this.fightContainer.showMoveDustEff({ x: this.x, y: this.y, side: this.roleData.side });
            tween.to({ x: point.x, y: point.y }, time);
        }
        else {
            fight.recordLog("startJump时,targets没有目标", fight.LOG_FIGHT_WARN);
        }
    };
    p.startDamage = function (index, total) {
        if (this.curSkill) {
            var actionType = this.curSkill.action_type;
            if (actionType == fight.ATTACK_ACTION_AREA) {
                if (!this.needSkipFrame())
                    this.showAreaEff();
            }
            else if (actionType == fight.ATTACK_ACTION_MISSLE) {
                this.showBulletEff();
            }
            else if (actionType == fight.ATTACK_ACTION_BOMB) {
                if (!this.needSkipFrame())
                    this.showBombEff();
            }
            else if (actionType == fight.ATTACK_JUMP_ATTACK2) {
                if (!this.needSkipFrame())
                    this.showWeaponEff();
            }
            else {
                if (!this.needSkipFrame()) {
                    if (fight.isAddHPSkill(this.curSkill)) {
                        this.showAddHPEff();
                    }
                    else {
                        this.fightContainer.startShake(this.curSkill.shake_type);
                        this.showHitEff(index, total);
                    }
                }
            }
        }
        else {
            fight.recordLog("\u4F24\u5BB3\u65F6\u6280\u80FD\u4E0D\u80FD\u4E3A\u7A7A", fight.LOG_FIGHT_WARN);
        }
    };
    p.showWeaponEff = function () {
        var _this = this;
        if (this.checkDamageEff()) {
            this.isPlayingDamage = true;
            var damageEff = new MCEff(this.curSkill.scource_effect);
            var frameArr = String(this.curSkill.effect_damage_frame || "").split(",");
            var total_1 = frameArr.length;
            var current_1 = 0;
            for (var i = 0; i < total_1; i++) {
                damageEff.registerBack(+frameArr[i], function () {
                    if (_this.curSkill) {
                        current_1++;
                        _this.isPlayingDamage = current_1 < total_1;
                        fight.recordLog("\u663E\u793Aweapon\u6548\u679C" + current_1 + "-" + total_1, fight.LOG_FIGHT_INFO);
                        _this.fightContainer.startShake(_this.curSkill.shake_type);
                        _this.showHitEff(current_1, total_1);
                    }
                    else {
                        fight.recordLog("\u8FD0\u884Cweapon\u65F6curSkill\u4E3Anull", fight.LOG_FIGHT_WARN);
                    }
                }, this);
            }
            damageEff.x = this.x;
            damageEff.y = this.y;
            this.fightContainer.showAreaEff(damageEff, this);
        }
    };
    p.showAreaEff = function () {
        var _this = this;
        if (this.checkDamageEff()) {
            var damageEff = new MCEff(this.curSkill.scource_effect);
            var frameArr = String(this.curSkill.effect_damage_frame || "").split(",");
            var total_2 = frameArr.length;
            var current_2 = 0;
            this.isPlayingDamage = total_2 > 0;
            damageEff.setMaxExistTime(2000);
            for (var i = 0; i < total_2; i++) {
                damageEff.registerBack(+frameArr[i], function () {
                    current_2++;
                    _this.isPlayingDamage = current_2 < total_2;
                    if (_this.curSkill) {
                        fight.recordLog("\u663E\u793Aarea\u6548\u679C" + current_2 + "-" + total_2, fight.LOG_FIGHT_INFO);
                        _this.fightContainer.startShake(_this.curSkill.shake_type);
                        _this.showHitEff(current_2, total_2);
                    }
                    else {
                        fight.recordLog("\u8FD0\u884CshowArea\u65F6curSkill\u4E3Anull", fight.LOG_FIGHT_WARN);
                    }
                }, this);
            }
            var offPoint = (!!this.curSkill.area_effect_point) ? this.curSkill.area_effect_point.split(",") : [0, 0];
            damageEff.x = fight.AREA_POS[this.roleData.side - 1].x + (Number(offPoint[0]) || 0);
            damageEff.y = fight.AREA_POS[this.roleData.side - 1].y + (Number(offPoint[1]) || 0);
            this.fightContainer.showAreaEff(damageEff, this);
        }
    };
    p.showBulletEff = function () {
        if (this.checkDamageEff()) {
            var len_1 = this.targets.length;
            var delay = 0;
            var self_1 = this;
            var damageEffSource_1 = this.curSkill.scource_effect;
            var damageEffSourceArr = (this.curSkill.scource_effect).split(",");
            var damageFrameArr_1 = String(this.curSkill.damage_frame).split(",");
            var bulletCount_1 = +damageEffSourceArr[1] || 1;
            this.isPlayingDamage = true;
            function attack() {
                var _loop_1 = function(i) {
                    var target = self_1.targets[i];
                    var fightRole = self_1.fightContainer.getRole(self_1.targets[i]);
                    var tox = target.x;
                    var toy = target.y - target.height * 0.5;
                    var offPoint = self_1.curSkill.shoot_point || [0, 0];
                    var scaleX = self_1.side == FightSideEnum.LEFT_SIDE ? -1 : 1;
                    var initX = self_1.x - scaleX * (Number(offPoint[0]) || 0);
                    var initY = self_1.y - self_1.roleData.config.modle_height * 0.5 + (Number(offPoint[1]) || 0);
                    var rotate = Math.atan2(toy - initY, tox - initX) * 180 / Math.PI + ((scaleX == 1) ? 180 : 0);
                    var damageEff = new BaseMCEffect(damageEffSource_1, null, false, scaleX);
                    damageEff.rotation = rotate;
                    self_1.fightContainer.showDamageEff(damageEff);
                    damageEff.x = initX;
                    damageEff.y = initY;
                    var time = self_1.curSkill.missle_time * 1000 * MathUtil.pointDistance(new egret.Point(tox, toy), new egret.Point(initX, initY)) / 100;
                    egret.Tween.get(damageEff).to({ x: tox, y: toy }, time, fight.bulletEase(time)).call(function () {
                        damageEff.dispose();
                        if (self_1.curSkill) {
                            self_1.firedHitMap[target.pos] = (self_1.firedHitMap[target.pos] || 0) + 1;
                            self_1.fightContainer.startShake(self_1.curSkill.shake_type);
                            self_1.showHitEff(self_1.firedHitMap[target.pos], bulletCount_1 * damageFrameArr_1.length, fightRole);
                            self_1.firedBulletCount++;
                            self_1.isPlayingDamage = self_1.firedBulletCount < len_1 * bulletCount_1 * damageFrameArr_1.length;
                            fight.recordLog("\u663E\u793A\u5B50\u5F39\u6548\u679C" + fight.getRolePosDes(target) + " " + self_1.firedBulletCount + "-" + len_1 * bulletCount_1 * damageFrameArr_1.length, fight.LOG_FIGHT_INFO);
                        }
                        else {
                            fight.recordLog("\u8FD0\u884CshowBullet\u65F6curSkill\u4E3Anull", fight.LOG_FIGHT_WARN);
                        }
                    });
                };
                for (var i = 0; i < len_1; i++) {
                    _loop_1(i);
                }
            }
            for (var i = 0; i < bulletCount_1; i++) {
                egret.setTimeout(attack, this, delay, []);
                delay += fight.BULLET_RUN_DELAY_TIME;
            }
        }
    };
    p.showBombEff = function () {
        var _this = this;
        if (this.checkDamageEff()) {
            var total = this.targets.length;
            var frame = +(this.curSkill.effect_damage_frame);
            var _loop_2 = function(i) {
                var fightRole = this_1.fightContainer.getRole(this_1.targets[i]);
                if (fightRole) {
                    var damageEff = new MCEff(this_1.curSkill.scource_effect);
                    fightRole.isPlayingDamage = true;
                    damageEff.registerBack(frame, function () {
                        if (_this.curSkill) {
                            _this.fightContainer.startShake(_this.curSkill.shake_type);
                        }
                        fightRole.isPlayingDamage = false;
                        _this.showHitEff();
                    }, this_1);
                    fightRole.addEff(damageEff);
                }
            };
            var this_1 = this;
            for (var i = 0; i < total; i++) {
                _loop_2(i);
            }
        }
    };
    p.showAddHPEff = function () {
        var _this = this;
        if (this.curSkill) {
            var total = this.targets.length;
            if (this.curSkill.target_effect) {
                var current_3 = 0;
                var total_3 = this.targets.length;
                this.isPlayingDamage = total_3 > 0;
                var _loop_3 = function(i) {
                    var target = this_2.targets[i];
                    var fightRole = this_2.fightContainer.getRole(target);
                    if (fightRole) {
                        var targetEffArr = String(this_2.curSkill.target_effect).split(",");
                        var eff = new MCEff(targetEffArr[0]);
                        eff.y = (targetEffArr[1] === undefined ? 0 : +targetEffArr[1]) * -0.5 * target.height;
                        eff.registerBack(0, function (index) {
                            current_3++;
                            _this.isPlayingDamage = current_3 < total_3;
                            var target = _this.targets[index];
                            if (_this.reportItem) {
                                var off = BigNum.sub(_this.reportItem.target[index].hp, fightRole.roleData.curHP);
                                if (BigNum.greater(off, 0)) {
                                    _this.fightContainer.flyTxt({
                                        str: MathUtil.easyNumber(off),
                                        x: target.x,
                                        y: target.y + target.height * -1
                                    }, fight.FONT_ADD_HP);
                                }
                                fightRole.updateRoleHP(_this.reportItem.target[i].hp, _this.reportItem.target[i].maxhp);
                            }
                            else {
                                fight.recordLog("\u52A0\u8840\u5B58\u5728\u95EE\u9898", fight.LOG_FIGHT_WARN);
                            }
                            fight.recordLog("\u663E\u793A\u52A0\u8840\u6548\u679C" + current_3 + "-" + total_3, fight.LOG_FIGHT_INFO);
                        }, this_2, i);
                        fightRole.addChild(eff);
                    }
                    else {
                        current_3++;
                        this_2.isPlayingDamage = current_3 < total_3;
                    }
                };
                var this_2 = this;
                for (var i = 0; i < total_3; i++) {
                    _loop_3(i);
                }
            }
            else {
                fight.recordLog(this.curSkill.id + "\u6CA1\u914D\u7F6Etarget_effect", fight.LOG_FIGHT_WARN);
            }
        }
        else {
            fight.recordLog("\u8FD0\u884CshowAddHP\u65F6curSkill\u4E3Anull", fight.LOG_FIGHT_WARN);
        }
    };
    p.showHitEff = function (index, total, role) {
        if (index === void 0) { index = 1; }
        if (total === void 0) { total = 1; }
        if (role === void 0) { role = null; }
        if (this.targets.length > 0) {
            fight.playSound(this.curSkill.target_sound);
        }
        for (var i = 0; i < this.targets.length; i++) {
            var target = this.targets[i];
            var fightRole = this.fightContainer.getRole(target);
            if (fightRole && (!role || fightRole == role)) {
                var hitInfo = this.reportItem.target[i];
                fightRole.addBuff(hitInfo, true);
                var damage = BigNum.mul(hitInfo.damage, 1 / total);
                var damageNum = MathUtil.easyNumber(damage);
                if (this.curSkill.target_effect_normal) {
                    var eff = new MCEff("hit_normal");
                    eff.y = target.y + (target.height) * -0.5;
                    eff.x = target.x;
                    this.fightContainer.showDamageEff(eff, fightRole);
                }
                if (this.curSkill.target_effect) {
                    var targetEffectArr = String(this.curSkill.target_effect).split(",");
                    var targetEffSource = targetEffectArr[0];
                    var targetEffPos = (targetEffectArr[1] === undefined) ? 1 : +targetEffectArr[1];
                    var eff = new MCEff(targetEffSource);
                    eff.y = target.y + (target.height * targetEffPos * -0.5);
                    eff.x = target.x;
                    this.fightContainer.showDamageEff(eff, fightRole);
                }
                if (hitInfo.dodge) {
                    this.fightContainer.flyTxt({
                        str: "闪避",
                        x: target.x,
                        y: target.y + target.height * -1
                    }, fight.FONT_SYSTEM);
                }
                else {
                    if (hitInfo.block) {
                        fightRole.block();
                    }
                    else {
                        fightRole.hit();
                    }
                    if (parseFloat(damageNum) > 0) {
                        if (this.curSkill.damage_type == "physical") {
                            this.fightContainer.flyTxt({
                                str: damageNum,
                                x: target.x,
                                y: target.y + target.height * -1,
                                scale: this.reportItem.cri ? 1.5 : 1
                            }, fight.FONT_PHYSICAL_DAMAGE);
                        }
                        else {
                            this.fightContainer.flyTxt({
                                str: damageNum,
                                x: target.x,
                                y: target.y + target.height * -1,
                                scale: this.reportItem.cri ? 1.5 : 1
                            }, fight.FONT_MAGICAL_DAMAGE);
                        }
                    }
                    else {
                        if (FightRoleVO.isInvincible(hitInfo.buff)) {
                            this.fightContainer.flyTxt({
                                str: "免伤",
                                x: target.x,
                                y: target.y + this.roleData.config.modle_height * -1
                            }, fight.FONT_SYSTEM);
                        }
                        else if (FightRoleVO.freeMacAtk(hitInfo.buff)) {
                            this.fightContainer.flyTxt({
                                str: "魔免",
                                x: target.x,
                                y: target.y + this.roleData.config.modle_height * -1
                            }, fight.FONT_SYSTEM);
                        }
                        else if (FightRoleVO.freePhyAtk(hitInfo.buff)) {
                            this.fightContainer.flyTxt({
                                str: "物免",
                                x: target.x,
                                y: target.y + this.roleData.config.modle_height * -1
                            }, fight.FONT_SYSTEM);
                        }
                        else {
                            if (this.curSkill.damage_type == "physical") {
                                damage = BigNum.max(BigNum.div(this.reportItem.phyAtk, 1000), 1);
                                damageNum = MathUtil.easyNumber(damage);
                                this.fightContainer.flyTxt({
                                    str: damageNum,
                                    x: target.x,
                                    y: target.y + target.height * -1,
                                    scale: this.reportItem.cri ? 1.5 : 1
                                }, fight.FONT_PHYSICAL_DAMAGE);
                            }
                            else {
                                damage = BigNum.max(BigNum.div(this.reportItem.magAtk, 1000), 1);
                                damageNum = MathUtil.easyNumber(damage);
                                this.fightContainer.flyTxt({
                                    str: damageNum,
                                    x: target.x,
                                    y: target.y + target.height * -1,
                                    scale: this.reportItem.cri ? 1.5 : 1
                                }, fight.FONT_MAGICAL_DAMAGE);
                            }
                        }
                    }
                }
                if (index >= total) {
                    fightRole.updateRoleHP(hitInfo.hp, hitInfo.maxhp);
                }
                else {
                    fightRole.updateRoleHP(BigNum.add(hitInfo.hp, BigNum.mul((total - index) / total, damage)), hitInfo.maxhp);
                }
            }
        }
    };
    p.onEnterFrame = function (e) {
        var frame = e.data;
        if (this.curSkill && frame > 0) {
            if (this.curSkill && frame == this.curSkill.scource_sound_frame) {
                fight.playSound(this.curSkill.scource_sound);
            }
            if (this.curSkill.damage_frame)
                if (this.curSkill.jump_frame == frame) {
                    if (!this.needSkipFrame())
                        this.startJump();
                }
                else {
                    var damageFrame = this.curSkill.damage_frame + "";
                    if (damageFrame.indexOf(",") > -1) {
                        var frames_1 = damageFrame.split(",");
                        for (var i = 0; i < frames_1.length; i++) {
                            if (+frames_1[i] == frame) {
                                this.startDamage(i + 1, frames_1.length);
                            }
                        }
                    }
                    else {
                        if (+this.curSkill.damage_frame == frame) {
                            this.startDamage(1, 1);
                        }
                    }
                }
        }
        else {
            fight.recordLog("\u89D2\u8272onEnterFrame\u65F6,\u6280\u80FD\u4E3A\u7A7A", fight.LOG_FIGHT_WARN);
        }
    };
    p.onTick = function (timeStamp) {
        if (this.curSkill) {
            this.checkNextStep();
        }
        // this.checkBuff();
        this.checkDie();
        return false;
    };
    p.checkBuff = function (buffs) {
        var keys = Object.keys(this.buffEffMap);
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            var type = keys[i];
            var exist = false;
            var __buffs = buffs || this.buffIdArr;
            for (var j = 0; j < __buffs.length; j++) {
                var buffConfig = Config.BuffData[__buffs[j]];
                if (buffConfig.effect == type) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                var eff = this.buffEffMap[type];
                if (eff) {
                    eff.dispose();
                }
                else {
                    fight.recordLog("buff可能出错了", fight.LOG_FIGHT_WARN);
                }
                delete this.buffEffMap[type];
                len--;
                i--;
            }
        }
    };
    p.checkDie = function () {
        if (BigNum.greater(fight.DIE_HP, this.roleData.curHP)) {
            if (this.parent && !this.isPlayingDie) {
                this.isPlayingDie = true;
                this.isPlayingDamage = false;
                this.isCanMoveRole = false;
                var dieEff = new RoleDieEff();
                this.lifeBar.setProgress(0, true);
                dieEff.scaleX = this.side == FightSideEnum.RIGHT_SIDE ? -1 : 1;
                dieEff.x = this.x;
                dieEff.y = this.y;
                this.fightContainer.showDamageEff(dieEff);
                if (this.curSkill) {
                    this.isCanMoveRole = true;
                    this.visible = false;
                }
                else {
                    this.dispatchEventWith("role_die", true, this);
                }
            }
        }
    };
    p.checkNextStep = function () {
        if (this.reportItem && this.reportItem.vertigo) {
            if (this.waiting) {
                this.nextStep();
            }
        }
        else {
            if (this.targets && this.targets.length > 0) {
                var oneStepComplete = this.waiting && !this.isMoving && this.body.isTriggerAtk;
                for (var i = 0; i < this.targets.length; i++) {
                    var fightRole = this.fightContainer.getRole(this.targets[i]);
                    oneStepComplete = (oneStepComplete && (!fightRole || (fightRole.waiting)));
                }
                if (oneStepComplete && !this.isPlayingAction) {
                    if (!this.isPlayingDamage) {
                        this.nextStep();
                    }
                }
            }
        }
    };
    p.checkDamageEff = function () {
        var result = true;
        if (!this.curSkill || !this.curSkill.scource_effect) {
            fight.recordLog("\u6280\u80FD" + this.curSkill.id + "\u8D44\u6E90source_effect\u6CA1\u914D\u7F6E", fight.LOG_FIGHT_WARN);
            result = false;
        }
        return result;
    };
    p.dispose = function () {
        this.reportItem = null;
        this.isPlayingDie = false;
        this.targets = [];
        while (this.effContainer.numChildren) {
            this.effContainer.removeChildAt(0);
        }
        for (var i = 0; i < 3; i++) {
            var container = this["buffContainer" + i];
            while (container.numChildren) {
                var mcEff = container.removeChildAt(0);
                if (mcEff && "dispose" in mcEff) {
                    mcEff.dispose();
                }
            }
        }
        this.buffIdArr = [];
        this.buffEffMap = {};
        this.oldBuffIdArr = [];
        this.lifeBar.reset();
        if (this.haloEff) {
            this.haloEff.stop();
        }
        this.removeEventListener("enter_frame", this.onEnterFrame, this, true);
        egret.stopTick(this.onTick, this);
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.fightContainer = null;
        egret.Tween.removeTweens(this);
        FightRoleFactory.freeRole(this);
    };
    // 是否需要补帧
    p.needSkipFrame = function () {
        return this.body.isTriggerAtk && this.isPlayingAction == false;
    };
    // ------------------------------------------get/set方法------------------------------------------
    p.idle = function () {
        this.body.idle();
    };
    p.hit = function () {
        this.body.hit();
    };
    p.block = function () {
        this.body.block();
    };
    d(p, "waiting"
        ,function () {
            return this.body.waiting;
        }
    );
    d(p, "curHP"
        ,function () {
            return this.roleData.curHP;
        }
        ,function (value) {
            this.roleData.curHP = value;
        }
    );
    d(p, "maxHP"
        ,function () {
            return this.roleData.maxHP;
        }
        ,function (value) {
            this.roleData.maxHP = value;
        }
    );
    d(p, "side"
        ,function () {
            return this.roleData.side;
        }
    );
    d(p, "pos"
        ,function () {
            return this.roleData.pos;
        }
    );
    d(p, "id"
        ,function () {
            return this.roleData.id;
        }
    );
    d(p, "zIndex"
        ,function () {
            return this._zIndex;
        }
        ,function (value) {
            this._zIndex = value;
        }
    );
    FightRole.createMovieClip = function (name) {
        if (FightRole.inst == null) {
            FightRole.inst = new egret.MovieClipDataFactory();
        }
        var dataRes = RES.getRes(name + "_json");
        var textureRes = RES.getRes(name + "_png");
        FightRole.inst.mcDataSet = dataRes;
        FightRole.inst.texture = textureRes;
        return new egret.MovieClip(FightRole.inst.generateMovieClipData(name));
    };
    return FightRole;
}(egret.DisplayObjectContainer));
egret.registerClass(FightRole,'FightRole');
