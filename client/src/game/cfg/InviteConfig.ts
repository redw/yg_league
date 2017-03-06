/**
 * Created by fraser on 16/11/14.
 */

class InviteConfig extends egret.HashObject {


    static _data: Dictionary = new Dictionary();

    static init(datas: Object)
    {
        var keys: string[] = Object.keys(datas);
        var len: number = keys.length;
        for (var i: number = 0; i < len; i++)
        {
            var cfg: InviteConfig = new InviteConfig(datas[keys[i]]);
            InviteConfig._data.add(cfg.id, cfg);
        }
    }

    static getConfig(id: number): InviteConfig
    {
        return InviteConfig._data.getValue(id);
    }

    static getConfigs(): InviteConfig[]
    {
        return InviteConfig._data.getValues();
    }


    //////////////////////////////////////////////////////////////////////
    //
    //                              DEFINE
    //
    //////////////////////////////////////////////////////////////////////

    private _data: any;

    constructor(data: any)
    {
        super();
        this._data = data;
    }

    get id(): number
    {
        return parseInt(this._data["id"]);
    }

    get value(): number
    {
        return parseInt(this._data["value"]);
    }

    get need(): number
    {
        return parseInt(this._data["need"]);
    }

    get description(): string
    {
        return this._data["description"];
    }

    // "value": 20,
    // "need": 1,
    // "id": 1,
    // "description": "邀请到1名好友"
}