/**
 * 解析JSON
 * @author j
 *
 */
class DataConfig extends egret.HashObject
{
    static data:Object;
    static fileList:string[];
    static shortName:Object;

    static initData(data:Object)
    {
        DataConfig.data = data;
        DataConfig.fileList = data["__fileList"];
        DataConfig.shortName = data["__shortName"];
    }

    static getTableData(name:string):Object
    {
        if(DataConfig.fileList.indexOf(name) != -1)
        {
            var dd:Object = DataConfig.data[name];

            for (var tmp in dd)
            {
                var abc:Object = dd[tmp];

                for (var prop in abc)
                {
                    var propName:string = DataConfig.shortName[prop];

                    if (propName != null)
                    {
                        abc[propName] = abc[prop];
                        delete abc[prop];
                    }
                }
            }
        }
        else
        {
            console.error("No Config File Name：[" + name + "]");
        }

        return dd;
    }
}