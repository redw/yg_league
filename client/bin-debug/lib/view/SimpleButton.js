/**
 * 简单按钮
 * @author j
 * 2016/1/7
 */
var SimpleButton = (function (_super) {
    __extends(SimpleButton, _super);
    function SimpleButton() {
        _super.call(this);
        this.touchEnabled = true;
        this.touchScaleEffect = true;
    }
    var d = __define,c=SimpleButton,p=c.prototype;
    d(p, "touchScaleEffect",undefined
        ,function (enabled) {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
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
    p.onTouchTap = function (event) {
        SoundManager.inst.playEffect("click_mp3");
    };
    return SimpleButton;
}(eui.Image));
egret.registerClass(SimpleButton,'SimpleButton');
