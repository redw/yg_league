/**
 * Created by Administrator on 12/8 0008.
 */
var MonsterCatchRenderer = (function (_super) {
    __extends(MonsterCatchRenderer, _super);
    function MonsterCatchRenderer() {
        _super.call(this);
        this.skinName = MonsterCatchRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=MonsterCatchRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnFight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnSweep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    };
    p.onHide = function (event) {
        this.btnFight.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnReset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnSweep.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    };
    p.onTouch = function (e) {
        if (e.currentTarget == this.btnFight) {
        }
        else if (e.currentTarget == this.btnSweep) {
        }
        else {
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        this.lblCostEnergy.text = "-" + Config.BaseData[21]["value"];
        var monsterInfo = UserProxy.inst.monsterList[this.data];
        var monsterData = Config.SmallMonsterData[this.data];
        this.lblName.text = monsterData["name"];
        var difficult = monsterInfo["difficult"] + 1;
        this.lblDifficulty.text = "难度：" + difficult;
        this.lblFightTimes.text = "剩余次数：" + monsterInfo["challenge"] + "/" + 3;
        var nowGet = Config.MonsterFb[difficult]["num"];
        var nextGet = Config.MonsterFb[difficult + 1]["num"];
        this.lblGet.text = "*" + nowGet;
        this.lblGetLast.text = "*" + nextGet;
        if (monsterInfo["challenge"]) {
            this.btnReset.visible = false;
            this.btnGroup.x = 222;
            this.btnSweep.enabled = true;
            this.btnFight.enabled = true;
        }
        else {
            this.btnReset.visible = true;
            this.btnGroup.x = 120;
            this.btnSweep.enabled = false;
            this.btnFight.enabled = false;
        }
        if (difficult > 1) {
            this.nextGroup.visible = true;
            this.btnSweep.visible = true;
        }
        else {
            this.nextGroup.visible = false;
            this.btnSweep.visible = false;
        }
    };
    return MonsterCatchRenderer;
}(eui.ItemRenderer));
egret.registerClass(MonsterCatchRenderer,'MonsterCatchRenderer');
