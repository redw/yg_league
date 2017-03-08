var getFightNeedRes = fight.getFightNeedRes;
/**
 * PVE战斗容器
 * Created by hh on 2017/3/7.
 */
var PVEFightContainer = (function (_super) {
    __extends(PVEFightContainer, _super);
    function PVEFightContainer() {
        _super.call(this, FightTypeEnum.PVE);
        this.isFirstBattle = false;
        this.moveCount = 0;
        this.dropProps = [];
        for (var i = 0; i < fight.DROP_POS.length; i++) {
            var item = new DropItem();
            item.x = fight.DROP_POS[i].x;
            item.y = fight.DROP_POS[i].y;
            this.dropProps.push(item);
        }
    }
    var d = __define,c=PVEFightContainer,p=c.prototype;
    // 添加背影
    p.addBackGround = function () {
        this.background = new PVEProspect();
        this.addChild(this.background);
        this.ground = new PVEMiddleGround();
        this.addChild(this.ground);
    };
    // 添加前景
    p.addProspect = function () {
        this.prospect = new PVEForeground();
        this.addChild(this.prospect);
    };
    // 同时出战的数量
    p.getPlayingCount = function () {
        var result = 1;
        var len = this.fightSteps.length;
        if (len > 1) {
            var firstPos = this.fightSteps[0].pos;
            var firstSide = fight.getSideByPos(firstPos);
            for (var i = 1; i < this.fightSteps.length; i++) {
                var curPos = this.fightSteps[i].pos;
                var curSide = fight.getSideByPos(curPos);
                if (firstSide == curSide && firstPos != curPos) {
                    firstPos = curPos;
                    result++;
                }
                else {
                    break;
                }
            }
        }
        return result;
    };
    p.startLevel = function (level) {
        this.level = level;
        this.prospect.level = level;
        this.background.level = level;
        this.ground.level = level;
        var heroArr = [{ id: 102, pos: 10 }, { id: 102, pos: 11 }, { id: 102, pos: 12 }, { id: 102, pos: 13 }, { id: 102, pos: 14 }, { id: 102, pos: 15 },
            { id: 102, pos: 20 }, { id: 102, pos: 21 }, { id: 102, pos: 22 }, { id: 102, pos: 23 }, { id: 102, pos: 24 }, { id: 102, pos: 25 }];
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadRoleComplete, this);
        RES.createGroup("bone_role", fight.getRolePathArr(heroArr), true);
        RES.loadGroup("bone_role", 1);
    };
    p.loadRoleComplete = function (event) {
        if (event.groupName == "bone_role") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadRoleComplete, this);
            var heroArr = [{ id: 102, pos: 10 }, { id: 102, pos: 11 }, { id: 102, pos: 12 }, { id: 102, pos: 13 }, { id: 102, pos: 14 }, { id: 102, pos: 15 },
                { id: 102, pos: 20 }, { id: 102, pos: 21 }, { id: 102, pos: 22 }, { id: 102, pos: 23 }, { id: 102, pos: 24 }, { id: 102, pos: 25 }];
            this.addRoles(heroArr);
        }
    };
    // 添加角色
    p.addRoles = function (elements) {
        _super.prototype.addRoles.call(this, elements);
        var len = elements ? elements.length : 0;
        for (var i = 0; i < len; i++) {
            var role = FightRoleFactory.createRole(this, elements[i]);
            var side = fight.getSideByPos(elements[i].pos) - 1;
            var index = fight.getPosIndexByPos(elements[i].pos);
            this.roles[side][index] = role;
        }
        this.changeRoleZIndex();
        this.tweenRoles(elements);
    };
    p.tweenRoles = function (elements) {
        var _this = this;
        var len = elements ? elements.length : 0;
        for (var i = 0; i < len; i++) {
            var side = fight.getSideByPos(elements[i].pos);
            var index = fight.getPosIndexByPos(elements[i].pos);
            var role = this.roles[side - 1][index];
            var tox = role.x;
            if (side == FightSideEnum.LEFT_SIDE) {
                role.x = fight.WIDTH * -0.5 + role.x;
            }
            else {
                role.x = fight.WIDTH * 1 + role.x;
            }
            egret.Tween.get(role).to({ x: tox }, fight.MIDDLE_GROUND_MOVE_TIME).call(function () {
                _this.roleMoveComplete();
            }, this);
        }
    };
    p.changeRoleZIndex = function () {
        var orders = fight.ROLE_Z_INDEX_ARR;
        var zIndex = 0;
        for (var i = 0; i < orders.length; i++) {
            var index = orders[i];
            if (index == fight.ADD_AREA_IN_INDEX) {
                this.leftAreaCont = new egret.DisplayObjectContainer();
                this.roleLayer.addChild(this.leftAreaCont);
            }
            if (this.roles[0][index]) {
                this.roles[0][index].zIndex = zIndex;
                this.roleLayer.addChild(this.roles[0][index]);
                zIndex++;
            }
            var dropIndex = fight.ADD_DROP_IN_INDEX.indexOf(index);
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
    };
    p.roleMoveComplete = function () {
        this.moveCount++;
        if (this.moveCount >= this.elements.length) {
            this.showSceneName();
        }
    };
    p.showSceneName = function () {
        if (!this.isFirstBattle) {
            this.isFirstBattle = true;
            var stageName = "";
            var eff = new NewChapterEff(stageName);
            eff.once(egret.Event.COMPLETE, this.showMonsterTip, this);
            this.fontEffLayer.addChild(eff);
        }
        else {
            this.showMonsterTip();
        }
    };
    p.showMonsterTip = function () {
        if (this.level % 10 == 0) {
            var eff = new BossIncomingEff();
            eff.once(egret.Event.COMPLETE, this.generateData, this);
            this.fontEffLayer.addChild(eff);
        }
        else {
            this.generateData();
        }
    };
    p.generateData = function () {
        var dataGenerator = new FightProcessGenerator();
        var fightVOArr = fight.generateFightRoleVOArr(this.elements);
        dataGenerator.addSceneDataVec(fightVOArr);
        var fightSteps = dataGenerator.generateData();
        this.fightStart(fightSteps);
    };
    return PVEFightContainer;
}(FightContainer));
egret.registerClass(PVEFightContainer,'PVEFightContainer');
