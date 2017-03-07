/**
 * Created by Administrator on 12/7 0007.
 */
var MonsterRenderer = (function (_super) {
    __extends(MonsterRenderer, _super);
    function MonsterRenderer() {
        _super.call(this);
        this.skinName = MonsterRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=MonsterRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.btnCall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnLook.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        Http.inst.addCmdListener(CmdID.MONSTER_UP, this.refreshMonster, this);
    };
    p.onHide = function (event) {
        this.btnCall.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnLook.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        Http.inst.removeCmdListener(CmdID.MONSTER_UP, this.refreshMonster, this);
    };
    p.onTouch = function (e) {
        if (e.currentTarget == this.btnCall) {
            Http.inst.send(CmdID.MONSTER_UP, { mid: this.data });
        }
        else {
            PanelManager.inst.showPanel("SmallMonsterInfo", this.data);
        }
    };
    p.refreshMonster = function (e) {
        for (var i in e.data["monsterList"]) {
            if (parseInt(i) == this.data) {
                this.dataChanged();
            }
        }
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var monsterData = Config.SmallMonsterData[this.data];
        this.lblName.text = monsterData["name"];
        var monsterInfo = UserProxy.inst.monsterList[this.data];
        var nextUpData = Config.MonsterLvUpData[monsterInfo["lv"] + 1];
        this.lblLv.text = "+" + monsterInfo["lv"];
        var para = parseFloat(monsterData["attr_1"][2]) * monsterData["lv"];
        this.lblDec.text = UserMethod.inst.getAddSting(monsterData["attr_1"], para);
        var hadPiece = monsterInfo["piece"];
        var needPiece = parseInt(nextUpData["num"]);
        this.bar.value = hadPiece / needPiece * 100;
        this.lblBar.text = MathUtil.easyNumber(hadPiece) + "/" + MathUtil.easyNumber(needPiece);
        if (monsterInfo["lv"]) {
            this.imgUnHad.visible = false;
            this.lblMagic.visible = true;
            this.btnLook.visible = true;
            this.btnCall.visible = false;
            this.lblLv.visible = true;
            var score = 0;
            var index = monsterInfo["lv"];
            for (var i = 1; i <= index; i++) {
                var value = parseInt(Config.MonsterLvUpData[i]["scores"]);
                score += value;
            }
            this.lblMagic.text = "法力：" + score;
        }
        else {
            this.lblMagic.visible = false;
            this.btnLook.visible = false;
            this.lblLv.visible = false;
            if (hadPiece >= needPiece) {
                this.btnCall.visible = true;
                this.imgUnHad.visible = false;
            }
            else {
                this.btnCall.visible = false;
                this.imgUnHad.visible = true;
            }
        }
    };
    return MonsterRenderer;
}(eui.ItemRenderer));
egret.registerClass(MonsterRenderer,'MonsterRenderer');
//# sourceMappingURL=MonsterRenderer.js.map