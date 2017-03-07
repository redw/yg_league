/**
 * 数组工具
 * @author j
 * 2016/5/26
 */
var ArrayUtil;
(function (ArrayUtil) {
    function remove(array, item, global) {
        var index;
        if (global == null) {
            global = false;
        }
        if (global) {
            while (true) {
                index = array.indexOf(item);
                if (index >= 0) {
                    array.splice(array.indexOf(item), 1);
                }
                else {
                    break;
                }
            }
        }
        else {
            index = array.indexOf(item);
            if (index >= 0) {
                array.splice(array.indexOf(item), 1);
            }
        }
        return index >= 0;
    }
    ArrayUtil.remove = remove;
    function getRandomItem(array, length, repeat) {
        var temp = [];
        if (length == null) {
            length = 1;
        }
        if (repeat == null) {
            repeat = false;
        }
        if (array.length <= 0) {
            return temp;
        }
        else {
            while (temp.length < length) {
                var item = array[Math.floor(array.length * Math.random())];
                if (repeat) {
                    temp.push(item);
                }
                else {
                    if (temp.indexOf(item) < 0) {
                        temp.push(item);
                    }
                }
            }
            return temp;
        }
    }
    ArrayUtil.getRandomItem = getRandomItem;
    function addIncrementProperty(array, name, minValue) {
        if (minValue == null) {
            minValue = 0;
        }
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            item[name] = minValue;
            minValue++;
        }
    }
    ArrayUtil.addIncrementProperty = addIncrementProperty;
})(ArrayUtil || (ArrayUtil = {}));
//# sourceMappingURL=ArrayUtil.js.map