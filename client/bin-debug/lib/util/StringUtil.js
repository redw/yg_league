/**
 * 字符串工具
 * @author j
 *
 */
var StringUtil;
(function (StringUtil) {
    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    StringUtil.trim = trim;
    function getCharLength(str) {
        var length = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                length = length + 2;
            }
            else {
                length++;
            }
        }
        return length;
    }
    StringUtil.getCharLength = getCharLength;
    function getQueryString(str) {
        var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
        var result = window.location.search.substr(1).match(reg);
        return result != null ? eval(result[2]) : null;
    }
    StringUtil.getQueryString = getQueryString;
    function decodeName(name) {
        var result = "玩家";
        if (name) {
            try {
                result = decodeURIComponent(name);
            }
            catch (e) {
                result = "玩家";
            }
        }
        result = result.replace(new RegExp("/( )/g"), "");
        if (result.length > 8) {
            result = result.substr(0, 6) + "...";
        }
        return result;
    }
    StringUtil.decodeName = decodeName;
    function convertImgURLTo64(url) {
        return url.replace(/\/0$/, "\/64");
    }
    StringUtil.convertImgURLTo64 = convertImgURLTo64;
    function timeToString(time, showHour) {
        if (showHour === void 0) { showHour = true; }
        if (time < 0) {
            time = 0;
        }
        var hou = Math.floor(time / 3600);
        var min = Math.floor((time % 3600) / 60);
        var sec = Math.floor(time % 60);
        if (showHour) {
            return StringUtil.unshiftZero(hou, 2) + ":" + StringUtil.unshiftZero(min, 2) + ":" + StringUtil.unshiftZero(sec, 2);
        }
        else {
            return StringUtil.unshiftZero(min, 2) + ":" + StringUtil.unshiftZero(sec, 2);
        }
    }
    StringUtil.timeToString = timeToString;
    function dateToString(date, showSecond) {
        if (showSecond) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
                + StringUtil.unshiftZero(date.getHours(), 2) + ":" + StringUtil.unshiftZero(date.getMinutes(), 2) + ":" + StringUtil.unshiftZero(date.getSeconds(), 2);
        }
        else {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
                + StringUtil.unshiftZero(date.getHours(), 2) + ":" + StringUtil.unshiftZero(date.getMinutes(), 2);
        }
    }
    StringUtil.dateToString = dateToString;
    function unshiftZero(value, toLength) {
        var str = value.toString();
        while (str.length < toLength) {
            str = "0" + str;
        }
        return str;
    }
    StringUtil.unshiftZero = unshiftZero;
    function toFixed(value, fractionDigits) {
        return value ? parseFloat(value.toFixed(fractionDigits ? fractionDigits : 0)) : 0;
    }
    StringUtil.toFixed = toFixed;
    function addWarp(text, limit) {
        if (text == null) {
            return "";
        }
        var len = 0;
        for (var i = 0; i < text.length; i++) {
            var c = text.charCodeAt(i);
            if (c == 10) {
                len = 0;
            }
            else {
                if (c < 0x7F) {
                    len++;
                }
                else if (c >= 0x80 && c < 0x7FF) {
                    len += 2;
                }
                else if ((c >= 0x800 && c < 0xD7FF) || (c >= 0xE000 && c < 0xFFFF)) {
                    len += 2;
                }
                else if (c >= 0x10000 && c < 0x10FFFF) {
                    len += 2;
                }
                if (len >= limit) {
                    text = text.substr(0, i + 1) + "\n" + text.substr(i + 1);
                    len = 0;
                    i++;
                }
            }
        }
        return text;
    }
    StringUtil.addWarp = addWarp;
    /**
     * 描述中的A、B、N
     * @param1? 替换A
     * @paramPer1? 是否显示%
     * @param2? 替换B
     * @paramPer2? 是否显示%
     * @returns {string}
     */
    function replaceDescribe(des) {
        var str = des;
        while (str.indexOf("N") != -1) {
            str = str.replace("N", "\n");
        }
        return str;
    }
    StringUtil.replaceDescribe = replaceDescribe;
})(StringUtil || (StringUtil = {}));
