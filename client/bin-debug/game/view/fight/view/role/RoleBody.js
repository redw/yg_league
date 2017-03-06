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
        this.mainMc = FightRole.createMovieClip(resourceArr[0]);
        this.addChild(this.mainMc);
        this.active();
        if (this.mainMc.totalFrames <= 0) {
            fight.recordLog("\u89D2\u8272:" + this.config.id + "\u8D44\u6E90\u6216\u547D\u540D\u6709\u95EE\u9898", fight.LOG_FIGHT_WARN);
        }
        if (this.skillMc && this.skillMc.totalFrames <= 1) {
            fight.recordLog("\u89D2\u8272:" + this.config.id + "\u8D44\u6E90\u6216\u547D\u540D\u6709\u95EE\u9898", fight.LOG_FIGHT_WARN);
        }
    }
    var d = __define,c=RoleBody,p=c.prototype;
    p.active = function () {
        this._isTriggerAtk = false;
        this.idle();
    };
    p.idle = function () {
        if (this.skillMc)
            this.skillMc.visible = false;
        this.mainMc.visible = true;
        this.waiting = true;
        this.mainMc.gotoAndPlay("idle", -1);
    };
    p.attack = function (skill) {
        var isSkillAttack = skill.action == "skill_1";
        if (this.skillMc)
            this.skillMc.visible = isSkillAttack;
        this.mainMc.visible = !isSkillAttack;
        this.waiting = false;
        this._isTriggerAtk = true;
        var mc = this.mainMc;
        if (isSkillAttack) {
            if (this.hasSkillMC() && !this.skillMc) {
                var resourceArr = String(this.config.resource).split(",");
                this.skillMc = FightRole.createMovieClip(resourceArr[0] + "_s");
                this.addChild(this.skillMc);
                if (this.skillMc.scaleX != this.mainMc.scaleX)
                    this.skillMc.scaleX = this.mainMc.scaleX;
            }
            if (this.skillMc) {
                this.skillMc.gotoAndPlay(1, 1);
                mc = this.skillMc;
            }
            else {
                this.mainMc.gotoAndPlay("attack", 1);
                fight.recordLog("\u89D2\u8272:" + this.config.id + "\u6280\u80FD\u653B\u51FB\u6709\u95EE\u9898\uFF0C\u6362\u6210\u666E\u901A\u653B\u51FB", fight.LOG_FIGHT_WARN);
            }
        }
        else {
            this.mainMc.gotoAndPlay(skill.action, 1);
        }
        mc.addEventListener(egret.MovieClipEvent.ENTER_FRAME, this.onEnterFrame, this);
        mc.addEventListener(egret.MovieClipEvent.COMPLETE, this.attackComplete, this);
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
            e.target.removeEventListener(egret.MovieClipEvent.ENTER_FRAME, this.onEnterFrame, this);
            e.target.removeEventListener(egret.MovieClipEvent.COMPLETE, this.attackComplete, this);
        }
        this.idle();
        this.dispatchEventWith("attack_complete");
    };
    p.block = function () {
        this.waiting = false;
        if (fight.existMCLabel("block", this.mainMc)) {
            this.mainMc.addEventListener(egret.MovieClipEvent.COMPLETE, this.blockComplete, this);
            this.mainMc.gotoAndPlay("block", 1);
        }
        else {
            fight.recordLog("\u89D2\u8272:" + this.config.id + "\u6CA1\u6709\u683C\u6863\u52A8\u4F5C", fight.LOG_FIGHT_WARN);
            this.blockComplete(null);
        }
    };
    p.blockComplete = function (e) {
        if (e === void 0) { e = null; }
        if (e)
            e.target.removeEventListener(egret.MovieClipEvent.COMPLETE, this.blockComplete, this);
        this.idle();
    };
    p.hit = function () {
        this.waiting = false;
        this.mainMc.addEventListener(egret.MovieClipEvent.COMPLETE, this.hitComplete, this);
        this.mainMc.gotoAndPlay("attacked", 1);
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
            this.mainMc.scaleX = scaleX;
            if (this.skillMc)
                this.skillMc.scaleX = scaleX;
        }
    );
    d(p, "isTriggerAtk"
        ,function () {
            return this._isTriggerAtk;
        }
    );
    d(p, "frameRate"
        ,function () {
            return this.mainMc.frameRate || 24;
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
    p.hasSkillMC = function () {
        var id = this.config.id;
        return fight.isHero(id) || id > 300;
    };
    p.reset = function () {
        this._waiting = true;
        this._isTriggerAtk = false;
        this.frameDisArr = [];
    };
    return RoleBody;
}(egret.DisplayObjectContainer));
egret.registerClass(RoleBody,'RoleBody');
