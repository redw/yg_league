/**
 * Created by Administrator on 1/9 0009.
 */
var PrivilegePanel = (function (_super) {
    __extends(PrivilegePanel, _super);
    function PrivilegePanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = PrivilegePanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=PrivilegePanel,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.VIP_REWARD, this.onAwardBack, this);
        this.imgLife.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLifeImg, this);
        this.imgMonth.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMonthImg, this);
        this.btnBuyMonth.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnBuyLife.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnGetLife.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        EventManager.inst.addEventListener(ContextEvent.RECHARGE_BACK, this.showInfo, this);
    };
    p.initData = function () {
        this._showMonth = false;
        this._showLife = false;
        this.showInfo();
    };
    p.showInfo = function () {
        if (UserProxy.inst.vipObj["monthVIP"]) {
            this.btnGet.enabled = true;
            var divTime = UserProxy.inst.vipObj["monthVIPTime"] - UserProxy.inst.server_time;
            this.lblDay.text = Math.round(divTime / 86400) + "天";
            if (UserProxy.inst.vipObj["monthVIPTime"] < UserProxy.inst.server_time) {
                this.btnGet.enabled = false;
                this.lblDay.text = "0天";
            }
            else {
                if (Math.round(divTime / 86400) <= 0) {
                    this.lblDay.text = TimeUtil.timeToString(divTime);
                }
                if (UserProxy.inst.vipObj["monthFlag"]) {
                    this.btnGet.label = "今日已领取";
                    this.btnGet.enabled = false;
                }
            }
        }
        else {
            this.btnGet.enabled = false;
        }
        if (UserProxy.inst.vipObj["foreverVIP"]) {
            this.imgHadBuy.visible = true;
            this.btnBuyLife.visible = false;
            this.imgLifeBtnBg.visible = false;
            this.btnGetLife.enabled = true;
            if (UserProxy.inst.vipObj["foreverFlag"]) {
                this.btnGetLife.label = "今日已领取";
                this.btnGetLife.enabled = false;
            }
        }
        else {
            this.imgHadBuy.visible = false;
            this.btnBuyLife.visible = true;
            this.imgLifeBtnBg.visible = true;
            this.btnGetLife.enabled = false;
        }
    };
    p.onAwardBack = function (e) {
        UserMethod.inst.showAward(e.data);
        UserProxy.inst.vipObj = e.data["vipObj"];
        this.showInfo();
        TopPanel.inst.showPoint(10);
    };
    p.onGet = function (e) {
        if (e.currentTarget == this.btnGet) {
            Http.inst.send(CmdID.VIP_REWARD, { type: 1 });
        }
        else {
            Http.inst.send(CmdID.VIP_REWARD, { type: 2 });
        }
    };
    p.onBuy = function (e) {
        if (e.currentTarget == this.btnBuyMonth) {
            ExternalUtil.inst.pay(PidType.PID_MONTH);
        }
        else {
            ExternalUtil.inst.pay(PidType.PID_FOREVER);
        }
    };
    p.onMonthImg = function () {
        this._showMonth = !this._showMonth;
        if (this._showMonth) {
            this.imgMonth.source = "month_buy_2_png";
        }
        else {
            this.imgMonth.source = "month_buy_1_png";
        }
    };
    p.onLifeImg = function () {
        this._showLife = !this._showLife;
        if (this._showLife) {
            this.imgLife.source = "life_buy_2_png";
        }
        else {
            this.imgLife.source = "life_buy_1_png";
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("PrivilegePanel");
    };
    p.destory = function () {
        Http.inst.removeCmdListener(CmdID.VIP_REWARD, this.onAwardBack, this);
        this.btnBuyLife.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLifeImg, this);
        this.btnBuyMonth.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMonthImg, this);
        this.btnBuyMonth.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnBuyLife.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnGetLife.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        EventManager.inst.removeEventListener(ContextEvent.RECHARGE_BACK, this.showInfo, this);
    };
    return PrivilegePanel;
}(BasePanel));
egret.registerClass(PrivilegePanel,'PrivilegePanel');
