/**
 * Created by Administrator on 2/16 0016.
 */
var MineMainPanel = (function (_super) {
    __extends(MineMainPanel, _super);
    function MineMainPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = MineMainPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=MineMainPanel,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.OPEN_HOME, this.showInfo, this);
        Http.inst.addCmdListener(CmdID.FARM_ORE, this.refreshStone, this);
        Http.inst.addCmdListener(CmdID.BUILDING_UP, this.buildingUp, this);
        Http.inst.addCmdListener(CmdID.MINE_UP, this.refreshStone, this);
        this.btnGoIn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.dingGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDing, this);
        this.poolGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPool, this);
        this.towerGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTower, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.lblStone.visible = false;
    };
    p.initData = function () {
        Http.inst.send(CmdID.OPEN_HOME);
    };
    p.buildingUp = function () {
        this.refreshStone();
        this.onSelect(this._selectId);
    };
    /**tower*/
    p.towerAction = function () {
        this.showTowerSelect(false);
        egret.Tween.get(this.towerGroup, { loop: true }).to({ y: 115 }, 1000).to({ y: 125 }, 1000);
    };
    p.showTowerSelect = function (show) {
        var tower_select = DisplayUtil.getChildByName(this.towerGroup, "tower_select");
        if (tower_select) {
            tower_select.visible = show;
        }
        else {
            this.createTowerSelect(show);
        }
    };
    p.createTowerSelect = function (show) {
        MovieClipUtils.createMovieClip(Global.getOtherEffect("tower_select"), "tower_select", afterAdd, this);
        function afterAdd(data) {
            var mc = data;
            mc.name = "tower_select";
            this.towerGroup.addChild(mc);
            mc.play(-1);
            mc.visible = show;
        }
    };
    p.towerSelect = function () {
        egret.Tween.removeTweens(this.towerGroup);
        this.towerGroup.y = 125;
        this.showTowerSelect(true);
    };
    /**pool*/
    p.poolAction = function () {
        this.showPoolSelect(false);
        var pool = this.poolData();
        if (pool) {
            pool.play(-1);
        }
    };
    p.poolData = function () {
        var pool = DisplayUtil.getChildByName(this.poolGroup, "pool");
        if (pool) {
            return pool;
        }
        else {
            MovieClipUtils.createMovieClip(Global.getOtherEffect("pool"), "pool", afterAdd, this);
            function afterAdd(data) {
                var mc = data;
                mc.name = "pool";
                this.poolGroup.addChild(mc);
                mc.play(-1);
                this.onPool();
                return mc;
            }
        }
    };
    p.showPoolSelect = function (show) {
        var pool_select = DisplayUtil.getChildByName(this.poolGroup, "pool_select");
        if (pool_select) {
            pool_select.visible = show;
        }
        else {
            this.createPoolSelect(show);
        }
    };
    p.createPoolSelect = function (show) {
        MovieClipUtils.createMovieClip(Global.getOtherEffect("pool_select"), "pool_select", afterAdd, this);
        function afterAdd(data) {
            var mc = data;
            mc.name = "pool_select";
            this.poolGroup.addChild(mc);
            mc.play(-1);
            mc.visible = show;
        }
    };
    p.poolSelect = function () {
        this.showPoolSelect(true);
        var pool = this.poolData();
        if (pool) {
            pool.gotoAndStop(1);
        }
    };
    /**ding*/
    p.dingAction = function () {
        var dingFire = this.dingFireData();
        if (dingFire) {
            dingFire.visible = true;
        }
        this.showDingSelect(false);
    };
    p.dingFireData = function () {
        var dingFire = DisplayUtil.getChildByName(this.dingGroup, "ding_fire");
        if (dingFire) {
            return dingFire;
        }
        else {
            MovieClipUtils.createMovieClip(Global.getOtherEffect("ding_fire"), "ding_fire", afterAdd, this);
            function afterAdd(data) {
                var mc = data;
                mc.x = 110;
                mc.y = -10;
                mc.name = "ding_fire";
                this.dingGroup.addChild(mc);
                mc.play(-1);
                return mc;
            }
        }
    };
    p.showDingSelect = function (show) {
        var ding_select = DisplayUtil.getChildByName(this.dingGroup, "ding_select");
        if (ding_select) {
            ding_select.visible = show;
        }
        else {
            this.createDingSelect(show);
        }
    };
    p.createDingSelect = function (show) {
        MovieClipUtils.createMovieClip(Global.getOtherEffect("ding_select"), "ding_select", afterAdd, this);
        function afterAdd(data) {
            var mc = data;
            mc.name = "ding_select";
            this.dingGroup.addChild(mc);
            mc.play(-1);
            mc.visible = show;
        }
    };
    p.dingSelect = function () {
        this.showDingSelect(true);
        var fire = this.dingFireData();
        if (fire) {
            fire.visible = false;
        }
    };
    p.onDing = function () {
        this.dingSelect();
        this.towerAction();
        this.poolAction();
        this.onSelect(2);
    };
    p.onTower = function () {
        this.towerSelect();
        this.dingAction();
        this.poolAction();
        this.onSelect(3);
    };
    p.onPool = function () {
        this.poolSelect();
        this.towerAction();
        this.dingAction();
        this.onSelect(1);
    };
    p.showInfo = function (e) {
        this.lblStone.visible = true;
        UserProxy.inst.home = e.data["home"];
        UserProxy.inst.ore = UserProxy.inst.home["ore"];
        UserProxy.inst.building = e.data["home"]["building"];
        this.lblStone.text = StringUtil.toFixed(UserProxy.inst.ore, 0) + "";
        this.setInit();
    };
    p.refreshStone = function () {
        this.lblStone.text = StringUtil.toFixed(UserProxy.inst.ore, 0) + "";
        this.onSelect(this._selectId);
    };
    p.setInit = function () {
        this.poolData();
        this.dingFireData();
        if (UserMethod.inst._mineFullPoint) {
            UserMethod.inst.addRedPoint(this.btnGoIn.parent, "upPoint", new egret.Point(this.btnGoIn.x + 80, this.btnGoIn.y + 10));
        }
    };
    p.onSelect = function (type) {
        this._selectId = type;
        var lv;
        var caveData;
        var nextCaveData;
        var cost;
        switch (type) {
            case 1:
                this.imgTitle.source = "mine_pool_title_png";
                lv = UserProxy.inst.building[1]["lv"];
                break;
            case 2:
                this.imgTitle.source = "mine_ding_title_png";
                lv = UserProxy.inst.building[2]["lv"];
                break;
            case 3:
                this.imgTitle.source = "mine_tower_title_png";
                lv = UserProxy.inst.building[3]["lv"];
                break;
        }
        this.lblLv.text = "Lv." + lv;
        if (!lv) {
            caveData = Config.CaveData[1];
            nextCaveData = Config.CaveData[1];
        }
        else {
            caveData = Config.CaveData[lv];
            nextCaveData = Config.CaveData[lv + 1];
        }
        var addNature = parseFloat(caveData["attr_" + type][2]) - 1;
        if (!lv) {
            addNature = 0;
        }
        var dec = UserMethod.inst.getAddSting(caveData["attr_" + type], addNature);
        this.lblNow.text = "当前：" + dec;
        if (!nextCaveData) {
            this.lblNext.text = "已到达顶级！";
            this.btnUp.enabled = false;
            this.lblBar.text = "MAX";
            this.imgBar.width = 272;
            this.btnUp.label = "升 级";
        }
        else {
            cost = nextCaveData["build_cost_" + type];
            if (!lv) {
                cost = 0;
                this.btnUp.label = "开 启";
            }
            else {
                this.btnUp.label = "升 级";
            }
            var addNature2 = parseFloat(nextCaveData["attr_" + type][2]) - 1;
            var dec2 = UserMethod.inst.getAddSting(nextCaveData["attr_" + type], addNature2);
            this.lblNext.text = "下级：" + dec2;
            var now = UserProxy.inst.ore;
            this.lblBar.text = StringUtil.toFixed(now, 0) + "/" + cost;
            this.imgBar.width = MathUtil.clamp(Math.floor(now * 272 / cost), 0, 272);
            this.btnUp.enabled = now >= cost;
        }
    };
    p.onUp = function () {
        var openArea = Config.BaseData[74]["value"];
        if (this._selectId == 2) {
            if (UserProxy.inst.historyArea < parseInt(openArea[1])) {
                Notice.show("通关" + openArea[1] + "关后开启");
                return;
            }
        }
        else if (this._selectId == 3) {
            if (UserProxy.inst.historyArea < parseInt(openArea[2])) {
                Notice.show("通关" + openArea[2] + "关后开启");
                return;
            }
        }
        Http.inst.send(CmdID.BUILDING_UP, { id: this._selectId });
    };
    p.onGo = function () {
        UserMethod.inst.removeRedPoint(this.btnGoIn.parent, "upPoint");
        PanelManager.inst.showPanel("MineInPanel");
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("MineMainPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        Http.inst.removeCmdListener(CmdID.OPEN_HOME, this.showInfo, this);
        Http.inst.removeCmdListener(CmdID.FARM_ORE, this.refreshStone, this);
        Http.inst.removeCmdListener(CmdID.BUILDING_UP, this.buildingUp, this);
        Http.inst.removeCmdListener(CmdID.MINE_UP, this.refreshStone, this);
        this.btnGoIn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.dingGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDing, this);
        this.poolGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPool, this);
        this.towerGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTower, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        //removeMC
        var pool = this.poolData();
        if (pool) {
            pool.stop();
            DisplayUtil.removeFromParent(pool);
        }
        var pool_select = DisplayUtil.getChildByName(this.poolGroup, "pool_select");
        if (pool_select) {
            pool_select.stop();
            DisplayUtil.removeFromParent(pool_select);
        }
        var dingFire = this.dingFireData();
        if (dingFire) {
            dingFire.stop();
            DisplayUtil.removeFromParent(dingFire);
        }
        var ding_select = DisplayUtil.getChildByName(this.dingGroup, "ding_select");
        if (ding_select) {
            ding_select.stop();
            DisplayUtil.removeFromParent(ding_select);
        }
        egret.Tween.removeTweens(this.towerGroup);
        var tower_select = DisplayUtil.getChildByName(this.towerGroup, "tower_select");
        if (tower_select) {
            tower_select.stop();
            DisplayUtil.removeFromParent(tower_select);
        }
        EventManager.inst.dispatch("MINE_CHECK");
    };
    return MineMainPanel;
}(BasePanel));
egret.registerClass(MineMainPanel,'MineMainPanel');
