/**
 * 战斗角色
 * Created by hh on 2017/2/7.
 */
var FightRole = (function (_super) {
    __extends(FightRole, _super);
    function FightRole(fightContainer, roleData) {
        _super.call(this);
        // 攻击或伤害时使用的技能
        this.curSkill = null;
        // 战斗信息
        this.reportItem = null;
        // 目标对象
        this.targets = null;
        // 正在播放死亡效果
        this.isPlayingDie = false;
        // 是否角色正在播放额外特效
        this.isPlayingExtraEff = false;
        // 角色所在的容器
        this.fightContainer = null;
        // 血条
        this.lifeBar = null;
        // 角色显示对象
        this.body = null;
        // 作用于身体脚下的buff容器
        this.buffContainer0 = null;
        // 作用于身体中间的buff容器
        this.buffContainer1 = null;
        // 作用于身体头部的buff容器
        this.buffContainer2 = null;
        // 除buff外的效果容器
        this.effContainer = null;
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
        this.lifeBar = new RoleHPBar(fight.needFlipped((roleData.pos)));
        this.addChild(this.lifeBar);
        this.skillAction = new SkillAction(this);
        this.buffAction = new BuffAction(this);
        this.active(fightContainer, roleData);
    }
    var d = __define,c=FightRole,p=c.prototype;
    p.active = function (fightContainer, roleData) {
        this.visible = true;
        this.fightContainer = fightContainer;
        this._pos = roleData.pos;
        this._config = Config.HeroData[roleData.id] || Config.EnemyData[roleData.id];
        this.updateRoleUI();
        this.idle();
    };
    p.updateRoleUI = function () {
        this.body.reset();
        this.skillAction.reset();
        this.buffAction.reset();
        this.isPlayingDie = false;
        this.isPlayingExtraEff = false;
        var point = this.initPoint;
        this.x = point.x;
        this.y = point.y;
        var shadowScaleSize = this.config.modle_height / 100;
        this.shadowBitmap.scaleX = this.shadowBitmap.scaleY = shadowScaleSize;
        this.shadowBitmap.y = fight.ROLE_SHADOW_OFF * shadowScaleSize;
        this.shadowBitmap.x = this.shadowBitmap.width * -0.5 * shadowScaleSize;
        if (this.haloEff) {
            this.haloEff.start();
        }
        this.body.flipped = fight.needFlipped(this.pos);
        this.body.active();
        this.buffContainer1.y = -0.5 * this.config.modle_height / 100;
        this.buffContainer2.y = -this.config.modle_height / 100;
        var hp_width = 62;
        var hp_height = 8;
        this.lifeBar.x = hp_width * -0.5;
        this.lifeBar.y = -(this.config.modle_height) - hp_height - 2;
        this.lifeBar.active(fight.needFlipped(this.pos));
    };
    /**
     * 攻击目标
     * @param data  战斗报告
     * @param delay 延迟
     */
    p.fight = function (data, delay) {
        var _this = this;
        egret.setTimeout(function () {
            _this.reportItem = data;
            var items = data.target;
            _this.updateRoleHP(BigNum.add(data.hp, data.damage || 0), data.maxhp);
            _this.buffAction.addBuff(data);
            _this.targets = [];
            _this.buffAction.checkBuff(data.buff);
            _this.body.reset();
            for (var i = 0; i < items.length; i++) {
                var role = _this.fightContainer.getRoleByPos(items[i].pos);
                if (role)
                    role.buffAction.checkBuff(items[i].buff);
                var id = items[i].id;
                var pos = +items[i].pos;
                _this.targets.push({ id: id, pos: pos });
            }
            var skillId = _this.reportItem.skillId;
            _this.curSkill = Config.SkillData[skillId];
            fight.recordLog("\u7B2C" + _this.reportItem.index + "\u6B65 \u89D2\u8272:" + _this.reportItem.id + " \u4F4D\u7F6E:" + _this.reportItem.pos + " \u5F00\u59CB" + _this.curSkill.action_type, fight.LOG_FIGHT_INFO);
            _this.skillAction.preAttack(_this.curSkill, _this.targets, _this.reportItem.buff, _this.reportItem.damage);
        }, this, delay);
    };
    /**
     * 射击目标
     */
    p.fireTargets = function (targets, cur, total) {
        var _this = this;
        if (cur === void 0) { cur = 1; }
        if (total === void 0) { total = 1; }
        var len = this.targets.length;
        var damageEffSource = this.curSkill.scource_effect;
        var index = 0;
        var offPoint = this.curSkill.shoot_point || [0, 0];
        var scaleX = this.getScaleX();
        var initX = this.x - scaleX * (Number(offPoint[0]) || 0);
        var initY = this.y - this.config.modle_height * 0.5 + (Number(offPoint[1]) || 0);
        var _loop_1 = function(i) {
            var target = targets[i];
            var point = this_1.initPoint;
            var tox = point.x;
            var toy = point.y - fight.getRoleHeight(target.id) * 0.5;
            var scaleX_1 = fight.needFlipped(target.pos) ? -1 : 1;
            var rotate = Math.atan2(toy - initY, tox - initX) * 180 / Math.PI + ((scaleX_1 == 1) ? 180 : 0);
            var damageEff = new MCEff(damageEffSource, false, scaleX_1);
            damageEff.rotation = rotate;
            damageEff.x = initX;
            damageEff.y = initY;
            this_1.fightContainer.showDamageEff(damageEff);
            var time = this_1.curSkill.missle_time * 1000 * MathUtil.pointDistance(new egret.Point(tox, toy), new egret.Point(initX, initY)) / 100;
            egret.Tween.get(damageEff).to({ x: tox, y: toy }, time, fight.bulletEase(time)).call(function () {
                damageEff.dispose();
                index++;
                _this.isPlayingExtraEff = index < len;
                _this.startDamage(index, len, target, cur / total);
                if (_this.curSkill) {
                    _this.fightContainer.startShake(_this.curSkill.shake_type);
                }
            }, this_1);
        };
        var this_1 = this;
        for (var i = 0; i < len; i++) {
            _loop_1(i);
        }
    };
    /**
     * 加血
     */
    p.addHP = function () {
        var _this = this;
        if (this.curSkill) {
            var total = this.targets.length;
            if (this.curSkill.target_effect) {
                var current_1 = 0;
                var total_1 = this.targets.length;
                this.isPlayingExtraEff = true;
                var _loop_2 = function(i) {
                    var target = this_2.targets[i];
                    var fightRole = this_2.fightContainer.getRoleByPos(target.pos);
                    if (fightRole) {
                        var eff = new MCEff(this_2.curSkill.target_effect);
                        eff.registerBack(0, function (index) {
                            current_1++;
                            _this.isPlayingExtraEff = current_1 < total_1;
                            var target = _this.targets[index];
                            if (_this.reportItem) {
                                var off = BigNum.sub(_this.reportItem.target[index].hp, fightRole.curHP);
                                if (BigNum.greater(off, 0)) {
                                    var point = fight.getRoleInitPoint(target.pos);
                                    var model_height = fight.getRoleHeight(target.id);
                                    _this.fightContainer.flyTxt({
                                        str: MathUtil.easyNumber(off),
                                        x: point.x,
                                        y: point.y + model_height * -1
                                    }, fight.FONT_ADD_HP);
                                }
                                fightRole.updateRoleHP(_this.reportItem.target[i].hp, _this.reportItem.target[i].maxhp);
                            }
                            else {
                                fight.recordLog("\u52A0\u8840\u5B58\u5728\u95EE\u9898", fight.LOG_FIGHT_WARN);
                            }
                            fight.recordLog("\u663E\u793A\u52A0\u8840\u6548\u679C" + current_1 + "-" + total_1, fight.LOG_FIGHT_INFO);
                        }, this_2, i);
                        fightRole.addChild(eff);
                    }
                    else {
                        current_1++;
                        this_2.isPlayingExtraEff = current_1 < total_1;
                    }
                };
                var this_2 = this;
                for (var i = 0; i < total_1; i++) {
                    _loop_2(i);
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
                var role = this.fightContainer.getRoleByPos(this.targets[i].pos);
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
        var position = new egret.Point(0, (0 - part) * this.config.modle_height * 0.5);
        if (off) {
            position.x += off.x;
            position.y += off.y;
        }
        dis.x = position.x;
        dis.y = position.y;
        this.addChild(dis);
    };
    p.addAreaEff = function (mc, flip) {
    };
    p.addContainerEff = function (mc, flip) {
    };
    p.flyTxt = function (str, name) {
    };
    p.startDamage = function (index, total, role, ratio) {
        if (index === void 0) { index = 1; }
        if (total === void 0) { total = 1; }
        if (role === void 0) { role = null; }
        if (ratio === void 0) { ratio = 1; }
        if (this.targets.length > 0) {
            fight.playSound(this.curSkill.target_sound);
        }
        for (var i = 0; i < this.targets.length; i++) {
            var target = this.targets[i];
            var fightRole = this.getRoleByPos(target.pos);
            if (fightRole) {
                var point = fightRole.initPoint;
                var model_height = fightRole.config.modle_height;
                if (!role || (target.id == role.id && target.pos == role.pos)) {
                    var hitInfo = this.reportItem.target[i];
                    var damage = BigNum.mul(hitInfo.damage, 1 / total);
                    var damageNum = MathUtil.easyNumber(damage);
                    if (this.curSkill.target_effect_normal) {
                        var eff = new MCEff("hit_normal");
                        eff.y = point.y + (model_height) * -0.5;
                        eff.x = point.x;
                        eff.scaleX = this.getScaleX();
                        this.fightContainer.showDamageEff(eff);
                    }
                    if (this.curSkill.target_effect) {
                        var eff = new MCEff(this.curSkill.target_effect);
                        eff.y = point.y + (model_height) * -0.5;
                        eff.x = point.x;
                        eff.scaleX = this.getScaleX();
                        this.fightContainer.showDamageEff(eff);
                    }
                    if (hitInfo.dodge) {
                        this.fightContainer.flyTxt({
                            str: "闪避",
                            x: point.x,
                            y: point.y + model_height * -1
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
                                    x: point.x,
                                    y: point.y + model_height * -1,
                                    scale: this.reportItem.cri ? 1.5 : 1
                                }, fight.FONT_PHYSICAL_DAMAGE);
                            }
                            else {
                                this.fightContainer.flyTxt({
                                    str: damageNum,
                                    x: point.x,
                                    y: point.y + model_height * -1,
                                    scale: this.reportItem.cri ? 1.5 : 1
                                }, fight.FONT_MAGICAL_DAMAGE);
                            }
                        }
                        else {
                            if (FightRoleVO.isInvincible(hitInfo.buff)) {
                                this.fightContainer.flyTxt({
                                    str: "免伤",
                                    x: point.x,
                                    y: point.y + model_height * -1
                                }, fight.FONT_SYSTEM);
                            }
                            else if (FightRoleVO.freeMacAtk(hitInfo.buff)) {
                                this.fightContainer.flyTxt({
                                    str: "魔免",
                                    x: point.x,
                                    y: point.y + model_height * -1
                                }, fight.FONT_SYSTEM);
                            }
                            else if (FightRoleVO.freePhyAtk(hitInfo.buff)) {
                                this.fightContainer.flyTxt({
                                    str: "物免",
                                    x: point.x,
                                    y: point.y + model_height * -1
                                }, fight.FONT_SYSTEM);
                            }
                            else {
                                if (this.curSkill.damage_type == "physical") {
                                    damage = BigNum.max(BigNum.div(this.reportItem.phyAtk, 1000), 1);
                                    damageNum = MathUtil.easyNumber(damage);
                                    this.fightContainer.flyTxt({
                                        str: damageNum,
                                        x: point.x,
                                        y: point.y + model_height * -1,
                                        scale: this.reportItem.cri ? 1.5 : 1
                                    }, fight.FONT_PHYSICAL_DAMAGE);
                                }
                                else {
                                    damage = BigNum.max(BigNum.div(this.reportItem.magAtk, 1000), 1);
                                    damageNum = MathUtil.easyNumber(damage);
                                    this.fightContainer.flyTxt({
                                        str: damageNum,
                                        x: point.x,
                                        y: point.y + model_height * -1,
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
                        fightRole.updateRoleHP(BigNum.add(hitInfo.hp, BigNum.mul((total - index) / total * ratio, damage)), hitInfo.maxhp);
                    }
                }
            }
        }
    };
    p.onTick = function () {
        if (this.curSkill) {
            this.checkNextStep();
        }
        this.buffAction.checkBuff();
        this.checkDie();
    };
    p.checkDie = function () {
        if (this.parent && !this.isPlayingDie && this.curHP) {
            if (BigNum.greater(fight.DIE_HP, this.curHP)) {
                this.isPlayingDie = true;
                var dieEff = new RoleDieEff();
                this.lifeBar.setProgress(0);
                dieEff.scaleX = this.side == FightSideEnum.RIGHT_SIDE ? -1 : 1;
                dieEff.x = this.x;
                dieEff.y = this.y;
                this.fightContainer.showDamageEff(dieEff);
                if (this.curSkill) {
                    this.visible = false;
                }
                else {
                    this.dispatchEventWith("role_die", true, this);
                }
            }
        }
    };
    p.checkNextStep = function () {
        if (!FightRoleVO.canAction(this.reportItem.buff)) {
            if (this.waiting) {
                this.nextStep();
            }
        }
        else {
            if (this.targets && this.targets.length > 0) {
                var oneStepComplete = this.waiting && this.skillAction.isActionComplete && !this.isPlayingExtraEff;
                for (var i = 0; i < this.targets.length; i++) {
                    var fightRole = this.fightContainer.getRoleByPos(this.targets[i].pos);
                    oneStepComplete = (oneStepComplete && (!fightRole || (fightRole.waiting)));
                }
                if (oneStepComplete) {
                    this.nextStep();
                }
            }
        }
    };
    p.nextStep = function () {
        fight.recordLog("\u7B2C" + this.reportItem.index + "\u6B65\u5B8C\u6210", fight.LOG_FIGHT_INFO);
        this.updateRoleHP(this.reportItem.hp, this.reportItem.maxhp);
        this.updateTargets();
        var round = this.reportItem.round;
        this.curSkill = null;
        this.reportItem = null;
        this.targets = [];
        this.dispatchEventWith("role_one_step_complete", true, round);
    };
    p.dispose = function () {
        while (this.effContainer.numChildren) {
            var mcEff = this.effContainer.removeChildAt(0);
            if ("dispose" in mcEff) {
                mcEff.dispose();
            }
            mcEff = null;
        }
        for (var i = 0; i < 3; i++) {
            var container = this["buffContainer" + i];
            while (container.numChildren) {
                var mcEff = container.removeChildAt(0);
                if (mcEff && "dispose" in mcEff) {
                    mcEff.dispose();
                }
                mcEff = null;
            }
        }
        this.lifeBar.reset();
        if (this.haloEff) {
            this.haloEff.stop();
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.visible = true;
        this.fightContainer = null;
        egret.Tween.removeTweens(this);
        FightRoleFactory.freeRole(this);
    };
    // ------------------------------------------角色行为方法--------------------------------------------
    p.idle = function () {
        this.body.idle();
    };
    p.attack = function (skill) {
        this.body.attack(skill);
    };
    p.hit = function () {
        this.body.hit();
    };
    p.block = function () {
        this.body.block();
    };
    //------------------------------------------------------------------------------------------------------
    p.getScaleX = function () {
        return fight.needFlipped(this.pos) ? -1 : 1;
    };
    p.getRoleByPos = function (info) {
        var pos;
        if (typeof info == "number" || typeof info == "string") {
            pos = Number(info);
        }
        else if ("pos" in info) {
            pos = Number(info["pos"]);
        }
        return this.fightContainer.getRoleByPos(pos);
    };
    d(p, "id"
        ,function () {
            return this._config.id;
        }
    );
    d(p, "config"
        ,function () {
            return this._config;
        }
    );
    d(p, "pos"
        ,function () {
            return this._pos;
        }
    );
    d(p, "side"
        ,function () {
            return Math.floor(this.pos / 10);
        }
    );
    d(p, "posIndex"
        ,function () {
            return this.pos % 10;
        }
    );
    d(p, "flipped"
        ,function () {
            return Math.floor(this.pos / 10) == FightSideEnum.LEFT_SIDE;
        }
    );
    d(p, "initPoint"
        // 角色初始位置
        ,function () {
            return fight.getRoleInitPoint(this.pos);
        }
    );
    d(p, "frameRate"
        ,function () {
            return this.body.frameRate;
        }
    );
    d(p, "waiting"
        ,function () {
            return this.body.waiting;
        }
    );
    d(p, "curHP"
        ,function () {
            return this._curHP;
        }
        ,function (value) {
            this._curHP = value;
        }
    );
    d(p, "maxHP"
        ,function () {
            return this._maxHP;
        }
        ,function (value) {
            this._maxHP = value;
        }
    );
    return FightRole;
}(egret.DisplayObjectContainer));
egret.registerClass(FightRole,'FightRole');
//# sourceMappingURL=FightRole.js.map