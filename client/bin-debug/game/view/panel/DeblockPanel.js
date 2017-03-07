/**
 * Created by Administrator on 1/18 0018.
 */
var DeblockPanel = (function (_super) {
    __extends(DeblockPanel, _super);
    function DeblockPanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = DeblockPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=DeblockPanel,p=c.prototype;
    p.init = function () {
    };
    p.initData = function () {
        EventManager.inst.dispatch(ContextEvent.OPEN_DEBLOCKING);
        this._index = this.data;
        var img;
        if (this.data == 1) {
            img = this.secretLock;
            this.pvpLock.visible = UserProxy.inst.historyArea < 200;
            this.weaponLock.visible = true;
        }
        else if (this.data == 2) {
            img = this.weaponLock;
            this.secretLock.visible = false;
            this.pvpLock.visible = UserProxy.inst.historyArea < 200;
        }
        else if (this.data == 3) {
            img = this.pvpLock;
            this.secretLock.visible = UserProxy.inst.circleObj["circleTimes"] < 1;
            this.weaponLock.visible = UserProxy.inst.circleObj["circleTimes"] < 1;
        }
        else {
            img = this.moneyLock;
        }
        var self = this;
        egret.Tween.get(img).to({ x: 240, y: 170, scaleX: 2, scaleY: 2 }, 800).call(doLight);
        function doLight() {
            MovieClipUtils.createMovieClip(Global.getOtherEffect("open_boom"), "open_boom", afterAdd, self);
            function afterAdd(data) {
                var mc = data;
                mc.x = -50;
                mc.y = 50;
                mc.scaleX = 3;
                mc.scaleY = 3;
                this.addChild(mc);
                MovieClipUtils.playMCOnce(mc, function () {
                    DisplayUtil.removeFromParent(mc);
                    img.visible = false;
                    lightMove();
                }, this);
            }
        }
        function lightMove() {
            self.imgLight.visible = true;
            var x;
            var y;
            var rotate;
            switch (self._index) {
                case 1:
                    x = 180;
                    y = 615;
                    rotate = 10;
                    break;
                case 2:
                    x = 240;
                    y = 615;
                    rotate = -5;
                    break;
                case 3:
                    x = 292;
                    y = 615;
                    rotate = -5;
                    break;
                case 4:
                    x = 70;
                    y = 615;
                    rotate = 20;
                    break;
            }
            egret.Tween.get(self.imgLight).to({ x: x, y: y, rotation: rotate }, 300).call(doBoom);
        }
        function doBoom() {
            self.imgLight.visible = false;
            MovieClipUtils.createMovieClip(Global.getOtherEffect("open_light"), "open_light", afterAdd, self);
            function afterAdd(data) {
                var mc = data;
                var mcX;
                switch (self._index) {
                    case 1:
                        mcX = 130;
                        break;
                    case 2:
                        mcX = 201;
                        break;
                    case 3:
                        mcX = 285;
                        break;
                    case 4:
                        mcX = -30;
                        break;
                }
                mc.x = mcX;
                mc.y = 650;
                this.addChild(mc);
                MovieClipUtils.playMCOnce(mc, function () {
                    DisplayUtil.removeFromParent(mc);
                    switch (self._index) {
                        case 1:
                            self.imgSecret.source = "deblocking_secret_light_png";
                            MenuPanel.inst.openMenu(3);
                            break;
                        case 2:
                            self.imgWeapon.source = "deblocking_weapon_light_png";
                            MenuPanel.inst.openMenu(4);
                            break;
                        case 3:
                            self.imgPVP.source = "deblocking_pvp_light_png";
                            MenuPanel.inst.openMenu(5);
                            break;
                        case 4:
                            self.imgMoney.source = "deblocking_xunshan_light_png";
                            if (UserProxy.inst.getGuideStep() > 10) {
                                MenuPanel.inst.openMenu(1);
                            }
                            break;
                    }
                    egret.setTimeout(function () {
                        self.onClose();
                    }, self, 300);
                }, this);
            }
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("DeblockPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        if (this.data == 1) {
            egret.setTimeout(function () {
                PanelManager.inst.showPanel("DeblockPanel", 2);
            }, this, 500);
        }
        if (this.data == 4) {
            if (UserProxy.inst.getGuideStep() == 11) {
                UserProxy.inst.nextGuide();
            }
        }
    };
    return DeblockPanel;
}(BasePanel));
egret.registerClass(DeblockPanel,'DeblockPanel');
//# sourceMappingURL=DeblockPanel.js.map