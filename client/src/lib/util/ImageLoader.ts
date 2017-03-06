/**
 * Created by fraser on 2015/12/8.
 */

class ImageLoader extends egret.HashObject {
    private _url: string;
    private _params: any;
    private _callBack: Function;
    private _callBackThis: any;

    public constructor(url: string, params: any, callBack: Function, callBackThis: any)
    {
        super();
        this._url = url;
        this._params = params;
        this._callBack = callBack;
        this._callBackThis = callBackThis;
    }

    public load(headImg: eui.Image): void
    {
        if (this._url != null && this._url != "")
        {
            RES.getResByUrl(this._url,
                function (res: any): void
                {
                    if (this._callBack != null)
                    {
                        this._callBack.call(this._callBackThis, res, this._params);
                    }
                }, this, RES.ResourceItem.TYPE_IMAGE);
        }
        else
        {
            headImg.source = "default_head_img_png";
        }
    }
}