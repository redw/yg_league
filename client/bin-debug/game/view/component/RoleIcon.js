/**
 * Created by Administrator on 12/26 0026.
 */
var RoleIcon = (function (_super) {
    __extends(RoleIcon, _super);
    function RoleIcon() {
        _super.call(this);
        this.skinName = RoleIconSkin;
    }
    var d = __define,c=RoleIcon,p=c.prototype;
    d(p, "imgIcon",undefined
        ,function (value) {
            this._icon = value;
            this.imageIcon.source = this._icon;
        }
    );
    d(p, "setLv",undefined
        /*public set qualityBg(quality:string)
        {
            var qly:number = parseInt(quality);
            switch (qly)
            {
                case 1:this._bg = "role_icon_1_png"; break;
                case 2:this._bg = "role_icon_2_png"; break;
                case 3:this._bg = "role_icon_3_png"; break;
                case 4:this._bg = "role_icon_4_png"; break;
            }
            this.imageBg.source = this._bg;
        }*/
        ,function (lv) {
            this._lv = lv;
            if (this._lv = lv) {
                this.lblLv.text = "Lv." + this._lv;
                this.lblLv.visible = true;
            }
            else {
                this.lblLv.visible = false;
            }
        }
    );
    d(p, "setStar",undefined
        ,function (star) {
            this._star = star;
            if (this._star) {
                this.lblStar.text = "" + this._star;
                this.lblStar.visible = true;
                this.imageStar.visible = true;
            }
            else {
                this.lblStar.visible = false;
                this.imageStar.visible = false;
            }
        }
    );
    return RoleIcon;
}(eui.Component));
egret.registerClass(RoleIcon,'RoleIcon');
