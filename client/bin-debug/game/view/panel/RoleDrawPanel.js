/**
 * Created by Administrator on 12/15 0015.
 */
var RoleDrawPanel = (function (_super) {
    __extends(RoleDrawPanel, _super);
    function RoleDrawPanel() {
        _super.call(this);
        this._startX = 550;
        this._endX = -220;
        this._roleIds = [];
        this._rotations = [-35, -20, 0, 20, 35, -45, -25, 0, 25, 45];
        this._tenMovePos = [new egret.Point(80, 200), new egret.Point(165, 200), new egret.Point(220, 200), new egret.Point(275, 200), new egret.Point(360, 220), new egret.Point(100, 260), new egret.Point(170, 280), new egret.Point(220, 280), new egret.Point(270, 280), new egret.Point(330, 260)];
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = RoleDrawPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=RoleDrawPanel,p=c.prototype;
    p.init = function () {
        this.btnOne.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDraw, this);
        this.btnTen.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDraw, this);
        this.roleShowGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRoleShow, this);
        this.roleShowGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRoleShow, this);
        this.btnShowAll.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnNotice.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.drawOverGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRoleDrawOver, this);
        this.imgTenBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tenDrawEnd, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnOneBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDrawEnd, this);
        this.btnTenBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tenDrawEnd, this);
        this.btnOneAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.oneAgain, this);
        this.btnTenAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tenAgain, this);
        this.btnDrawShop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDrawShop, this);
        Http.inst.addCmdListener(CmdID.DRAW_HERO, this.drawBack, this);
        EventManager.inst.addEventListener("GUIDE_DRAW", this.onGuide, this);
        EventManager.inst.addEventListener(ContextEvent.CONTINUE_MOVE, this.continueMove, this);
        EventManager.inst.addEventListener("GUIDE_DRAW_CLOSE", this.guideClose, this);
        this.coinShow.startListener();
    };
    p.initData = function () {
        this.cloudMove();
        this._roleIds = [];
        for (var i in Config.HeroData) {
            this._roleIds.push(parseInt(i));
        }
        this.btnOne.label = Config.BaseData[41]["value"];
        this.btnOne.imgType = "reward_3_s_png";
        if (UserProxy.inst.ticket > 0) {
            this.btnOne.label = UserProxy.inst.ticket + "";
            this.btnOne.imgType = "reward_14_s_png";
        }
        this.btnOne.extraLabel = "来一发！";
        this.btnTen.label = Config.BaseData[42]["value"];
        this.btnTen.extraLabel = "十连发！！";
        this.oneDrawGroup.visible = false;
        this.drawOverGroup.visible = false;
        this.drawTenGroup.visible = false;
        this.btnOneAgain.label = Config.BaseData[41]["value"];
        this.btnOneAgain.extraLabel = "来一发！";
        this.btnOneAgain.imgType = "reward_3_s_png";
        if (UserProxy.inst.ticket > 0) {
            this.btnOneAgain.label = UserProxy.inst.ticket + "";
            this.btnOneAgain.imgType = "reward_14_s_png";
        }
        this.btnTenAgain.label = Config.BaseData[42]["value"];
        this.btnTenAgain.extraLabel = "十连发！！";
        this.drawTicketAndTime();
        this._roleIdx = 0;
        this.startShowMove();
    };
    p.onGuide = function () {
        if (this._cdTime <= 0) {
            this.btnOne.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
    };
    p.startShowMove = function () {
        this.roleShowGroup.x = this._startX;
        this.lblSay.visible = false;
        this.imgSay.visible = false;
        var id = this._roleIds[this._roleIdx];
        this._roleIdx++;
        if (this._roleIdx > 32) {
            this._roleIdx = 0;
        }
        this._nowFirstMoveId = id;
        if (this._nowMc) {
            this._nowMc.stop();
            DisplayUtil.removeFromParent(this._nowMc);
        }
        var roleData = UserProxy.inst.heroData.getHeroData(id);
        this.lblRoleName.text = roleData.config.name;
        this.atkType.source = "job_" + roleData.config.job + "_png";
        this.lblSay.text = roleData.config.slogan;
        this.imgBody.source = Global.getHerobody(id);
        /* MovieClipUtils.createMovieClip(Global.getChaStay(id),id.toString(),afterAdd,this);
         function afterAdd(data): void
         {
             this._nowMc = data;
             this._nowMc.x = 30;
             this._nowMc.y = 80;
             this._nowMc.play(-1);
             this._nowMc.scaleX = 1.8;
             this._nowMc.scaleY = 1.8;
             this.roleGroup.addChild(this._nowMc);
         }*/
        egret.Tween.get(this.roleShowGroup).to({ x: this._endX }, 9000);
        if (this._wait1) {
            egret.clearTimeout(this._wait1);
        }
        if (this._say1) {
            egret.clearTimeout(this._say1);
        }
        this._wait1 = egret.setTimeout(function () {
            this.startShowMove2();
        }, this, 7200);
        this._say1 = egret.setTimeout(function () {
            this.lblSay.visible = true;
            this.imgSay.visible = true;
        }, this, 2500);
    };
    p.continueMove1 = function () {
        var time = (this.roleShowGroup.x + 78) / 77 * 900;
        var endTime = (this.roleShowGroup.x + 220) / 77 * 900;
        egret.Tween.get(this.roleShowGroup).to({ x: this._endX }, endTime);
        this.lblSay.visible = true;
        this.imgSay.visible = true;
        if (time >= 0) {
            this._wait1 = egret.setTimeout(function () {
                this.startShowMove2();
            }, this, time);
        }
    };
    p.stopMove1 = function () {
        egret.Tween.removeTweens(this.roleShowGroup);
        if (this._wait1) {
            egret.clearTimeout(this._wait1);
        }
        if (this._say1) {
            egret.clearTimeout(this._say1);
        }
    };
    p.startShowMove2 = function () {
        this.roleShowGroup2.x = this._startX;
        this.lblSay2.visible = false;
        this.imgSay2.visible = false;
        var id = this._roleIds[this._roleIdx];
        this._roleIdx++;
        if (this._roleIdx > 32) {
            this._roleIdx = 0;
        }
        this._nowNextMoveId = id;
        if (this._nextMc) {
            this._nextMc.stop();
            DisplayUtil.removeFromParent(this._nextMc);
        }
        var roleData = UserProxy.inst.heroData.getHeroData(id);
        this.lblRoleName2.text = roleData.config.name;
        this.atkType2.source = "job_" + roleData.config.job + "_png";
        this.lblSay2.text = roleData.config.slogan;
        this.imgBody2.source = Global.getHerobody(id);
        egret.Tween.get(this.roleShowGroup2).to({ x: this._endX }, 9000);
        this._wait2 = egret.setTimeout(function () {
            this.startShowMove();
        }, this, 7200);
        this._say2 = egret.setTimeout(function () {
            this.lblSay2.visible = true;
            this.imgSay2.visible = true;
        }, this, 2500);
    };
    p.continueMove2 = function () {
        var time = (this.roleShowGroup2.x + 78) / 71 * 900;
        var endTime = (this.roleShowGroup2.x + 220) / 71 * 900;
        egret.Tween.get(this.roleShowGroup2).to({ x: this._endX }, endTime);
        this.lblSay2.visible = true;
        this.imgSay2.visible = true;
        if (time >= 0) {
            this._wait2 = egret.setTimeout(function () {
                this.startShowMove();
            }, this, time);
        }
    };
    p.stopMove2 = function () {
        egret.Tween.removeTweens(this.roleShowGroup2);
        if (this._wait2) {
            egret.clearTimeout(this._wait2);
        }
        if (this._say2) {
            egret.clearTimeout(this._say2);
        }
    };
    p.continueMove = function () {
        if (this._stopMove == 1) {
            this.continueMove1();
        }
        else {
            this.continueMove2();
        }
    };
    p.drawBack = function (e) {
        var length = e.data["rewardAry"].length;
        this._rewardAry = [];
        for (var i = 0; i < length; i++) {
            this._rewardAry.push(e.data["rewardAry"][i]["id"]);
        }
        this.drawTicketAndTime();
        this.drawStart();
        this._drawHeroList = e.data["heroList"];
        MenuPanel.inst.checkDraw();
    };
    p.drawTicketAndTime = function () {
        this.lblGold.text = UserProxy.inst.diamond + "";
        this.lblDrawPoint.text = UserProxy.inst.ticket + "";
        var base = parseInt(Config.BaseData[43]["value"]);
        this._cdTime = (base * 60) - (UserProxy.inst.server_time - UserProxy.inst.lastFreeTime);
        if (this._cdTime > 0) {
            this.lblFreeTime.visible = true;
            this.btnOne.label = Config.BaseData[41]["value"];
            this.btnOneAgain.label = Config.BaseData[41]["value"];
            this.btnOne.imgType = "reward_3_s_png";
            this.btnOneAgain.imgType = "reward_3_s_png";
            if (UserProxy.inst.ticket > 0) {
                this.btnOne.label = UserProxy.inst.ticket + "";
                this.btnOne.imgType = "reward_14_s_png";
            }
            if (UserProxy.inst.ticket > 0) {
                this.btnOneAgain.label = UserProxy.inst.ticket + "";
                this.btnOneAgain.imgType = "reward_14_s_png";
            }
            this.tickerTime();
            TickerUtil.register(this.tickerTime, this, 1000);
        }
        else {
            this.btnOne.label = "免 费";
            this.lblFreeTime.visible = false;
        }
    };
    p.tickerTime = function () {
        this.lblFreeTime.text = StringUtil.timeToString(this._cdTime, true) + "后免费";
        this._cdTime--;
        if (!this._cdTime) {
            TickerUtil.unregister(this.tickerTime, this);
        }
    };
    p.onDraw = function (e) {
        if (e.currentTarget == this.btnOne) {
            if (UserProxy.inst.costAlart || this._cdTime <= 0 || UserProxy.inst.ticket) {
                this.drawOneWarning();
            }
            else {
                Alert.showCost(Config.BaseData[41]["value"], "寻仙一次", true, this.drawOneWarning, null, this);
            }
        }
        else {
            this._isTenAgain = false;
            if (UserProxy.inst.costAlart) {
                this.drawTenWarning();
            }
            else {
                Alert.showCost(Config.BaseData[42]["value"], "寻仙十次", true, this.drawTenWarning, null, this);
            }
        }
    };
    p.drawOneWarning = function () {
        if (UserProxy.inst.diamond >= parseInt(Config.BaseData[41]["value"]) || this._cdTime <= 0 || UserProxy.inst.ticket) {
            this.drawDisable();
            this._drawType = 1;
            Http.inst.send(CmdID.DRAW_HERO, { type: this._drawType });
        }
        else {
            ExternalUtil.inst.diamondAlert();
        }
    };
    p.drawTenWarning = function () {
        if (UserProxy.inst.diamond >= parseInt(Config.BaseData[42]["value"])) {
            this.drawDisable();
            this._drawType = 2;
            this._drawTenIdx = 0;
            this.hideTenIcons();
            Http.inst.send(CmdID.DRAW_HERO, { type: this._drawType });
        }
        else {
            ExternalUtil.inst.diamondAlert();
        }
    };
    p.hideTenIcons = function () {
        for (var i = 0; i < 10; i++) {
            var awardGroup = DisplayUtil.getChildByName(this.drawTenGroup, "awardGroup" + i);
            awardGroup.visible = false;
        }
    };
    p.drawStart = function () {
        var _this = this;
        var self = this;
        MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_ball"), "draw_ball", function (data) {
            var mc = data;
            mc.x = 240;
            mc.y = 440;
            self.addChild(mc);
            MovieClipUtils.playMCOnce(mc, function () {
                DisplayUtil.removeFromParent(mc);
                drawCommonLight();
            }, _this);
        }, this);
        function drawCommonLight() {
            var _this = this;
            MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_common_effect"), "draw_common_effect", function (data) {
                var mc = data;
                mc.x = 240;
                mc.y = 385;
                self.addChild(mc);
                MovieClipUtils.playMCOnce(mc, function () {
                    DisplayUtil.removeFromParent(mc);
                    if (self._drawType == 1) {
                        self.drawOneLight();
                    }
                    else {
                        self.drawTenGroup.visible = true;
                        self.btnTenAgain.visible = false;
                        self.btnTenBack.visible = false;
                        self.drawTenLight();
                    }
                }, _this);
            }, this);
        }
    };
    p.drawOneLight = function () {
        var _this = this;
        var id = this._rewardAry[0];
        var reward = Config.HeroDrawData[id]["reward_1"];
        var icon = DisplayUtil.getChildByName(this.oneDrawGroup, "icon");
        var num = DisplayUtil.getChildByName(this.oneDrawGroup, "num");
        var light = DisplayUtil.getChildByName(this.oneDrawGroup, "light");
        var name = DisplayUtil.getChildByName(this.oneDrawGroup, "name");
        icon.touchReward = reward;
        var rewardData = UserMethod.inst.rewardJs[reward[0]];
        num.text = "x" + reward[2];
        var quality = UserProxy.inst.heroData.getHeroData(reward[1]).config.quality;
        icon.qualityBg = quality;
        light.visible = false;
        egret.Tween.get(light, { loop: true }).to({ rotation: 360 }, 15000);
        var heroData = UserProxy.inst.heroData.getHeroData(reward[1]);
        if (rewardData.id == 6) {
            icon.imgIcon = Global.getChaIcon(reward[1]);
            light.visible = true;
            name.text = heroData.config.name;
        }
        else {
            icon.imgIcon = Global.getChaChipIcon(reward[1]);
            name.text = heroData.config.name + "元神";
            if (parseInt(reward[1]) == 126 || parseInt(reward[1]) == 129 || parseInt(reward[1]) == 130) {
                light.visible = true;
            }
        }
        var self = this;
        MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_one_effect"), "draw_one_effect", function (data) {
            var mc = data;
            mc.x = 240;
            mc.y = 385;
            self.addChild(mc);
            MovieClipUtils.playMCOnce(mc, function () {
                DisplayUtil.removeFromParent(mc);
                self.oneDrawGroup.visible = true;
                self.btnOneAgain.visible = false;
                self.btnOneBack.visible = false;
                self.drawIconShine();
            }, _this);
        }, this);
    };
    p.drawTenLight = function () {
        var self = this;
        var mc;
        MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_ten_light"), "draw_ten_light", function (data) {
            mc = data;
            mc.x = 245;
            mc.y = 375;
            mc.name = "tenLight";
            self.addChild(mc);
            mc.play(-1);
            self.startFly();
        }, this);
    };
    p.startFly = function () {
        this.imgTenFly.x = 220;
        this.imgTenFly.y = 370;
        this.imgTenFly.scaleY = 0.3;
        this.imgTenFly.rotation = this._rotations[this._drawTenIdx];
        var moveX = this._tenMovePos[this._drawTenIdx].x;
        var moveY = this._tenMovePos[this._drawTenIdx].y;
        this.imgTenFly.visible = true;
        if (this._isTenAgain) {
            egret.Tween.get(this.imgTenFly).to({ scaleY: 0.6, x: moveX, y: moveY }, 0);
            egret.setTimeout(flyOver, this, 0);
        }
        else {
            egret.Tween.get(this.imgTenFly).to({ scaleY: 0.6, x: moveX, y: moveY }, 50);
            egret.setTimeout(flyOver, this, 50);
        }
        var self = this;
        function flyOver() {
            var _this = this;
            self.imgTenFly.visible = false;
            var awardGroup = DisplayUtil.getChildByName(self.drawTenGroup, "awardGroup" + self._drawTenIdx);
            MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_ten_effect"), "draw_ten_effect", function (data) {
                var mc = data;
                mc.x = awardGroup.x + 32;
                mc.y = awardGroup.y + 32;
                self.addChild(mc);
                MovieClipUtils.playMCOnce(mc, function () {
                    DisplayUtil.removeFromParent(mc);
                    showAwardGet();
                }, _this);
            }, this);
        }
        function showAwardGet() {
            var id = self._rewardAry[self._drawTenIdx];
            var reward = Config.HeroDrawData[id]["reward_1"];
            var rewardData = UserMethod.inst.rewardJs[reward[0]];
            var awardGroup = DisplayUtil.getChildByName(self.drawTenGroup, "awardGroup" + self._drawTenIdx);
            awardGroup.visible = true;
            var icon = DisplayUtil.getChildByName(awardGroup, "icon");
            var num = DisplayUtil.getChildByName(awardGroup, "num");
            var light = DisplayUtil.getChildByName(awardGroup, "light");
            icon.touchReward = reward;
            num.text = "x" + reward[2];
            var quality = UserProxy.inst.heroData.getHeroData(reward[1]).config.quality;
            icon.qualityBg = quality;
            light.visible = false;
            egret.Tween.get(light, { loop: true }).to({ rotation: 360 }, 15000);
            if (rewardData.id == 6) {
                icon.imgIcon = Global.getChaIcon(reward[1]);
                light.visible = true;
            }
            else {
                icon.imgIcon = Global.getChaChipIcon(reward[1]);
                if (parseInt(reward[1]) == 126 || parseInt(reward[1]) == 129 || parseInt(reward[1]) == 130) {
                    light.visible = true;
                }
            }
            self._drawTenIdx++;
            if (self._drawTenIdx <= 10) {
                if (id <= 199) {
                    self.showDrawRole(id);
                }
                else {
                    if (self._drawTenIdx <= 9) {
                        self.startFly();
                    }
                }
                if (self._drawTenIdx == 10) {
                    self.btnTenAgain.visible = true;
                    self.btnTenBack.visible = true;
                    var mc = DisplayUtil.getChildByName(self, "tenLight");
                    if (mc) {
                        mc.stop();
                        DisplayUtil.removeFromParent(mc);
                    }
                }
            }
        }
    };
    p.drawIconShine = function () {
        var _this = this;
        var self = this;
        MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_icon_shine"), "draw_icon_shine", function (data) {
            var mc = data;
            mc.x = 240;
            mc.y = 337;
            self.addChild(mc);
            MovieClipUtils.playMCOnce(mc, function () {
                DisplayUtil.removeFromParent(mc);
                //如果是role
                if (this._rewardAry[0] <= 199) {
                    self.showDrawRole(this._rewardAry[0]);
                    self.oneDrawGroup.visible = false;
                }
                else {
                    self.btnOneAgain.visible = true;
                    self.btnOneBack.visible = true;
                    self.oneBg.addEventListener(egret.TouchEvent.TOUCH_TAP, self.onDrawEnd, self);
                }
            }, _this);
        }, this);
    };
    p.showDrawRole = function (id) {
        this.imgShowBody.source = Global.getHerobody(id);
        this.imgShowBody.visible = true;
        this.imgShowBody.scaleX = 0.2;
        this.imgShowBody.scaleY = 0.2;
        egret.Tween.get(this.imgShowBody).to({ scaleX: 0.8, scaleY: 0.8 }, 400);
        egret.setTimeout(function () {
            this.showRoleDrawOver(id);
        }, this, 180);
    };
    p.showRoleDrawOver = function (id) {
        var _this = this;
        this._canCloseDraw = false;
        this.setChildIndex(this.drawOverGroup, 100);
        this.drawOverGroup.visible = true;
        this.drawGroup.visible = false;
        var roleData = UserProxy.inst.heroData.getHeroData(id);
        this.drawTurnIcon.setLv = 0;
        this.drawTurnIcon.setStar = 0;
        this.drawTurnIcon.imgIcon = Global.getChaChipIcon(id);
        this.drawTurnNum.text = "x" + roleData.config.piece;
        this.imgRotate.visible = true;
        this.drawGroup.y = 300;
        egret.Tween.get(this.imgRotate, { loop: true }).to({ rotation: 360 }, 10000);
        this.lblName.text = roleData.config.name;
        egret.setTimeout(roleChangeFragment, this, 1200);
        egret.setTimeout(function () { _this._canCloseDraw = true; }, this, 1500);
        var self = this;
        function roleChangeFragment() {
            var _this = this;
            if (roleData.level) {
                egret.Tween.removeTweens(self.imgRotate);
                self.imgRotate.visible = false;
                self.imgShowBody.visible = false;
                MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_role_change"), "draw_role_change", function (data) {
                    var mc = data;
                    mc.x = 245;
                    mc.y = 330;
                    self.drawOverGroup.addChild(mc);
                    MovieClipUtils.playMCOnce(mc, function () {
                        DisplayUtil.removeFromParent(mc);
                        self.drawGroup.visible = true;
                        egret.Tween.get(self.drawGroup).to({ y: 310 }, 500);
                    }, _this);
                }, this);
            }
            else {
                PanelManager.inst.showPanel("RoleDrawInfoPanel", { id: id, from: 1 });
            }
        }
    };
    p.closeRoleDrawOver = function () {
        if (!this._canCloseDraw) {
            return;
        }
        this.drawOverGroup.visible = false;
        var mc = DisplayUtil.getChildByName(this, "roleMc");
        if (mc) {
            DisplayUtil.removeFromParent(mc);
        }
        if (this._drawType == 1) {
            this.drawEnable();
        }
        else {
            if (this._drawTenIdx < 10) {
                this.startFly();
            }
        }
        if (UserMethod.inst.guideBajie) {
            UserMethod.inst.guideBajie = false;
            PanelManager.inst.hidePanel("RoleDrawPanel");
            UserProxy.inst.setBuffer(5);
            UserProxy.inst.nextGuide();
        }
    };
    p.oneAgain = function () {
        var self = this;
        if (UserProxy.inst.costAlart || this._cdTime <= 0 || UserProxy.inst.ticket) {
            oneWarning();
        }
        else {
            Alert.showCost(Config.BaseData[41]["value"], "寻仙一次", true, oneWarning, null, this);
        }
        function oneWarning() {
            if (UserProxy.inst.diamond >= parseInt(Config.BaseData[41]["value"]) || this._cdTime <= 0 || UserProxy.inst.ticket) {
                self.onDrawEnd();
                self.drawDisable();
                self._drawType = 1;
                Http.inst.send(CmdID.DRAW_HERO, { type: self._drawType });
            }
            else {
                ExternalUtil.inst.diamondAlert();
            }
        }
    };
    p.tenAgain = function () {
        this._isTenAgain = true;
        var self = this;
        if (UserProxy.inst.costAlart) {
            tenWarning();
        }
        else {
            Alert.showCost(Config.BaseData[42]["value"], "寻仙十次", true, tenWarning, null, this);
        }
        function tenWarning() {
            if (UserProxy.inst.diamond >= parseInt(Config.BaseData[42]["value"])) {
                self.tenDrawEnd();
                self.drawDisable();
                self._drawType = 2;
                self._drawTenIdx = 0;
                self.hideTenIcons();
                Http.inst.send(CmdID.DRAW_HERO, { type: self._drawType });
            }
            else {
                ExternalUtil.inst.diamondAlert();
            }
        }
    };
    p.onDrawEnd = function () {
        this.oneDrawGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDrawEnd, this);
        this.oneDrawGroup.visible = false;
        this.drawEnable();
    };
    p.tenDrawEnd = function () {
        if (this._drawTenIdx <= 9) {
            return;
        }
        this.drawTenGroup.visible = false;
        this.drawEnable();
    };
    p.drawDisable = function () {
        this.drawHideGroup.visible = false;
    };
    p.drawEnable = function () {
        for (var i in this._drawHeroList) {
            var hero = this._drawHeroList[i];
            var id = parseInt(i);
            var roleData = UserProxy.inst.heroData.getHeroData(id);
            hero["evolution"] = roleData.evolution;
        }
        UserProxy.inst.heroData.parse(this._drawHeroList);
        EventManager.inst.dispatch(ContextEvent.HAVE_NEW_ROLE);
        this.drawHideGroup.visible = true;
    };
    p.guideClose = function () {
        UserProxy.inst.heroData.parse(this._drawHeroList);
        EventManager.inst.dispatch(ContextEvent.HAVE_NEW_ROLE);
    };
    p.onRoleShow = function (e) {
        var id;
        if (e.currentTarget == this.roleShowGroup) {
            id = this._nowFirstMoveId;
            this._stopMove = 1;
            this.stopMove1();
        }
        else {
            id = this._nowNextMoveId;
            this._stopMove = 2;
            this.stopMove2();
        }
        PanelManager.inst.showPanel("RoleDrawInfoPanel", { id: id, from: 0 });
    };
    p.onTouch = function (e) {
        if (e.currentTarget == this.btnShowAll) {
        }
        else {
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("RoleDrawPanel");
    };
    p.cloudMove = function () {
        egret.Tween.get(this.imgCloud2, { loop: true }).to({ x: 100 }, 55000).wait(4800).to({ x: 282 }, 37000).wait(6800);
        egret.Tween.get(this.imgCloud1, { loop: true }).to({ x: 32 }, 32000).wait(3800).to({ x: -212 }, 59000).wait(1800);
        egret.Tween.get(this.imgCloud3, { loop: true }).to({ x: -250 }, 39000).wait(5300).to({ x: -50 }, 21000).wait(2800);
    };
    p.onDrawShop = function () {
        PanelManager.inst.showPanel("RoleChangePanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnOne.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDraw, this);
        this.btnTen.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDraw, this);
        this.roleShowGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRoleShow, this);
        this.roleShowGroup2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRoleShow, this);
        this.btnShowAll.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnNotice.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.drawOverGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRoleDrawOver, this);
        this.drawTenGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tenDrawEnd, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        Http.inst.removeCmdListener(CmdID.DRAW_HERO, this.drawBack, this);
        EventManager.inst.removeEventListener("GUIDE_DRAW", this.onGuide, this);
        EventManager.inst.removeEventListener("GUIDE_DRAW_CLOSE", this.guideClose, this);
        EventManager.inst.removeEventListener(ContextEvent.CONTINUE_MOVE, this.continueMove, this);
        this.btnOneBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDrawEnd, this);
        this.btnTenBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tenDrawEnd, this);
        this.btnOneAgain.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.oneAgain, this);
        this.btnTenAgain.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tenAgain, this);
        this.btnDrawShop.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDrawShop, this);
        egret.Tween.removeTweens(this.imgCloud2);
        egret.Tween.removeTweens(this.imgCloud1);
        egret.Tween.removeTweens(this.imgCloud3);
        TickerUtil.unregister(this.tickerTime, this);
        this.coinShow.endListener();
    };
    return RoleDrawPanel;
}(BasePanel));
egret.registerClass(RoleDrawPanel,'RoleDrawPanel');
//# sourceMappingURL=RoleDrawPanel.js.map