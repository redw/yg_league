/**
 * 基本的战斗容器
 * Created by hh on 2017/3/7.
 */
var FightContainer = (function (_super) {
    __extends(FightContainer, _super);
    function FightContainer(type) {
        if (type === void 0) { type = FightTypeEnum.PVE; }
        _super.call(this);
        this.type = FightTypeEnum.PVE; // 战斗类型
        this.state = FightStateEnum.Wait; // 战斗状态
        this.oldLifeRatio = -1;
        this.meanWhileStep = 1; // 同时可出战的步数
        this.leftTotalLife = "1"; // 左方总生命
        this.rightTotalLife = "1"; // 右方总生命
        this.fightSteps = []; // 战斗步骤
        this.fightStepsDup = []; // 战斗步骤副本
        this.roles = [Array(fight.ROLE_UP_LIMIT), Array(fight.ROLE_UP_LIMIT)];
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
    var d = __define,c=FightContainer,p=c.prototype;
    // 添加背影
    p.addBackGround = function () {
    };
    // 添加前景
    p.addProspect = function () {
    };
    // 同时出战的数量
    p.getPlayingCount = function () {
        return 1;
    };
    // 添加角色
    p.addRoles = function (elements) {
        this.elements = elements;
    };
    // 显示技能名字效果
    p.showSkillFlyTxt = function (content) {
    };
    // 显示警告效果
    p.showWarnEff = function () {
    };
    // 开始抖动
    p.startShake = function (range) {
    };
    p.addListeners = function () {
        this.addEventListener("role_one_step_complete", this.onOneStepComplete, this, true);
        this.addEventListener("role_die", this.onRoleDie, this, true);
        this.addEventListener("role_hp_change", this.onRoleHPChange, this, true);
    };
    p.fightStart = function (steps) {
        if (!this.elements || this.elements.length <= 0) {
            fight.recordLog("no role data,cannot start", fight.LOG_FIGHT_WARN);
        }
        else {
            if (this.state != FightStateEnum.Fight) {
                this.dispatchEventWith("fight_start", true);
                if (steps) {
                    for (var i = 0; i < steps.length; i++) {
                        steps[i].index = i;
                        var pos = steps[i].pos;
                        var newPos = 0;
                        if ((typeof pos == "string") && pos.indexOf("_") > 0) {
                            var posArr = pos.split("_");
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
    };
    p.forceFightEnd = function () {
        this.fightSteps.length = 0;
    };
    p.fightComplete = function () {
        this.state = FightStateEnum.End;
        egret.setTimeout(function () {
            // this.dispatchEventWith(ContextEvent.FIGHT_END, true);
        }, this, 200);
    };
    p.startStep = function () {
        if (this.fightSteps.length <= 0) {
            this.fightComplete();
        }
        else {
            var count = this.getPlayingCount();
            this.meanWhileStep = count;
            var delayTime = 0;
            while (count--) {
                var data = this.fightSteps.shift();
                var startRole = this.getRoleByPos(data.pos);
                if (startRole) {
                    startRole.fight(data, delayTime);
                }
                else {
                    fight.recordLog("\u7B2C" + data.index + "\u6B65\u51FA\u9519", fight.LOG_FIGHT_WARN);
                }
                delayTime += fight.MEANWHILE_FIGHT_DELAY_TIME;
            }
        }
    };
    p.onOneStepComplete = function () {
        var _this = this;
        this.meanWhileStep--;
        if (this.meanWhileStep <= 0)
            egret.setTimeout(function () {
                _this.startStep();
            }, this, fight.STEP_DELAY_TIME);
    };
    p.onRoleDie = function (e) {
        var role = e.data;
        this.roleDie(role);
    };
    p.roleDie = function (role) {
        var side = role.side - 1;
        var pos = role.pos;
        delete this.roles[side][pos];
        role.dispose();
    };
    p.getRoleByPos = function (pos) {
        var side = fight.getSideByPos(pos) - 1;
        var index = fight.getPosIndexByPos(pos);
        return this.roles[side][index];
    };
    p.getCurTotalLife = function (side) {
        var curLife = "0";
        var roleArr = this.roles[side - 1];
        var len = roleArr ? roleArr.length : 0;
        for (var i = 0; i < len; i++) {
            var role = roleArr[i];
            if (role) {
                curLife = BigNum.add(curLife, role.curHP);
            }
        }
        return curLife;
    };
    p.getTotalLife = function (side) {
        var totalLife = "0";
        var roleArr = this.roles[side - 1];
        var len = roleArr ? roleArr.length : 0;
        for (var i = 0; i < len; i++) {
            var role = roleArr[i];
            if (role) {
                totalLife = BigNum.add(totalLife, role.maxHP);
            }
        }
        return totalLife;
    };
    p.shake = function (range) {
        if (range > 0) {
            if (!this.shakeScreenEff) {
                this.shakeScreenEff = new ShakeScreenEff(this);
            }
            this.shakeScreenEff.startShake(range);
        }
    };
    p.showMoveDustEff = function (value) {
        var eff = new MoveDustEff();
        eff.x = value.x;
        eff.y = value.y;
        this.dustLayer.addChild(eff);
    };
    p.showGrayEff = function () {
        var _this = this;
        this.drawGrayEff();
        this.addEventListener(egret.Event.ENTER_FRAME, this.drawGrayEff, this);
        egret.setTimeout(function () {
            _this.removeEventListener(egret.Event.ENTER_FRAME, _this.drawGrayEff, _this);
            _this.grayLayer.graphics.clear();
        }, this, 1000);
    };
    p.drawGrayEff = function () {
        this.grayLayer.graphics.clear();
        this.grayLayer.graphics.beginFill(0x0, 0.4);
        this.grayLayer.graphics.drawRect(-30, -30, this.stage.width + 60, this.stage.height + 60);
        this.grayLayer.graphics.endFill();
    };
    p.showAreaEff = function (eff, side) {
        var scaleX = (side == FightSideEnum.LEFT_SIDE ? -1 : 1);
        eff.scaleX = scaleX;
        if (side == FightSideEnum.LEFT_SIDE) {
            this.leftAreaCont.addChild(eff);
        }
        else {
            this.rightAreaCont.addChild(eff);
        }
    };
    p.showDamageEff = function (eff) {
        this.damageEffLayer.addChild(eff);
    };
    p.flyTxt = function (content, fntname) {
        var fontEff = new FontEff(fntname);
        fontEff.x = content.x || 0;
        fontEff.y = content.y || 0;
        fontEff.show(content);
        this.fontEffLayer.addChild(fontEff);
    };
    p.onRoleHPChange = function () {
        var curTotalLife = this.getCurTotalLife(FightSideEnum.LEFT_SIDE);
        var ratio = +BigNum.div(curTotalLife, this.leftTotalLife);
        if (this.oldLifeRatio > 0) {
            if (ratio <= 0.3 && ratio < this.oldLifeRatio) {
                this.showWarnEff();
                this.oldLifeRatio = ratio;
            }
        }
        else {
            this.oldLifeRatio = ratio;
        }
    };
    p.reset = function () {
        for (var i = 0; i < this.roles.length; i++) {
            for (var j = 0; j < this.roles[i].length; j++) {
                if (this.roles[i][j]) {
                    this.roles[i][j].dispose();
                    this.roles[i][j] = null;
                }
            }
        }
    };
    p.dispose = function () {
        this.reset();
        this.removeEventListener("role_one_step_complete", this.onOneStepComplete, this, true);
        this.removeEventListener("role_die", this.onRoleDie, this, true);
        this.removeEventListener("role_hp_change", this.onRoleHPChange, this, true);
    };
    return FightContainer;
}(egret.DisplayObjectContainer));
egret.registerClass(FightContainer,'FightContainer');
//# sourceMappingURL=FightContainer.js.map