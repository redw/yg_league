/**
 * 解析JSON
 * @author j
 *
 */
var DataConfig = (function (_super) {
    __extends(DataConfig, _super);
    function DataConfig() {
        _super.apply(this, arguments);
    }
    var d = __define,c=DataConfig,p=c.prototype;
    DataConfig.initData = function (data) {
        DataConfig.data = data;
        DataConfig.fileList = data["__fileList"];
        DataConfig.shortName = data["__shortName"];
    };
    DataConfig.getTableData = function (name) {
        if (DataConfig.fileList.indexOf(name) != -1) {
            var dd = DataConfig.data[name];
            for (var tmp in dd) {
                var abc = dd[tmp];
                for (var prop in abc) {
                    var propName = DataConfig.shortName[prop];
                    if (propName != null) {
                        abc[propName] = abc[prop];
                        delete abc[prop];
                    }
                }
            }
        }
        else {
            console.error("No Config File Name：[" + name + "]");
        }
        return dd;
    };
    return DataConfig;
}(egret.HashObject));
egret.registerClass(DataConfig,'DataConfig');
