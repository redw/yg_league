/**
 * 战斗角色身体部分
 * Created by hh on 2017/2/7.
 */
class RoleBody extends egret.DisplayObjectContainer {
    private skillMc:egret.MovieClip;
    private mainMc:egret.MovieClip;
    private config:RoleConfig;
    private _waiting:boolean = true;
    private _isTriggerAtk:boolean = false;
    private frameDisArr = [];

    public constructor(id:number) {
        super();
        this.config = Config.HeroData[id] || Config.EnemyData[id];
        let resourceArr = String(this.config.resource).split(",");
        this.mainMc = FightRole.createMovieClip(resourceArr[0]);
        this.addChild(this.mainMc);

        this.active();
        if (this.mainMc.totalFrames <= 0) {
            fight.recordLog(`角色:${this.config.id}资源或命名有问题`, fight.LOG_FIGHT_WARN);
        }
        if (this.skillMc && this.skillMc.totalFrames <= 1) {
            fight.recordLog(`角色:${this.config.id}资源或命名有问题`, fight.LOG_FIGHT_WARN);
        }
    }

    public active() {
        this._isTriggerAtk = false;
        this.idle();
    }

    public idle() {
        if (this.skillMc)
            this.skillMc.visible = false;
        this.mainMc.visible = true;
        this.waiting = true;
        this.mainMc.gotoAndPlay("idle", -1);
    }

    public attack(skill:SkillConfig) {
        let isSkillAttack = skill.action == "skill_1";
        if (this.skillMc)
            this.skillMc.visible = isSkillAttack;
        this.mainMc.visible = !isSkillAttack;
        this.waiting = false;
        this._isTriggerAtk = true;
        let mc:egret.MovieClip = this.mainMc;
        if (isSkillAttack) {
            if (this.hasSkillMC() && !this.skillMc) {
                let resourceArr = String(this.config.resource).split(",");
                this.skillMc = FightRole.createMovieClip(`${resourceArr[0]}_s`);
                this.addChild(this.skillMc);
                if (this.skillMc.scaleX != this.mainMc.scaleX)
                    this.skillMc.scaleX = this.mainMc.scaleX;
            }
            if (this.skillMc) {
                this.skillMc.gotoAndPlay(1, 1);
                mc = this.skillMc;
            } else {
                this.mainMc.gotoAndPlay("attack", 1);
                fight.recordLog(`角色:${this.config.id}技能攻击有问题，换成普通攻击`, fight.LOG_FIGHT_WARN);
            }
        } else {
            this.mainMc.gotoAndPlay(skill.action, 1);
        }
        mc.addEventListener(egret.MovieClipEvent.ENTER_FRAME, this.onEnterFrame, this);
        mc.addEventListener(egret.MovieClipEvent.COMPLETE, this.attackComplete, this);
    }

    private onEnterFrame(e:egret.MovieClipEvent) {
        let mc:egret.MovieClip = e.target;
        let curFrame = mc.currentFrame;
        if (this.frameDisArr.indexOf(curFrame) < 0) {
            this.frameDisArr.push(curFrame);
            this.dispatchEventWith("enter_frame", true, curFrame);
        }
    }

    private attackComplete(e:egret.MovieClipEvent = null) {
        if (e) {
            let mc:egret.MovieClip = e.target;
            let total = mc.totalFrames;
            for (let i = 1; i <= total; i++) {
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
    }

    public block() {
        this.waiting = false;
        if (fight.existMCLabel("block", this.mainMc)) {
            this.mainMc.addEventListener(egret.MovieClipEvent.COMPLETE, this.blockComplete, this);
            this.mainMc.gotoAndPlay("block", 1);
        } else {
            fight.recordLog(`角色:${this.config.id}没有格档动作`, fight.LOG_FIGHT_WARN);
            this.blockComplete(null);
        }
    }

    private blockComplete(e:egret.MovieClipEvent = null) {
        if (e)
            e.target.removeEventListener(egret.MovieClipEvent.COMPLETE, this.blockComplete, this);
        this.idle();
    }

    public hit() {
        this.waiting = false;
        this.mainMc.addEventListener(egret.MovieClipEvent.COMPLETE, this.hitComplete, this);
        this.mainMc.gotoAndPlay("attacked", 1);
    }

    private hitComplete(e:egret.MovieClipEvent = null) {
        if (e)
            e.target.removeEventListener(egret.MovieClipEvent.COMPLETE, this.hitComplete, this);
        this.idle();
    }

    /** 翻转 */
    public set flipped(value:boolean) {
        let scaleX = value ? -1 : 1;
        this.mainMc.scaleX = scaleX;
        if (this.skillMc)
            this.skillMc.scaleX = scaleX;
    }

    public get isTriggerAtk(){
        return this._isTriggerAtk;
    }

    public get frameRate(){
        return this.mainMc.frameRate || 24;
    }

    public get waiting() {
        return this._waiting;
    }

    public set waiting(value:boolean) {
        this._waiting = value;
    }

    private hasSkillMC(){
        let id = this.config.id;
        return fight.isHero(id) || id > 300;
    }

    public reset(){
        this._waiting = true;
        this._isTriggerAtk = false;
        this.frameDisArr = [];
    }
}
