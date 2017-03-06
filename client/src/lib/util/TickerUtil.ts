/**
 * 心跳
 * @author j
 * 2016/3/15
 */
module TickerUtil
{
    var _hasInit:boolean = false;
    var _lastTime:number;
    var _delay:number = 1000 / 60;
    var _timeoutID:number = 0;

    var _callbackList:any[] = [];

    function onTicker():void
    {
        var time:number = Date.now();

        egret.clearTimeout(_timeoutID);
        _timeoutID = egret.setTimeout(onTicker, this, _delay);

        for (var callback of _callbackList)
        {
            callback["passTime"] = callback["passTime"] + (time - _lastTime);

            if (callback["passTime"] >= callback["time"])
            {
                callback["func"].call(callback["thisObj"]);
                callback["passTime"] = callback["passTime"] - callback["time"];
            }
        }
        _lastTime = time;
    }

    export function register(func:Function, thisObj:any, time:number):void
    {
        if (_hasInit == false)
        {
            _hasInit = true;
            _lastTime = Date.now();
            _timeoutID = egret.setTimeout(onTicker, this, _delay);
        }
        unregister(func, thisObj);

        var callback:any = {};
        callback["func"] = func;
        callback["thisObj"] = thisObj;
        callback["time"] = time;
        callback["passTime"] = 0;
        _callbackList.push(callback);
    }

    export function unregister(func:Function, thisObj:any):void
    {
        for (var callback of _callbackList)
        {
            if (callback["func"] == func && callback["thisObj"] == thisObj)
            {
                _callbackList.splice(_callbackList.indexOf(callback), 1);
                break;
            }
        }
    }
}