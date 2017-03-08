/**
 * Created by Administrator on 11/28 0028.
 */
var RoleDetailsPanel = (function (_super) {
    __extends(RoleDetailsPanel, _super);
    function RoleDetailsPanel() {
        _super.call(this);
        this._touchCount = 0;
        this._continueTimes = 0;
        this._continueTouch = 0;
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = RoleDetailsPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=RoleDetailsPanel,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.ENHANCE_UP, this.onEnhanceUp, this);
        Http.inst.addCmdListener(CmdID.STAR_UP, this.checkStar, this);
        Http.inst.addCmdListener(CmdID.RELATIONSHIP, this.checkShip, this);
        EventManager.inst.addEventListener(ContextEvent.CHANGE_ROLE_SHOW, this.showRoleInfo, this);
        this.tabShip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        this.tabTalent.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        this.tabSkill.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnUpTen.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnUpNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
        this.btnUpStar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpStar, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this.btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeft, this);
        this.btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRight, this);
        this.talentList.itemRenderer = RoleBuffRenderer;
        this.coinShow.startListener();
    };
    p.initData = function () {
        this.changeSelect(this.data);
        this.tabTalent.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        egret.Tween.get(this.btnRight, { loop: true }).to({ alpha: 0.3 }, 1000).to({ alpha: 1 }, 1000);
        egret.Tween.get(this.btnLeft, { loop: true }).to({ alpha: 0.3 }, 1000).to({ alpha: 1 }, 1000);
    };
    p.changeSelect = function (id) {
        UserMethod.inst.roleSelectId = id;
        this._roleData = Config.HeroData[id];
        this.lblName.text = this._roleData["name"];
        this.showRoleInfo();
        this.checkStar();
        this.checkShip();
    };
    p.checkStar = function () {
        UserMethod.inst.removeRedPoint(this.btnUpStar.parent, "star");
        if (UserMethod.inst.oneStarCheck(UserMethod.inst.roleSelectId)) {
            UserMethod.inst.addRedPoint(this.btnUpStar.parent, "star", new egret.Point(this.btnUpStar.x + 120, this.btnUpStar.y + 15));
        }
        this.checkShip();
    };
    p.checkShip = function () {
        UserMethod.inst.removeRedPoint(this.tabShip.parent, "ship");
        if (UserMethod.inst.oneShipCheck(UserMethod.inst.roleSelectId)) {
            UserMethod.inst.addRedPoint(this.tabShip.parent, "ship", new egret.Point(this.tabShip.x + 120, this.tabShip.y + 15));
        }
    };
    p.showRoleInfo = function () {
        var roleData = UserProxy.inst.heroData.getHeroData(UserMethod.inst.roleSelectId);
        this.btnLeft.visible = true;
        this.btnRight.visible = true;
        if (!roleData.level) {
            this.btnUp.visible = false;
            this.btnUpStar.visible = false;
            this.btnBack.visible = false;
            this.btnLeft.visible = false;
            this.btnRight.visible = false;
        }
        this.roleIcon.setLv = roleData.level;
        this.roleIcon.setStar = roleData.starLevel;
        this.roleIcon.imgIcon = Global.getChaIcon(UserMethod.inst.roleSelectId);
        this.lblHp.text = MathUtil.easyNumber(roleData.maxHP);
        this.lblDef.text = MathUtil.easyNumber(roleData.phyDef);
        this.lblMgDef.text = MathUtil.easyNumber(roleData.magDef);
        this.lblCrit.text = MathUtil.easyNumber(roleData.critDamge);
        this.bitLbl.text = "+" + roleData.strengthenLevel;
        this.bitLbl.visible = roleData.strengthenLevel > 0;
        this.btnBack.enabled = roleData.strengthenLevel > 0;
        this.imgJob.source = "job_" + roleData.config.job + "_png";
        this.imgRace.source = "race_" + roleData.config.race + "_png";
        this.imgSex.source = "sex_" + roleData.config.sex + "_png";
        this.imgRange.source = "rang_" + roleData.config.range + "_png";
        if (parseInt(roleData.config.damage_type) == 1) {
            this.imgAtk.source = "common_atk_png";
            this.lblAtk.text = MathUtil.easyNumber(roleData.phyAtk);
        }
        else {
            this.imgAtk.source = "common_mgAtk_png";
            this.lblAtk.text = MathUtil.easyNumber(roleData.magAtk);
        }
        //cost
        var cost_1 = parseInt(Config.HeroJadeCostData[roleData.strengthenLevel]["up_cost_1"]);
        var cost_10 = parseInt(Config.HeroJadeCostData[roleData.strengthenLevel]["up_cost_10"]);
        var cost_100 = parseInt(Config.HeroJadeCostData[roleData.strengthenLevel]["up_cost_100"]);
        this.btnUp.imgType = "reward_4_s_png";
        this.btnUpTen.imgType = "reward_4_s_png";
        this.btnUpNext.imgType = "reward_4_s_png";
        this.btnUp.label = MathUtil.easyNumber(cost_1);
        this.btnUp.extraLabel = "强化";
        this.btnUp.enabled = UserProxy.inst.medal >= cost_1;
        if (roleData.strengthenLevel >= 2000) {
            this.btnUp.label = "MAX";
            this.btnUp.enabled = false;
            this.hideGroup.visible = false;
        }
        if (!cost_10) {
            this.btnUpTen.label = "???";
            this.btnUpTen.extraLabel = "强化+???";
            this.btnUpTen.enabled = false;
        }
        else {
            this.btnUpTen.label = MathUtil.easyNumber(cost_10);
            this.btnUpTen.extraLabel = "强化+10";
            this.btnUpTen.enabled = UserProxy.inst.medal >= cost_10;
        }
        if (!cost_100) {
            this.btnUpNext.label = "???";
            this.btnUpNext.extraLabel = "强化+???";
            this.btnUpNext.enabled = false;
        }
        else {
            this.btnUpNext.label = MathUtil.easyNumber(cost_100);
            this.btnUpNext.extraLabel = "强化+100";
            this.btnUpNext.enabled = UserProxy.inst.medal >= cost_100;
        }
    };
    p.onTab = function (e) {
        SoundManager.inst.playEffect("click_mp3");
        var select = 0;
        if (e.currentTarget == this.tabTalent) {
            select = 1;
        }
        else {
            if (e.currentTarget == this.tabSkill) {
                select = 2;
            }
            else {
                select = 3;
            }
        }
        this._lastBtn = e.currentTarget;
        this.onSelectChoose(select);
    };
    p.onSelectChoose = function (index) {
        // if(index == this._select)
        // {
        //     return;
        // }
        this._select = index;
        if (index == 1) {
            this.skillShip.visible = false;
            this.talentGroup.visible = true;
            this.tabTalent.imageUp.visible = false;
            this.tabShip.imageUp.visible = true;
            this.tabSkill.imageUp.visible = true;
        }
        else {
            this.skillShip.visible = true;
            this.talentGroup.visible = false;
            if (index == 2) {
                this.changeList.itemRenderer = RoleSkillRenderer;
                this.tabTalent.imageUp.visible = true;
                this.tabShip.imageUp.visible = true;
                this.tabSkill.imageUp.visible = false;
            }
            else {
                this.changeList.itemRenderer = RoleShipRenderer;
                this.tabTalent.imageUp.visible = true;
                this.tabShip.imageUp.visible = false;
                this.tabSkill.imageUp.visible = true;
            }
        }
        this.refresh();
    };
    p.refresh = function () {
        var items = [];
        if (this._select == 1) {
            var talent = Config.TalentData[UserMethod.inst.roleSelectId];
            for (var i in talent) {
                if (i != "id") {
                    var key = i.replace("effect_", "");
                    var array = [];
                    array = talent[i].concat();
                    array.unshift(key);
                    items.push(array);
                }
            }
            items.sort(sortNum);
            function sortNum(a, b) {
                return parseInt(a[0]) - parseInt(b[0]);
            }
            this.talentList.dataProvider = new eui.ArrayCollection(items);
        }
        else {
            if (this._select == 2) {
                //skill
                var openStar = Config.BaseData[1]["value"];
                var skillId = this._roleData["skill"].concat();
                var buffs = [
                    { icon: "", skillId: skillId[1], openStar: openStar[1] },
                    { icon: "", skillId: skillId[2], openStar: openStar[2] },
                    { icon: "", skillId: skillId[3], openStar: openStar[3] },
                    { icon: "", skillId: skillId[4], openStar: openStar[4] },
                    { icon: "", skillId: skillId[5], openStar: openStar[5] },
                    { icon: "", skillId: skillId[6], openStar: openStar[6] },
                ];
                items = buffs.concat();
            }
            else {
                //ship
                var ships = this._roleData["friendly"];
                items = ships.concat();
            }
            this.changeList.dataProvider = new eui.ArrayCollection(items);
        }
    };
    p.onEnhanceUp = function () {
        this.showRoleInfo();
    };
    p.onUp = function (e) {
        var type = 0;
        if (e.currentTarget == this.btnUp) {
            type = 1;
        }
        else if (e.currentTarget == this.btnUpTen) {
            type = 2;
        }
        else {
            type = 3;
        }
        Http.inst.send(CmdID.ENHANCE_UP, { hid: UserMethod.inst.roleSelectId, type: type });
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
    p.delayShow = function () {
        this._touchCount++;
        if (this._touchCount > 3) {
            this.hideGroup.visible = true;
        }
        if (this.hideGroup.visible) {
            if (this._delayTimes) {
                egret.clearTimeout(this._delayTimes);
            }
            this._delayTimes = egret.setTimeout(clearShow, this, 3000);
        }
        function clearShow() {
            this.hideGroup.visible = false;
            this._continueTouch = 0;
            this._touchCount = 0;
        }
    };
    p.onBack = function (e) {
        PanelManager.inst.showPanel("RoleStrengthRestart", UserMethod.inst.roleSelectId);
    };
    p.onUpStar = function () {
        PanelManager.inst.showPanel("RoleStarRise", UserMethod.inst.roleSelectId);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("RoleDetailsPanel");
    };
    p.onLeft = function () {
        var index = UserMethod.inst.nowRoleShow.indexOf(UserMethod.inst.roleSelectId);
        if (index == 0) {
            index = UserMethod.inst.nowRoleShow.length - 1;
        }
        else {
            index--;
        }
        var id = UserMethod.inst.nowRoleShow[index];
        this.changeSelect(id);
        this._lastBtn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    };
    p.onRight = function () {
        var index = UserMethod.inst.nowRoleShow.indexOf(UserMethod.inst.roleSelectId);
        if (index == UserMethod.inst.nowRoleShow.length - 1) {
            index = 0;
        }
        else {
            index++;
        }
        var id = UserMethod.inst.nowRoleShow[index];
        this.changeSelect(id);
        this._lastBtn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        Http.inst.removeCmdListener(CmdID.ENHANCE_UP, this.onEnhanceUp, this);
        Http.inst.removeCmdListener(CmdID.STAR_UP, this.checkStar, this);
        Http.inst.removeCmdListener(CmdID.RELATIONSHIP, this.checkShip, this);
        EventManager.inst.removeEventListener(ContextEvent.CHANGE_ROLE_SHOW, this.showRoleInfo, this);
        this.btnUpStar.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpStar, this);
        this.tabShip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        this.tabTalent.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        this.tabSkill.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnUpTen.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnUpNext.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUp, this);
        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        egret.Tween.removeTweens(this.btnLeft);
        egret.Tween.removeTweens(this.btnRight);
        this.coinShow.endListener();
    };
    return RoleDetailsPanel;
}(BasePanel));
egret.registerClass(RoleDetailsPanel,'RoleDetailsPanel');
