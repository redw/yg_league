/**
 * Created by Administrator on 12/21 0021.
 */
var DailyAchieveRenderer = (function (_super) {
    __extends(DailyAchieveRenderer, _super);
    function DailyAchieveRenderer() {
        _super.call(this);
        this.skinName = DailyAchieveRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=DailyAchieveRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
        Http.inst.addCmdListener(CmdID.ACHIEVEMENT, this.onAchieveBack, this);
        // Http.inst.addCmdListener(CmdID.TASK,this.onTask,this);
    };
    p.onHide = function (event) {
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
        Http.inst.removeCmdListener(CmdID.ACHIEVEMENT, this.onAchieveBack, this);
        // Http.inst.removeCmdListener(CmdID.TASK,this.onTask,this);
    };
    p.onGet = function () {
        if (UserMethod.inst.daily_achieve == 1) {
            Http.inst.send(CmdID.TASK, { tid: this._currentData["id"] });
        }
        else {
            Http.inst.send(CmdID.ACHIEVEMENT, { tid: this._currentData["id"] });
        }
    };
    p.onAchieveBack = function (e) {
        this.dataChanged();
    };
    p.onTask = function (e) {
        this.dataChanged();
    };
    p.onGo = function () {
        UserMethod.inst.typeGo(this.data);
        PanelManager.inst.hidePanel("DailyAchievePanel");
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (UserMethod.inst.daily_achieve == 1) {
            this.btnGo.visible = false;
            this.imgIcon.source = "task_" + this.data + "_png";
            var currentData = null;
            var nextData = null;
            for (var i in Config.DailyTaskData) {
                var dailyData = Config.DailyTaskData[i];
                if (parseInt(dailyData["task_type"]) == this.data) {
                    nextData = dailyData;
                    if (!UserMethod.inst.isBitGet(parseInt(dailyData["id"]), UserProxy.inst.taskBit)) {
                        currentData = dailyData;
                        break;
                    }
                }
            }
            if (currentData) {
                this.lblName.visible = true;
                this._currentData = currentData;
                this.lblName.text = currentData["name"];
                if (currentData["task_type"] == 1 && ExternalUtil.inst.getIsYYB()) {
                    this.lblName.text = this.lblName.text.replace("邀请好友", "领取在线奖励");
                }
                var endParm = currentData["task_parm"];
                var nowParm = UserMethod.inst.dailyNowPar(this.data);
                this.lblBar.text = nowParm + "/" + endParm;
                this.bar.value = Math.min(100 * (nowParm / endParm), 100);
                this.imgHadGot.visible = false;
                if (nowParm >= endParm) {
                    this.btnGo.visible = false;
                    this.btnGet.visible = true;
                }
                else {
                    this.btnGo.visible = true;
                    this.btnGet.visible = false;
                }
                this.imgHadGot.visible = false;
                if (UserMethod.inst.isBitGet(this._currentData["id"], UserProxy.inst.taskBit)) {
                    this.imgHadGot.visible = true;
                    this.btnGet.visible = false;
                    this.btnGo.visible = false;
                }
            }
            else {
                //max
                // this.lblName.text = nextData["name"];
                this.btnGet.visible = false;
                this.btnGo.visible = false;
                this.imgHadGot.visible = true;
                this.lblBar.text = "已完成";
                this.bar.value = 100;
                this.lblName.visible = false;
            }
            var data = currentData ? currentData : nextData;
            var rewardData = UserMethod.inst.rewardJs[data["reward_1"][0]];
            this.lblAwardNum.text = rewardData.name + "x" + data["reward_1"][2];
            if (rewardData.id == 2) {
                this.lblAwardNum.text = rewardData.name + "x" + data["reward_1"][2] + "小时";
            }
            if (rewardData.id == 6 || rewardData.id == 7) {
                var heroData = UserProxy.inst.heroData.getHeroData(data["reward_1"][1]);
                if (rewardData.id == 6) {
                    this.imgType.source = Global.getChaIcon(data["reward_1"][1]);
                    this.lblAwardNum.text = heroData.config.name + "x" + data["reward_1"][2];
                }
                else {
                    this.imgType.source = Global.getChaChipIcon(data["reward_1"][1]);
                    this.lblAwardNum.text = heroData.config.name + "元神" + "x" + data["reward_1"][2];
                }
            }
            else if (rewardData.id >= 17 && rewardData.id <= 21) {
                this.lblAwardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(data["reward_1"]);
                this.imgType.source = rewardData.icon_s;
            }
            else if (rewardData.id == 5) {
                this.lblAwardNum.text = "x" + UserMethod.inst.getStageJade(data["reward_1"][2]);
                this.imgType.source = rewardData.icon_s;
            }
            else {
                this.imgType.source = rewardData.icon_s;
            }
        }
        else {
            this.imgIcon.source = "achieve_icon_" + this.data + "_png";
            var currentData = null;
            var nextData = null;
            for (var i in Config.AchievementData) {
                var achievementData = Config.AchievementData[i];
                if (achievementData["achv_type"] == this.data) {
                    nextData = achievementData;
                    if (!UserMethod.inst.isBitGet(parseInt(achievementData["id"]), UserProxy.inst.achieveBit)) {
                        currentData = achievementData;
                        break;
                    }
                }
            }
            if (currentData) {
                this.lblName.visible = true;
                this._currentData = currentData;
                this.lblName.text = currentData["disc"];
                var endParm = currentData["achv_parm"];
                var nowParm = UserMethod.inst.achieveNowPar(this.data);
                this.lblBar.text = nowParm + "/" + endParm;
                this.bar.value = Math.min(100 * (nowParm / endParm), 100);
                this.imgHadGot.visible = false;
                this.btnGo.visible = false;
                this.btnGet.visible = true;
                if (nowParm >= endParm) {
                    this.btnGet.enabled = true;
                }
                else {
                    this.btnGet.enabled = false;
                }
                this.imgType.visible = true;
                this.lblAwardNum.visible = true;
                var rewardData = UserMethod.inst.rewardJs[currentData["reward_1"][0]];
                this.lblAwardNum.text = currentData["reward_1"][2];
                this.lblAwardNum.text = rewardData.name + "x" + currentData["reward_1"][2];
                if (rewardData.id == 2) {
                    this.lblAwardNum.text = rewardData.name + "x" + currentData["reward_1"][2] + "小时";
                }
                if (rewardData.id == 6 || rewardData.id == 7) {
                    var heroData = UserProxy.inst.heroData.getHeroData(currentData["reward_1"][1]);
                    if (rewardData.id == 6) {
                        this.imgType.source = Global.getChaIcon(currentData["reward_1"][1]);
                        this.lblAwardNum.text = heroData.config.name + "x" + currentData["reward_1"][2];
                        ;
                    }
                    else {
                        this.imgType.source = Global.getChaChipIcon(currentData["reward_1"][1]);
                        this.lblAwardNum.text = heroData.config.name + "元神" + "x" + currentData["reward_1"][2];
                    }
                }
                else if (rewardData.id >= 17 && rewardData.id <= 21) {
                    this.lblAwardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(currentData["reward_1"]);
                    this.imgType.source = rewardData.icon_s;
                }
                else if (rewardData.id == 5) {
                    this.lblAwardNum.text = "x" + UserMethod.inst.getStageJade(currentData["reward_1"][2]);
                    this.imgType.source = rewardData.icon_s;
                }
                else {
                    this.imgType.source = rewardData.icon_s;
                }
            }
            else {
                //max
                this.lblName.visible = false;
                this.btnGet.visible = false;
                this.btnGo.visible = false;
                this.imgHadGot.visible = true;
                this.lblBar.text = "MAX";
                this.bar.value = 100;
                this.imgType.visible = false;
                this.lblAwardNum.visible = false;
            }
        }
    };
    return DailyAchieveRenderer;
}(eui.ItemRenderer));
egret.registerClass(DailyAchieveRenderer,'DailyAchieveRenderer');
