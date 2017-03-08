/**
 * Created by Administrator on 11/25 0025.
 */
var RoleRenderer = (function (_super) {
    __extends(RoleRenderer, _super);
    function RoleRenderer() {
        _super.call(this);
        this._touchCount = 0;
        this._continueTimes = 0;
        this._continueTouch = 0;
        this.skinName = RoleRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=RoleRenderer,p=c.prototype;
    p.onShow = function (event) {
        EventManager.inst.addEventListener(ContextEvent.CHANGE_ROLE_SHOW, this.refreshShow, this);
        EventManager.inst.addEventListener(ContextEvent.REFRESH_BASE, this.dataChanged, this);
        Http.inst.addCmdListener(CmdID.HERO_UP, this.onRefreshSoldier, this);
        Http.inst.addCmdListener(CmdID.STAR_UP, this.dataChanged, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLvUp, this);
        this.btnUpTwo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLvUp, this);
        this.btnUpThree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLvUp, this);
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRole, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this.btnCall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCall, this);
        EventManager.inst.addEventListener("GUIDE_HEROUP", this.onGuide, this);
        EventManager.inst.addEventListener("GUIDE_HEROUP_2", this.onGuide2, this);
        this.btnUpGroup.visible = false;
    };
    p.onHide = function (event) {
        EventManager.inst.removeEventListener(ContextEvent.CHANGE_ROLE_SHOW, this.refreshShow, this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_BASE, this.dataChanged, this);
        Http.inst.removeCmdListener(CmdID.HERO_UP, this.onRefreshSoldier, this);
        Http.inst.removeCmdListener(CmdID.STAR_UP, this.dataChanged, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLvUp, this);
        this.btnUpTwo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLvUp, this);
        this.btnUpThree.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLvUp, this);
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRole, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this.btnCall.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCall, this);
        EventManager.inst.removeEventListener("GUIDE_HEROUP", this.onGuide, this);
        EventManager.inst.removeEventListener("GUIDE_HEROUP_2", this.onGuide2, this);
    };
    p.onGuide = function () {
        if (this.data == 102) {
            this.btnUp.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
    };
    p.onGuide2 = function () {
        if (this.data == 103) {
            this.btnUp.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
    };
    p.onRefreshSoldier = function (event) {
        var _this = this;
        var data = event.data;
        for (var i in data["heroList"]) {
            if (parseInt(i) == this.data) {
                MovieClipUtils.createMovieClip(Global.getOtherEffect("level_up_effect"), "level_up_effect", function (data) {
                    var mc = data;
                    mc.x = 6;
                    mc.y = 5;
                    _this.addChild(mc);
                    MovieClipUtils.playMCOnce(mc, function () {
                        DisplayUtil.removeFromParent(mc);
                    }, _this);
                }, this);
                this.dataChanged();
                this.delayShow();
            }
        }
    };
    p.refreshShow = function (e) {
        this.dataChanged();
    };
    p.onTouch = function () {
        this.btnUp.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    };
    p.onTouchEnd = function () {
        this.btnUp.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    };
    p.onEnterFrame = function () {
        this._continueTimes++;
        if (this._continueTimes > 10 && !this._continueTouch) {
            this._continueTimes = 0;
            this._continueTouch = 1;
            this._touchCount = 3;
            this.delayShow();
            this.onTouchEnd();
        }
    };
    p.onLvUp = function (e) {
        var lv = 0;
        if (e.currentTarget == this.btnUp) {
            lv = 1;
        }
        else if (e.currentTarget == this.btnUpTwo) {
            lv = 10;
        }
        else {
            lv = this._topLv;
        }
        Http.inst.send(CmdID.HERO_UP, { hid: this.data, upLel: lv });
    };
    p.onCall = function () {
        Http.inst.send(CmdID.STAR_UP, { hid: this.data });
    };
    p.onRole = function (e) {
        PanelManager.inst.showPanel("RoleDetailsPanel", this.data);
    };
    p.delayShow = function () {
        this._touchCount++;
        if (this._touchCount > 3) {
            this.btnUpGroup.visible = true;
        }
        if (this.btnUpGroup.visible) {
            if (this._delayTimes) {
                egret.clearTimeout(this._delayTimes);
            }
            this._delayTimes = egret.setTimeout(clearShow, this, 2000);
        }
        function clearShow() {
            this.btnUpGroup.visible = false;
            this._continueTouch = 0;
            this._touchCount = 0;
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (this.data) {
            this.height = 72;
            this.contentGroup.visible = true;
            this.imgLine.visible = false;
            this.imgCellBg.visible = true;
            var roleData = UserProxy.inst.heroData.getHeroData(this.data);
            this.lblName.text = roleData.config.name;
            this.lblHp.text = "" + MathUtil.easyNumber(roleData.maxHP);
            this.roleIcon.setLv = roleData.level;
            this.roleIcon.setStar = roleData.starLevel;
            this.roleIcon.imgIcon = Global.getChaIcon(this.data);
            if (roleData.level) {
                this.btnCall.visible = false;
                this.btnUp.visible = true;
                this.imgCellBg.source = "common_cell_png";
            }
            else {
                this.btnCall.visible = true;
                this.btnUp.visible = false;
                this.imgCellBg.source = "role_unhad_cell_png";
                var starData = Config.HeroStarData[1];
                var needChip = starData["rank_chip_" + roleData.config.quality];
                this.btnCall.label = roleData.starPiece + "/" + needChip;
                /*if(roleData.starPiece >= needChip)
                {
                    this.btnCall.label = roleData.starPiece + "/" + needChip + "(合成)";
                }
                else
                {

                }*/
                this.btnCall.enabled = roleData.starPiece >= needChip;
                this.btnCall.imgType.source = Global.getChaChipIcon(this.data);
            }
            var battleArr = UserProxy.inst.fightData.getPVEIds();
            this.imgBattle.visible = battleArr.indexOf(this.data) > -1;
            this.imgAtkType.source = "job_" + roleData.config.job + "_png";
            if (parseInt(roleData.config.damage_type) == 1) {
                this.imgAtk.source = "common_atk_png";
                this.lblAtk.text = MathUtil.easyNumber(roleData.phyAtk);
            }
            else {
                this.imgAtk.source = "common_mgAtk_png";
                this.lblAtk.text = MathUtil.easyNumber(roleData.magAtk);
            }
            if (roleData.strengthenLevel) {
                this.bitLbl.visible = true;
                this.bitLbl.text = "+" + roleData.strengthenLevel;
            }
            else {
                this.bitLbl.visible = false;
            }
            //btnMoney
            var upGold = parseFloat(Config.BaseData[2]["value"]) / UserProxy.inst.subFriendMoney;
            var baseAdd = Config.BaseData[3]["value"];
            var baseLv = Math.pow(baseAdd, roleData.level);
            var baseDiv = 1 - baseAdd;
            var before_1 = (1 - Math.pow(baseAdd, 1)) / baseDiv;
            var before_2 = (1 - Math.pow(baseAdd, 10)) / baseDiv;
            var before_3 = (1 - Math.pow(baseAdd, 100)) / baseDiv;
            var before_4 = (1 - Math.pow(baseAdd, 1000)) / baseDiv;
            var baseUp_1 = BigNum.mul(baseLv, before_1);
            var baseUp_2 = BigNum.mul(baseLv, before_2);
            var baseUp_3 = BigNum.mul(baseLv, before_3);
            var baseUp_4 = BigNum.mul(baseLv, before_4);
            var upGold_1 = BigNum.mul(upGold, baseUp_1);
            this.btnUp.label = MathUtil.easyNumber(upGold_1);
            this.btnUp.extraLabel = "升级";
            this.btnUp.enabled = BigNum.greaterOrEqual(UserProxy.inst.gold, upGold_1);
            if (!UserProxy.inst.isGuideEnd() && this.data == 102) {
                var hand = DisplayUtil.getChildByName(this, "hand");
                if (!hand) {
                    var step = UserProxy.inst.getGuideStep();
                    if (step > 3 && step < 10 && BigNum.greaterOrEqual(UserProxy.inst.gold, upGold_1)) {
                        MovieClipUtils.createMovieClip(Global.getOtherEffect("hand_effect"), "hand_effect", function (mc) {
                            mc.x = 410;
                            mc.y = 20;
                            mc.scaleX = -1;
                            mc.name = "hand";
                            mc.play(-1);
                            this.addChild(mc);
                        }, this);
                    }
                }
                else {
                    var nowGuide = false;
                    if (PanelManager.inst.isShow("GuidePanel")) {
                        nowGuide = true;
                    }
                    if (BigNum.lessOrEqual(UserProxy.inst.gold, upGold_1) || nowGuide) {
                        hand.stop();
                        DisplayUtil.removeFromParent(hand);
                    }
                }
            }
            var upGold_10 = BigNum.mul(upGold, baseUp_2);
            this.btnUpTwo.label = MathUtil.easyNumber(upGold_10);
            this.btnUpTwo.extraLabel = "升10级";
            this.btnUpTwo.enabled = BigNum.greaterOrEqual(UserProxy.inst.gold, upGold_10);
            var upGold_100 = BigNum.mul(upGold, baseUp_3);
            var upGold_1000 = BigNum.mul(upGold, baseUp_4);
            if (BigNum.less(UserProxy.inst.gold, upGold_100)) {
                this.btnUpThree.label = MathUtil.easyNumber(upGold_100);
                this.btnUpThree.extraLabel = "升100级";
                this.btnUpThree.enabled = false;
            }
            else if (BigNum.greaterOrEqual(UserProxy.inst.gold, upGold_100) && BigNum.less(UserProxy.inst.gold, upGold_1000)) {
                this.btnUpThree.label = MathUtil.easyNumber(upGold_100);
                this.btnUpThree.extraLabel = "升100级";
                this.btnUpThree.enabled = true;
                this._topLv = 100;
            }
            else {
                this.btnUpThree.label = MathUtil.easyNumber(upGold_1000);
                this.btnUpThree.extraLabel = "升1000级";
                this.btnUpThree.enabled = true;
                this._topLv = 1000;
            }
            var ship = false;
            var star = false;
            UserMethod.inst.removeRedPoint(this.roleIcon.parent, "star");
            if (UserMethod.inst.oneStarCheck(this.data)) {
                star = true;
            }
            if (UserMethod.inst.oneShipCheck(this.data)) {
                ship = true;
            }
            if (star || ship) {
                UserMethod.inst.addRedPoint(this.roleIcon.parent, "star", new egret.Point(this.roleIcon.x + 60, this.roleIcon.y + 5));
            }
        }
        else {
            this.height = 18;
            this.btnCall.visible = false;
            this.btnUp.visible = false;
            this.contentGroup.visible = false;
            this.imgLine.visible = true;
            this.imgCellBg.visible = false;
        }
    };
    return RoleRenderer;
}(eui.ItemRenderer));
egret.registerClass(RoleRenderer,'RoleRenderer');
