/**
 * Copyright (c) 2015-2018, YG Technology Inc.
 * Created by fraser on 17/1/14 下午12:43 .
 * EMAIL: fraser@11h5.com
 * Description :
 */
var BaseShareType = (function (_super) {
    __extends(BaseShareType, _super);
    function BaseShareType() {
        _super.apply(this, arguments);
    }
    var d = __define,c=BaseShareType,p=c.prototype;
    p.getTextureByBase64 = function (data, callback, cbThis) {
        var img = new Image();
        img.src = data;
        img.onload = function () {
            var texture = new egret.Texture();
            var bitmapdata = new egret.BitmapData(img);
            texture._setBitmapData(bitmapdata);
            //
            callback.call(cbThis, texture);
        };
    };
    return BaseShareType;
}(egret.HashObject));
egret.registerClass(BaseShareType,'BaseShareType');
//# sourceMappingURL=BaseShareType.js.map