/**
 * Created by fraser on 16/8/17.
 */
var TimeUtil;
(function (TimeUtil) {
    /**
     * @param date
     * @param hourEnable
     * @returns {string}  '2016/11/22 09:11'
     */
    function formatDate(date, seq, hourEnable) {
        if (seq === void 0) { seq = "/"; }
        if (hourEnable === void 0) { hourEnable = true; }
        var hour = date.getHours();
        var min = date.getMinutes();
        var hourStr = hour >= 10 ? (hour + "") : ("0" + hour);
        var minStr = min >= 10 ? (min + "") : ("0" + min);
        if (hourEnable) {
            return date.getFullYear() + seq + (date.getMonth() + 1) + seq + date.getDate() + " " +
                hourStr + ":" + minStr;
        }
        else {
            return date.getFullYear() + seq + (date.getMonth() + 1) + seq + date.getDate();
        }
    }
    TimeUtil.formatDate = formatDate;
    /**
     * 毫秒变成00:00:00这种字符串
     * @param time (ms)
     * @returns {string}  '06:23:11'
     */
    function timeToString(time, needHour) {
        if (needHour === void 0) { needHour = false; }
        // time = time * 0.001;
        //
        if (time >= 3600) {
            needHour = true;
        }
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time - (hours * 3600)) / 60);
        var seconds = Math.floor(time - hours * 3600 - minutes * 60);
        var strTime = "";
        if (needHour) {
            strTime += ((hours > 9 ? hours : ("0" + hours)) + ":");
        }
        strTime += ((minutes > 9 ? minutes : ("0" + minutes)) + ":");
        strTime += (seconds > 9 ? seconds : ("0" + seconds));
        //
        return strTime;
    }
    TimeUtil.timeToString = timeToString;
})(TimeUtil || (TimeUtil = {}));
//# sourceMappingURL=TimeUtil.js.map