/**
 * 动画工具类: 自动加载并创建MovieClip动画
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var MovieClipUtils;
(function (MovieClipUtils) {
    var _mcDataFactoryMap = {};
    var _spriteSheetMap = {};
    /**
     * 播放一次MC
     * @param mc
     * @param callback
     * @param thisObject
     */
    function playMCOnce(mc, callback, thisObject) {
        if (callback === void 0) { callback = null; }
        if (thisObject === void 0) { thisObject = null; }
        if (mc != null) {
            mc.play(1);
            mc.addEventListener(egret.Event.COMPLETE, function (event) {
                this.removeEventListener(egret.Event.COMPLETE, arguments.callee, this);
                if (callback != null) {
                    callback.call(thisObject);
                }
            }, mc);
        }
    }
    MovieClipUtils.playMCOnce = playMCOnce;
    /**
     * 创建MovieClip动画
     * @param resName 资源名(对应name.json与name.png)
     * @param movieClipName 动画名
     * @param compFunc 创建完成后回调
     * @param thisObject 回调对象
     */
    function createMovieClip(resName, movieClipName, compFunc, thisObject) {
        if (!_mcDataFactoryMap[resName]) {
            _mcDataFactoryMap[resName] = { "callerList": [] };
        }
        var factoryItem = _mcDataFactoryMap[resName];
        if (factoryItem.factory) {
            compFunc.call(thisObject, new egret.MovieClip(factoryItem.factory.generateMovieClipData(movieClipName)));
        }
        else {
            var dataRes = RES.getRes(resName + "_json");
            var textureRes = RES.getRes(resName + "_png");
            if (dataRes && textureRes) {
                factoryItem.factory = new egret.MovieClipDataFactory(dataRes, textureRes);
                compFunc.call(thisObject, new egret.MovieClip(factoryItem.factory.generateMovieClipData(movieClipName)));
            }
            else {
                factoryItem.callerList.push({
                    "compFunc": compFunc,
                    "thisObject": thisObject,
                    "movieClipName": movieClipName
                });
                if (factoryItem.callerList.length == 1) {
                    var urlList = [resName + ".json", resName + ".png"];
                    LoaderUtils.load(urlList.concat(), function (resList) {
                        factoryItem.factory = new egret.MovieClipDataFactory(resList[urlList[0]], resList[urlList[1]]);
                        for (var i in factoryItem.callerList) {
                            var caller = factoryItem.callerList[i];
                            caller.compFunc.call(caller.thisObject, new egret.MovieClip(factoryItem.factory.generateMovieClipData(caller.movieClipName)));
                        }
                    }, null, this);
                }
            }
        }
    }
    MovieClipUtils.createMovieClip = createMovieClip;
    /**
     * 从图片集中创建MovieClip动画
     * @param resName 资源名(对应name.json与name.png)
     * @param prefix 动画资源前缀
     * @param duration 每帧间隔时间
     * @param compFunc 创建完成后回调
     * @param thisObject 回调对象
     */
    function createMovieClipFromSpriteSheet(resName, prefix, duration, compFunc, thisObject) {
        function createMovieClipData(data, spriteSheet, prefix, duration) {
            var frameRate = 24;
            var frames = [];
            var textureData = {};
            var mcData = { "frameRate": frameRate, "frames": [] };
            var keys = [];
            for (var key in data.frames) {
                textureData[key] = {
                    "x": data.frames[key].x,
                    "y": data.frames[key].y,
                    "w": data.frames[key].w,
                    "h": data.frames[key].h
                };
                if (key.indexOf(prefix) == 0) {
                    keys.push(key);
                }
            }
            keys.sort();
            for (var i = 0; i < keys.length; i++) {
                key = keys[i];
                var frameData = data.frames[key];
                var startFrame = { "duration": duration, "res": key, "x": frameData.offX, "y": frameData.offY };
                mcData.frames.push(startFrame);
                frames.push(startFrame);
                for (var k = 1; k < duration; k++) {
                    frames.push({ "frame": i * duration + 1 });
                }
            }
            var movieClipData = new egret.MovieClipData();
            movieClipData.frames = frames;
            movieClipData.frameRate = frameRate;
            movieClipData.spriteSheet = spriteSheet;
            movieClipData.textureData = textureData;
            movieClipData.mcData = mcData;
            return movieClipData;
        }
        if (!_spriteSheetMap[resName]) {
            _spriteSheetMap[resName] = { "callerList": [] };
        }
        var spriteSheetItem = _spriteSheetMap[resName];
        if (spriteSheetItem.spriteSheet) {
            compFunc.call(thisObject, new egret.MovieClip(createMovieClipData(spriteSheetItem.data, spriteSheetItem.spriteSheet, prefix, duration)));
        }
        else {
            spriteSheetItem.callerList.push({
                "compFunc": compFunc,
                "thisObject": thisObject,
                "prefix": prefix,
                "duration": duration
            });
            if (spriteSheetItem.callerList.length == 1) {
                var urlList = [resName + ".json", resName + ".png"];
                LoaderUtils.load(urlList.concat(), function (resList) {
                    spriteSheetItem.data = resList[urlList[0]];
                    spriteSheetItem.spriteSheet = new egret.SpriteSheet(resList[urlList[1]]);
                    for (var i in spriteSheetItem.callerList) {
                        var caller = spriteSheetItem.callerList[i];
                        caller.compFunc.call(caller.thisObject, new egret.MovieClip(createMovieClipData(spriteSheetItem.data, spriteSheetItem.spriteSheet, caller.prefix, caller.duration)));
                    }
                }, null, this);
            }
        }
    }
    MovieClipUtils.createMovieClipFromSpriteSheet = createMovieClipFromSpriteSheet;
})(MovieClipUtils || (MovieClipUtils = {}));
//# sourceMappingURL=MovieClipUtils.js.map