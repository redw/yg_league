/**
 * 加载游戏界面
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var LoadPanel = (function (_super) {
    __extends(LoadPanel, _super);
    function LoadPanel() {
        _super.call(this);
        this.skinName = LoadingPanelSkin;
        this._mutex = true;
        this._layer = PanelManager.TOP_LAYER;
        this.verticalCenter = 0;
        this.horizontalCenter = 0;
    }
    var d = __define,c=LoadPanel,p=c.prototype;
    p.destory = function () {
        _super.prototype.destory.call(this);
    };
    p.init = function () {
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
        this._callback = this._data.callback;
        this._thisObject = this._data.thisObject;
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("main");
    };
    /**
     * preload资源组加载完成
     * @param event
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "main") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this._callback.call(this._thisObject);
        }
    };
    /**
     * preload资源组加载进度
     * @param event
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "main") {
            this.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.setProgress = function (current, total) {
        this.txtContent.text = current + "/" + total + " 资源加载中...";
    };
    return LoadPanel;
}(BasePanel));
egret.registerClass(LoadPanel,'LoadPanel');
//# sourceMappingURL=LoadPanel.js.map