/**
 * Created by Administrator on 2/9 0009.
 */
var CircleGoSuccessPanel = (function (_super) {
    __extends(CircleGoSuccessPanel, _super);
    function CircleGoSuccessPanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = CircleGoSuccessPanlSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=CircleGoSuccessPanel,p=c.prototype;
    p.init = function () {
        this.imgWhite.visible = false;
        this.completeGroup.visible = false;
        this.completeGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.initData = function () {
        var self = this;
        MovieClipUtils.createMovieClip(Global.getOtherEffect("circle_light"), "circle_light", afterAdd, this);
        function afterAdd(data) {
            var mc = data;
            mc.x = -149;
            mc.y = -50;
            mc.scaleX = 3;
            mc.scaleY = 3;
            this.addChild(mc);
            MovieClipUtils.playMCOnce(mc, function () {
                DisplayUtil.removeFromParent(mc);
                showWhite();
                egret.setTimeout(self.startShow, this, 800);
            }, this);
        }
        function showWhite() {
            self.imgWhite.visible = true;
            egret.Tween.get(self.imgWhite).to({ alpha: 0 }, 800);
        }
    };
    p.startShow = function () {
        this.imgWhite.visible = false;
        this.completeGroup.visible = true;
        /* MovieClipUtils.createMovieClip(Global.getOtherEffect("circle_star"),"circle_star",afterAdd1,this);
         function afterAdd1(data): void
         {
             var mc = data;
             mc.x = 80;
             mc.y = 140;
             mc.play(-1);
             mc.touchEnabled = false;
             mc.name = "star";
             mc.scaleX = 2.5;
             mc.scaleY = 2.5;
             this.completeGroup.addChild(mc);
         }*/
        for (var i = 0; i < 18; i++) {
            var star = DisplayUtil.getChildByName(this.completeGroup, "star" + i);
            if (i % 2 == 0) {
                star.alpha = 0;
                egret.Tween.get(star, { loop: true }).to({ alpha: 1 }, 1000).to({ alpha: 0 }, 1000);
            }
            else {
                egret.Tween.get(star, { loop: true }).to({ alpha: 0 }, 1000).to({ alpha: 1 }, 1000);
            }
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("CircleGoSuccessPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        var mc = DisplayUtil.getChildByName(this.completeGroup, "star");
        if (mc) {
            mc.stop();
            DisplayUtil.removeFromParent(mc);
        }
        for (var i = 0; i < 12; i++) {
            var star = DisplayUtil.getChildByName(this.completeGroup, "star" + i);
            egret.Tween.removeTweens(star);
        }
    };
    return CircleGoSuccessPanel;
}(BasePanel));
egret.registerClass(CircleGoSuccessPanel,'CircleGoSuccessPanel');
//# sourceMappingURL=CircleGoSuccessPanel.js.map