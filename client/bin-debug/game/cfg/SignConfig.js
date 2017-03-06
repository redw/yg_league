/**
 * Created by fraser on 16/11/14.
 */
var SignConfig = (function (_super) {
    __extends(SignConfig, _super);
    function SignConfig(data) {
        _super.call(this);
        this._data = data;
    }
    var d = __define,c=SignConfig,p=c.prototype;
    SignConfig.init = function (datas) {
        var keys = Object.keys(datas);
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            var cfg = new SignConfig(datas[keys[i]]);
            SignConfig._data.add(cfg.id, cfg);
        }
    };
    SignConfig.getConfig = function (id) {
        return SignConfig._data.getValue(id);
    };
    SignConfig.getConfigs = function () {
        return SignConfig._data.getValues();
    };
    d(p, "id"
        ,function () {
            return parseInt(this._data["id"]);
        }
    );
    d(p, "value"
        ,function () {
            return parseInt(this._data["value"]);
        }
    );
    d(p, "type"
        ,function () {
            return parseInt(this._data["type"]);
        }
    );
    d(p, "pic"
        ,function () {
            return this._data["pic"];
        }
    );
    SignConfig._data = new Dictionary();
    return SignConfig;
}(egret.HashObject));
egret.registerClass(SignConfig,'SignConfig');
