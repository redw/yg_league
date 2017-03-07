/**
 * Created by Administrator on 12/12 0012.
 */
var SevenDayPanel = (function (_super) {
    __extends(SevenDayPanel, _super);
    function SevenDayPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SevenDayPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=SevenDayPanel,p=c.prototype;
    p.init = function () {
        var today = UserMethod.inst.activeDay();
        this._today = today;
        if (!this._today) {
            if (UserMethod.inst.activeDayEndTime() > UserProxy.inst.server_time) {
                this._today = 7;
                today = 7;
            }
        }
        this._selectPos = [];
        for (var i = 1; i < 8; i++) {
            var dayBtn = DisplayUtil.getChildByName(this.btnGroup, "btnDay" + i);
            dayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectDay, this);
            dayBtn.btnDay = i;
            this._selectPos[i] = new egret.Point(dayBtn.x - 2, dayBtn.y - 2);
            if (today == i) {
                dayBtn.btnImg = "seven_day_button_high_png";
            }
            else if (today > i) {
                dayBtn.btnImg = "seven_day_button_normal_png";
            }
            else {
                dayBtn.btnImg = "seven_day_button_disable_png";
            }
        }
        Http.inst.addCmdListener(CmdID.SEVEN_DAY_GIFT, this.onBuyBack, this);
        this.togBtnDaily.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onToggon, this);
        this.togBtnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onToggon, this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.imgBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShow, this);
        this.dayList.itemRenderer = SevenDayRenderer;
        this.togBtnDaily.selected = true;
        this.togBtnBuy.selected = false;
        this.changeToggon();
        this.coinShow.startListener();
    };
    p.initData = function () {
        var date = new Date(UserMethod.inst.activeDayEndTime() * 1000);
        this.lblEndGetTime.text = StringUtil.dateToString(date);
        this.lblEndTime.text = StringUtil.dateToString(date);
        if (!this._today) {
            this.dayScroll.visible = false;
            this.discountGroup.visible = false;
        }
        else {
            this.refresh(this._today);
            this.showTodayBuy(this._today);
            var dayBtn = DisplayUtil.getChildByName(this.btnGroup, "btnDay" + this._today);
            dayBtn.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }
    };
    p.showTodayBuy = function (day) {
        this._buyDay = day;
        var buyData = Config.SevenBuyData[day];
        this.lblName.text = buyData["name"];
        this.lblNowCost.text = buyData["price"];
        this.lblOldCost.text = parseInt(buyData["price"]) * 2 + "";
        this.btnBuy.enabled = parseFloat(UserProxy.inst.gold) >= parseInt(buyData["price"]);
        this.imgBox.source = "sevenDay_box_" + day + "_png";
        this.imgBox["id"] = day;
        if (UserMethod.inst.isBitGet(day, UserProxy.inst.sevenBuyBit)) {
            this.btnBuy.visible = false;
            this.imgHadBuy.visible = true;
        }
        else {
            this.btnBuy.visible = true;
            this.imgHadBuy.visible = false;
        }
    };
    p.onBuy = function () {
        Http.inst.send(CmdID.SEVEN_DAY_GIFT, { id: this._buyDay });
    };
    p.onBuyBack = function (e) {
        UserMethod.inst.showAward(e.data);
        UserProxy.inst.gold = e.data["gold"];
        UserProxy.inst.sevenBuyBit = e.data["sevenBuyBit"];
        this.showTodayBuy(this._buyDay);
    };
    p.onSelectDay = function (e) {
        var index = parseInt(e.currentTarget.name.replace("btnDay", ""));
        if (index > this._today) {
            Notice.show("敬请期待！");
            return;
        }
        this.imgSevenSelect.x = this._selectPos[index].x;
        this.imgSevenSelect.y = this._selectPos[index].y;
        this.refresh(index);
        this.showTodayBuy(index);
    };
    p.refresh = function (day) {
        var todayDatas = [];
        var todayDowns = [];
        var todayFinishs = [];
        for (var i in Config.SevenDayData) {
            var data = Config.SevenDayData[i];
            var endValue = data["task_num"];
            var nowValue = UserMethod.inst.sevenDayFinish(data);
            if (Number(data["day"]) == day) {
                if (UserMethod.inst.isBitGet(parseInt(data["id"]), UserProxy.inst.sevenDayBit)) {
                    todayDowns.push(Config.SevenDayData[i]["id"]);
                }
                else if (endValue <= nowValue) {
                    todayFinishs.push(Config.SevenDayData[i]["id"]);
                }
                else {
                    todayDatas.push(Config.SevenDayData[i]["id"]);
                }
            }
        }
        this.dayList.dataProvider = new eui.ArrayCollection(todayFinishs.concat(todayDatas, todayDowns));
    };
    p.onToggon = function (e) {
        if (e.currentTarget == this.togBtnDaily) {
            this.togBtnDaily.selected = true;
            this.togBtnBuy.selected = !this.togBtnDaily.selected;
        }
        else {
            this.togBtnBuy.selected = true;
            this.togBtnDaily.selected = !this.togBtnBuy.selected;
        }
        this.changeToggon();
    };
    p.changeToggon = function () {
        if (this.togBtnDaily.selected) {
            this.dayScroll.visible = true;
            this.discountGroup.visible = false;
        }
        else {
            this.dayScroll.visible = false;
            this.discountGroup.visible = true;
        }
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("SevenDayPanel");
    };
    p.onShow = function (e) {
        var day = e.currentTarget["id"];
        var buyData = Config.SevenBuyData[day];
        var string = buyData["disc"];
        Alert.show(StringUtil.replaceDescribe(string));
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        for (var i = 1; i < 8; i++) {
            var dayBtn = DisplayUtil.getChildByName(this.btnGroup, "btnDay" + i);
            dayBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectDay, this);
        }
        Http.inst.removeCmdListener(CmdID.SEVEN_DAY_GIFT, this.onBuyBack, this);
        this.togBtnDaily.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onToggon, this);
        this.togBtnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onToggon, this);
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.imgBox.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShow, this);
        TopPanel.inst.showPoint(7);
        this.coinShow.endListener();
    };
    return SevenDayPanel;
}(BasePanel));
egret.registerClass(SevenDayPanel,'SevenDayPanel');
//# sourceMappingURL=SevenDayPanel.js.map