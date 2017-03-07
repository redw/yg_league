/**
 * Created by Administrator on 1/25 0025.
 */
/*
 0，集字
 1，充值
 2，消费
 3，单笔
 4，邀请
 3, 寻仙
 4，竞技场
 */
var ActiveLimitPanel = (function (_super) {
    __extends(ActiveLimitPanel, _super);
    function ActiveLimitPanel() {
        _super.call(this);
        this._actGroups = [];
        this._lastBtn = null;
        this._maxIndex = 0;
        this._scrollEnd = 216;
        this._scrollStart = 0;
        ActiveLimitPanel._inst = this;
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = ActiveLimitPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=ActiveLimitPanel,p=c.prototype;
    d(ActiveLimitPanel, "inst"
        ,function () {
            return ActiveLimitPanel._inst;
        }
    );
    p.init = function () {
        this.btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.coinShow.startListener();
        if (UserMethod.inst.isWordOpen()) {
            this.checkPoint(1);
            this.btnWord.name = "btn0";
            this._actGroups.push(this.btnWord);
        }
        else {
            DisplayUtil.removeFromParent(this.btnWord.parent);
        }
        if (UserMethod.inst.isRechargeOpen()) {
            this.checkPoint(2);
            this.btnRecharge.name = "btn1";
            this._actGroups.push(this.btnRecharge);
        }
        else {
            DisplayUtil.removeFromParent(this.btnRecharge.parent);
        }
        if (UserMethod.inst.isCostOpen()) {
            this.checkPoint(3);
            this.btnCost.name = "btn2";
            this._actGroups.push(this.btnCost);
        }
        else {
            DisplayUtil.removeFromParent(this.btnCost.parent);
        }
        if (UserMethod.inst.isOnePayOpen()) {
            this.checkPoint(4);
            this.btnOnePay.name = "btn3";
            this._actGroups.push(this.btnOnePay);
        }
        else {
            DisplayUtil.removeFromParent(this.btnOnePay.parent);
        }
        if (UserMethod.inst.isInviteDoubleOpen()) {
            if (ExternalUtil.inst.getIsYYB()) {
                this.btnShareDouble.source = "limit_doubel_invite_yyb_png";
            }
            this.btnShareDouble.name = "btn4";
            this._actGroups.push(this.btnShareDouble);
        }
        else {
            DisplayUtil.removeFromParent(this.btnShareDouble.parent);
        }
        if (UserMethod.inst.isFestivalOpen()) {
            this.checkPoint(5);
            this.btnFestival.name = "btn5";
            this._actGroups.push(this.btnFestival);
        }
        else {
            DisplayUtil.removeFromParent(this.btnFestival.parent);
        }
        this._maxIndex = this._actGroups.length;
        for (var i = 0; i < this._maxIndex; i++) {
            var btn = this._actGroups[i];
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onActive, this);
        }
    };
    p.initData = function () {
        var firstBtn = this._actGroups[0];
        firstBtn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        this.cloudMove();
    };
    p.checkPoint = function (type) {
        var showAll = type ? false : true;
        if (type == 1 || showAll) {
            UserMethod.inst.removeRedPoint(this.btnWord.parent, "word");
            if (UserMethod.inst._actWordShow) {
                UserMethod.inst.addRedPoint(this.btnWord.parent, "word", new egret.Point(this.btnWord.x + 80, this.btnWord.y + 18));
            }
        }
        if (type == 2 || showAll) {
            UserMethod.inst.removeRedPoint(this.btnRecharge.parent, "recharge");
            if (UserMethod.inst._actRechargeShow) {
                UserMethod.inst.addRedPoint(this.btnRecharge.parent, "recharge", new egret.Point(this.btnRecharge.x + 80, this.btnRecharge.y + 18));
            }
        }
        if (type == 3 || showAll) {
            UserMethod.inst.removeRedPoint(this.btnCost.parent, "cost");
            if (UserMethod.inst._actCostShow) {
                UserMethod.inst.addRedPoint(this.btnCost.parent, "cost", new egret.Point(this.btnCost.x + 80, this.btnCost.y + 18));
            }
        }
        if (type == 4 || showAll) {
            UserMethod.inst.removeRedPoint(this.btnOnePay.parent, "onePay");
            if (UserMethod.inst._actOnePayShow) {
                UserMethod.inst.addRedPoint(this.btnOnePay.parent, "onePay", new egret.Point(this.btnOnePay.x + 80, this.btnOnePay.y + 18));
            }
        }
        if (type == 5 || showAll) {
            UserMethod.inst.removeRedPoint(this.btnFestival.parent, "festival");
            if (UserMethod.inst._actFestivalShow) {
                UserMethod.inst.addRedPoint(this.btnFestival.parent, "festival", new egret.Point(this.btnFestival.x + 80, this.btnFestival.y + 18));
            }
        }
    };
    p.onActive = function (e) {
        var index = parseInt(e.currentTarget.name.replace("btn", ""));
        if (this._lastBtn) {
            if (this._lastBtn == e.currentTarget) {
                return;
            }
            else {
                this.removeActive();
                this.removeSelect(this._lastBtn);
            }
        }
        this._lastBtn = e.currentTarget;
        this.addSelect(this._lastBtn);
        var layer;
        switch (index) {
            case 0:
                layer = new ActiveLimitWord();
                break;
            case 1:
                UserMethod.inst.recharge_cost = 1;
                layer = new ActiveLimitRecharge();
                break;
            case 2:
                UserMethod.inst.recharge_cost = 2;
                layer = new ActiveLimitCost();
                break;
            case 3:
                UserMethod.inst.recharge_cost = 3;
                layer = new ActiveLimitOnePay();
                break;
            case 4:
                layer = new ActiveLimitInvite();
                break;
            case 5:
                layer = new ActiveLimitFestival();
                break;
        }
        layer.name = "layer";
        this.activeGroup.addChild(layer);
    };
    p.onChange = function (e) {
        if (this._maxIndex <= 1) {
            return;
        }
        var nowIndex = this._actGroups.indexOf(this._lastBtn);
        if (e.currentTarget == this.btnLeft) {
            if (nowIndex == 0) {
                nowIndex = this._maxIndex - 1;
            }
            else {
                nowIndex--;
            }
            var btn = this._actGroups[nowIndex];
            btn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
        else {
            if (nowIndex == this._maxIndex - 1) {
                nowIndex = 0;
            }
            else {
                nowIndex++;
            }
            var btn = this._actGroups[nowIndex];
            btn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
        this.contentGroup.scrollH = nowIndex > 3 ? this._scrollEnd : this._scrollStart;
    };
    p.removeActive = function () {
        var layer = DisplayUtil.getChildByName(this.activeGroup, "layer");
        if (layer) {
            DisplayUtil.removeFromParent(layer);
        }
    };
    p.addSelect = function (nowBtn) {
        var group = nowBtn.parent;
        var selectImg = new AutoBitmap();
        selectImg.source = "active_select_png";
        selectImg.name = "select";
        group.addChildAt(selectImg, 0);
    };
    p.removeSelect = function (lastBtn) {
        var group = lastBtn.parent;
        var selectImg = DisplayUtil.getChildByName(group, "select");
        if (selectImg) {
            group.removeChild(selectImg);
        }
    };
    p.cloudMove = function () {
        egret.Tween.get(this.imgCloud2, { loop: true }).to({ x: 100 }, 55000).wait(4800).to({ x: 282 }, 37000).wait(6800);
        egret.Tween.get(this.imgCloud1, { loop: true }).to({ x: 32 }, 32000).wait(3800).to({ x: -212 }, 59000).wait(1800);
        egret.Tween.get(this.imgCloud3, { loop: true }).to({ x: -250 }, 39000).wait(5300).to({ x: -50 }, 21000).wait(2800);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("ActiveLimitPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        egret.Tween.removeTweens(this.imgCloud2);
        egret.Tween.removeTweens(this.imgCloud1);
        egret.Tween.removeTweens(this.imgCloud3);
        this.btnLeft.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnRight.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        for (var i = 0; i < this._maxIndex; i++) {
            var btn = this._actGroups[i];
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onActive, this);
        }
        this.coinShow.endListener();
    };
    return ActiveLimitPanel;
}(BasePanel));
egret.registerClass(ActiveLimitPanel,'ActiveLimitPanel');
//# sourceMappingURL=ActiveLimitPanel.js.map