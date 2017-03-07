/**
 * 统计包装
 * by Fraser
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var TDGAUtil;
(function (TDGAUtil) {
    //在enter协议返回时调用下
    function initACount() {
        try {
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
        catch (e) {
        }
    }
    TDGAUtil.initACount = initACount;
    //记录付费点
    function onItemPurchase(item, count) {
        if (count === void 0) { count = 1; }
        try {
            window["TDGA"].onItemPurchase({
                item: item,
                itemNumber: count
            });
        }
        catch (e) {
        }
    }
    TDGAUtil.onItemPurchase = onItemPurchase;
    //消耗物品或服务等
    function onItemUse(item, count) {
        if (count === void 0) { count = 1; }
        try {
            window["TDGA"].onItemUse({
                item: item,
                itemNumber: count
            });
        }
        catch (e) {
        }
    }
    TDGAUtil.onItemUse = onItemUse;
    //赠予虚拟币，例子: TDGA.onReward(100, '新手奖励');
    function onReward(amount, reason) {
        try {
            window["TDGA"].onReward(amount, reason);
        }
        catch (e) {
        }
    }
    TDGAUtil.onReward = onReward;
})(TDGAUtil || (TDGAUtil = {}));
//# sourceMappingURL=TDGAUtil.js.map