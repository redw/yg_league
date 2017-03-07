/**
 * Created by fraser on 16/11/14.
 */
var InviteConfig = (function (_super) {
    __extends(InviteConfig, _super);
    function InviteConfig(data) {
        _super.call(this);
        this._data = data;
    }
    var d = __define,c=InviteConfig,p=c.prototype;
    InviteConfig.init = function (datas) {
        var keys = Object.keys(datas);
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            var cfg = new InviteConfig(datas[keys[i]]);
            InviteConfig._data.add(cfg.id, cfg);
        }
    };
    InviteConfig.getConfig = function (id) {
        return InviteConfig._data.getValue(id);
    };
    InviteConfig.getConfigs = function () {
        return InviteConfig._data.getValues();
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
    d(p, "need"
        ,function () {
            return parseInt(this._data["need"]);
        }
    );
    d(p, "description"
        ,function () {
            return this._data["description"];
        }
    );
    InviteConfig._data = new Dictionary();
    return InviteConfig;
}(egret.HashObject));
egret.registerClass(InviteConfig,'InviteConfig');
//# sourceMappingURL=InviteConfig.js.map