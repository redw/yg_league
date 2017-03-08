/**
 * 战斗角色身体部分
 * Created by hh on 2017/2/7.
 */
var RoleBody = (function (_super) {
    __extends(RoleBody, _super);
    function RoleBody(id) {
        _super.call(this);
        this._waiting = true;
        this._isTriggerAtk = false;
        this.frameDisArr = [];
        this.config = Config.HeroData[id] || Config.EnemyData[id];
        var resourceArr = String(this.config.resource).split(",");
        this.armature = fight.createArmature(resourceArr[0]);
        this.armatureDis = this.armature.display;
        this.addChild(this.armatureDis);
        dragonBones.WorldClock.clock.add(this.armature);
        this.active();
    }
    var d = __define,c=RoleBody,p=c.prototype;
    p.active = function () {
        this._isTriggerAtk = false;
        this.idle();
    };
    p.disActive = function () {
        dragonBones.WorldClock.clock.remove(this.armature);
    };
    p.idle = function () {
        this.armature.animation.gotoAndPlay("idle", 0, 0, 0);
        this.waiting = true;
    };
    p.attack = function (skill) {
        this.waiting = false;
        this._isTriggerAtk = true;
        // this.armatureDis.addEventListener(egret.MovieClipEvent.ENTER_FRAME, this.onEnterFrame, this);
        this.armature.addEventListener(egret.MovieClipEvent.COMPLETE, this.attackComplete, this);
        this.armature.animation.play(skill.action, 1);
    };
    p.onEnterFrame = function (e) {
        var mc = e.target;
        var curFrame = mc.currentFrame;
        if (this.frameDisArr.indexOf(curFrame) < 0) {
            this.frameDisArr.push(curFrame);
            this.dispatchEventWith("enter_frame", true, curFrame);
        }
    };
    p.attackComplete = function (e) {
        if (e === void 0) { e = null; }
        if (e) {
            var mc = e.target;
            var total = mc.totalFrames;
            for (var i = 1; i <= total; i++) {
                if (this.frameDisArr.indexOf(i) < 0) {
                    this.dispatchEventWith("enter_frame", true, i);
                }
            }
            this.frameDisArr = [];
            // e.target.removeEventListener(egret.MovieClipEvent.ENTER_FRAME, this.onEnterFrame, this);
            e.target.removeEventListener(egret.MovieClipEvent.COMPLETE, this.attackComplete, this);
        }
        this.idle();
        this.dispatchEventWith("attack_complete", true);
    };
    p.block = function () {
        this.armature.animation.play("block", -1);
        this.waiting = false;
    };
    p.blockComplete = function (e) {
        if (e === void 0) { e = null; }
        if (e)
            e.target.removeEventListener(egret.MovieClipEvent.COMPLETE, this.blockComplete, this);
        this.idle();
    };
    p.hit = function () {
        this.armature.animation.play("attacked", 1);
        this.waiting = false;
    };
    p.hitComplete = function (e) {
        if (e === void 0) { e = null; }
        if (e)
            e.target.removeEventListener(egret.MovieClipEvent.COMPLETE, this.hitComplete, this);
        this.idle();
    };
    d(p, "flipped",undefined
        /** 翻转 */
        ,function (value) {
            var scaleX = value ? -1 : 1;
            this.armatureDis.scaleX = scaleX;
        }
    );
    d(p, "isTriggerAtk"
        ,function () {
            return this._isTriggerAtk;
        }
    );
    d(p, "frameRate"
        ,function () {
            return 24;
        }
    );
    d(p, "waiting"
        ,function () {
            return this._waiting;
        }
        ,function (value) {
            this._waiting = value;
        }
    );
    p.reset = function () {
        this._waiting = true;
        this._isTriggerAtk = false;
        this.frameDisArr = [];
    };
    return RoleBody;
}(egret.DisplayObjectContainer));
egret.registerClass(RoleBody,'RoleBody');
//# sourceMappingURL=RoleBody.js.map