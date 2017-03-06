/**
 * 动画工具类: 自动加载并创建MovieClip动画
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
module MovieClipUtils
{
    var _mcDataFactoryMap = {};
    var _spriteSheetMap = {};

    /**
     * 播放一次MC
     * @param mc
     * @param callback
     * @param thisObject
     */
    export function playMCOnce(mc:egret.MovieClip, callback:Function = null, thisObject:any = null):void
    {
        if (mc != null)
        {
            mc.play(1);
            mc.addEventListener(egret.Event.COMPLETE, function (event:egret.Event):void
            {
                this.removeEventListener(egret.Event.COMPLETE, arguments.callee, this);
                if (callback != null)
                {
                    callback.call(thisObject);
                }
            }, mc);
        }
    }

    /**
     * 创建MovieClip动画
     * @param resName 资源名(对应name.json与name.png)
     * @param movieClipName 动画名
     * @param compFunc 创建完成后回调
     * @param thisObject 回调对象
     */
    export function createMovieClip(resName:string, movieClipName:string, compFunc:any, thisObject:any):void
    {
        if (!_mcDataFactoryMap[resName])
        {
            _mcDataFactoryMap[resName] = {"callerList": []};
        }

        var factoryItem = _mcDataFactoryMap[resName];
        if (factoryItem.factory)
        {
            compFunc.call(thisObject, new egret.MovieClip(factoryItem.factory.generateMovieClipData(movieClipName)));
        }
        else
        {
            var dataRes:any = RES.getRes(resName + "_json");
            var textureRes:any = RES.getRes(resName + "_png");
            if (dataRes && textureRes)
            {
                factoryItem.factory = new egret.MovieClipDataFactory(dataRes, textureRes);
                compFunc.call(thisObject, new egret.MovieClip(factoryItem.factory.generateMovieClipData(movieClipName)));
            }
            else
            {
                factoryItem.callerList.push({
                    "compFunc": compFunc,
                    "thisObject": thisObject,
                    "movieClipName": movieClipName
                });
                if (factoryItem.callerList.length == 1)
                {
                    var urlList:string[] = [resName + ".json", resName + ".png"];
                    LoaderUtils.load(urlList.concat(), function (resList:Object):void
                    {
                        factoryItem.factory = new egret.MovieClipDataFactory(resList[urlList[0]], resList[urlList[1]]);
                        for (var i in factoryItem.callerList)
                        {
                            var caller = factoryItem.callerList[i];
                            caller.compFunc.call(caller.thisObject, new egret.MovieClip(factoryItem.factory.generateMovieClipData(caller.movieClipName)));
                        }
                    }, null, this);
                }
            }
        }
    }

    /**
     * 从图片集中创建MovieClip动画
     * @param resName 资源名(对应name.json与name.png)
     * @param prefix 动画资源前缀
     * @param duration 每帧间隔时间
     * @param compFunc 创建完成后回调
     * @param thisObject 回调对象
     */
    export function createMovieClipFromSpriteSheet(resName:string, prefix:string, duration:number, compFunc:any, thisObject:any):void
    {
        function createMovieClipData(data:any, spriteSheet:egret.SpriteSheet, prefix:string, duration:number):egret.MovieClipData
        {
            var frameRate:number = 24;
            var frames:any[] = [];
            var textureData:any = {};
            var mcData:any = {"frameRate": frameRate, "frames": []};
            var keys:string[] = [];
            for (var key in data.frames)
            {
                textureData[key] = {
                    "x": data.frames[key].x,
                    "y": data.frames[key].y,
                    "w": data.frames[key].w,
                    "h": data.frames[key].h
                };
                if (key.indexOf(prefix) == 0)
                {
                    keys.push(key);
                }
            }
            keys.sort();
            for (var i:number = 0; i < keys.length; i++)
            {
                key = keys[i];
                var frameData:any = data.frames[key];
                var startFrame:any = {"duration": duration, "res": key, "x": frameData.offX, "y": frameData.offY};
                mcData.frames.push(startFrame);

                frames.push(startFrame);
                for (var k:number = 1; k < duration; k++)
                {
                    frames.push({"frame": i * duration + 1});
                }
            }

            var movieClipData:egret.MovieClipData = new egret.MovieClipData();
            movieClipData.frames = frames;
            movieClipData.frameRate = frameRate;
            movieClipData.spriteSheet = spriteSheet;
            movieClipData.textureData = textureData;
            movieClipData.mcData = mcData;

            return movieClipData;
        }

        if (!_spriteSheetMap[resName])
        {
            _spriteSheetMap[resName] = {"callerList": []};
        }

        var spriteSheetItem = _spriteSheetMap[resName];
        if (spriteSheetItem.spriteSheet)
        {
            compFunc.call(thisObject, new egret.MovieClip(createMovieClipData(spriteSheetItem.data, spriteSheetItem.spriteSheet, prefix, duration)));
        }
        else
        {
            spriteSheetItem.callerList.push({
                "compFunc": compFunc,
                "thisObject": thisObject,
                "prefix": prefix,
                "duration": duration
            });
            if (spriteSheetItem.callerList.length == 1)
            {
                var urlList:string[] = [resName + ".json", resName + ".png"];
                LoaderUtils.load(urlList.concat(), function (resList:Object):void
                {
                    spriteSheetItem.data = resList[urlList[0]];
                    spriteSheetItem.spriteSheet = new egret.SpriteSheet(resList[urlList[1]]);
                    for (var i in spriteSheetItem.callerList)
                    {
                        var caller = spriteSheetItem.callerList[i];
                        caller.compFunc.call(caller.thisObject, new egret.MovieClip(createMovieClipData(spriteSheetItem.data, spriteSheetItem.spriteSheet, caller.prefix, caller.duration)));
                    }
                }, null, this);
            }
        }
    }
}  