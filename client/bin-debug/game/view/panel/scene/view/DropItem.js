/**
 * 道具掉落
 * Created by hh on 2016/12/19.
 */
var DropItem = (function (_super) {
    __extends(DropItem, _super);
    function DropItem() {
        _super.call(this);
        this._dropId = -1;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    }
    var d = __define,c=DropItem,p=c.prototype;
    p.addToStage = function (e) {
        if (this.propEff) {
            var mc = this.propEff.getMC();
            if (mc && !mc.isPlaying) {
                mc.play(-1);
            }
        }
    };
    p.stop = function () {
        var mc = this.propEff ? this.propEff.getMC() : null;
        if (mc && mc.isPlaying) {
            mc.stop();
        }
    };
    d(p, "dropId"
        ,function () {
            return this._dropId;
        }
        ,function (value) {
            if (this._dropId != value) {
                if (value) {
                    this.touchEnabled = false;
                    var eff = new MCEff("item_appear_effect");
                    eff.addEventListener(egret.Event.COMPLETE, this.showProp, this);
                    this.addChild(eff);
                }
                else {
                }
            }
            this._dropId = value;
        }
    );
    p.showProp = function (e) {
        if (e === void 0) { e = null; }
        if (e && e.target) {
            e.target.removeEventListener(egret.Event.COMPLETE, this.showProp, this);
        }
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        var config = Config.DropData[this._dropId];
        this.propEff = new MCEff(config.resource, false);
        this.addChild(this.propEff);
        this.addToStage(null);
    };
    p.onTouchTap = function () {
        this.touchEnabled = false;
        this.propEff.dispose();
        this.propEff = null;
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        var eff = new MCEff("item_disappear_effect");
        eff.addEventListener(egret.Event.COMPLETE, this.onUseProp, this);
        this.addChild(eff);
    };
    p.onUseProp = function (e) {
        if (e) {
            e.target.removeEventListener(egret.Event.COMPLETE, this.onUseProp, this);
        }
        var propId = this._dropId;
        switch (propId) {
            case 1:
            case 2:
            case 3:
                EventManager.inst.dispatch("use_prop", propId);
                break;
            // 获得转生次数+1
            case 4:
                Http.inst.send(CmdID.PROP_USE, { id: propId });
                break;
            // 小财神
            case 5:
                Http.inst.send(CmdID.PROP_USE, { id: propId });
                break;
            // 大财神
            case 6:
                Http.inst.send(CmdID.PROP_USE, { id: propId });
                break;
            case 7:
                Http.inst.send(CmdID.PROP_USE, { id: propId });
                break;
            case 8:
                Http.inst.send(CmdID.PROP_USE, { id: propId });
                break;
        }
        this.dispose();
    };
    p.dispose = function (e) {
        if (e === void 0) { e = null; }
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
        this._dropId = 0;
        if (this.propEff) {
            this.propEff.dispose();
            this.propEff = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    return DropItem;
}(egret.DisplayObjectContainer));
egret.registerClass(DropItem,'DropItem');
