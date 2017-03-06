/**
 * 对象池
 * @author j
 *
 */
module ObjectPool
{
    var _pool:Dictionary = new Dictionary();

    export function cache(key:string, obj:any):void
    {
        if (_pool.containsKey(key) == false)
        {
            _pool.add(key, []);
        }

        var list:any[] = _pool.getValue(key);
        list.push(obj);
    }

    export function getObj(key:string):any
    {
        if (_pool.containsKey(key))
        {
            var list:any[] = _pool.getValue(key);

            if (list.length > 0)
            {
                return list.shift();
            }
        }

        return null;
    }

    /**
     * 清理对象池
     * @param key 模糊匹配，不填则全部清空
     *
     */
    export function clear(key?:string):void
    {
        if (key)
        {
            var delList:string[] = [];

            _pool.eachKey(function(eachKey:string):void
            {
                if (eachKey.indexOf(key) >= 0)
                {
                    delList.push(eachKey);
                }
            }, this);

            for (var delKey of delList)
            {
                _pool.remove(delKey);
            }
        }
        else
        {
            _pool.clear();
        }
    }

    export function toString():string
    {
        var content:string = "";

        _pool.forEach(function(key:any, value:any):void
        {
            content = content + key + " -> " + value.length + "\n";
        }, this);

        if (content == "")
        {
            return "ObjectPool Content： Empty";
        }
        else
        {
            return "ObjectPool Content：\n" + content;
        }
    }
}