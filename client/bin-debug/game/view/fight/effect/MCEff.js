/**
 * mc效果
 * Created by hh on 16/12/25.
 */
var MCEff = (function (_super) {
    __extends(MCEff, _super);
    function MCEff(value, autoDisAppear, scaleX) {
        if (autoDisAppear === void 0) { autoDisAppear = true; }
        if (scaleX === void 0) { scaleX = 1; }
        _super.call(this);
        this.autoDisAppear = false;
        this._scaleX = 1;
        this.frameBacks = [];
        this._timer = -1;
        this.autoDisAppear = autoDisAppear;
        this.source = value;
        this._scaleX = scaleX;
    }
    var d = __define,c=MCEff,p=c.prototype;
    /**
     * 注册回调
     * @param frame
     * @param fun
     * @param scope
     * @param param
     */
    p.registerBack = function (frame, fun, scope, param) {
        if (scope === void 0) { scope = null; }
        if (param === void 0) { param = null; }
        if (!this.frameBacks || this.frameBacks.length == 0) {
            this.frameBacks = [];
        }
        this.frameBacks[frame] = [fun, scope, param];
    };
    d(p, "source"
        ,function () {
            return this._source;
        }
        ,function (value) {
            if (this._source != value) {
                this._source = value;
                var hasRes = fight.isMCResourceLoaded(value);
                if (hasRes) {
                    this.mc = fight.createMovieClip(value);
                    var totalFrame = this.mc.totalFrames;
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
                    }
                    else {
                        this.mc.gotoAndPlay(1, -1);
                    }
                    this.addChild(this.mc);
                }
                else {
                    egret.setTimeout(this.onComplete, this, 100);
                }
            }
        }
    );
    p.onEnterFrame = function () {
        var curFrame = this.mc.currentFrame;
        this.triggerFun(curFrame);
        return false;
    };
    p.onComplete = function () {
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
    };
    p.triggerFun = function (frame) {
        if (this.frameBacks[frame]) {
            var fun = this.frameBacks[frame][0];
            var scope = this.frameBacks[frame][1];
            var param = this.frameBacks[frame][2];
            fun.call(scope, param);
            this.frameBacks[frame] = null;
        }
    };
    p.triggerFunArr = function () {
        var keys = Object.keys(this.frameBacks || []);
        for (var i = 0; i < keys.length; i++) {
            this.triggerFun(keys[i]);
        }
    };
    p.getMC = function () {
        return this.mc;
    };
    p.start = function () {
        if (this.mc && !this.mc.isPlaying) {
            if (this.autoDisAppear) {
                this.mc.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
                this.mc.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
                this.mc.gotoAndPlay(1, 1);
            }
            else {
                this.mc.gotoAndPlay(1, -1);
            }
        }
    };
    p.stop = function () {
        if (this.mc && this.mc.isPlaying) {
            this.mc.stop();
        }
    };
    p.dispose = function () {
        this.onComplete();
    };
    p.setMaxExistTime = function (time) {
        if (this.autoDisAppear && this._timer < 0) {
            this._timer = egret.setTimeout(this.forceComplete, this, time);
        }
    };
    p.forceComplete = function () {
        if (this._timer >= 0)
            egret.clearTimeout(this._timer);
        this._timer = -1;
        this.onComplete();
    };
    return MCEff;
}(egret.DisplayObjectContainer));
egret.registerClass(MCEff,'MCEff');
//# sourceMappingURL=MCEff.js.map