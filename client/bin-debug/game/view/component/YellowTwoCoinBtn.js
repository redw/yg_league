/**
 * Created by Administrator on 12/1 0001.
 */
var YellowTwoCoinBtn = (function (_super) {
    __extends(YellowTwoCoinBtn, _super);
    function YellowTwoCoinBtn() {
        _super.call(this);
        this.skinName = YellowTwoCoinBtnSkin;
        this.touchSoundEffect = true;
    }
    var d = __define,c=YellowTwoCoinBtn,p=c.prototype;
    d(p, "label",undefined
        ,function (value) {
            this._label1 = value;
            this.labelDisplay.text = this._label1;
        }
    );
    d(p, "label1",undefined
        ,function (value) {
            this._label2 = value;
            this.labelDisplay1.text = this._label2;
        }
    );
    d(p, "type",undefined
        ,function (value) {
            this._type = value;
            this.imageType.source = this._type;
        }
    );
    d(p, "type1",undefined
        ,function (value) {
            this._type1 = value;
            this.imageType1.source = this._type1;
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
    return YellowTwoCoinBtn;
}(eui.Button));
egret.registerClass(YellowTwoCoinBtn,'YellowTwoCoinBtn');
