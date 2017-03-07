/**
 * Created by fraser on 2015/12/8.
 */
var ImageLoader = (function (_super) {
    __extends(ImageLoader, _super);
    function ImageLoader(url, params, callBack, callBackThis) {
        _super.call(this);
        this._url = url;
        this._params = params;
        this._callBack = callBack;
        this._callBackThis = callBackThis;
    }
    var d = __define,c=ImageLoader,p=c.prototype;
    p.load = function (headImg) {
        if (this._url != null && this._url != "") {
            RES.getResByUrl(this._url, function (res) {
                if (this._callBack != null) {
                    this._callBack.call(this._callBackThis, res, this._params);
                }
            }, this, RES.ResourceItem.TYPE_IMAGE);
        }
        else {
            headImg.source = "default_head_img_png";
        }
    };
    return ImageLoader;
}(egret.HashObject));
egret.registerClass(ImageLoader,'ImageLoader');
//# sourceMappingURL=ImageLoader.js.map