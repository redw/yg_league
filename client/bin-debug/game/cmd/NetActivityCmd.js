/**
 * Created by Administrator on 1/14 0014.
 */
var NetActivityCmd = (function (_super) {
    __extends(NetActivityCmd, _super);
    function NetActivityCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetActivityCmd,p=c.prototype;
    p.execute = function () {
        switch (this.data["type"]) {
            case 1:
                UserMethod.inst.showAward(this.data);
                UserProxy.inst.sevenDayBegTime = this.data["sevenDay"]["sevenDayBegTime"];
                UserProxy.inst.sevenBuyBit = this.data["sevenDay"]["sevenBuyBit"];
                UserProxy.inst.sevenDayBit = this.data["sevenDay"]["sevenDayBit"];
                break;
            case 7:
                UserMethod.inst.showAward(this.data);
                UserProxy.inst.vipObj["fundBit"] = this.data["fundBit"];
                TopPanel.inst.showPoint(11, 3);
                ActivePanel.inst.checkPoint(3);
                break;
            case 2:
                UserMethod.inst.showAward(this.data);
                var actWord = UserProxy.inst.activityObj[101];
                actWord["collectWord"] = this.data["collectWord"];
                TopPanel.inst.showPoint(8, 2);
                ActiveLimitPanel.inst.checkPoint(1);
                break;
            case 3:
                UserMethod.inst.showAward(this.data);
                var actWord = UserProxy.inst.activityObj[102];
                actWord["rmbActBit"] = this.data["rmbActBit"];
                TopPanel.inst.showPoint(8, 1);
                ActiveLimitPanel.inst.checkPoint(2);
                break;
            case 4:
                UserMethod.inst.showAward(this.data);
                var actCost = UserProxy.inst.activityObj[103];
                actCost["consumeActBit"] = this.data["consumeActBit"];
                TopPanel.inst.showPoint(8, 3);
                ActiveLimitPanel.inst.checkPoint(3);
                break;
            case 14:
                UserMethod.inst.showAward(this.data);
                var actCost = UserProxy.inst.activityObj[106];
                actCost["dayRMBBit"] = this.data["dayRMBBit"];
                TopPanel.inst.showPoint(8, 4);
                ActiveLimitPanel.inst.checkPoint(4);
                break;
            case 16:
                UserMethod.inst.showAward(this.data);
                var actFestival = UserProxy.inst.activityObj[111];
                actFestival["todayFlag"] = this.data["todayFlag"];
                actFestival["timesAry"] = this.data["timesAry"];
                TopPanel.inst.showPoint(8, 5);
                ActiveLimitPanel.inst.checkPoint(5);
                break;
        }
    };
    return NetActivityCmd;
}(BaseCmd));
egret.registerClass(NetActivityCmd,'NetActivityCmd');
var NetTaskCmd = (function (_super) {
    __extends(NetTaskCmd, _super);
    function NetTaskCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetTaskCmd,p=c.prototype;
    p.execute = function () {
        UserProxy.inst.taskBit = this.data["taskBit"];
        UserMethod.inst.showAward(this.data);
        TopPanel.inst.showPoint(4);
    };
    return NetTaskCmd;
}(BaseCmd));
egret.registerClass(NetTaskCmd,'NetTaskCmd');
//# sourceMappingURL=NetActivityCmd.js.map