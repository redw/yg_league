/**
 * Created by Administrator on 12/21 0021.
 */
class DailyAchievePanel extends BasePanel
{
    private imgDaily:AutoBitmap;
    private imgAchieve:AutoBitmap;
    private list:eui.List;
    private btnClose:SimpleButton;
    public coinShow:CoinShowPanel;

    private _lastSelect:AutoBitmap;

    private _lastVerticalScrollPos: number = 0;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = DailyAchievePanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init():void
    {
        Http.inst.addCmdListener(CmdID.TASK,this.onTaskRefresh,this);
        Http.inst.addCmdListener(CmdID.ACHIEVEMENT,this.checkAchievePoint,this);
        this.imgDaily.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.imgAchieve.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.list.itemRenderer = DailyAchieveRenderer;
        this.coinShow.startListener();
    }

    public initData():void
    {
        if(this.data == 1)
        {
            this.imgDaily.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
        else
        {
            this.imgAchieve.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }

        this.checkAchievePoint();
        this.checkDailyPoint();
    }

    private checkAchievePoint():void
    {
        UserMethod.inst.removeRedPoint(this.imgAchieve.parent,"ach");
        if(UserMethod.inst._achievePointShow)
        {
            UserMethod.inst.addRedPoint(this.imgAchieve.parent,"ach",new egret.Point(this.imgAchieve.x + 80 ,this.imgAchieve.y + 10));
        }
    }

    private checkDailyPoint():void
    {
        UserMethod.inst.removeRedPoint(this.imgDaily.parent,"daily");
        if(UserMethod.inst._dailyPointShow)
        {
            UserMethod.inst.addRedPoint(this.imgDaily.parent,"daily",new egret.Point(this.imgDaily.x + 80 ,this.imgDaily.y + 10));
        }
    }


    private onTaskRefresh(event: egret.Event): void
    {
        this._lastVerticalScrollPos = this.list.scrollV;
        this.refresh();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        this.checkDailyPoint();
    }

    private onEnterFrame(event: egret.Event): void
    {
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        this.list.scrollV = this._lastVerticalScrollPos;
    }

    private onTouch(e:egret.TouchEvent):void
    {
        if(this._lastSelect && this._lastSelect == e.currentTarget)
        {
            return;
        }

        if(e.currentTarget == this.imgDaily)
        {
            if(UserProxy.inst.historyArea < 10)
            {
                Notice.show("通过10关后开启！");
                return;
            }

            this.imgDaily.source = "daily_touch_png";
            this.imgAchieve.source = "achieve_normal_png";
            UserMethod.inst.daily_achieve = 1;
        }
        else
        {
            this.imgAchieve.source = "achieve_touch_png";
            this.imgDaily.source = "daily_normal_png";
            UserMethod.inst.daily_achieve = 2;
        }
        this._lastSelect = e.currentTarget;
        this.refresh();

    }

    private refresh():void
    {
        var ids:number[] = [];
        var canGetIds:number[] = [];
        var showIds:number[] = [];
        var downIds:number[] = [];
        if(UserMethod.inst.daily_achieve == 1)
        {
            ids = [1,2,3,4,5,6,7,8,10,11,12,13,14];
            var length:number = ids.length;
            for(var i:number = 0; i < length; i++)
            {
                var currentData:any = null;
                var nextData:any = null;

                for (var c in Config.DailyTaskData)
                {
                    var dailyData:any = Config.DailyTaskData[c];
                    if (parseInt(dailyData["task_type"]) == ids[i])
                    {
                        nextData = dailyData;
                        if (!UserMethod.inst.isBitGet(parseInt(dailyData["id"]),UserProxy.inst.taskBit))
                        {
                            currentData = dailyData;
                            break;
                        }
                    }
                }
                if(currentData)
                {
                    var endParm:number = currentData["task_parm"];
                    var nowParm:number = UserMethod.inst.dailyNowPar(currentData["task_type"]);
                    if(nowParm >= endParm)
                    {
                        canGetIds.push((ids[i]));
                    }
                    else
                    {
                        showIds.push((ids[i]));
                    }
                }
                else
                {
                    downIds.push(ids[i])
                }
            }
            this.list.dataProvider = new eui.ArrayCollection(canGetIds.concat(showIds,downIds));
        }
        else
        {
            var canGetIds:number[] = [];
            var showIds:number[] = [];
            var downIds:number[] = [];
            ids = [1,2,3,4,5,6,7,8,11,12,13,14,15];
            var length:number = ids.length;
            for(var i:number = 0; i < length; i++)
            {
                var currentData:any = null;
                var nextData:any = null;

                for (var c in Config.AchievementData)
                {
                    var achievementData:any = Config.AchievementData[c];
                    if (parseInt(achievementData["achv_type"] ) == ids[i])
                    {
                        nextData = achievementData;

                        if (!UserMethod.inst.isBitGet(parseInt(achievementData["id"]),UserProxy.inst.achieveBit))
                        {
                            currentData = achievementData;
                            break;
                        }
                    }
                }

                if (currentData)
                {
                    var endParm:number = currentData["achv_parm"];
                    var nowParm:number = UserMethod.inst.achieveNowPar(achievementData["achv_type"] );
                    if(nowParm >= endParm)
                    {
                        canGetIds.push((ids[i]));
                    }
                    else
                    {
                        showIds.push((ids[i]));
                    }
                }
                else
                {
                    downIds.push(ids[i])
                }
            }

            this.list.dataProvider = new eui.ArrayCollection(canGetIds.concat(showIds,downIds));
        }

    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("DailyAchievePanel");
    }


    public destory():void
    {
        super.destory();
        Http.inst.removeCmdListener(CmdID.TASK,this.onTaskRefresh,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.imgDaily.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.imgAchieve.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.coinShow.endListener();
    }
}