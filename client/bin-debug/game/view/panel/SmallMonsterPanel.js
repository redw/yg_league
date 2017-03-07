/**
 * Created by Administrator on 12/7 0007.
 */
var SmallMonsterPanel = (function (_super) {
    __extends(SmallMonsterPanel, _super);
    function SmallMonsterPanel() {
        _super.call(this);
        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = SmallMonsterPanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }
    var d = __define,c=SmallMonsterPanel,p=c.prototype;
    p.init = function () {
        Http.inst.addCmdListener(CmdID.MONSTER_UP, this.showMagicAdd, this);
        Http.inst.addCmdListener(CmdID.MONSTER_OPEN, this.openBack, this);
        this.btnGoCatch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCatch, this);
        this.btnGoCatch.touchScaleEffect = true;
        this.monsterList.itemRenderer = MonsterRenderer;
        Http.inst.send(CmdID.MONSTER_OPEN);
    };
    p.initData = function () {
        this.showMagicAdd();
        var ids = [];
        for (var i in UserProxy.inst.monsterList) {
            ids.push(parseInt(i));
        }
        this.monsterList.dataProvider = new eui.ArrayCollection(ids);
    };
    p.openBack = function (e) {
        if (e.data) {
            UserProxy.inst.vitality = e.data["vitality"];
            UserProxy.inst.lastRecoverTime = e.data["lastRecoverTime"];
        }
    };
    p.showMagicAdd = function () {
        //等级
        var nowLv = 0;
        var next_score = 0;
        var lv_base = Config.BaseData[32]["value"];
        var lv_para = Config.BaseData[33]["value"];
        var pow_base = Config.BaseData[34]["value"];
        var pow_para = Config.BaseData[35]["value"];
        for (var i = 0; i < 1000; i++) {
            var next = pow_base * (Math.pow(pow_para, i + 1) - 1) / (pow_para - 1);
            if (next > UserProxy.inst.score) {
                nowLv = i;
                next_score = next;
                break;
            }
        }
        var nature_add;
        if (nowLv) {
            nature_add = Math.floor(lv_base * Math.pow(lv_para, nowLv - 1));
        }
        else {
            nature_add = 0;
        }
        this.lblProgress.text = UserProxy.inst.score + "/" + next_score;
        this.allProgress.value = UserProxy.inst.score / next_score * 100;
        this.lblAllLv.text = "Lv." + nowLv + " 法力";
        this.lblUpNature.text = "全体全属性提升：" + MathUtil.easyNumber(nature_add * 100) + "%";
    };
    p.onCatch = function (e) {
        PanelManager.inst.showPanel("SmallMonsterCatch");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnGoCatch.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCatch, this);
        this.btnGoCatch.touchScaleEffect = false;
        Http.inst.removeCmdListener(CmdID.MONSTER_UP, this.showMagicAdd, this);
    };
    return SmallMonsterPanel;
}(BasePanel));
egret.registerClass(SmallMonsterPanel,'SmallMonsterPanel');
//# sourceMappingURL=SmallMonsterPanel.js.map