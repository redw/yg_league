/**
 * Created by Administrator on 12/27 0027.
 */
var RoleStarRise = (function (_super) {
    __extends(RoleStarRise, _super);
    function RoleStarRise() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = RoleStarRiseSkin;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
        this._modal = true;
    }
    var d = __define,c=RoleStarRise,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.STAR_UP, this.showEffect, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnRise.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRise, this);
    };
    p.showEffect = function () {
        this.riseBg.visible = true;
        this.riseShowStar.visible = true;
        this.riseShowStar.scaleX = 8;
        this.riseShowStar.scaleY = 8;
        var self = this;
        egret.Tween.get(this.riseShowStar).to({ scaleX: 1, scaleY: 1 }, 300).call(showEffect);
        function showEffect() {
            self.riseShowStar.visible = false;
            MovieClipUtils.createMovieClip(Global.getOtherEffect("rise_star"), "rise_star", afterAdd, this);
            function afterAdd(data) {
                var mc = data;
                mc.x = 108;
                mc.y = 100;
                self.contentGroup.addChild(mc);
                MovieClipUtils.playMCOnce(mc, function () {
                    DisplayUtil.removeFromParent(mc);
                    self.riseBg.visible = false;
                    self.initData();
                }, this);
            }
        }
    };
    p.initData = function () {
        var roleData = UserProxy.inst.heroData.getHeroData(this.data);
        this.imgJob.source = "job_" + roleData.config.job + "_png";
        this.lblName.text = roleData.config.name;
        this.lblNameChip.text = roleData.config.name + "元神";
        this.lblStar.text = roleData.starLevel + "";
        this.imageIcon.source = Global.getChaIcon(this.data);
        var quality = parseInt(roleData.config.quality);
        this.imgIconBg.source = "role_icon_" + quality + "_png";
        var starData = Config.HeroStarData[roleData.starLevel + 1];
        var needChip = starData["rank_chip_" + quality];
        var needPill = starData["rank_pill_" + quality];
        var starPiece = roleData.starPiece;
        this.lblFragmentNum.text = starPiece + "/" + needChip;
        this.lblStarCoin.text = UserProxy.inst.pill + "/" + needPill;
        var chipEnough = 0;
        var pillEnough = 0;
        if (starPiece >= needChip) {
            chipEnough = 1;
        }
        if (UserProxy.inst.pill >= needPill) {
            pillEnough = 1;
        }
        this.imgEnoughChip.visible = !!chipEnough;
        this.imgEnoughPill.visible = !!pillEnough;
        this.btnRise.enabled = (!!chipEnough && !!pillEnough);
        var starMax = parseInt(Config.BaseData[67]["value"][quality - 1]);
        if (roleData.starLevel >= starMax) {
            this.btnRise.enabled = false;
            this.btnRise.label = "MAX";
        }
        this.chipIcon.imgIcon = Global.getChaChipIcon(this.data);
        this.chipIcon.qualityBg = roleData.config.quality;
        this.starIcon.imgIcon = "reward_22_png";
    };
    p.onRise = function () {
        Http.inst.send(CmdID.STAR_UP, { hid: this.data });
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("RoleStarRise");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        Http.inst.removeCmdListener(CmdID.STAR_UP, this.initData, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnRise.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRise, this);
    };
    return RoleStarRise;
}(BasePanel));
egret.registerClass(RoleStarRise,'RoleStarRise');
