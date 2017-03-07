/**
 * Created by Administrator on 12/26 0026.
 */
var RoleFormationPanel = (function (_super) {
    __extends(RoleFormationPanel, _super);
    // private _groupPosArr:eui.Group[];
    function RoleFormationPanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = RoleFormationPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=RoleFormationPanel,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.posGroup0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.btnInto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onInto, this);
        EventManager.inst.addEventListener("GUIDE_FORMATION_2", this.onGuide, this);
        EventManager.inst.addEventListener("GUIDE_CLOSE_FORMATION", this.onClose, this);
        EventManager.inst.addEventListener(ContextEvent.BATTLE_CHANGE_POS, this.showArrow, this);
        /*for(var i:number = 0; i < 6; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"battleGroup" + i);
            var mcGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(group,"mcGroup");
            mcGroup["id"] = i;
            mcGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDownRole,this);
        }*/
        this.upList.itemRenderer = RoleFormationRenderer;
    };
    p.initData = function () {
        UserMethod.inst.battle_type_pos = this.data.type;
        var ids = [];
        var idArrays = [];
        var heroIds = UserProxy.inst.heroData.getHeroIds();
        var count = 0;
        var total = 0;
        for (var i in heroIds) {
            var roleId = Number(heroIds[i]);
            var hero = UserProxy.inst.heroData.getHeroData(roleId);
            if (UserMethod.inst.battle_type_pos == 1) {
                total++;
                if (hero.level) {
                    ids.push(roleId);
                    count++;
                }
            }
            else {
                switch (Math.floor(this.data.id / 1000)) {
                    case 1:
                        if (parseInt(hero.config.race) != 3) {
                            total++;
                            if (hero.level) {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                    case 2:
                        if (parseInt(hero.config.race) != 4) {
                            total++;
                            if (hero.level) {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                    case 3:
                        if (parseInt(hero.config.race) != 5) {
                            total++;
                            if (hero.level) {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                    case 4:
                        if (parseInt(hero.config.range) != 1) {
                            total++;
                            if (hero.level) {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                    case 5:
                        if (parseInt(hero.config.range) != 2) {
                            total++;
                            if (hero.level) {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                }
            }
            if (ids.length == 4) {
                idArrays.push(ids);
                ids = [];
            }
        }
        if (ids.length > 0) {
            idArrays.push(ids);
        }
        this.upList.dataProvider = new eui.ArrayCollection(idArrays);
        this.lblHadHero.text = count + "/" + total;
        /*this._groupPosArr = [];
        this._groupPosArr.push(this.posGroup0);
        this._groupPosArr.push(this.posGroup1);
        this._groupPosArr.push(this.posGroup2);
        this._groupPosArr.push(this.posGroup3);
        this._groupPosArr.push(this.posGroup4);
        this._groupPosArr.push(this.posGroup5);*/
        var battleArr = [];
        UserMethod.inst.battle_pos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        switch (UserMethod.inst.battle_type_pos) {
            case 1:
                this.txtBg.visible = true;
                this.lblSecretDesc.visible = false;
                battleArr = UserProxy.inst.fightData.getPVEFormation();
                this.btnInto.visible = false;
                this.upList.height = 400;
                var length = battleArr.length;
                for (var l = 0; l < length; l++) {
                    UserMethod.inst.battle_pos[battleArr[l]["pos"]] = battleArr[l]["id"];
                }
                var canUp = false;
                for (var p = 0; p < 6; p++) {
                    if (!UserMethod.inst.battle_pos[p]) {
                        canUp = true;
                    }
                }
                if (canUp) {
                    this.lblHelp.text = "请点击下方需要上阵的英雄";
                }
                break;
            case 2:
                this.txtBg.visible = false;
                this.lblSecretDesc.visible = true;
                var secretData = Config.WeaponFbOp[UserMethod.inst.secret_type];
                this.lblSecretDesc.text = secretData["disc"];
                this.scroll.height = 340;
                var dungeonInfo = UserProxy.inst.dungeonList[UserMethod.inst.secret_type];
                var dungeonArr = dungeonInfo["dungeonPos"].concat();
                battleArr = dungeonArr;
                this.btnInto.visible = true;
                this.upList.height = 340;
                var length = battleArr.length;
                for (var l = 0; l < length; l++) {
                    UserMethod.inst.battle_pos[l] = battleArr[l];
                }
                break;
        }
        this.refreshBattleRoles();
    };
    p.onGuide = function () {
        this.posGroup0.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    };
    p.refreshBattleRoles = function () {
        for (var i = 0; i < 6; i++) {
            this.changePosRole(i, UserMethod.inst.battle_pos[i]);
        }
    };
    p.changePosRole = function (pos, roleId) {
        var group = DisplayUtil.getChildByName(this, "battleGroup" + pos);
        var posGroup = DisplayUtil.getChildByName(this, "posGroup" + pos);
        var mcGroup = DisplayUtil.getChildByName(group, "mcGroup");
        var mc = DisplayUtil.getChildByName(mcGroup, "mc");
        if (mc) {
            DisplayUtil.removeFromParent(mc);
        }
        if (roleId) {
            group.visible = true;
            var lv = DisplayUtil.getChildByName(group, "lv");
            var star = DisplayUtil.getChildByName(group, "star");
            var type = DisplayUtil.getChildByName(group, "type");
            var strength = DisplayUtil.getChildByName(group, "strength");
            var imgLvMis = DisplayUtil.getChildByName(group, "imgLvMis");
            var roleData = UserProxy.inst.heroData.getHeroData(roleId);
            lv.text = "Lv." + roleData.level;
            star.text = "" + roleData.starLevel;
            type.source = "job_" + roleData.config.job + "_png";
            strength.text = "+" + roleData.strengthenLevel;
            if (UserMethod.inst.battle_type_pos != 2) {
                imgLvMis.visible = false;
            }
            MovieClipUtils.createMovieClip(Global.getChaStay(roleId), "" + roleId, afterAdd, this);
            function afterAdd(data) {
                var mc = data;
                mc.x = 45;
                mc.y = 70;
                mc.scaleX = -1;
                mc.name = "mc";
                mc.play(-1);
                mc.touchEnabled = false;
                mcGroup.addChild(mc);
            }
        }
        else {
            group.visible = false;
        }
    };
    p.onTouchPos = function (e) {
        var pos;
        switch (e.currentTarget) {
            case this.posGroup0:
                pos = 0;
                break;
            case this.posGroup1:
                pos = 1;
                break;
            case this.posGroup2:
                pos = 2;
                break;
            case this.posGroup3:
                pos = 3;
                break;
            case this.posGroup4:
                pos = 4;
                break;
            case this.posGroup5:
                pos = 5;
                break;
        }
        if (UserMethod.inst.battle_select_role) {
            this.changePosRole(pos, UserMethod.inst.battle_select_role);
            var oldSelect = UserMethod.inst.battle_select_role;
            UserMethod.inst.battle_select_role = 0;
            this.changeBattleRole(pos, oldSelect);
        }
        else {
            if (UserMethod.inst.battle_pos[pos]) {
                this.changePosRole(pos, 0);
                this.changeBattleRole(pos, 0);
            }
        }
        this.removeArrow();
    };
    /*private onDownRole(e:egret.TouchEvent):void
    {
        var touchId:number = e.currentTarget["id"];
        this.changeBattleRole(touchId,0);
        this.changePosRole(touchId,0);
    }*/
    p.showArrow = function () {
        var arrowPosY = [75, 155, 235, 75, 155, 235];
        var canUp = false;
        for (var i = 0; i < 6; i++) {
            if (!UserMethod.inst.battle_pos[i]) {
                var arrow = DisplayUtil.getChildByName(this, "arrow" + i);
                arrow.visible = true;
                egret.Tween.get(arrow, { loop: true }).to({ y: arrow.y - 10 }, 800).to({ y: arrowPosY[i] }, 800);
                canUp = true;
            }
        }
        if (canUp) {
            this.lblHelp.text = "请点击上方需要摆放位置";
        }
    };
    p.removeArrow = function () {
        for (var i = 0; i < 6; i++) {
            var arrow = DisplayUtil.getChildByName(this, "arrow" + i);
            egret.Tween.removeTweens(arrow);
            arrow.visible = false;
        }
        this.lblHelp.text = "完成上阵,关闭后生效";
    };
    p.changeBattleRole = function (pos, roleId) {
        UserMethod.inst.battle_pos[pos] = roleId;
        EventManager.inst.dispatch(ContextEvent.BATTLE_CHANGE_END, roleId);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("RoleFormationPanel");
        UserMethod.inst.battle_select_role = 0;
        //改变阵容
        switch (UserMethod.inst.battle_type_pos) {
            case 1:
                Http.inst.send(CmdID.FIGHT_FORMATION, { type: 1, posAry: JSON.stringify(UserMethod.inst.battle_pos) });
                // 此处只是改变数据,不通知服务器端,下关开始时，才通知服务器端
                // UserProxy.inst.fightData.changePVEFormation(UserMethod.inst.battle_pos);
                break;
        }
    };
    p.onInto = function () {
        var had = false;
        for (var i in UserMethod.inst.battle_pos) {
            if (UserMethod.inst.battle_pos[i]) {
                had = true;
                break;
            }
        }
        if (!had) {
            Notice.show("必须上阵一个伙伴才能进行战斗！");
            return;
        }
        PanelManager.inst.hidePanel("RoleFormationPanel");
        if (PanelManager.inst.isShow("SecretAreaPanel")) {
            PanelManager.inst.hidePanel("SecretAreaPanel");
        }
        PanelManager.inst.showPanel("BossFightPanel", { id: this.data.id, hero: UserMethod.inst.battle_pos.concat() });
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.posGroup0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.posGroup5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPos, this);
        this.btnInto.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onInto, this);
        /*for(var i:number = 0; i < 6; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"battleGroup" + i);
            var mcGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(group,"mcGroup");
            mcGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDownRole,this);
        }*/
        EventManager.inst.removeEventListener(ContextEvent.BATTLE_CHANGE_POS, this.showArrow, this);
        EventManager.inst.removeEventListener("GUIDE_FORMATION_2", this.onGuide, this);
        EventManager.inst.removeEventListener("GUIDE_CLOSE_FORMATION", this.onClose, this);
        this.removeArrow();
        TopPanel.inst.hideFormation();
    };
    return RoleFormationPanel;
}(BasePanel));
egret.registerClass(RoleFormationPanel,'RoleFormationPanel');
//# sourceMappingURL=RoleFormationPanel.js.map