/**
 * Created by Administrator on 11/28 0028.
 */
var RoleShipRenderer = (function (_super) {
    __extends(RoleShipRenderer, _super);
    function RoleShipRenderer() {
        _super.call(this);
        this.skinName = RoleShipRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=RoleShipRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnShipUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpShip, this);
        EventManager.inst.addEventListener(ContextEvent.HERO_SHIP_UP, this.onUpShipBack, this);
        Http.inst.addCmdListener(CmdID.STAR_UP, this.dataChanged, this);
        for (var i = 0; i < 5; i++) {
            var roleIcon = DisplayUtil.getChildByName(this.contentGroup, "roleIcon" + i);
            roleIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHead, this);
        }
    };
    p.onHide = function (event) {
        this.btnShipUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpShip, this);
        EventManager.inst.removeEventListener(ContextEvent.HERO_SHIP_UP, this.onUpShipBack, this);
        Http.inst.removeCmdListener(CmdID.STAR_UP, this.dataChanged, this);
        for (var i = 0; i < 5; i++) {
            var roleIcon = DisplayUtil.getChildByName(this.contentGroup, "roleIcon" + i);
            roleIcon.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHead, this);
        }
    };
    p.onUpShip = function () {
        Http.inst.send(CmdID.RELATIONSHIP, { rid: this.data });
    };
    p.onHead = function (e) {
        var id = e.currentTarget["id"];
        if (id) {
            PanelManager.inst.showPanel("RoleDrawInfoPanel", { id: id, from: 0 });
        }
    };
    p.onUpShipBack = function (e) {
        if (e.data == this.data) {
            var _loop_1 = function(i) {
                MovieClipUtils.createMovieClip(Global.getOtherEffect("rise_ship"), "rise_ship", afterAdd, this_1);
                function afterAdd(data) {
                    var mc = data;
                    mc.x = 10 + i * 60;
                    mc.y = 6;
                    mc.touchEnabled = false;
                    this.contentGroup.addChild(mc);
                    MovieClipUtils.playMCOnce(mc, function () {
                        DisplayUtil.removeFromParent(mc);
                    }, this);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this._length; i++) {
                _loop_1(i);
            }
            this.dataChanged();
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        for (var i = 0; i < 5; i++) {
            var roleIcon = DisplayUtil.getChildByName(this.contentGroup, "roleIcon" + i);
            var roleGray = DisplayUtil.getChildByName(this.contentGroup, "roleGray" + i);
            roleIcon.visible = false;
            roleGray.visible = false;
            roleIcon["id"] = null;
        }
        var shipId = this.data;
        var shipData = Config.FriendshipData[shipId];
        var shipInfo = UserProxy.inst.relationship[shipId];
        this.lblName.text = shipData["name"];
        this.lblLv.text = "Lv." + shipInfo["lv"];
        this._length = shipData["herogroup"].length;
        var starCount = 0;
        var notHad = true;
        for (var i = 0; i < this._length; i++) {
            var roleId = shipData["herogroup"][i];
            var roleIcon = DisplayUtil.getChildByName(this.contentGroup, "roleIcon" + i);
            var roleGray = DisplayUtil.getChildByName(this.contentGroup, "roleGray" + i);
            roleIcon.visible = true;
            var roleInfo = UserProxy.inst.heroData.getValue(roleId);
            roleIcon["id"] = roleId;
            roleIcon.setLv = 0;
            roleIcon.setStar = roleInfo.starLevel;
            roleIcon.imgIcon = Global.getChaIcon(roleId);
            starCount += roleInfo.starLevel;
            if (!roleInfo.starLevel) {
                notHad = false;
                roleGray.visible = true;
            }
        }
        var shipLv = shipInfo["lv"];
        var value = shipData["attr_1"];
        var par = value[2] * (Math.pow(parseFloat(shipData["attr_parm"]), shipLv - 1));
        var nextPar = value[2] * (Math.pow(parseFloat(shipData["attr_parm"]), shipLv));
        var needStar = shipData["stars"][shipLv];
        this.lblDic.text = UserMethod.inst.getAddSting(value, shipLv ? par : 0);
        this.lblNextAdd.x = 16 + this.lblDic.width;
        if (shipLv >= 10) {
            this.lblNextAdd.visible = false;
            this.btnShipUp.label = "MAX";
            this.btnShipUp.enabled = false;
        }
        else {
            this.lblNextAdd.text = "(+" + StringUtil.toFixed(nextPar * 100) + "%)";
            this.btnShipUp.label = starCount + "/" + needStar;
        }
        this.btnShipUp.coinType = "common_star_png";
        if (shipLv) {
            this.btnShipUp.extraLabel = "情缘进阶";
        }
        else {
            this.btnShipUp.extraLabel = "情缘激活";
        }
        this.btnShipUp.enabled = (starCount >= needStar && notHad);
    };
    return RoleShipRenderer;
}(eui.ItemRenderer));
egret.registerClass(RoleShipRenderer,'RoleShipRenderer');
