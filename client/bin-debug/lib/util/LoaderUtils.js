/**
 * 加载工具类: 多个资源加载完成后回调
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var LoaderUtils;
(function (LoaderUtils) {
    function load(urlList, compFunc, progFunc, thisObject) {
        var resList = {};
        var urlLen = urlList.length;
        function next() {
            var url = urlList.shift();
            RES.getResByUrl(url, function (res) {
                resList[url] = res;
                if (progFunc) {
                    progFunc.call(thisObject, (urlLen - urlList.length) / urlLen);
                }
                if (urlList.length <= 0) {
                    compFunc.call(thisObject, resList);
                }
                else {
                    next();
                }
            }, this);
        }
        next();
    }
    LoaderUtils.load = load;
    /**
     * 可传参式加载图片
     * @param url
     * @param params
     * @param callback
     * @param thisObject
     */
    function loadImage(url, params, callback, thisObject) {
        RES.getResByUrl(url, function (res) {
            if (callback != null) {
                callback.call(thisObject, res, params);
            }
        }, this, RES.ResourceItem.TYPE_IMAGE);
    }
    LoaderUtils.loadImage = loadImage;
})(LoaderUtils || (LoaderUtils = {}));
//# sourceMappingURL=LoaderUtils.js.map