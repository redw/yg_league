/**
 * Created by Administrator on 2/7 0007.
 */
var LoadExtraPanel = (function (_super) {
    __extends(LoadExtraPanel, _super);
    function LoadExtraPanel() {
        _super.call(this);
        this.skinName = LoadExtraPanelSkin;
        this._mutex = true;
        this._layer = PanelManager.TOP_LAYER;
        this.verticalCenter = 0;
        this.horizontalCenter = 0;
    }
    var d = __define,c=LoadExtraPanel,p=c.prototype;
    p.destory = function () {
        _super.prototype.destory.call(this);
        var mc = DisplayUtil.getChildByName(this, "process");
        if (mc) {
            mc.stop();
            DisplayUtil.removeFromParent(mc);
        }
    };
    p.init = function () {
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
        this._callback = this._data.callback;
        this._thisObject = this._data.thisObject;
        this._needLoadRes = [];
        this._needLoadRes = this._data.resArray.concat();
        this._showText = this._data.showText;
        this._groupName = this._data.groupName;
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        MovieClipUtils.createMovieClip(Global.getOtherEffect("process"), "process", afterAdd1, this);
        function afterAdd1(data) {
            var mc = data;
            mc.x = 240;
            mc.y = 400;
            mc.play(-1);
            mc.name = "process";
            this.addChild(mc);
            RES.createGroup(this._groupName, this._needLoadRes);
            RES.loadGroup(this._groupName);
        }
    };
    /**
     * preload资源组加载完成
     * @param event
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == this._groupName) {
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
        if (event.groupName == this._groupName) {
            this.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.setProgress = function (current, total) {
        this.txtContent.text = this._showText + current + "/" + total + " 请稍后...";
    };
    return LoadExtraPanel;
}(BasePanel));
egret.registerClass(LoadExtraPanel,'LoadExtraPanel');
//# sourceMappingURL=LoadExtraPanel.js.map