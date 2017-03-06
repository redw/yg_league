/**
 * 数组工具
 * @author j
 * 2016/5/26
 */
module ArrayUtil
{
    export function remove(array:any[], item:any, global?:boolean):boolean
    {
        var index:number;

        if (global == null)
        {
            global = false;
        }

        if (global)
        {
            while (true)
            {
                index = array.indexOf(item);

                if (index >= 0)
                {
                    array.splice(array.indexOf(item), 1);
                }
                else
                {
                    break;
                }
            }
        }
        else
        {
            index = array.indexOf(item);

            if (index >= 0)
            {
                array.splice(array.indexOf(item), 1);
            }
        }

        return index >= 0;
    }

    export function getRandomItem(array:any[], length?:number, repeat?:boolean):any[]
    {
        var temp:any[] = [];

        if (length == null)
        {
            length = 1;
        }
        if (repeat == null)
        {
            repeat = false;
        }

        if (array.length <= 0)
        {
            return temp;
        }
        else
        {
            while (temp.length < length)
            {
                var item:any = array[Math.floor(array.length * Math.random())];

                if (repeat)
                {
                    temp.push(item);
                }
                else
                {
                    if (temp.indexOf(item) < 0)
                    {
                        temp.push(item);
                    }
                }
            }
            return temp;
        }
    }

    export function addIncrementProperty(array:any[], name:string, minValue?:number):void
    {
        if (minValue == null)
        {
            minValue = 0;
        }

        for (var i:number = 0; i < array.length; i++)
        {
            var item:any = array[i];
            item[name] = minValue;

            minValue++;
        }
    }
}