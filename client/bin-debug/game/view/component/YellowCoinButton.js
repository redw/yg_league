/**
 * Created by Administrator on 11/24 0024.
 */
var YellowCoinButton = (function (_super) {
    __extends(YellowCoinButton, _super);
    function YellowCoinButton() {
        _super.call(this);
        this.skinName = YellowCoinButtonSkin;
        this.touchSoundEffect = true;
    }
    var d = __define,c=YellowCoinButton,p=c.prototype;
    d(p, "extraLabel",undefined
        ,function (value) {
            this._txt = value;
            this.txtUp.text = this._txt;
        }
    );
    d(p, "label",undefined
        ,function (value) {
            this.labelDisplay.text = value;
        }
    );
    d(p, "coinType",undefined
        ,function (value) {
            this._img = value;
            this.imgType.source = this._img;
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
    return YellowCoinButton;
}(eui.Button));
egret.registerClass(YellowCoinButton,'YellowCoinButton');
//# sourceMappingURL=YellowCoinButton.js.map