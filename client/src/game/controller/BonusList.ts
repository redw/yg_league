/**
 * 奖励列表
 * @author j
 * 2016/4/12
 */
class BonusList extends egret.HashObject
{
    private list:any[] = [];
    private callback:Function;
    private thisObject:any;

    private showing:boolean = false;
    private currentItem:Object;

    public constructor()
    {
        super();
    }

    public push(awardId:number, cnt:number, hero?:number):void
    {
        var item:any = {};
        item["awardId"] = awardId;
        item["cnt"] = cnt;
        item["hero"] = hero;
        item["callback"] = this.showNext;
        item["thisObject"] = this;
        this.list.push(item);
    }

    public show(callback?:Function, thisObject?:any):void
    {
        this.callback = callback;
        this.thisObject = thisObject;

        if (this.showing)
        {
            return;
        }

        this.showing = true;
        this.showNext();
    }

    public length():number
    {
        return this.list.length;
    }

    private showNext():void
    {
        if (this.currentItem)
        {
            EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
            EventManager.inst.dispatch(ContextEvent.REFRESH_WEAPON_COIN);
            EventManager.inst.dispatch(ContextEvent.REFRESH_SOUL_COIN);
        }
        this.currentItem = null;

        if (this.list.length <= 0)
        {
            this.showing = false;

            if (this.callback != null)
            {
                this.callback.call(this.thisObject);
            }
        }
        else
        {
            this.currentItem = this.list.shift();
            PanelManager.inst.showPanel("BonusPanel", this.currentItem);
        }
    }
}