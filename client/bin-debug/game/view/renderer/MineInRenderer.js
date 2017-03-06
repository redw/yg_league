/**
 * Created by Administrator on 2/16 0016.
 */
var MineInRenderer = (function (_super) {
    __extends(MineInRenderer, _super);
    function MineInRenderer() {
        _super.call(this);
        this._barWidth = 160;
        this.skinName = MineInRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=MineInRenderer,p=c.prototype;
    p.onShow = function (event) {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_CAVE_STONE, this.refreshNowStone, this);
        EventManager.inst.addEventListener(ContextEvent.MiNE_FORMATION_CLOSE, this.dataChanged, this);
        Http.inst.addCmdListener(CmdID.FARM_ORE, this.dataChanged, this);
        Http.inst.addCmdListener(CmdID.MINE_UP, this.refreshUpMine, this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnStay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStay, this);
        this.lockGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLock, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
    };
    p.onHide = function (event) {
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_CAVE_STONE, this.refreshNowStone, this);
        EventManager.inst.removeEventListener(ContextEvent.MiNE_FORMATION_CLOSE, this.dataChanged, this);
        Http.inst.removeCmdListener(CmdID.FARM_ORE, this.dataChanged, this);
        Http.inst.removeCmdListener(CmdID.MINE_UP, this.refreshUpMine, this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnStay.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStay, this);
        this.lockGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLock, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
    };
    p.onUp = function () {
        PanelManager.inst.showPanel("MineCaveUpPanel", this.data);
    };
    p.onLock = function () {
        var openArr = Config.BaseData[76]["value"];
        Notice.show("轮回" + openArr[this.data - 1] + "次后自动解锁！");
    };
    p.onGet = function () {
        var point = parseFloat(Config.BaseData[78]["value"]);
        // var mineFullArr:string[] = Config.BaseData[77]["value"];
        var outPutMax = this._fullPut; //parseInt(mineFullArr[this.data - 1]);
        var outPut = UserProxy.inst.mineOutputAry[this.data - 1];
        var need = outPutMax * point;
        if (outPut < need) {
            Notice.show("需要累积 " + need + " 以上，才可收取灵矿");
            return;
        }
        Http.inst.send(CmdID.FARM_ORE, { id: this.data });
    };
    p.onStay = function () {
        PanelManager.inst.showPanel("MineFormationPanel", this.data);
    };
    p.showBar = function (now, max) {
        var redPoint = DisplayUtil.getChildByName(this.btnGet.parent, "upPoint");
        if (now >= max) {
            if (!redPoint) {
                UserMethod.inst.addRedPoint(this.btnGet.parent, "upPoint", new egret.Point(this.btnGet.x + 55, this.btnGet.y + 10));
            }
        }
        else {
            UserMethod.inst.removeRedPoint(this.btnGet.parent, "upPoint");
        }
        this.imgBar.width = MathUtil.clamp(Math.floor(now * this._barWidth / max), 0, this._barWidth);
        this.lblBar.text = StringUtil.toFixed(now, 0) + "/" + max;
        this._fullPut = max;
    };
    p.refreshNowStone = function (e) {
        var data = e.data;
        var mineData = UserProxy.inst.home["mine"][this.data];
        mineData["nowOutput"] = data[this.data - 1];
        this.showBar(mineData["nowOutput"], mineData["maxOutput"]);
    };
    p.refreshUpMine = function () {
        var mineData = UserProxy.inst.home["mine"][this.data];
        this.showBar(mineData["nowOutput"], mineData["maxOutput"]);
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var productOut = 0;
        var mineData = UserProxy.inst.home["mine"][this.data];
        var openArr = Config.BaseData[76]["value"];
        if (UserProxy.inst.circleObj["circleTimes"] >= parseInt(openArr[this.data - 1])) {
            this.contentGroup.visible = true;
            this.lockGroup.visible = false;
            this.showBar(mineData["nowOutput"], mineData["maxOutput"]);
            for (var i = 0; i < 6; i++) {
                var posGroup = DisplayUtil.getChildByName(this.contentGroup, "pos" + i);
                posGroup.removeChildren();
            }
            for (var i = 0; i < 6; i++) {
                var id = mineData["pos"][i];
                if (id) {
                    var roleData = UserProxy.inst.heroData.getHeroData(id);
                    var oreData = Config.OreData[roleData.starLevel];
                    var number = parseInt(oreData["num_" + roleData.config.quality]);
                    productOut += number;
                    var posGroup = DisplayUtil.getChildByName(this.contentGroup, "pos" + i);
                    this.addMc(id, posGroup);
                }
            }
            this.lblOutPut.text = productOut + "";
        }
        else {
            this.contentGroup.visible = false;
            this.lockGroup.visible = true;
            var openArr = Config.BaseData[76]["value"];
            this.lblOpen.text = "当前轮回次数：" + UserProxy.inst.circleObj["circleTimes"] + "/" + openArr[this.data - 1];
        }
    };
    p.addMc = function (id, posGroup) {
        posGroup.removeChildren();
        if (id) {
            MovieClipUtils.createMovieClip(Global.getChaStay(id), "" + id, afterAdd, this);
            function afterAdd(data) {
                var mc = data;
                mc.x = 50;
                mc.y = 80;
                mc.name = "mc";
                mc.scaleX = -1;
                mc.play(-1);
                posGroup.addChild(mc);
            }
        }
    };
    return MineInRenderer;
}(eui.ItemRenderer));
egret.registerClass(MineInRenderer,'MineInRenderer');
