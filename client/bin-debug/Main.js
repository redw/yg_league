/**
 * 游戏入口
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.apply(this, arguments);
    }
    var d = __define,c=Main,p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        if (ExternalUtil.inst.getIsHT()) {
        }
        else {
            console.log("一款游戏，要经历怎样的过程，才能抵达用户面前？");
            console.log("一位新人，要经历怎样的成长，才能站在技术之巅？");
            console.log("探寻这里的秘密；");
            console.log("体验这里的挑战；");
            console.log("成为这里的主人；");
            console.log("加入游光，加入前端开发组，走向人生巅峰，迎娶白富美。");
            console.log("请将简历发送至%chr@11h5.com", "color:red");
            console.log("");
        }
        //适配
        if (Global.getStageHeight() < 800) {
            this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        }
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //设置加载进度界面
        this._loadingView = new LoadingUI();
        this.stage.addChild(this._loadingView);
        //初始化Resource资源加载库
        var resURL = "resource/default.res.json?v=" + ExternalUtil.inst.getVersion();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onResComplete, this);
        RES.loadConfig(resURL, "resource/");
    };
    p.onResComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onResComplete, this);
        //
        var themeURL = "resource/default.thm.json?v=" + ExternalUtil.inst.getVersion();
        this._theme = new eui.Theme(themeURL, this.stage);
        this._theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeComplete, this);
    };
    //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
    p.onThemeComplete = function () {
        var platform = ExternalUtil.inst.getPlatform();
        var configName = "config_" + platform;
        RES.getResByUrl(Global.getResURL(configName + ".json?v=" + ExternalUtil.inst.getVersion()), function (data) {
            Global.initConfig(data); // 初始化配置数据
            this.loadResources();
        }, this, RES.ResourceItem.TYPE_JSON);
    };
    p.loadResources = function () {
        this._theme.removeEventListener(eui.UIEvent.COMPLETE, this.loadResources, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this._loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            // 错误码文件配置
            Config.loadError();
            if (ExternalUtil.inst.getIsHT()) {
                ExternalUtil.inst.hortorInit();
            }
            else {
                ExternalUtil.inst.weixinInit();
            }
            // 加载服务器地址
            if (Global.SERVER_ADDR) {
                this.initGame();
            }
            else {
                // 获取服务器地址
                ExternalUtil.inst.getServerInfo(this.initGame, this);
            }
        }
    };
    p.onResourceLoadError = function (event) {
        this.onResourceLoadComplete(event);
    };
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this._loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.initGame = function () {
        fight.HEIGHT = (this.stage.stageHeight - 340);
        CmdID.initCmd();
        PanelManager.inst.init(this);
        // PanelManager.inst.showPanel("LoginPanel");
        this.enterInit();
    };
    p.enterInit = function () {
        if (window['hideLoading'] != null) {
            window['hideLoading']();
        }
        Global.TOKEN = Global.TEST_TOKEN ? Global.TEST_TOKEN : ExternalUtil.inst.getToken();
        console.log("TOKEN:" + Global.TOKEN);
        if (Global.DEBUG) {
            Http.inst.send(CmdID.ENTER);
        }
        else {
            window["AWY_SDK"].shareParams({ "cp_from": "msg" });
            var from = window["AWY_SDK"].getURLVar("cp_from");
            var friendId = window["AWY_SDK"].getURLVar("fuid");
            Http.inst.send(CmdID.ENTER, { yyb: ExternalUtil.inst.getIsYYB() ? 1 : 0, hortor: ExternalUtil.inst.getIsHT() ? 1 : 0, inviteId: friendId, from: from ? from : "" });
        }
        console.log("[RenderMode] ", egret.Capabilities.renderMode);
    };
    return Main;
}(eui.UILayer));
egret.registerClass(Main,'Main');
