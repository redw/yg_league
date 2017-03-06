/**
 * Created by fraser on 16/8/17.
 */

module TimeUtil {

    /**
     * @param date
     * @param hourEnable
     * @returns {string}  '2016/11/22 09:11'
     */
    export function formatDate(date: Date, seq: string = "/", hourEnable: boolean = true): string {
        var hour: number = date.getHours();
        var min: number = date.getMinutes();
        var hourStr: string = hour >= 10 ? (hour + "") : ("0" + hour);
        var minStr: string = min >= 10 ? (min + "") : ("0" + min);

        if (hourEnable) {
            return date.getFullYear() + seq + (date.getMonth() + 1) + seq + date.getDate() + " " +
                hourStr + ":" + minStr;
        }
        else {
            return date.getFullYear() + seq + (date.getMonth() + 1) + seq + date.getDate();
        }
    }
    /**
     * 毫秒变成00:00:00这种字符串
     * @param time (ms)
     * @returns {string}  '06:23:11'
     */
    export function timeToString(time: number, needHour: boolean = false): string {
        // time = time * 0.001;
        //
        if(time >= 3600)
        {
            needHour = true;
        }
        var hours: number = Math.floor(time / 3600);
        var minutes: number = Math.floor((time - (hours * 3600)) / 60);
        var seconds: number = Math.floor(time - hours * 3600 - minutes * 60);
        var strTime = "";
        if (needHour) {
            strTime += ((hours > 9 ? hours : ("0" + hours)) + ":");
        }
        strTime += ((minutes > 9 ? minutes : ("0" + minutes)) + ":");
        strTime += (seconds > 9 ? seconds : ("0" + seconds));
        //
        return strTime;
    }

}