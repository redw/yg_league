/**
 * Created by hh on 2016/12/9.
 */
/** 同步战斗 */
var NetFightSyncCmd = (function (_super) {
    __extends(NetFightSyncCmd, _super);
    function NetFightSyncCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetFightSyncCmd,p=c.prototype;
    p.execute = function () {
        if (this.data && this.data.curArea) {
            UserProxy.inst.endCheckBattle();
            // 如果没有战斗报告，则更新转盘，关卡，任务数据
            if (!this.data.battleReport) {
                _super.prototype.execute.call(this);
                UserProxy.inst.curArea = this.data.curArea;
                if ("wheelTimes" in this.data) {
                    UserProxy.inst.wheelTimes = this.data.wheelTimes;
                    TopPanel.inst.showPoint(6);
                }
                if (TopPanel.inst.btnCircleBack.visible == true) {
                    var goMission = UserProxy.inst.circleObj["lastCircleArea"] - parseInt(Config.BaseData[69]["value"]);
                    if (UserProxy.inst.curArea >= goMission) {
                        TopPanel.inst.showPoint(6);
                        TopPanel.inst.showPoint(9);
                    }
                }
                if (this.data["sevenDay"]) {
                    UserProxy.inst.sevenBuyBit = this.data["sevenDay"]["sevenBuyBit"];
                    UserProxy.inst.sevenDayBegTime = this.data["sevenDay"]["sevenDayBegTime"];
                    UserProxy.inst.sevenDayBit = this.data["sevenDay"]["sevenDayBit"];
                    TopPanel.inst.showPoint(7);
                }
                if (this.data["historyArea"]) {
                    UserProxy.inst.historyArea = this.data["historyArea"];
                    if (this.data["historyArea"] == 10) {
                        EventManager.inst.dispatch(ContextEvent.OPEN_FUNCTION);
                        if (UserProxy.inst.getGuideStep() == 4) {
                            UserProxy.inst.nextGuide();
                        }
                    }
                    else if (this.data["historyArea"] == 20) {
                        PanelManager.inst.showPanel("DeblockPanel", 4);
                    }
                    else if (this.data["historyArea"] == 200) {
                        PanelManager.inst.showPanel("DeblockPanel", 3);
                    }
                }
            }
        }
        EventManager.inst.dispatch(ContextEvent.PVE_SYNC_RES, this.data);
    };
    return NetFightSyncCmd;
}(BaseCmd));
egret.registerClass(NetFightSyncCmd,'NetFightSyncCmd');
/** 延迟战斗同步 */
var DelayFightSyncCmd = (function (_super) {
    __extends(DelayFightSyncCmd, _super);
    function DelayFightSyncCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=DelayFightSyncCmd,p=c.prototype;
    p.execute = function () {
        if (this.data && this.data.curArea) {
            _super.prototype.execute.call(this);
            // 为什么ret会变化呢？
            if ((this.data.curArea - 1) % 10 == 0) {
                this.data.ret = 1;
            }
            UserProxy.inst.curArea = this.data.curArea;
            if ("wheelTimes" in this.data) {
                UserProxy.inst.wheelTimes = this.data.wheelTimes;
                TopPanel.inst.showPoint(6);
                TopPanel.inst.showPoint(9);
            }
            if (TopPanel.inst.btnCircleBack.visible == true) {
                var goMission = UserProxy.inst.circleObj["lastCircleArea"] - parseInt(Config.BaseData[69]["value"]);
                if (UserProxy.inst.curArea >= goMission) {
                    TopPanel.inst.showPoint(6);
                    TopPanel.inst.showPoint(9);
                }
            }
            if (this.data["sevenDay"]) {
                UserProxy.inst.sevenBuyBit = this.data["sevenDay"]["sevenBuyBit"];
                UserProxy.inst.sevenDayBegTime = this.data["sevenDay"]["sevenDayBegTime"];
                UserProxy.inst.sevenDayBit = this.data["sevenDay"]["sevenDayBit"];
                TopPanel.inst.showPoint(7);
            }
            if (UserProxy.inst.curArea >= UserProxy.inst.circleObj["lastCircleArea"]) {
                TopPanel.inst.showPoint(6);
                TopPanel.inst.showPoint(9);
            }
            if (this.data["historyArea"]) {
                UserProxy.inst.historyArea = this.data["historyArea"];
                if (this.data["historyArea"] == 10) {
                    EventManager.inst.dispatch(ContextEvent.OPEN_FUNCTION);
                    if (UserProxy.inst.getGuideStep() == 4) {
                        UserProxy.inst.nextGuide();
                    }
                }
                else if (this.data["historyArea"] == 20) {
                    PanelManager.inst.showPanel("DeblockPanel", 4);
                }
                else if (this.data["historyArea"] == 200) {
                    PanelManager.inst.showPanel("DeblockPanel", 3);
                }
            }
            UserProxy.inst.endCheckBattle();
        }
        UserProxy.inst.endCheckBattle();
        EventManager.inst.dispatch(ContextEvent.PVE_SYNC_RES, this.data);
    };
    return DelayFightSyncCmd;
}(BaseCmd));
egret.registerClass(DelayFightSyncCmd,'DelayFightSyncCmd');
/** 布阵 */
var NetFormationCmd = (function (_super) {
    __extends(NetFormationCmd, _super);
    function NetFormationCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetFormationCmd,p=c.prototype;
    p.execute = function () {
        if (this.data && this.data.msg) {
            UserProxy.inst.fightData.changePVEFormation(UserMethod.inst.battle_pos);
            UserProxy.inst.fightData.ensurePVEFormation();
            EventManager.inst.dispatch(ContextEvent.CHANGE_ROLE_SHOW);
        }
    };
    return NetFormationCmd;
}(BaseCmd));
egret.registerClass(NetFormationCmd,'NetFormationCmd');
/** PVP请求战斗数据 */
var NetPVPReqFightDataCmd = (function (_super) {
    __extends(NetPVPReqFightDataCmd, _super);
    function NetPVPReqFightDataCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetPVPReqFightDataCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        if (this.data["diamond"]) {
            UserProxy.inst.diamond = this.data["diamond"];
        }
        EventManager.inst.dispatch(ContextEvent.PVP_FIGHT_DATA_RES, this.data);
    };
    return NetPVPReqFightDataCmd;
}(BaseCmd));
egret.registerClass(NetPVPReqFightDataCmd,'NetPVPReqFightDataCmd');
/** 秘镜战数据请求 */
var NetDungeonFightCmdReq = (function (_super) {
    __extends(NetDungeonFightCmdReq, _super);
    function NetDungeonFightCmdReq() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetDungeonFightCmdReq,p=c.prototype;
    p.execute = function () {
        // TODO 需通知其它模块改变数据
        _super.prototype.execute.call(this);
        if (this.data["dungeonObj"]) {
            UserProxy.inst.dungeonList = this.data["dungeonObj"]["dungeonList"];
            UserProxy.inst.buyTimes = this.data["dungeonObj"]["buyTimes"];
            UserProxy.inst.maxTimes = this.data["dungeonObj"]["maxTimes"];
            UserProxy.inst.freeTimes = this.data["dungeonObj"]["freeTimes"];
            UserProxy.inst.lastRecoverTime = this.data["dungeonObj"]["lastRecoverTime"];
        }
        var ret = this.data.ret;
        var battleReport = this.data.battleReport;
        EventManager.inst.dispatch(ContextEvent.DUNGEON_FIGHT_DATA_RES, this.data);
    };
    return NetDungeonFightCmdReq;
}(BaseCmd));
egret.registerClass(NetDungeonFightCmdReq,'NetDungeonFightCmdReq');
//# sourceMappingURL=NetFightCmd.js.map