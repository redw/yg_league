/**
 * Created by fraser on 16/11/16.
 */
var PromotionConfig = (function (_super) {
    __extends(PromotionConfig, _super);
    function PromotionConfig(data) {
        _super.call(this);
        this._data = data;
    }
    var d = __define,c=PromotionConfig,p=c.prototype;
    PromotionConfig.init = function (datas) {
        var keys = Object.keys(datas);
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            var cfg = new PromotionConfig(datas[keys[i]]);
            var cfgs;
            if (PromotionConfig._data.containsKey(cfg.type)) {
                cfgs = PromotionConfig._data.getValue(cfg.type);
            }
            else {
                cfgs = [];
                PromotionConfig._data.add(cfg.type, cfgs);
            }
            cfgs.push(cfg);
        }
    };
    PromotionConfig.getConfig = function (type) {
        var rs;
        var cfgs = PromotionConfig._data.getValue(type);
        var len = cfgs.length;
        for (var i = 0; i < len; i++) {
            if (cfgs[i].isInTimeScope) {
                rs = cfgs[i];
                break;
            }
        }
        return rs;
    };
    d(p, "id"
        ,function () {
            return parseInt(this._data["id"]);
        }
    );
    d(p, "isInTimeScope"
        // 活动是否在时间范围内
        ,function () {
            if (UserProxy.inst.server_time > this.timeBegin && UserProxy.inst.server_time < this.timeEnd) {
                return true;
            }
            else {
                return (this.forever == 1);
            }
        }
    );
    d(p, "timeBegin"
        ,function () {
            return parseInt(this._data["time_begin"]) * 1000;
        }
    );
    d(p, "timeEnd"
        ,function () {
            return parseInt(this._data["time_end"]) * 1000;
        }
    );
    d(p, "timeBeginStr"
        ,function () {
            return TimeUtil.formatDate(new Date(this.timeBegin), "/", false);
        }
    );
    d(p, "timeEndStr"
        ,function () {
            return TimeUtil.formatDate(new Date(this.timeEnd), "/", false);
        }
    );
    d(p, "description"
        ,function () {
            return this._data["desc"];
        }
    );
    d(p, "name"
        ,function () {
            return this._data["name"];
        }
    );
    d(p, "type"
        ,function () {
            return parseInt(this._data["type"]);
        }
    );
    d(p, "forever"
        // 是否为永久活动
        ,function () {
            return parseInt(this._data["forever"]);
        }
    );
    PromotionConfig._data = new Dictionary();
    return PromotionConfig;
}(egret.HashObject));
egret.registerClass(PromotionConfig,'PromotionConfig');
