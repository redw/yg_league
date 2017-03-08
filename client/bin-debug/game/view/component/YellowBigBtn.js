/**
 * Created by Administrator on 11/29 0029.
 */
var YellowBigBtn = (function (_super) {
    __extends(YellowBigBtn, _super);
    function YellowBigBtn() {
        _super.call(this);
        this.skinName = YellowBigBtnSkin;
        this.touchSoundEffect = true;
    }
    var d = __define,c=YellowBigBtn,p=c.prototype;
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
    d(p, "imgType",undefined
        ,function (value) {
            if (!value) {
                this.type.visible = false;
            }
            else {
                this.type.visible = true;
                this._img = value;
                this.type.source = this._img;
            }
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
    return YellowBigBtn;
}(eui.Button));
egret.registerClass(YellowBigBtn,'YellowBigBtn');
