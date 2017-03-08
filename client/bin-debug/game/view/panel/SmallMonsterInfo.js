/**
 * Created by Administrator on 12/7 0007.
 */
var SmallMonsterInfo = (function (_super) {
    __extends(SmallMonsterInfo, _super);
    function SmallMonsterInfo() {
        _super.call(this);
        this._barWidth = 239;
        this._canUp = false;
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SmallMonsterInfoSkin;
        this._mutex = false;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=SmallMonsterInfo,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnClose.touchScaleEffect = true;
        this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
        this.btnAdd.touchScaleEffect = true;
        this.btnSelect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
        this.btnSelect.touchScaleEffect = true;
        this.btnLvUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLvUp, this);
        this.imgSelect.visible = false;
        Http.inst.addCmdListener(CmdID.MONSTER_UP, this.initData, this);
    };
    p.initData = function () {
        this._monsterData = Config.SmallMonsterData[this.data];
        this.lblName.text = this._monsterData["name"];
        this.lblAllPiece.text = UserProxy.inst.allKindPiece + "";
        this._monsterInfo = UserProxy.inst.monsterList[this.data];
        this._nextUpData = Config.MonsterLvUpData[this._monsterInfo["lv"] + 1];
        this.lblLv.text = "+" + this._monsterInfo["lv"];
        var para = parseFloat(this._monsterData["attr_1"][2]) * this._monsterData["lv"];
        this.lblDec.text = UserMethod.inst.getAddSting(this._monsterData["attr_1"], para);
        var score = 0;
        var index = this._monsterInfo["lv"];
        for (var i = 1; i <= index; i++) {
            var value = parseInt(Config.MonsterLvUpData[i]["scores"]);
            score += value;
        }
        this.lblMagic.text = "法力：" + score;
        this.changePercent();
    };
    p.changePercent = function () {
        var hadPiece = this._monsterInfo["piece"];
        var needPiece = parseInt(this._nextUpData["num"]);
        var userAllPiece = UserProxy.inst.allKindPiece + hadPiece;
        this.imgAddBar.visible = this.imgSelect.visible;
        this.imgBar.width = MathUtil.clamp(Math.floor(hadPiece * this._barWidth / needPiece), 0, this._barWidth);
        this.imgAddBar.width = MathUtil.clamp(Math.floor(userAllPiece * this._barWidth / needPiece), 0, this._barWidth);
        this._canUp = false;
        if (this.imgSelect.visible) {
            this.lblBar.text = userAllPiece + "/" + needPiece;
            if (userAllPiece >= needPiece) {
                this._canUp = true;
            }
        }
        else {
            this.lblBar.text = hadPiece + "/" + needPiece;
            if (hadPiece >= needPiece) {
                this._canUp = true;
            }
        }
        this.btnLvUp.enabled = this._canUp;
    };
    p.onLvUp = function () {
        Http.inst.send(CmdID.MONSTER_UP, { mid: this.data });
    };
    p.onAdd = function () {
        PanelManager.inst.showPanel("SmallMonsterCatch");
    };
    p.onSelect = function () {
        this.imgSelect.visible = !this.imgSelect.visible;
        this.changePercent();
    };
    p.onClose = function (e) {
        PanelManager.inst.hidePanel("SmallMonsterInfo");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnClose.touchScaleEffect = false;
        this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdd, this);
        this.btnAdd.touchScaleEffect = false;
        this.btnSelect.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
        this.btnSelect.touchScaleEffect = false;
        this.btnLvUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLvUp, this);
        Http.inst.removeEventListener(CmdID.MONSTER_UP, this.initData, this);
    };
    return SmallMonsterInfo;
}(BasePanel));
egret.registerClass(SmallMonsterInfo,'SmallMonsterInfo');
