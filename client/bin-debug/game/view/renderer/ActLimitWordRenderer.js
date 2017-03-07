/**
 * Created by Administrator on 1/25 0025.
 */
var ActLimitWordRenderer = (function (_super) {
    __extends(ActLimitWordRenderer, _super);
    function ActLimitWordRenderer() {
        _super.call(this);
        this.skinName = ActLimitWordRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActLimitWordRenderer,p=c.prototype;
    p.onShow = function (event) {
        Http.inst.addCmdListener(CmdID.ACTIVITY, this.dataChanged, this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
    };
    p.onHide = function (event) {
        Http.inst.removeCmdListener(CmdID.ACTIVITY, this.dataChanged, this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
    };
    p.onGet = function () {
        Http.inst.send(CmdID.ACTIVITY, { type: 2, id: this.data });
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var wordData = Config.ActWordData[this.data];
        this.showReward(wordData);
        for (var i = 0; i < 5; i++) {
            var group = DisplayUtil.getChildByName(this, "group" + i);
            group.visible = false;
        }
        var enable = [];
        for (var i = 0; i < wordData["condition"].length; i++) {
            if (wordData["condition"][i]) {
                var group = DisplayUtil.getChildByName(this, "group" + i);
                var word = DisplayUtil.getChildByName(group, "word");
                var num = DisplayUtil.getChildByName(group, "num");
                group.visible = true;
                word.source = "piece_" + wordData["condition"][i] + "_png";
                var wordInfo = UserProxy.inst.activityObj[101];
                if (wordInfo && wordInfo["collectWord"]) {
                    var collectWord = UserProxy.inst.activityObj[101]["collectWord"].concat();
                    var count = collectWord[parseInt(wordData["condition"][i]) - 1];
                    num.text = "x" + count;
                    if (count > 0) {
                        enable.push(true);
                    }
                    else {
                        enable.push(false);
                    }
                }
                else {
                    num.text = "x0";
                    enable.push(false);
                }
            }
        }
        for (var j = 0; j < enable.length; j++) {
            if (!enable[j]) {
                this.btnGet.enabled = false;
                return;
            }
        }
        this.btnGet.enabled = true;
    };
    p.showReward = function (data) {
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
                ;
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
    };
    return ActLimitWordRenderer;
}(eui.ItemRenderer));
egret.registerClass(ActLimitWordRenderer,'ActLimitWordRenderer');
//# sourceMappingURL=ActLimitWordRenderer.js.map