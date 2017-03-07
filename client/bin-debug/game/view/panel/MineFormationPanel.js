/**
 * Created by Administrator on 2/21 0021.
 */
var MineFormationPanel = (function (_super) {
    __extends(MineFormationPanel, _super);
    function MineFormationPanel() {
        _super.call(this);
        this._action = false;
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = MineFormationPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=MineFormationPanel,p=c.prototype;
    p.init = function () {
        EventManager.inst.addEventListener(ContextEvent.MINE_UP_CHANGE, this.onAddRole, this);
        Http.inst.addCmdListener(CmdID.MINE_HERO, this.onFormationBack, this);
        for (var i = 0; i < 6; i++) {
            var roleGroup = DisplayUtil.getChildByName(this, "role" + i);
            roleGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDown, this);
            var btnPos = DisplayUtil.getChildByName(this, "btnPos" + i);
            btnPos.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        }
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackSure, this);
        this.roleList.itemRenderer = MineInRoleRenderer;
    };
    p.initData = function () {
        var cavernId = this.data;
        var mineData = UserProxy.inst.home["mine"];
        var cavernData = mineData[cavernId];
        this.lblProduct.text = cavernData["outputPerSec"];
        UserMethod.inst.home_up_arr = [];
        UserMethod.inst.home_up_arr = cavernData["pos"].concat();
        this.changeNow();
    };
    p.onAddRole = function (e) {
        if (this._selectIdx < 0) {
            Notice.show("没有合适的位置！");
            return;
        }
        UserMethod.inst.home_up_arr[this._selectIdx] = parseInt(e.data);
        this.changeNow();
    };
    p.changeNow = function () {
        this.showStay(UserMethod.inst.home_up_arr);
        this.refresh();
    };
    p.showStay = function (pos) {
        var productOut = 0;
        this._selectIdx = -1;
        for (var i = 0; i < 6; i++) {
            var roleGroup = DisplayUtil.getChildByName(this, "role" + i);
            var icon = DisplayUtil.getChildByName(roleGroup, "icon");
            var produce = DisplayUtil.getChildByName(roleGroup, "produce");
            icon.y = 0;
            icon.alpha = 1;
            var btnPos1 = DisplayUtil.getChildByName(this, "btnPos" + i);
            if (pos[i]) {
                btnPos1.visible = false;
                roleGroup.visible = true;
                var id = pos[i];
                roleGroup["id"] = id;
                var roleData = UserProxy.inst.heroData.getHeroData(id);
                icon.imgIcon = Global.getChaIcon(id);
                icon.setStar = roleData.starLevel;
                icon.setLv = 0;
                var oreData = Config.OreData[roleData.starLevel];
                var number = parseInt(oreData["num_" + roleData.config.quality]);
                produce.text = number + "";
                productOut += number;
            }
            else {
                if (this._selectIdx < 0) {
                    this._selectIdx = i;
                }
                btnPos1.visible = true;
                roleGroup.visible = false;
            }
        }
        this.lblProduct.text = productOut + "";
    };
    p.refresh = function () {
        var heroIds = UserProxy.inst.heroData.getHeroIds();
        var idsLength = heroIds.length;
        var useIds = [];
        var notUseIds = [];
        var idArrays = [];
        var mineData = UserProxy.inst.home["mine"];
        for (var i in mineData) {
            if (this.data == parseInt(i)) {
                for (var c in UserMethod.inst.home_up_arr) {
                    var id = UserMethod.inst.home_up_arr[c];
                    if (id) {
                        useIds.push(id);
                    }
                }
            }
            else {
                for (var c in mineData[i]["pos"]) {
                    var id = mineData[i]["pos"][c];
                    if (Number(id)) {
                        useIds.push(Number(id));
                    }
                }
            }
        }
        for (var j = 0; j < idsLength; j++) {
            var id = Number(heroIds[j]);
            var roleData = UserProxy.inst.heroData.getHeroData(id);
            if (useIds.indexOf(id) <= -1 && roleData.starLevel) {
                notUseIds.push(id);
                if (notUseIds.length == 6) {
                    idArrays.push(notUseIds);
                    notUseIds = [];
                }
            }
        }
        idArrays.push(notUseIds);
        this.roleList.dataProvider = new eui.ArrayCollection(idArrays);
    };
    p.onBackSure = function () {
        if (this._action) {
            return;
        }
        var ids = [];
        for (var i = 0; i < 9; i++) {
            var id = Number(UserMethod.inst.home_up_arr[i]);
            if (id) {
                ids.push(id);
            }
            else {
                ids.push(0);
            }
        }
        Http.inst.send(CmdID.MINE_HERO, { id: this.data, pos: JSON.stringify(ids) });
    };
    p.onDown = function (e) {
        var roleGroup = e.currentTarget;
        var icon = DisplayUtil.getChildByName(roleGroup, "icon");
        egret.Tween.get(icon).to({ y: icon.y + 20, alpha: 0 }, 400);
        this._action = true;
        var id = roleGroup["id"];
        UserMethod.inst.home_up_arr[UserMethod.inst.home_up_arr.indexOf(id)] = 0;
        egret.setTimeout(function () {
            this._action = false;
            this.changeNow();
        }, this, 400);
    };
    p.onUp = function (e) {
        var index = parseInt(e.currentTarget.name.replace("btnPos", ""));
        this._selectIdx = index;
        EventManager.inst.dispatch(ContextEvent.MINE_NEED_UP, index);
    };
    p.onFormationBack = function (e) {
        var cavernId = this.data;
        var mineData = UserProxy.inst.home["mine"];
        var cavernData = mineData[cavernId];
        cavernData["outputPerSec"] = e.data["outputPerSec"];
        cavernData["pos"] = e.data["pos"];
        EventManager.inst.dispatch(ContextEvent.MiNE_FORMATION_CLOSE);
        PanelManager.inst.hidePanel("MineFormationPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        EventManager.inst.removeEventListener(ContextEvent.MINE_UP_CHANGE, this.onAddRole, this);
        Http.inst.removeCmdListener(CmdID.MINE_HERO, this.onFormationBack, this);
        for (var i = 0; i < 6; i++) {
            var roleGroup = DisplayUtil.getChildByName(this, "role" + i);
            roleGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDown, this);
            var btnPos = DisplayUtil.getChildByName(this, "btnPos" + i);
            btnPos.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        }
        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackSure, this);
    };
    return MineFormationPanel;
}(BasePanel));
egret.registerClass(MineFormationPanel,'MineFormationPanel');
//# sourceMappingURL=MineFormationPanel.js.map