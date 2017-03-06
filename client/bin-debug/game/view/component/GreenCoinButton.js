/**
 * Created by Administrator on 11/24 0024.
 */
var GreenCoinButton = (function (_super) {
    __extends(GreenCoinButton, _super);
    function GreenCoinButton() {
        _super.call(this);
        this.skinName = GreenCoinButtonSkin;
        this.touchSoundEffect = true;
    }
    var d = __define,c=GreenCoinButton,p=c.prototype;
    d(p, "type",undefined
        ,function (type) {
            if (type == 1) {
                this.imgType.source = "reward_1_s_png";
            }
            else if (type == 2) {
                this.imgType.source = "reward_3_s_png";
            }
        }
    );
    d(p, "label",undefined
        ,function (value) {
            this.labelDisplay.text = value;
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
    return GreenCoinButton;
}(eui.Button));
egret.registerClass(GreenCoinButton,'GreenCoinButton');
