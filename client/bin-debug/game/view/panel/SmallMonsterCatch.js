/**
 * Created by Administrator on 12/8 0008.
 */
var SmallMonsterCatch = (function (_super) {
    __extends(SmallMonsterCatch, _super);
    function SmallMonsterCatch() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SmallMonsterCatchSkin;
        this._mutex = false;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=SmallMonsterCatch,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnClose.touchScaleEffect = true;
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.catchMonsterList.itemRenderer = MonsterCatchRenderer;
    };
    p.initData = function () {
        this.lblVitality.text = UserProxy.inst.vitality + "/" + UserProxy.inst.vitalityMax;
        if (UserProxy.inst.vitality >= UserProxy.inst.vitalityMax) {
            this.lblRecoverTime.visible = false;
        }
        else {
        }
        var ids = [];
        for (var i in Config.SmallMonsterData) {
            ids.push(parseInt(i));
        }
        this.catchMonsterList.dataProvider = new eui.ArrayCollection(ids);
    };
    p.onClose = function (e) {
        PanelManager.inst.hidePanel("SmallMonsterCatch");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnClose.touchScaleEffect = false;
        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    return SmallMonsterCatch;
}(BasePanel));
egret.registerClass(SmallMonsterCatch,'SmallMonsterCatch');
