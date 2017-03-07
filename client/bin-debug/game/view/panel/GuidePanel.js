/**
 * Created by Administrator on 1/14 0014.
 */
var GuidePanel = (function (_super) {
    __extends(GuidePanel, _super);
    function GuidePanel() {
        _super.call(this);
        this._step = 0;
        this._descIndex = 0;
        this._descFinish = false;
        this._isShow = false;
        this.skinName = GuidePanelSkin;
        this._layer = PanelManager.TOP_LAYER;
    }
    var d = __define,c=GuidePanel,p=c.prototype;
    p.init = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.initData = function () {
        if (this._isShow) {
            return;
        }
        this._isShow = true;
        this.imgRect1.visible = false;
        this.imgRect2.visible = false;
        this.imgRect3.visible = false;
        this.imgMask.visible = false;
        this.lblGuide1.text = "";
        this.lblGuide2.text = "";
        this._dialog1 = "";
        this._dialog2 = "";
        this._descIndex = 0;
        if (this.data) {
            this._callback = this.data["callback"];
            this._thisObj = this.data["thisObj"];
        }
        var step = UserProxy.inst.getGuideStep();
        this.imgRect0.width = this.width;
        this.imgRect0.height = this.height;
        var excX = Global.getStageHeight() / 800;
        var excY = Global.getStageWidth() / 480;
        switch (step) {
            case 1:
                this._dialog1 = "点【升级】伙伴 ";
                this._dialog2 = "可让伙伴变强 ";
                this.imgType.source = "deblocking_friend_png";
                this._rect = new egret.Rectangle(12 * excX, 567 * excY, 454, 73);
                this.showHand(395, 595);
                this.imgType.x = 146;
                this.imgType.y = 378;
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 72;
                this.imgGirl.y = 310;
                this.imgDialog.width = 350;
                this.imgDialog.x = 100;
                this.imgDialog.y = 365;
                this.lblGuide1.x = 232;
                this.lblGuide1.y = 391;
                this.lblGuide2.x = 320;
                this.lblGuide2.y = 424;
                this.imgDialog.width = 350;
                this.imgDialog.x = 100;
                this.imgDialog.y = 365;
                break;
            case 2:
                this._dialog1 = "再点2次 ";
                this._dialog2 = "";
                this.imgType.visible = false;
                this._rect = new egret.Rectangle(12 * excX, 567 * excY, 454, 73);
                this.showHand(395, 595);
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 72;
                this.imgGirl.y = 310;
                this.imgDialog.width = 350;
                this.imgDialog.x = 100;
                this.imgDialog.y = 365;
                this.lblGuide1.x = 175;
                this.lblGuide1.y = 405;
                this.imgDialog.width = 200;
                this.imgDialog.x = 100;
                this.imgDialog.y = 365;
                break;
            case 3:
                this._dialog1 = "再点1次 ";
                this._dialog2 = "";
                this.imgType.visible = false;
                this._rect = new egret.Rectangle(12 * excX, 567 * excY, 454, 73);
                this.showHand(395, 595);
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 72;
                this.imgGirl.y = 310;
                this.imgDialog.width = 350;
                this.imgDialog.x = 100;
                this.imgDialog.y = 365;
                this.lblGuide1.x = 175;
                this.lblGuide1.y = 405;
                this.imgDialog.width = 200;
                this.imgDialog.x = 100;
                this.imgDialog.y = 365;
                break;
            case 4:
                this._dialog1 = "一个人打得太慢 ";
                this._dialog2 = "点【寻仙】找帮手 ";
                this.imgType.source = "role_draw_png";
                this._rect = new egret.Rectangle(17 * excX, 515 * excY, 127, 43);
                this.showHand(51, 540);
                this.imgType.x = 56;
                this.imgType.y = 378;
                this.imgGirl.scaleX = -1;
                this.imgGirl.x = 400;
                this.imgGirl.y = 323;
                this.imgDialog.width = 350;
                this.imgDialog.x = 40;
                this.imgDialog.y = 365;
                this.lblGuide1.x = 189;
                this.lblGuide1.y = 394;
                this.lblGuide2.x = 126;
                this.lblGuide2.y = 430;
                break;
            case 5:
                this._dialog1 = "寻仙使用元宝 每天也有免费机会";
                this._dialog2 = "";
                this._rect = new egret.Rectangle(53 * excX, 662 * excY, 133, 72);
                this.showHand(95, 690);
                this.imgType.visible = false;
                this.imgGirl.scaleX = -1;
                this.imgGirl.x = 410;
                this.imgGirl.y = 440;
                this.imgDialog.width = 350;
                this.imgDialog.x = 22;
                this.imgDialog.y = 489;
                this.lblGuide1.x = 50;
                this.lblGuide1.y = 530;
                break;
            case 6:
                this.imgDialog.scaleX = 1;
                this._dialog1 = "点【布阵】让新伙伴加入战斗 ";
                this._dialog2 = "";
                this.imgType.source = "guide_formate_png";
                this._rect = new egret.Rectangle(361 * excX, 515 * excY, 101, 43);
                this.showHand(400, 540);
                this.imgType.x = 223;
                this.imgType.y = 393;
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 80;
                this.imgGirl.y = 314;
                this.imgDialog.width = 350;
                this.imgDialog.x = 100;
                this.imgDialog.y = 384;
                this.lblGuide1.x = 186;
                this.lblGuide1.y = 451;
                break;
            case 7:
                this.imgDialog.scaleX = 1;
                this._dialog1 = "先选择上阵伙伴，点头像 ";
                this._dialog2 = "";
                this._rect = new egret.Rectangle(132 * excX, 390 * excY, 104, 117);
                this.showHand(180, 430);
                this.imgType.visible = false;
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 80;
                this.imgGirl.y = 464;
                this.imgDialog.width = 315;
                this.imgDialog.x = 100;
                this.imgDialog.y = 535;
                this.lblGuide1.x = 182;
                this.lblGuide1.y = 578;
                break;
            case 8:
                this.imgDialog.scaleX = 1;
                this._dialog1 = "再点上阵位置完成布阵 ";
                this._dialog2 = "";
                this._rect = new egret.Rectangle(250 * excX, 70 * excY, 120, 80);
                this.showHand(290, 100);
                this.imgType.visible = false;
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 105;
                this.imgGirl.y = 182;
                this.imgDialog.width = 278;
                this.imgDialog.x = 141;
                this.imgDialog.y = 258;
                this.lblGuide1.x = 202;
                this.lblGuide1.y = 298;
                break;
            case 9:
                this.imgDialog.scaleX = 1;
                this._dialog1 = "关闭后会记录布阵，当回合开始时生效 ";
                this._dialog2 = "";
                this._rect = new egret.Rectangle(418 * excX, 300 * excY, 58, 60);
                this.showHand(440, 330);
                this.imgType.visible = false;
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 82;
                this.imgGirl.y = 400;
                this.imgDialog.width = 360;
                this.imgDialog.x = 113;
                this.imgDialog.y = 457;
                this.lblGuide1.x = 154;
                this.lblGuide1.y = 493;
                break;
            case 10:
                this.imgDialog.scaleX = 1;
                this._dialog1 = "别忘了为新伙伴升级 ";
                this._dialog2 = "";
                this._rect = new egret.Rectangle(12 * excX, 643 * excY, 454, 73);
                this.showHand(395, 668);
                this.imgType.visible = false;
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 82;
                this.imgGirl.y = 400;
                this.imgDialog.width = 304;
                this.imgDialog.x = 113;
                this.imgDialog.y = 457;
                this.lblGuide1.x = 194;
                this.lblGuide1.y = 496;
                break;
            case 11:
                this.imgDialog.scaleX = 1;
                this._dialog1 = "点【开启】巡山 ";
                this._dialog2 = "就可以开启赚钱之路了 ";
                this._rect = new egret.Rectangle(12 * excX, 570 * excY, 454, 73);
                this.showHand(395, 595);
                this.imgType.source = "deblocking_xunshan_light_png";
                this.imgType.x = 140;
                this.imgType.y = 440;
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 65;
                this.imgGirl.y = 361;
                this.imgDialog.width = 342;
                this.imgDialog.x = 113;
                this.imgDialog.y = 427;
                this.lblGuide1.x = 235;
                this.lblGuide1.y = 453;
                this.lblGuide2.x = 260;
                this.lblGuide2.y = 485;
                this.imgDialog.width = 350;
                this.imgDialog.x = 113;
                this.imgDialog.y = 427;
                break;
            case 12:
                this._dialog1 = "出现【点击】提示 ";
                this._dialog2 = "点它就能赚钱 ";
                this._rect = new egret.Rectangle(25 * excX, 575 * excY, 62, 62);
                this.showHand(60, 595);
                this.imgType.source = "guide_head_png";
                this.imgType.x = 32;
                this.imgType.y = 434;
                this.imgGirl.scaleX = -1;
                this.imgGirl.x = 416;
                this.imgGirl.y = 360;
                this.imgDialog.width = 350;
                this.imgDialog.x = 19;
                this.imgDialog.y = 420;
                this.lblGuide1.x = 117;
                this.lblGuide1.y = 440;
                this.lblGuide2.x = 200;
                this.lblGuide2.y = 475;
                this.imgDialog.width = 350;
                this.imgDialog.x = 19;
                this.imgDialog.y = 420;
                break;
            case 13:
                this._dialog1 = "再点1次 ";
                this._dialog2 = "";
                this.imgType.visible = false;
                this._rect = new egret.Rectangle(12 * excX, 570 * excY, 454, 73);
                this.showHand(395, 595);
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 72;
                this.imgGirl.y = 310;
                this.imgDialog.width = 350;
                this.imgDialog.x = 100;
                this.imgDialog.y = 365;
                this.lblGuide1.x = 175;
                this.lblGuide1.y = 405;
                this.imgDialog.width = 200;
                this.imgDialog.x = 100;
                this.imgDialog.y = 365;
                break;
            case 14:
                this._dialog1 = "差不多你已领悟了，有缘再见 ";
                this._dialog2 = "";
                this.imgType.visible = false;
                this.imgGirl.scaleX = 1;
                this.imgGirl.x = 103;
                this.imgGirl.y = 167;
                this.imgDialog.width = 350;
                this.imgDialog.x = 114;
                this.imgDialog.y = 235;
                this.lblGuide1.x = 202;
                this.lblGuide1.y = 276;
                this.imgDialog.width = 350;
                this.imgDialog.x = 114;
                this.imgDialog.y = 236;
                break;
        }
        if (this._rect) {
            this.imgRect0.visible = true;
            this.imgRect1.visible = true;
            this.imgRect2.visible = true;
            this.imgRect3.visible = true;
            this.imgMask.visible = true;
            this.imgRect0.x = 0;
            this.imgRect0.y = 0;
            this.imgRect0.width = 480;
            this.imgRect0.height = this._rect.y;
            this.imgRect1.x = 0;
            this.imgRect1.y = this._rect.y;
            this.imgRect1.width = this._rect.x;
            this.imgRect1.height = this._rect.height;
            this.imgRect2.x = this._rect.x + this._rect.width;
            this.imgRect2.y = this._rect.y;
            this.imgRect2.width = 480 - (this._rect.x + this._rect.width);
            this.imgRect2.height = this._rect.height;
            this.imgRect3.x = 0;
            this.imgRect3.y = this._rect.y + this._rect.height;
            this.imgRect3.width = 480;
            this.imgRect3.height = 800 - (this._rect.y + this._rect.height);
            this.imgMask.x = this._rect.x - 10;
            this.imgMask.y = this._rect.y - 10;
            this.imgMask.width = this._rect.width + 20;
            this.imgMask.height = this._rect.height + 20;
        }
        this._lblShow = egret.setInterval(this.onTicker, this, 100);
    };
    p.showHand = function (headPosX, handPosY) {
        var excX = Global.getStageHeight() / 800;
        var excY = Global.getStageWidth() / 480;
        MovieClipUtils.createMovieClip(Global.getOtherEffect("hand_effect"), "hand_effect", function (mc) {
            mc.play(-1);
            mc.x = headPosX * excX;
            mc.y = handPosY * excY;
            this.addChild(mc);
        }, this);
    };
    p.onTicker = function () {
        this._descIndex++;
        var length1 = this._dialog1.length;
        var length2 = this._dialog2.length;
        var totalLength = length1 + length2;
        if (this._descIndex >= totalLength) {
            this._descFinish = true;
            this.lblGuide2.text = this._dialog2;
            this.lblGuide1.text = this._dialog1;
            egret.clearInterval(this._lblShow);
        }
        else if (this._descIndex > length1) {
            this.lblGuide2.text = this._dialog2.slice(0, this._descIndex - length1);
        }
        else {
            this.lblGuide1.text = this._dialog1.slice(0, this._descIndex);
        }
    };
    p.onClose = function (evt) {
        if (this._descFinish) {
            this._isShow = false;
            PanelManager.inst.hidePanel("GuidePanel");
            if (this._callback) {
                this._callback.call(this._thisObj);
                this._callback = null;
            }
        }
        else {
            this._descIndex = this._dialog1.length + this._dialog2.length;
            this.onTicker();
        }
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    return GuidePanel;
}(BasePanel));
egret.registerClass(GuidePanel,'GuidePanel');
//# sourceMappingURL=GuidePanel.js.map