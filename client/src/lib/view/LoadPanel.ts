/**
 * 加载游戏界面
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
class LoadPanel extends BasePanel
{
    public txtContent:eui.Label;
    private _callback:Function;
    private _thisObject:any;

    public constructor()
    {
        super();
        this.skinName = LoadingPanelSkin;
        this._mutex = true;
        this._layer = PanelManager.TOP_LAYER;
        this.verticalCenter = 0;
        this.horizontalCenter = 0;
    }

    public destory():void
    {
        super.destory();

    }

    public init():void
    {


    }

    public initData():void
    {
        super.initData();
        this._callback = this._data.callback;
        this._thisObject = this._data.thisObject;
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("main");
    }

    /**
     * preload资源组加载完成
     * @param event
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void
    {
        if (event.groupName == "main")
        {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this._callback.call(this._thisObject);
        }
    }

    /**
     * preload资源组加载进度
     * @param event
     */
    private onResourceProgress(event:RES.ResourceEvent):void
    {
        if (event.groupName == "main")
        {
            this.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    public setProgress(current, total):void
    {
        this.txtContent.text = current + "/" + total + " 资源加载中...";
    }
}