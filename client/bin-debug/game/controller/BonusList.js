/**
 * 奖励列表
 * @author j
 * 2016/4/12
 */
var BonusList = (function (_super) {
    __extends(BonusList, _super);
    function BonusList() {
        _super.call(this);
        this.list = [];
        this.showing = false;
    }
    var d = __define,c=BonusList,p=c.prototype;
    p.push = function (awardId, cnt, hero) {
        var item = {};
        item["awardId"] = awardId;
        item["cnt"] = cnt;
        item["hero"] = hero;
        item["callback"] = this.showNext;
        item["thisObject"] = this;
        this.list.push(item);
    };
    p.show = function (callback, thisObject) {
        this.callback = callback;
        this.thisObject = thisObject;
        if (this.showing) {
            return;
        }
        this.showing = true;
        this.showNext();
    };
    p.length = function () {
        return this.list.length;
    };
    p.showNext = function () {
        if (this.currentItem) {
            EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
            EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON_COIN);
            EventManager.inst.dispatch(ContextEvent.REFRESH_SOUL_COIN);
        }
        this.currentItem = null;
        if (this.list.length <= 0) {
            this.showing = false;
            if (this.callback != null) {
                this.callback.call(this.thisObject);
            }
        }
        else {
            this.currentItem = this.list.shift();
            PanelManager.inst.showPanel("BonusPanel", this.currentItem);
        }
    };
    return BonusList;
}(egret.HashObject));
egret.registerClass(BonusList,'BonusList');
//# sourceMappingURL=BonusList.js.map