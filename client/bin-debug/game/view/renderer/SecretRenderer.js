/**
 * Created by Administrator on 12/5 0005.
 */
var SecretRenderer = (function (_super) {
    __extends(SecretRenderer, _super);
    function SecretRenderer() {
        _super.call(this);
        this._openDay = [];
        this.skinName = SecretRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=SecretRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
    };
    p.onHide = function (event) {
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
    };
    p.onGo = function (e) {
        if (!UserProxy.inst.freeTimes) {
            this.onAdd();
            return;
        }
        PanelManager.inst.showPanel("SecretAreaPanel", this.data);
    };
    p.onAdd = function () {
        var cost = parseInt(Config.BaseData[29]["value"]) * (1 + 0.5 * (UserProxy.inst.buyTimes - 1));
        Alert.showCost(cost, "买一次体力（ps:人参果可以增加次数哦~）", true, showCost, null, this);
        function showCost() {
            if (UserProxy.inst.diamond >= cost) {
                Http.inst.send(CmdID.DUNGEON_TIMES);
            }
            else {
                ExternalUtil.inst.diamondAlert();
            }
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var secretData = Config.WeaponFbOp[this.data];
        this.lblName.text = secretData["name"];
        this.imgType.source = UserMethod.inst.rewardJs[secretData["reward_icon"]].icon_s;
        this.lblGoTime.text = this.openDay(secretData["open_day"]);
        this.imgIcon.source = Global.getSecretIcon(secretData["head_icon"]);
        this.checkDay();
    };
    p.openDay = function (openArr) {
        var openStr = "（入场：";
        var length = openArr.length;
        this._openDay = [];
        for (var i = 0; i < length; i++) {
            if (parseInt(openArr[i])) {
                this._openDay.push(i);
                switch (i) {
                    case 0:
                        openStr += "周日、";
                        break;
                    case 1:
                        openStr += "周一、";
                        break;
                    case 2:
                        openStr += "周二、";
                        break;
                    case 3:
                        openStr += "周三、";
                        break;
                    case 4:
                        openStr += "周四、";
                        break;
                    case 5:
                        openStr += "周五";
                        break;
                    case 6:
                        openStr += "周六";
                        break;
                }
            }
        }
        openStr += "）";
        return openStr;
    };
    p.checkDay = function () {
        this.btnGo.source = "secret_area_close_png";
        this.btnGo.touchEnabled = false;
        this.btnGo.touchScaleEffect = false;
        var length = this._openDay.length;
        var myData = new Date();
        myData.setTime(UserProxy.inst.server_time * 1000);
        var today = myData.getDay();
        for (var i = 0; i < length; i++) {
            if (this._openDay[i] == today) {
                this.btnGo.source = "secret_area_in_png";
                this.btnGo.touchEnabled = true;
                this.btnGo.touchScaleEffect = true;
                return;
            }
        }
    };
    return SecretRenderer;
}(eui.ItemRenderer));
egret.registerClass(SecretRenderer,'SecretRenderer');
