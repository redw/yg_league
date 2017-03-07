/**
 * Created by Administrator on 12/22 0022.
 */
var TargetPanel = (function (_super) {
    __extends(TargetPanel, _super);
    function TargetPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = TargetPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=TargetPanel,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.MISSION, this.missionBack, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnTotalEnd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTotal, this);
        for (var i = 0; i < 4; i++) {
            var targetGroup = DisplayUtil.getChildByName(this, "targetGroup" + i);
            var btnGet = DisplayUtil.getChildByName(targetGroup, "btnGet");
            var btnGo = DisplayUtil.getChildByName(targetGroup, "btnGo");
            btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
            btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGo, this);
        }
        this.coinShow.startListener();
    };
    p.initData = function () {
        this.nowGroup();
        for (var i = 0; i < 4; i++) {
            this.showCell(i);
        }
        this.groupBtnEnable();
        egret.Tween.get(this.imgLight, { loop: true }).to({ rotation: 360 }, 10000);
    };
    p.missionBack = function (e) {
        UserProxy.inst.missionBit = e.data["missionBit"];
        var group = e.data["group"];
        UserProxy.inst.missionObj["group"] = group;
        UserMethod.inst.showAward(e.data);
        if (UserMethod.inst.isTargetEnd()) {
            egret.setTimeout(function () {
                Notice.show("恭喜你!已完成全部目标任务！");
            }, this, 800);
            this.onClose();
            TopPanel.inst.showPoint(5);
            return;
        }
        if ((group - 1) > 0 && group % 5 == 0) {
            this.nowGroup();
            for (var i = 0; i < 4; i++) {
                this.showCell(i);
            }
        }
        else {
            this.showCell(this._sendId);
        }
        this.groupBtnEnable();
        TopPanel.inst.showPoint(5);
    };
    p.nowGroup = function () {
        this._donecCount = 0;
        var nowGroup = UserProxy.inst.missionObj["group"];
        var firstId = Math.floor(nowGroup / 5) * 5 + 1;
        var groupId = firstId + 4;
        this._ids = [];
        for (var i = firstId; i < groupId; i++) {
            this._ids.push(i);
        }
        var missionData = Config.TargetData[groupId];
        var reward = missionData["reward_1"].concat();
        var rewardData = UserMethod.inst.rewardJs[reward[0]];
        this.imgAwardType.touchReward = reward;
        if (rewardData.id == 6 || rewardData.id == 7) {
            var heroData = UserProxy.inst.heroData.getHeroData(reward[1]);
            var quality = heroData.config.quality;
            this.imgAwardType.qualityBg = quality;
            if (rewardData.id == 6) {
                this.imgAwardType.imgIcon = Global.getChaIcon(reward[1]);
            }
            else {
                this.imgAwardType.imgIcon = Global.getChaChipIcon(reward[1]);
            }
        }
        else if (rewardData.id >= 17 && rewardData.id <= 21) {
            this.lblAwardNum.text = "x" + UserMethod.inst.getWeaponCoinStage(reward);
            this.imgAwardType.imgIcon = rewardData.icon;
        }
        else if (rewardData.id == 5) {
            this.lblAwardNum.text = "x" + UserMethod.inst.getStageJade(reward[2]);
            this.imgAwardType.imgIcon = rewardData.icon;
        }
        else {
            this.imgAwardType.imgIcon = rewardData.icon;
        }
        this.lblAwardNum.text = "x" + missionData["reward_1"][2];
    };
    p.showCell = function (idx) {
        var targetGroup = DisplayUtil.getChildByName(this, "targetGroup" + idx);
        var icon = DisplayUtil.getChildByName(targetGroup, "icon");
        var name = DisplayUtil.getChildByName(targetGroup, "name");
        var btnGet = DisplayUtil.getChildByName(targetGroup, "btnGet");
        var btnGo = DisplayUtil.getChildByName(targetGroup, "btnGo");
        var awardNum = DisplayUtil.getChildByName(targetGroup, "awardNum");
        var awardType = DisplayUtil.getChildByName(targetGroup, "awardType");
        var lblBar = DisplayUtil.getChildByName(targetGroup, "lblBar");
        var bar = DisplayUtil.getChildByName(targetGroup, "bar");
        var imgGot = DisplayUtil.getChildByName(targetGroup, "imgGot");
        var missionData = Config.TargetData[this._ids[idx]];
        btnGet["idx"] = idx;
        btnGet["id"] = missionData["id"];
        name.text = missionData["name"];
        btnGo["id"] = missionData["task_type"];
        var endParm = missionData["task_num"];
        var nowParm = UserMethod.inst.targetFinish(missionData);
        icon.source = "mission_" + missionData["task_type"] + "_png";
        lblBar.text = nowParm + "/" + endParm;
        bar.value = Math.min(100 * (nowParm / endParm), 100);
        if (nowParm >= endParm) {
            btnGet.visible = true;
            btnGo.visible = false;
        }
        else {
            btnGet.visible = false;
            btnGo.visible = true;
        }
        var rewardData = UserMethod.inst.rewardJs[missionData["reward_1"][0]];
        awardType.source = rewardData.icon_s;
        awardNum.text = "x" + missionData["reward_1"][2];
        if (rewardData.id == 2) {
            awardNum.text = rewardData.name + "x" + missionData["reward_1"][2] + "小时";
        }
        if (UserMethod.inst.isBitGet(missionData["id"], UserProxy.inst.missionBit)) {
            btnGo.visible = false;
            imgGot.visible = true;
            btnGet.visible = false;
            this._donecCount++;
        }
        else {
            imgGot.visible = false;
        }
    };
    p.groupBtnEnable = function () {
        this.btnTotalEnd.label = this._donecCount + "/4";
        if (this._donecCount == 4) {
            this.btnTotalEnd.enabled = true;
            this.btnTotalEnd.label = "领 取";
        }
        else {
            this.btnTotalEnd.enabled = false;
        }
    };
    p.onTotal = function () {
        var nowGroup = UserProxy.inst.missionObj["group"] + 1;
        Http.inst.send(CmdID.MISSION, { tid: nowGroup });
    };
    p.onTouch = function (e) {
        var id = e.currentTarget["id"];
        this._sendId = e.currentTarget["idx"];
        Http.inst.send(CmdID.MISSION, { tid: id });
    };
    p.onGo = function (e) {
        var type = e.currentTarget["id"];
        this.typeGo(type);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("TargetPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        Http.inst.removeCmdListener(CmdID.MISSION, this.missionBack, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnTotalEnd.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTotal, this);
        for (var i = 0; i < 4; i++) {
            var targetGroup = DisplayUtil.getChildByName(this, "targetGroup" + i);
            var btnGet = DisplayUtil.getChildByName(targetGroup, "btnGet");
            btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        }
        // EventManager.inst.dispatch(ContextEvent.TARGET_HANG);
        egret.Tween.removeTweens(this.imgLight);
        this.coinShow.endListener();
    };
    /**
     * 前往
     * @param goType
     */
    p.typeGo = function (goType) {
        switch (goType) {
            case 1:
                break;
            case 2:
                MenuPanel.inst.openMenu(1);
                break;
            case 3:
                MenuPanel.inst.openMenu(2);
                break;
            case 4:
                MenuPanel.inst.openMenu(4);
                break;
            case 5:
                MenuPanel.inst.openMenu(2);
                break;
            case 6:
                PanelManager.inst.showPanel("PVPPanel");
                break;
            case 7:
                PanelManager.inst.showPanel("PVPPanel");
                break;
            case 8:
                PanelManager.inst.showPanel("FriendMainPanel", 1);
                break;
            case 9:
                break;
            case 10:
                MenuPanel.inst.openMenu(3);
                break;
            case 11:
                break;
            case 12:
                MenuPanel.inst.openMenu(2);
                break;
            case 13:
                MenuPanel.inst.openMenu(1);
                break;
        }
        this.onClose();
    };
    return TargetPanel;
}(BasePanel));
egret.registerClass(TargetPanel,'TargetPanel');
//# sourceMappingURL=TargetPanel.js.map