/**
 * 战斗角色身体部分
 * Created by hh on 2017/2/7.
 */
class RoleBody extends egret.DisplayObjectContainer {
    private armature:dragonBones.Armature;
    private armatureDis:egret.DisplayObject;
    private config:RoleConfig;
    private _waiting:boolean = true;
    private _isTriggerAtk:boolean = false;
    private frameDisArr = [];

    public constructor(id:number) {
        super();
        this.config = Config.HeroData[id] || Config.EnemyData[id];
        let resourceArr = String(this.config.resource).split(",");
        this.armature = fight.createArmature(resourceArr[0]);
        this.armatureDis = <egret.DisplayObject>this.armature.display;
        this.addChild(this.armatureDis);
        dragonBones.WorldClock.clock.add(this.armature);

        this.active();
    }

    public active() {
        this._isTriggerAtk = false;
        this.idle();
    }

    public disActive(){
        dragonBones.WorldClock.clock.remove(this.armature);
    }

    public idle() {
        this.armature.animation.gotoAndPlay("idle", 0, 0, 0);
        this.waiting = true;
    }

    public attack(skill:SkillConfig) {
        this.waiting = false;
        this._isTriggerAtk = true;
        this.armatureDis.addEventListener(dragonBones.FrameEvent.FRAME_EVENT, this.onFrameEvent, this);
        this.armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.attackComplete, this);

        this.armature.animation.play(skill.action, 1);
    }

    private onEnterFrame(e:egret.MovieClipEvent) {
        let mc:egret.MovieClip = e.target;
        let curFrame = mc.currentFrame;
        if (this.frameDisArr.indexOf(curFrame) < 0) {
            this.frameDisArr.push(curFrame);
            this.dispatchEventWith("enter_frame", true, curFrame);
        }
    }

    private attackComplete(e:dragonBones.AnimationEvent = null) {
        if (e) {
            let mc:egret.MovieClip = e.target;
            let total = mc.totalFrames;
            for (let i = 1; i <= total; i++) {
                if (this.frameDisArr.indexOf(i) < 0) {
                    this.dispatchEventWith("enter_frame", true, i);
                }
            }
            this.frameDisArr = [];
            e.target.removeEventListener(dragonBones.FrameEvent.FRAME_EVENT, this.onFrameEvent, this);
            e.target.removeEventListener(dragonBones.AnimationEvent.COMPLETE, this.attackComplete, this);
        }
        this.idle();
        this.dispatchEventWith("attack_complete", true);
    }

    private onFrameEvent(e:dragonBones.FrameEvent) {
        this.dispatchEventWith("attack_event", true, e.frameLabel);
    }

    public block() {
        this.armature.animation.play("block", -1);
        this.waiting = false;
    }

    private blockComplete(e:egret.MovieClipEvent = null) {
        if (e)
            e.target.removeEventListener(egret.MovieClipEvent.COMPLETE, this.blockComplete, this);
        this.idle();
    }

    public hit() {
        this.armature.animation.play("attacked", 1);
        this.waiting = false;
    }

    private hitComplete(e:egret.MovieClipEvent = null) {
        if (e)
            e.target.removeEventListener(egret.MovieClipEvent.COMPLETE, this.hitComplete, this);
        this.idle();
    }

    public get isTriggerAtk(){
        return this._isTriggerAtk;
    }

    public get frameRate(){
        return 24;
    }

    public get waiting() {
        return this._waiting;
    }

    public set waiting(value:boolean) {
        this._waiting = value;
    }

    /** 翻转 */
    public set flipped(value:boolean) {
        let scaleX = value ? -1 : 1;
        this.armatureDis.scaleX = scaleX;
    }

    public reset(){
        this._waiting = true;
        this._isTriggerAtk = false;
        this.frameDisArr = [];
        this.idle();
    }
}
