/**
 * Created by fraser on 16/11/14.
 */

class SignConfig extends egret.HashObject {

    static _data: Dictionary = new Dictionary();

    static init(datas: Object) {
        var keys: string[] = Object.keys(datas);
        var len: number = keys.length;
        for (var i: number = 0; i < len; i++) {
            var cfg: SignConfig = new SignConfig(datas[keys[i]]);
            SignConfig._data.add(cfg.id, cfg);
        }
    }

    static getConfig(id: number): SignConfig {
        return SignConfig._data.getValue(id);
    }

    static getConfigs(): SignConfig[] {
        return SignConfig._data.getValues();
    }

    //////////////////////////////////////////////////////////////////////
    //
    //                              DEFINE
    //
    //////////////////////////////////////////////////////////////////////

    private _data: any;

    constructor(data: any) {
        super();
        this._data = data;
    }

    get id(): number {
        return parseInt(this._data["id"]);
    }

    get value(): number {
        return parseInt(this._data["value"]);
    }

    get type(): number {
        return parseInt(this._data["type"]);
    }

    get pic(): string {
        return this._data["pic"];
    }

    // "value": 80000,
    // "pic": 1,
    // "type": 1,
    // "id": 1
}