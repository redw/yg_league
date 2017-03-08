/**
 * 对象池
 * @author j
 *
 */
var ObjectPool;
(function (ObjectPool) {
    var _pool = new Dictionary();
    function cache(key, obj) {
        if (_pool.containsKey(key) == false) {
            _pool.add(key, []);
        }
        var list = _pool.getValue(key);
        list.push(obj);
    }
    ObjectPool.cache = cache;
    function getObj(key) {
        if (_pool.containsKey(key)) {
            var list = _pool.getValue(key);
            if (list.length > 0) {
                return list.shift();
            }
        }
        return null;
    }
    ObjectPool.getObj = getObj;
    /**
     * 清理对象池
     * @param key 模糊匹配，不填则全部清空
     *
     */
    function clear(key) {
        if (key) {
            var delList = [];
            _pool.eachKey(function (eachKey) {
                if (eachKey.indexOf(key) >= 0) {
                    delList.push(eachKey);
                }
            }, this);
            for (var _i = 0, delList_1 = delList; _i < delList_1.length; _i++) {
                var delKey = delList_1[_i];
                _pool.remove(delKey);
            }
        }
        else {
            _pool.clear();
        }
    }
    ObjectPool.clear = clear;
    function toString() {
        var content = "";
        _pool.forEach(function (key, value) {
            content = content + key + " -> " + value.length + "\n";
        }, this);
        if (content == "") {
            return "ObjectPool Content： Empty";
        }
        else {
            return "ObjectPool Content：\n" + content;
        }
    }
    ObjectPool.toString = toString;
})(ObjectPool || (ObjectPool = {}));
