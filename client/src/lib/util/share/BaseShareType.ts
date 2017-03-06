/**
 * Copyright (c) 2015-2018, YG Technology Inc.
 * Created by fraser on 17/1/14 下午12:43 .
 * EMAIL: fraser@11h5.com
 * Description :
 */


class BaseShareType extends egret.HashObject {

    protected getTextureByBase64(data: string, callback: Function, cbThis: any): void {
        var img: HTMLImageElement = new Image();
        img.src = data;
        img.onload = function () {
            var texture = new egret.Texture();
            var bitmapdata = new egret.BitmapData(img);
            texture._setBitmapData(bitmapdata);
            //
            callback.call(cbThis, texture);
        }
    }
}