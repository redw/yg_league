/**
 * Created by fraser on 16/11/16.
 */


class PromotionConfig extends egret.HashObject {


    static _data: Dictionary = new Dictionary();

    static init(datas: Object) {
        var keys: string[] = Object.keys(datas);
        var len: number = keys.length;
        for (var i: number = 0; i < len; i++) {
            var cfg: PromotionConfig = new PromotionConfig(datas[keys[i]]);
            var cfgs: PromotionConfig[];
            if (PromotionConfig._data.containsKey(cfg.type)) {
                cfgs = PromotionConfig._data.getValue(cfg.type);
            }
            else {
                cfgs = [];
                PromotionConfig._data.add(cfg.type, cfgs);
            }
            cfgs.push(cfg);
        }
    }

    static getConfig(type: number): PromotionConfig {
        var rs: PromotionConfig;
        var cfgs: PromotionConfig[] = PromotionConfig._data.getValue(type);
        var len: number = cfgs.length;
        for (var i: number = 0; i < len; i++) {
            if (cfgs[i].isInTimeScope) {
                rs = cfgs[i];
                break;
            }
        }
        return rs;
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

    // 活动是否在时间范围内
    get isInTimeScope(): boolean {
        if (UserProxy.inst.server_time > this.timeBegin && UserProxy.inst.server_time < this.timeEnd) {
            return true;
        }
        else {
            return (this.forever == 1);
        }
    }

    get timeBegin(): number {
        return parseInt(this._data["time_begin"]) * 1000;
    }

    get timeEnd(): number {
        return parseInt(this._data["time_end"]) * 1000;
    }

    get timeBeginStr(): string {
        return TimeUtil.formatDate(new Date(this.timeBegin), "/", false);
    }

    get timeEndStr(): string {
        return TimeUtil.formatDate(new Date(this.timeEnd), "/", false);
    }

    get description(): string {
        return this._data["desc"];
    }

    get name(): string {
        return this._data["name"];
    }

    get type(): number {
        return parseInt(this._data["type"]);
    }

    // 是否为永久活动
    get forever(): number {
        return parseInt(this._data["forever"]);
    }

    // "2": {
    //     "desc": "",
    //     "id": 2,
    //     "name": "海盗寻宝",
    //     "time_begin": 1479139200,
    //     "page": "ActiveCardPage",
    //     "time_end": 1479744000,
    //     "icon": 2,
    //     "type": 2,
    //     "forever":0,
    //     "area":1,
    //     "prize" : [
    //
    //         ]
    // },
}