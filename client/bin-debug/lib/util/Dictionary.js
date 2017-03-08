/**
 * 字典
 * @author j
 *
 */
var Dictionary = (function (_super) {
    __extends(Dictionary, _super);
    function Dictionary() {
        _super.call(this);
        this._length = 0;
        this._content = {};
    }
    var d = __define,c=Dictionary,p=c.prototype;
    /**
     * 长度
     * @return
     *
     */
    p.length = function () {
        return this._length;
    };
    /**
     * 添加键值对，返回key的旧value值，没有则返回null
     * @param key
     * @param value
     * @return
     *
     */
    p.add = function (key, value) {
        if (key == null) {
            console.log("Dictionary.add == Cannot Add Null Key");
            return null;
        }
        if (key in this._content == false) {
            this._length++;
        }
        var temp = this.getValue(key);
        this._content[key] = value;
        return temp;
    };
    /**
     * 移除键值对，返回key的旧value值，没有则返回null
     * @param key
     * @return
     *
     */
    p.remove = function (key) {
        if (key in this._content == false) {
            return null;
        }
        this._length--;
        var temp = this._content[key];
        delete this._content[key];
        return temp;
    };
    /**
     * 通过value获取key
     * @param value
     * @return
     *
     */
    p.getKey = function (value) {
        for (var k in this._content) {
            if (this._content[k] == value) {
                return k;
            }
        }
        return null;
    };
    /**
     * 获取key列表
     * @return
     *
     */
    p.getKeys = function () {
        var temp = [];
        var index = 0;
        for (var k in this._content) {
            temp[index] = k;
            index++;
        }
        return temp;
    };
    /**
     * 通过key获取value
     * @param key
     * @return
     *
     */
    p.getValue = function (key) {
        return this._content[key];
    };
    /**
     * 获取value列表
     * @return
     *
     */
    p.getValues = function () {
        var temp = [];
        var index = 0;
        for (var k in this._content) {
            temp[index] = this._content[k];
            index++;
        }
        return temp;
    };
    /**
     * 是否包含指定key
     * @param key
     * @return
     *
     */
    p.containsKey = function (key) {
        return key in this._content;
    };
    /**
     * 是否包含指定value
     * @param value
     * @return
     *
     */
    p.containsValue = function (value) {
        for (var k in this._content) {
            if (this._content[k] == value) {
                return true;
            }
        }
        return false;
    };
    /**
     * 对key列表的每一项执行测试函数
     * @param fun
     *
     */
    p.eachKey = function (fun, thisObject) {
        for (var k in this._content) {
            fun.call(thisObject, k);
        }
    };
    /**
     * 对value列表的每一项执行测试函数
     * @param fun
     *
     */
    p.eachValue = function (fun, thisObject) {
        for (var k in this._content) {
            fun.call(thisObject, this._content[k]);
        }
    };
    /**
     * 对Dictionary的每一项执行测试函数，第一个参数为key，第二个参数为value
     * @param fun
     *
     */
    p.forEach = function (fun, thisObject) {
        for (var k in this._content) {
            fun.call(thisObject, k, this._content[k]);
        }
    };
    /**
     * 对Dictionary的每一项执行测试函数，第一个参数为key，第二个参数为value，如果测试结果为true，则将此项的value添加进返回的Array中
     * @param fun
     * @return
     *
     */
    p.filter = function (fun, thisObject) {
        var temp = [];
        for (var k in this._content) {
            if (fun.call(thisObject, k, this._content[k]) == true) {
                temp.push(this._content[k]);
            }
        }
        return temp;
    };
    /**
     * 对Dictionary的每一项执行测试函数，第一个参数为key，第二个参数为value，直到获得测试结果为true的项
     * @param fun
     * @return
     *
     */
    p.some = function (fun, thisObject) {
        for (var k in this._content) {
            if (fun.call(thisObject, k, this._content[k]) == false) {
                return true;
            }
        }
        return true;
    };
    /**
     * 对Dictionary的每一项执行测试函数，第一个参数为key，第二个参数为value，直到获得测试结果为false的项
     * @param fun
     * @return
     *
     */
    p.every = function (fun, thisObject) {
        for (var k in this._content) {
            if (fun.call(thisObject, k, this._content[k]) == false) {
                return false;
            }
        }
        return true;
    };
    /**
     * 清空
     *
     */
    p.clear = function () {
        this._length = 0;
        this._content = {};
    };
    /**
     * 克隆
     * @return
     *
     */
    p.clone = function () {
        var temp = new Dictionary();
        for (var k in this._content) {
            temp.add(k, this._content[k]);
        }
        return temp;
    };
    /**
     * 返回Dictionary的字符串描述信息
     * @return
     *
     */
    p.toString = function () {
        var content = "";
        for (var k in this._content) {
            content = content + k + " -> " + this._content[k] + "\n";
        }
        if (content == "") {
            return "Dictionary Content： Empty";
        }
        else {
            return "Dictionary Content：\n" + content;
        }
    };
    return Dictionary;
}(egret.HashObject));
egret.registerClass(Dictionary,'Dictionary');
