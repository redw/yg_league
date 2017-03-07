var BaseTicker = (function (_super) {
    __extends(BaseTicker, _super);
    /**
     * @param interval      触发间隔
     * @param refreshRate   刷新频率
     * */
    function BaseTicker(interval, refreshRate) {
        if (interval === void 0) { interval = 1000; }
        if (refreshRate === void 0) { refreshRate = 50; }
        _super.call(this);
        this._interval = 1000;
        this._refreshRate = 50;
        this._tag1 = 0;
        this._tag2 = 0;
        //
        this._idddd = -1;
        this._passTime = 0;
        this._interval = interval;
    }
    var d = __define,c=BaseTicker,p=c.prototype;
    p.updateInterval = function (value) {
        this._interval = value;
    };
    p.start = function () {
        if (!this._status) {
            this.stop();
            //
            this._status = true;
            this._passTime = 0;
            this._tag1 = egret.getTimer();
            this._idddd = egret.setTimeout(this.onTicker, this, this._refreshRate);
        }
    };
    p.stop = function () {
        this._status = false;
        //
        if (this._idddd != -1) {
            egret.clearTimeout(this._idddd);
            this._idddd = -1;
        }
    };
    p.onTicker = function () {
        if (this._status) {
            this._idddd = egret.setTimeout(this.onTicker, this, this._refreshRate);
            //
            this._tag2 = egret.getTimer();
            this._passTime += this._refreshRate;
            if (this._passTime >= this._interval) {
                this._passTime -= this._interval;
                var range = this._tag2 - this._tag1 - this._interval;
                this._tag1 = egret.getTimer();
                this.onTimer(range);
            }
        }
    };
    p.onTimer = function (range) {
        //
    };
    d(p, "passTime"
        ,function () {
            return this._passTime;
        }
    );
    return BaseTicker;
}(egret.DisplayObjectContainer));
egret.registerClass(BaseTicker,'BaseTicker');
//# sourceMappingURL=BaseTicker.js.map