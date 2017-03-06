/**
 * 加载工具类: 多个资源加载完成后回调
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
module LoaderUtils
{
    export function load(urlList:string[], compFunc:any, progFunc:any, thisObject:any):void
    {
        var resList:Object = {};
        var urlLen:number = urlList.length;
        function next():void
        {
            var url:string = urlList.shift();
            RES.getResByUrl(url, function(res: any):void
                {
                    resList[url] = res;

                    if (progFunc)
                    {
                        progFunc.call(thisObject, (urlLen - urlList.length) / urlLen);
                    }

                    if (urlList.length <= 0)
                    {
                        compFunc.call(thisObject, resList);
                    }
                    else
                    {
                        next();
                    }
                }, this);
        }
        next();
    }

    /**
     * 可传参式加载图片
     * @param url
     * @param params
     * @param callback
     * @param thisObject
     */
    export function loadImage(url:string, params:any, callback:Function, thisObject:any):void
    {
        RES.getResByUrl(url, function (res:any):void
        {
            if (callback != null)
            {
                callback.call(thisObject, res, params);
            }
        }, this, RES.ResourceItem.TYPE_IMAGE);
    }
}  