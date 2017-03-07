/**
 * Created by Administrator on 12/28 0028.
 */
var SevenDayButton = (function (_super) {
    __extends(SevenDayButton, _super);
    function SevenDayButton() {
        _super.call(this);
        this.skinName = SevenDayButtonSkin;
        this.touchEnabled = true;
        this.touchScaleEffect = true;
    }
    var d = __define,c=SevenDayButton,p=c.prototype;
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
    d(p, "btnImg",undefined
        ,function (string) {
            this._imgStr = string;
            this.img.source = this._imgStr;
        }
    );
    d(p, "btnDay",undefined
        ,function (day) {
            switch (day) {
                case 1:
                    this._txt = "第一天";
                    break;
                case 2:
                    this._txt = "第二天";
                    break;
                case 3:
                    this._txt = "第三天";
                    break;
                case 4:
                    this._txt = "第四天";
                    break;
                case 5:
                    this._txt = "第五天";
                    break;
                case 6:
                    this._txt = "第六天";
                    break;
                case 7:
                    this._txt = "第七天";
                    break;
            }
            this.lbl.text = this._txt;
        }
    );
    return SevenDayButton;
}(eui.Component));
egret.registerClass(SevenDayButton,'SevenDayButton');
//# sourceMappingURL=SevenDayButton.js.map