/**
 * 心跳
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var NetKeepLiveCmd = (function (_super) {
    __extends(NetKeepLiveCmd, _super);
    function NetKeepLiveCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetKeepLiveCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        UserMethod.inst.aliveTime = 0;
        UserProxy.inst.startAlive();
        EventManager.inst.dispatch(ContextEvent.ADD_EARN_MONEY, this.data["gold"]);
        UserProxy.inst.server_time = this.data["serverTime"];
        if (this.data["newMsg"]) {
            UserProxy.inst.newMsg = this.data["newMsg"];
            if (Object.keys(UserProxy.inst.newMsg).length) {
                PanelManager.inst.showPanel("FriendMainPanel", 4);
            }
        }
        if (this.data["mailFlag"] && this.data["mailFlag"] == 1) {
            UserProxy.inst.mailFlag = this.data["mailFlag"];
            UserProxy.inst.mail = this.data["mailObj"]["mail"];
            TopPanel.inst.showPoint(13);
            TopPanel.inst.checkHide();
        }
        if (this.data["activityObj"]) {
            UserProxy.inst.activityObj = this.data["activityObj"];
            TopPanel.inst.showPoint(8);
        }
        if (this.data["wordIdx"]) {
            var bonusList = new BonusList();
            bonusList.push(BonusType.WORD, this.data["wordIdx"] + 1);
            bonusList.show();
        }
        if (this.data["consumeAct"]) {
            var actWord = UserProxy.inst.activityObj[103];
            actWord["consumeAct"] = this.data["consumeAct"];
            TopPanel.inst.showPoint(8, 3);
        }
        if (this.data["mineOutputAry"]) {
            UserProxy.inst.mineOutputAry = this.data["mineOutputAry"];
            EventManager.inst.dispatch(ContextEvent.REFRESH_CAVE_STONE, this.data["mineOutputAry"]);
        }
    };
    return NetKeepLiveCmd;
}(BaseCmd));
egret.registerClass(NetKeepLiveCmd,'NetKeepLiveCmd');
