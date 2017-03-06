/**
 * 统计包装
 * by Fraser
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
module TDGAUtil
{
    //在enter协议返回时调用下
    export function initACount():void
    {
        try
        {
            window["TDGA"].Account({
                accountId: UserProxy.inst.uid,
                level: 0,
                gameServer: "",
                accountType: 0,
                age: 0,
                accountName: UserProxy.inst.nickname,
                gender: 0
            });
        }
        catch (e)
        {
        }
    }

    //记录付费点
    export function onItemPurchase(item:string, count:number = 1):void
    {
        try
        {
            window["TDGA"].onItemPurchase({
                item: item,
                itemNumber: count
            });
        }
        catch (e)
        {
        }
    }

    //消耗物品或服务等
    export function onItemUse(item:string, count:number = 1):void
    {
        try
        {
            window["TDGA"].onItemUse({
                item: item,
                itemNumber: count
            });
        }
        catch (e)
        {
        }
    }

    //赠予虚拟币，例子: TDGA.onReward(100, '新手奖励');
    export function onReward(amount:number, reason:string):void
    {
        try
        {
            window["TDGA"].onReward(amount, reason);
        }
        catch (e)
        {
        }
    }
}