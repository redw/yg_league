/**
 * mc效果
 * Created by hh on 16/12/25.
 */
class MCEff extends egret.DisplayObjectContainer {
    private mc:egret.MovieClip;
    public autoDisAppear:boolean = false;
    private _scaleX:number = 1;
    private frameBacks = [];
    private _source:string;

    public constructor(value:string, autoDisAppear:boolean=true, scaleX:number = 1){
        super();
        this.autoDisAppear = autoDisAppear;
        this.source = value;
        this._scaleX = scaleX;
    }

    /**
     * 注册回调
     * @param frame
     * @param fun
     * @param scope
     * @param param
     */
    public registerBack(frame:number, fun:Function, scope:Object=null, param:any=null){
        if (!this.frameBacks || this.frameBacks.length == 0) {
            this.frameBacks = [];
        }
        this.frameBacks[frame] = [fun, scope, param];
    }

    public get source(){
        return this._source;
    }

    public set source(value:string) {
        if (this._source != value) {
            this._source = value;
            let hasRes = fight.isMCResourceLoaded(value);
            if (hasRes) {
                this.mc = fight.createMovieClip(value);
                let totalFrame = this.mc.totalFrames;
                if (totalFrame < 1) {
                    // fight.recordLog(`资源${value}出错`, fight.LOG_FIGHT_WARN);
                    this.onComplete();
                    return;
                }
                // if (this.frameBacks) {
                //     let keys = Object.keys(this.frameBacks);
                //     for (let i = 0; i < keys.length; i++) {
                //         let key = +keys[i];
                //         if (key <= 0 || key > totalFrame) {
                //             let callInfo = this.frameBacks[key];
                //             delete this.frameBacks[key];
                //             this.frameBacks[totalFrame] = callInfo;
                //         }
                //     }
                // }
                this.mc.scaleX = this._scaleX;
                this.mc.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
                if (this.autoDisAppear) {
                    this.mc.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
                    this.mc.gotoAndPlay(1, 1);
                } else {
                    this.mc.gotoAndPlay(1, -1);
                }
                this.addChild(this.mc);
            } else {
                egret.setTimeout(this.onComplete, this, 100);
            }
        }
    }

    private onEnterFrame(){
        let curFrame = this.mc.currentFrame;
        this.triggerFun(curFrame);
        return false;
    }

    private onComplete() {
        if (this._timer >= 0) {
            egret.clearTimeout(this._timer);
            this._timer = -1;
        }

        this.triggerFunArr();
        this.dispatchEventWith(egret.Event.COMPLETE);
        if (this.mc) {
            this.mc.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.mc.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
            if (this.mc.parent)
                this.mc.parent.removeChild(this.mc);
            this.mc = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.frameBacks = [];
    }

    private triggerFun(frame:number|string){
        if (this.frameBacks[frame]) {
            let fun = this.frameBacks[frame][0];
            let scope = this.frameBacks[frame][1];
            let param = this.frameBacks[frame][2];
            fun.call(scope, param);
            this.frameBacks[frame] = null;
        }
    }

    private triggerFunArr(){
        let keys = Object.keys(this.frameBacks || []);
        for (let i = 0; i < keys.length; i++) {
            this.triggerFun(keys[i]);
        }
    }

    public getMC(){
        return this.mc;
    }

    public start(){
        if (this.mc && !this.mc.isPlaying) {
            if (this.autoDisAppear) {
                this.mc.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
                this.mc.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
                this.mc.gotoAndPlay(1, 1);
            } else {
                this.mc.gotoAndPlay(1, -1);
            }
        }
    }

    public stop(){
        if (this.mc && this.mc.isPlaying) {
            this.mc.stop();
        }
    }

    public dispose(){
        this.onComplete();
    }

    private _timer:number = -1;
    public setMaxExistTime(time:number) {
        if (this.autoDisAppear && this._timer < 0) {
            this._timer = egret.setTimeout(this.forceComplete, this, time);
        }
    }

    private forceComplete(){
        if (this._timer >= 0)
            egret.clearTimeout(this._timer);
        this._timer = -1;
        this.onComplete();
    }
}