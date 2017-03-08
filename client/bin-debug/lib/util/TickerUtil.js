/**
 * 心跳
 * @author j
 * 2016/3/15
 */
var TickerUtil;
(function (TickerUtil) {
    var _hasInit = false;
    var _lastTime;
    var _delay = 1000 / 60;
    var _timeoutID = 0;
    var _callbackList = [];
    function onTicker() {
        var time = Date.now();
        egret.clearTimeout(_timeoutID);
        _timeoutID = egret.setTimeout(onTicker, this, _delay);
        for (var _i = 0, _callbackList_1 = _callbackList; _i < _callbackList_1.length; _i++) {
            var callback = _callbackList_1[_i];
            callback["passTime"] = callback["passTime"] + (time - _lastTime);
            if (callback["passTime"] >= callback["time"]) {
                callback["func"].call(callback["thisObj"]);
                callback["passTime"] = callback["passTime"] - callback["time"];
            }
        }
        _lastTime = time;
    }
    function register(func, thisObj, time) {
        if (_hasInit == false) {
            _hasInit = true;
            _lastTime = Date.now();
            _timeoutID = egret.setTimeout(onTicker, this, _delay);
        }
        unregister(func, thisObj);
        var callback = {};
        callback["func"] = func;
        callback["thisObj"] = thisObj;
        callback["time"] = time;
        callback["passTime"] = 0;
        _callbackList.push(callback);
    }
    TickerUtil.register = register;
    function unregister(func, thisObj) {
        for (var _i = 0, _callbackList_2 = _callbackList; _i < _callbackList_2.length; _i++) {
            var callback = _callbackList_2[_i];
            if (callback["func"] == func && callback["thisObj"] == thisObj) {
                _callbackList.splice(_callbackList.indexOf(callback), 1);
                break;
            }
        }
    }
    TickerUtil.unregister = unregister;
})(TickerUtil || (TickerUtil = {}));
