/**
 * 位操作
 * @author j
 * 2016/11/23
 */
var BitUtil;
(function (BitUtil) {
    /**
     * 获取位
     * @param value
     * @param index
     * @return
     *
     */
    function getBit(value, index) {
        return value == (value | (1 << index));
    }
    BitUtil.getBit = getBit;
    /**
     * 设置位
     * @param value
     * @param index
     * @return
     *
     */
    function setBit(value, index, bool) {
        if (bool) {
            value = value | (1 << index);
        }
        else {
            value = value & ~(1 << index);
        }
        return value;
    }
    BitUtil.setBit = setBit;
    /**
     * 返回布尔数组
     * @param value
     * @param len
     * @return
     *
     */
    function toBitArray(value, len) {
        var temp = [];
        for (var i = 0; i < len; i++) {
            temp[i] = Boolean(value & 1);
            value = value >> 1;
        }
        return temp;
    }
    BitUtil.toBitArray = toBitArray;
    function isBitTrueByString(position, source) {
        position = source.length - position - 1;
        if (position < source.length) {
            return parseInt(source.charAt(position)) == 1;
        }
        else {
            return false;
        }
    }
    BitUtil.isBitTrueByString = isBitTrueByString;
})(BitUtil || (BitUtil = {}));
