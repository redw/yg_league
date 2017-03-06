/**
 * Created by Administrator on 12/9 0009.
 */
var ActiveSign = (function (_super) {
    __extends(ActiveSign, _super);
    function ActiveSign() {
        _super.call(this);
        this.skinName = ActiveSignSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveSign,p=c.prototype;
    p.onShow = function (event) {
        this.btnSign.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSign, this);
        Http.inst.addCmdListener(CmdID.SIGN_IN, this.signBack, this);
        this.continueSign();
        this.showInfo();
    };
    p.onHide = function (event) {
        this.btnSign.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSign, this);
        Http.inst.removeCmdListener(CmdID.SIGN_IN, this.signBack, this);
    };
    p.signBack = function (e) {
        UserMethod.inst.showAward(e.data);
        this.btnSign.enabled = false;
        this.btnSign.label = "已签到";
        var data = e.data;
        UserProxy.inst.signDays = data["signObj"]["signDays"];
        UserProxy.inst.todayFlag = data["signObj"]["todayFlag"];
        UserProxy.inst.lastSignTime = data["signObj"]["lastSignTime"];
        this.continueSign();
        this.showInfo();
        this.signToday(UserProxy.inst.signDays);
        TopPanel.inst.showPoint(11, 1);
        ActivePanel.inst.checkPoint(1);
    };
    p.showInfo = function () {
        for (var i = 1; i < 8; i++) {
            var dayGroup = DisplayUtil.getChildByName(this, "dayGroup" + i);
            var name = DisplayUtil.getChildByName(dayGroup, "name");
            var icon = DisplayUtil.getChildByName(dayGroup, "icon");
            var awardNum = DisplayUtil.getChildByName(dayGroup, "awardNum");
            var mask = DisplayUtil.getChildByName(dayGroup, "mask");
            var imgGot = DisplayUtil.getChildByName(dayGroup, "imgGot");
            var imgDouble = DisplayUtil.getChildByName(dayGroup, "imgDouble");
            var signData = Config.DailySigninData[i];
            var typeStr = this.doubleType(parseInt(signData["double_condition"]));
            if (typeStr) {
                imgDouble.visible = true;
                imgDouble.source = typeStr;
            }
            else {
                imgDouble.visible = false;
            }
            var reward = signData["reward_1"].concat();
            var rewardData = UserMethod.inst.rewardJs[reward[0]];
            icon.touchReward = reward;
            name.text = rewardData.name;
            awardNum.text = "x" + MathUtil.easyNumber(reward[2]);
            if (rewardData.id == 6 || rewardData.id == 7) {
                var heroData = UserProxy.inst.heroData.getHeroData(reward[1]);
                var quality = heroData.config.quality;
                icon.qualityBg = quality;
                if (rewardData.id == 6) {
                    icon.imgIcon = Global.getChaIcon(reward[1]);
                    name.text = heroData.config.name;
                }
                else {
                    icon.imgIcon = Global.getChaChipIcon(reward[1]);
                    name.text = heroData.config.name + "元神";
                }
            }
            else if (rewardData.id >= 17 && rewardData.id <= 21) {
                awardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
                icon.imgIcon = rewardData.icon;
            }
            else if (rewardData.id == 5) {
                awardNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
                icon.imgIcon = rewardData.icon;
            }
            else {
                icon.imgIcon = rewardData.icon;
            }
            if (this._signDay >= i) {
                imgGot.visible = true;
                mask.visible = true;
            }
            else {
                imgGot.visible = false;
                mask.visible = false;
            }
        }
        if (UserProxy.inst.todayFlag) {
            this.btnSign.enabled = false;
            this.btnSign.label = "已签到";
        }
    };
    p.signToday = function (day) {
        var dayGroup = DisplayUtil.getChildByName(this, "dayGroup" + day);
        var mask = DisplayUtil.getChildByName(dayGroup, "mask");
        var imgGot = DisplayUtil.getChildByName(dayGroup, "imgGot");
        imgGot.y = imgGot.y + 20;
        imgGot.visible = true;
        imgGot.scaleX = 3;
        imgGot.scaleY = 3;
        egret.Tween.get(imgGot).to({ scaleX: 1, scaleY: 1, y: imgGot.y - 20 }, 300, egret.Ease.circIn).call(function () { mask.visible = true; });
    };
    p.doubleType = function (type) {
        var imgStr;
        switch (type) {
            case 0:
                imgStr = null;
                break;
            case 1:
                imgStr = "s_first_double_png";
                break;
            case 2:
                imgStr = "s_lifetime_double_png";
                break;
            case 3:
                imgStr = "s_month_double_png";
                break;
        }
        return imgStr;
    };
    p.continueSign = function () {
        var time = new Date();
        time.setTime(UserProxy.inst.lastSignTime * 1000);
        time.setHours(23);
        time.setMinutes(59);
        time.setSeconds(59);
        var lastDay = Math.floor(time.valueOf() / 1000) + 1;
        var nowTime = new Date();
        nowTime.setTime(UserProxy.inst.server_time * 1000);
        nowTime.setHours(23);
        nowTime.setMinutes(59);
        nowTime.setSeconds(59);
        var today = Math.floor(nowTime.valueOf() / 1000) + 1;
        var duringSign = Math.floor((today - lastDay) / 86400);
        this._signDay = UserProxy.inst.signDays;
        if (!UserProxy.inst.todayFlag) {
            //判断签到天数
            if (UserProxy.inst.signDays == 7) {
                this._signDay = 0;
            }
            else if (duringSign > 1) {
                this._signDay = 0;
            }
        }
    };
    p.onSign = function () {
        Http.inst.send(CmdID.SIGN_IN);
    };
    return ActiveSign;
}(eui.Component));
egret.registerClass(ActiveSign,'ActiveSign');
