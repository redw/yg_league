/**
 * 位操作
 * @author j
 * 2016/11/23
 */
module BitUtil
{
    /**
     * 获取位
     * @param value
     * @param index
     * @return
     *
     */
    export function getBit(value:number, index:number):Boolean
    {
        return value == (value | (1 << index));
    }

    /**
     * 设置位
     * @param value
     * @param index
     * @return
     *
     */
    export function setBit(value:number, index:number, bool:Boolean):number
    {
        if(bool)
        {
            value = value | (1 << index);
        }
        else
        {
            value = value & ~(1 << index);
        }
        return value;
    }

    /**
     * 返回布尔数组
     * @param value
     * @param len
     * @return
     *
     */
    export function toBitArray(value:number, len:number):boolean[]
    {
        var temp:boolean[] = [];

        for(var i:number = 0; i < len; i++)
        {
            temp[i] = Boolean(value & 1);
            value = value >> 1;
        }
        return temp;
    }

    export function isBitTrueByString(position:number, source:string):boolean
    {
        position = source.length - position - 1;
        if (position < source.length)
        {
            return parseInt(source.charAt(position)) == 1;
        }
        else
        {
            return false;
        }
    }
}