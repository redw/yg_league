/**
 * 处理角色的攻击行为,包括被眩晕和没有target等
 * Created by hh on 17/2/20.
 */
var SkillAction = (function () {
    /**
     * 构造函数
     */
    function SkillAction(fightRole) {
        this._isActionComplete = false;
        // 是否攻击完成
        this.isAttackComplete = false;
        // 额外效果的数量
        this.extraEffCount = 0;
        // 是否触发过跳跃帧(用于校证)
        this.isTriggerJump = false;
        // 是否触发过伤害帧(用于校证)
        this.isTriggerDamage = false;
        // 是否触发过额外效果(用于校证)
        this.isTriggerExtraEff = false;
        this.fightRole = fightRole;
    }
    var d = __define,c=SkillAction,p=c.prototype;
    /**
     * 预攻击目标
     * @param skill     技能信息
     * @param targets   攻击目标
     * @param buffs     所有buff
     * @param damage    自身所受伤害
     */
    p.preAttack = function (skill, targets, buffs, damage) {
        this.reset();
        this.curSkill = skill;
        this.targets = targets;
        this.buffs = buffs;
        this.damage = damage;
        fight.verifyActiveSkill(this.curSkill);
        var vertigo = false;
        var len = buffs ? buffs.length : 0;
        for (var i = 0; i < len; i++) {
            var buffConfig = Config.BuffData[buffs[i]];
            if (buffConfig && buffConfig.effect == BuffTypeEnum.VERTIGO) {
                vertigo = true;
                break;
            }
        }
        if (vertigo) {
            this.postAttackComplete();
        }
        else if (this.targets.length == 0) {
            this.actionComplete();
        }
        else {
            this.fightRole.showSkillName(this.curSkill.skill_name);
            var showInfo = (this.curSkill.skill_free_effect || "").split(",");
            var needMode = !!showInfo[1];
            var source = showInfo[0];
            if (source && source != "0") {
                var eff = new MCEff(source);
                eff.registerBack(0, this.doAction, this, null);
                this.fightRole.showFreeSkillEff(eff, needMode);
            }
            else {
                this.doAction();
            }
        }
    };
    p.doAction = function () {
        var action = this.curSkill.action_type;
        if (fight.needMoveAttack(action)) {
            this.moveAndAttack();
        }
        else {
            this.attack();
        }
    };
    // 移动和攻击
    p.moveAndAttack = function () {
        this.fightRole.dispatchEventWith("start_move", true, { x: this.fightRole.x, y: this.fightRole.y, scaleX: this.fightRole.getScaleX() });
        var point = fight.getNearFightPoint(this.fightRole.pos, this.targets, this.curSkill);
        var tween = egret.Tween.get(this.fightRole);
        tween.to({ x: point.x, y: point.y }, fight.MOVE_TIME);
        tween.call(this.attack, this);
    };
    p.attack = function () {
        this.fightRole.addEventListener("attack_complete", this.onComplete, this, true);
        // this.fightRole.addEventListener("enter_frame", this.onEnterFrame, this, true);
        this.fightRole.attack(this.curSkill);
    };
    // 检测jump和伤害触发帧
    p.onEnterFrame = function (e) {
        var frame = e.data;
        if (frame == this.curSkill.scource_sound_frame) {
            fight.playSound(this.curSkill.scource_sound);
        }
        if (this.curSkill.jump_frame > 0 && fight.checkFrameEquip(frame, this.curSkill.jump_frame, 1) && !this.isTriggerJump) {
            this.isTriggerJump = true;
            this.triggerJump();
        }
        // 如果配多帧伤害,尽量保证最后一帧能触发
        var frames = String(this.curSkill.damage_frame).split(",");
        var len = frames.length;
        for (var i = 0; i < len; i++) {
            if (fight.checkFrameEquip(frame, +frames[i])) {
                if (i == len - 1) {
                    this.isTriggerDamage = true;
                }
                this.doDamageAction(i + 1, len);
                break;
            }
        }
        if (!this.isTriggerDamage && fight.checkFrameEquip(frame, +frames[len - 1], 1)) {
            this.isTriggerDamage = true;
            this.doDamageAction(len, len);
        }
    };
    // 攻击完成
    p.onComplete = function () {
        var _this = this;
        this.isAttackComplete = true;
        this.fightRole.removeEventListener("attack_complete", this.onComplete, this, true);
        // this.fightRole.removeEventListener("enter_frame", this.onEnterFrame, this, true);
        if (fight.needRetreat(this.curSkill.action_type)) {
            var tween = egret.Tween.get(this.fightRole);
            var point = fight.getRoleInitPoint(this.fightRole.pos);
            tween.to({ x: point.x, y: point.y }, fight.RETREAT_TIME);
            tween.call(function () {
                _this.postAttackComplete();
            }, this);
        }
        else {
            this.postAttackComplete();
        }
    };
    p.postAttackComplete = function () {
        if (BigNum.greater(this.damage || 0, 1)) {
            this.fightRole.hit();
        }
        this.checkComplete();
    };
    // 触发跳跃
    p.triggerJump = function () {
        this.fightRole.dispatchEventWith("start_move");
        var point = new egret.Point();
        if (this.curSkill.action_type == fight.ATTACK_ACTION_JUMP_AREA) {
            var offPoint = (!!this.curSkill.area_effect_point) ? this.curSkill.area_effect_point.split(",") : [0, 0];
            var side = this.fightRole.side;
            point.x = fight.AREA_POS[side - 1].x + (Number(offPoint[0]) || 0);
            point.y = fight.AREA_POS[side - 1].y + (Number(offPoint[1]) || 0);
        }
        else {
            point = fight.getNearFightPoint(this.fightRole.pos, this.targets, this.curSkill);
        }
        var tween = egret.Tween.get(this.fightRole);
        var frameCount = +this.curSkill.damage_frame - this.curSkill.jump_frame;
        var frameRate = this.fightRole.frameRate;
        var time = frameCount / frameRate * 1000;
        tween.to({ x: point.x, y: point.y }, time);
    };
    // 处理伤害行为
    p.doDamageAction = function (cur, total) {
        if (this.curSkill.scource_effect) {
            if (fight.isMCResourceLoaded(this.curSkill.scource_effect)) {
                if (this.curSkill.action_type == fight.ATTACK_ACTION_MISSLE) {
                    this.fightRole.fireTargets(this.targets, cur, total);
                }
                else {
                    this.extraEffCount++;
                    var mc = fight.createMovieClip(this.curSkill.scource_effect);
                    if (!this.curSkill.effect_damage_frame || this.curSkill.effect_damage_frame == 1) {
                        this.fightRole.startDamage(1, 1);
                    }
                    else {
                        mc.addEventListener(egret.MovieClipEvent.ENTER_FRAME, this.onEnterFrame1, this);
                    }
                    mc.addEventListener(egret.MovieClipEvent.COMPLETE, this.onComplete1, this);
                    mc.gotoAndPlay(1, 1);
                    if (this.curSkill.action_type == fight.ATTACK_ACTION_BOMB) {
                        this.fightRole.addEff(mc);
                    }
                    if (this.curSkill.action_type == fight.ATTACK_ACTION_AREA) {
                        var offPoint = (!!this.curSkill.area_effect_point) ? this.curSkill.area_effect_point.split(",") : [0, 0];
                        var side = this.fightRole.side;
                        mc.x = fight.AREA_POS[side - 1].x + (Number(offPoint[0]) || 0);
                        mc.y = fight.AREA_POS[side - 1].y + (Number(offPoint[1]) || 0);
                        this.fightRole.addAreaEff(mc, fight.needFlipped(this.fightRole.pos));
                    }
                    if (this.curSkill.action_type == fight.ATTACK_JUMP_ATTACK2) {
                        mc.x = this.fightRole.x;
                        mc.y = this.fightRole.y;
                        this.fightRole.addContainerEff(mc, fight.needFlipped(this.fightRole.pos));
                    }
                }
            }
        }
        else {
            this.fightRole.startDamage(cur, total);
        }
    };
    p.onEnterFrame1 = function (e) {
        var mc = e.target;
        var frame = mc.currentFrame;
        if (this.curSkill.effect_damage_frame) {
            var frames_1 = String(this.curSkill.effect_damage_frame).split(",");
            var len = frames_1.length;
            for (var i = 0; i < len; i++) {
                if (fight.checkFrameEquip(frame, +frames_1[i])) {
                    if (i == len - 1) {
                        this.isTriggerExtraEff = true;
                    }
                    this.fightRole.startDamage(i + 1, len);
                    break;
                }
            }
            if (!this.isTriggerExtraEff && fight.checkFrameEquip(frame, +frames_1[len - 1], 1)) {
                this.isTriggerExtraEff = true;
                this.fightRole.startDamage(len, len);
            }
        }
    };
    p.onComplete1 = function (e) {
        var mc = e.target;
        mc.removeEventListener(egret.MovieClipEvent.ENTER_FRAME, this.onEnterFrame1, this);
        mc.removeEventListener(egret.MovieClipEvent.COMPLETE, this.onComplete1, this);
        this.extraEffCount--;
        this.checkComplete();
    };
    d(p, "isActionComplete"
        ,function () {
            return this._isActionComplete;
        }
    );
    p.checkComplete = function () {
        if (this.isAttackComplete && (this.extraEffCount <= 0)) {
            this.actionComplete();
        }
    };
    p.actionComplete = function () {
        this._isActionComplete = true;
        this.fightRole.dispatchEventWith("skill_action_complete", true);
    };
    p.reset = function () {
        this.isTriggerDamage = false;
        this.isTriggerJump = false;
        this.isTriggerExtraEff = false;
        this._isActionComplete = false;
        this.targets = null;
        this.curSkill = null;
        this.buffs = null;
        this.damage = "0";
        this.extraEffCount = 0;
    };
    p.dispose = function () {
        this.reset();
        this.fightRole = null;
    };
    return SkillAction;
}());
egret.registerClass(SkillAction,'SkillAction');
//# sourceMappingURL=SkillAction.js.map