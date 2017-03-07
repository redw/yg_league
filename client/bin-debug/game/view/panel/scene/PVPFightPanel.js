/**
 * pvp面板
 */
var PVPFightPanel = (function (_super) {
    __extends(PVPFightPanel, _super);
    function PVPFightPanel() {
        _super.call(this);
        this.selfPosArr = [];
        this.isResOk = false;
        this._layer = PanelManager.TOP_LAYER;
    }
    var d = __define,c=PVPFightPanel,p=c.prototype;
    p.initData = function () {
        var heroArr = [];
        this.selfPosArr = this._data[0].concat();
        for (var i = 0; i < this.selfPosArr.length; i++) {
            if (this.selfPosArr[i] > 0)
                heroArr.push({ side: FightSideEnum.LEFT_SIDE, pos: i, id: this.selfPosArr[i] });
        }
        this.isResOk = false;
        this.selfRoles = heroArr;
        this.matchRoles = fight.generatePVPFightHeroVOArr(this._data[2].hero, this._data[2].pos, FightSideEnum.RIGHT_SIDE);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
        fight.loadPVPFightRes([].concat(this.selfRoles, this.matchRoles));
        this.myHeadInfo.setInfo(this._data[3]);
        this.otherHeadInfo.setInfo(this._data[4]);
        Http.inst.send(CmdID.FIGHT_PVP_BEGIN, {
            pos: JSON.stringify(this.selfPosArr),
            tp: this.fightContainer.getTriggerChanceType()
        });
    };
    p.init = function () {
        this.backGround = new PVPBackGround();
        this.addChild(this.backGround);
        this.fightContainer = new FightContainer(FightTypeEnum.PVP);
        this.fightContainer.y = 20;
        this.addChild(this.fightContainer);
        this.roundProgress = new RoundProgress();
        this.roundProgress.x = 190;
        this.roundProgress.y = 20;
        this.addChild(this.roundProgress);
        this.roundProgress.round = 1;
        this.myHeadInfo = new PlayerHead();
        this.addChild(this.myHeadInfo);
        this.otherHeadInfo = new PlayerHead("right");
        this.otherHeadInfo.y = 714;
        this.addChild(this.otherHeadInfo);
        this.addEventListener(ContextEvent.FIGHT_END, this.onFightEnd, this, true);
        this.addEventListener("fight_start", this.onFightStart, this, true);
        EventManager.inst.dispatchEventWith(ContextEvent.TOGGLE_PVE_BATTLE, false, false);
        EventManager.inst.addEventListener(ContextEvent.PVP_FIGHT_DATA_RES, this.onPVPFightDataRes, this);
        this.addEventListener("role_one_step_complete", this.updateRound, this);
    };
    p.loadResComplete = function (e) {
        if (e.groupName == "pvpFight") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.loadResComplete, this);
            var heroArr = [].concat(this.selfRoles, this.matchRoles);
            this.fightContainer.fightDeployment(heroArr, false);
            this.isResOk = true;
            this.startFight();
        }
    };
    p.onPVPFightDataRes = function (e) {
        this.result = e.data;
        this.startFight();
    };
    p.startFight = function () {
        if (this.isResOk && this.result) {
            var step = [].concat(this.result.battleReport);
            for (var i = 0; i < step.length; i++) {
                step[i].index = i;
            }
            this.fightContainer.start(step);
        }
    };
    p.updateRound = function (e) {
        this.roundProgress.round = e.data + 1;
    };
    p.onFightStart = function () {
        fight.playSound("pvp", false);
    };
    p.onFightEnd = function () {
        var data = {};
        data.ret = this.result.ret;
        data.curPanelName = "PVPFightPanel";
        PanelManager.inst.showPanel("FightResultPanel", data);
        EventManager.inst.dispatchEventWith(ContextEvent.TOGGLE_PVE_BATTLE, false, true);
        this.removeEventListener("fight_end", this.onFightEnd, this, true);
        this.removeEventListener("fight_start", this.onFightStart, this, true);
        EventManager.inst.removeEventListener(ContextEvent.PVP_FIGHT_DATA_RES, this.onPVPFightDataRes, this);
        // EventManager.inst.dispatch(ContextEvent.PVP_REFRESH_ROLE_REQ);
        EventManager.inst.dispatch(ContextEvent.PVP_FIGHT_END, this.result);
    };
    p.destory = function () {
        if (this.roundProgress)
            this.roundProgress.dispose();
        this.roundProgress = null;
        if (this.myHeadInfo)
            this.myHeadInfo.dispose();
        this.myHeadInfo = null;
        if (this.otherHeadInfo)
            this.otherHeadInfo.dispose();
        this.otherHeadInfo = null;
        if (this.backGround) {
            this.backGround.dispose();
        }
        this.backGround = null;
        this.selfPosArr = null;
        this.matchRoles = null;
        this.selfPosArr = null;
        this.fightContainer.reset();
        _super.prototype.destory.call(this);
    };
    return PVPFightPanel;
}(BasePanel));
egret.registerClass(PVPFightPanel,'PVPFightPanel');
//# sourceMappingURL=PVPFightPanel.js.map