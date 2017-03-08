/**
 * Created by Administrator on 1/9 0009.
 */
var FirstRechargePanel = (function (_super) {
    __extends(FirstRechargePanel, _super);
    function FirstRechargePanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = FirstReChargePanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=FirstRechargePanel,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.VIP_PRICE, this.awardBack, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
    };
    p.initData = function () {
        var firstData = Config.FirstBloodData[1];
        var pos = [];
        for (var i = 1; i < 5; i++) {
            var weaponIcon = DisplayUtil.getChildByName(this, "award" + i);
            var awardNum = DisplayUtil.getChildByName(this, "awardNum" + i);
            var reward = firstData["reward_" + i].concat();
            var rewardData = UserMethod.inst.rewardJs[reward[0]];
            weaponIcon.imgIcon = rewardData.icon;
            awardNum.text = "x" + reward[2];
            weaponIcon.touchReward = reward;
            if (parseInt(reward[0]) == 101) {
                weaponIcon.qualityBg = "3";
            }
            pos.push(new egret.Point(weaponIcon.x, weaponIcon.y));
        }
        var _loop_1 = function(y) {
            MovieClipUtils.createMovieClip(Global.getOtherEffect("first_light_effect"), "first_light_effect", afterAdd, this_1);
            function afterAdd(data) {
                var mc = data;
                mc.x = pos[y - 1].x - 8;
                mc.y = pos[y - 1].y - 8;
                mc.play(-1);
                mc.touchEnabled = false;
                mc.name = "mc" + y;
                this.addChild(mc);
            }
        };
        var this_1 = this;
        for (var y = 1; y < 5; y++) {
            _loop_1(y);
        }
        if (UserProxy.inst.rechargeFlag == 1) {
            this.btnBuy.label = "领 取";
        }
        else if (UserProxy.inst.rechargeFlag == 2) {
            this.btnBuy.label = "已领取";
            this.btnBuy.enabled = false;
        }
    };
    p.awardBack = function (e) {
        UserMethod.inst.showAward(e.data);
        UserProxy.inst.rechargeFlag = e.data["rechargeFlag"];
        this.btnBuy.label = "已领取";
        this.btnBuy.enabled = false;
        TopPanel.inst.showPoint(1);
    };
    p.onBuy = function () {
        if (!UserProxy.inst.rechargeFlag) {
            MenuPanel.inst.menuUp = true;
            MenuPanel.inst.openMenu(6);
            this.onClose();
        }
        else if (UserProxy.inst.rechargeFlag == 1) {
            Http.inst.send(CmdID.VIP_PRICE);
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("FirstRechargePanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        Http.inst.removeCmdListener(CmdID.VIP_PRICE, this.awardBack, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        for (var i = 1; i < 5; i++) {
            var mc = DisplayUtil.getChildByName(this, "mc" + i);
            mc.stop();
            DisplayUtil.removeFromParent(mc);
        }
    };
    return FirstRechargePanel;
}(BasePanel));
egret.registerClass(FirstRechargePanel,'FirstRechargePanel');
