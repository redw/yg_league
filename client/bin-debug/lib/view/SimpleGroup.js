/**
 * Created by Administrator on 12/1 0001.
 */
var SimpleGroup = (function (_super) {
    __extends(SimpleGroup, _super);
    function SimpleGroup() {
        _super.call(this);
        this.touchEnabled = true;
        this.touchScaleEffect = true;
    }
    var d = __define,c=SimpleGroup,p=c.prototype;
    d(p, "touchScaleEffect",undefined
        ,function (enabled) {
            if (enabled) {
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            }
            else {
                this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            }
        }
    );
    p.onTouchBegin = function (event) {
        EffectUtil.playScaleEffect(this, 0.9);
    };
    return SimpleGroup;
}(eui.Group));
egret.registerClass(SimpleGroup,'SimpleGroup');
