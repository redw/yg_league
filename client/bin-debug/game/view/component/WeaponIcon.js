/**
 * Created by Administrator on 12/1 0001.
 */
var WeaponIcon = (function (_super) {
    __extends(WeaponIcon, _super);
    function WeaponIcon() {
        _super.call(this);
        this.skinName = WeaponIconSkin;
    }
    var d = __define,c=WeaponIcon,p=c.prototype;
    d(p, "imgIcon",undefined
        ,function (value) {
            this._icon = value;
            this.imageIcon.source = this._icon;
        }
    );
    d(p, "imgBg",undefined
        ,function (value) {
            this._bg = value;
            this.imageBg.source = this._bg;
        }
    );
    d(p, "qualityBg",undefined
        ,function (quality) {
            var qly = parseInt(quality);
            switch (qly) {
                case 1:
                    this._bg = "role_icon_1_png";
                    break;
                case 2:
                    this._bg = "role_icon_2_png";
                    break;
                case 3:
                    this._bg = "role_icon_3_png";
                    break;
                case 4:
                    this._bg = "role_icon_4_png";
                    break;
            }
            this.imageBg.source = this._bg;
        }
    );
    d(p, "touchReward",undefined
        ,function (reward) {
            this.imageIcon["awardData"] = reward;
            this.imageIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onItem, this);
        }
    );
    p.onItem = function (e) {
        var awardData = e.currentTarget["awardData"];
        ShowItemTipPanel.show(awardData);
    };
    return WeaponIcon;
}(eui.Component));
egret.registerClass(WeaponIcon,'WeaponIcon');
//# sourceMappingURL=WeaponIcon.js.map