/**
 * Created by Administrator on 11/29 0029.
 */
var StarButton = (function (_super) {
    __extends(StarButton, _super);
    function StarButton() {
        _super.call(this);
        this.skinName = StarButtonSkin;
        this.touchSoundEffect = true;
    }
    var d = __define,c=StarButton,p=c.prototype;
    d(p, "label",undefined
        ,function (value) {
            this.labelTxt.text = value;
        }
    );
    d(p, "touchSoundEffect",undefined
        ,function (enabled) {
            if (enabled) {
                this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            }
            else {
                this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            }
        }
    );
    p.onTouchTap = function (event) {
        SoundManager.inst.playEffect("click_mp3");
    };
    return StarButton;
}(eui.Button));
egret.registerClass(StarButton,'StarButton');
