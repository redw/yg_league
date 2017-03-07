/**
 * 角色血条栏
 * Created by hh on 2016/12/26.
 */
var RoleHPBar = (function (_super) {
    __extends(RoleHPBar, _super);
    function RoleHPBar(flipped) {
        _super.call(this);
        this.pad = 1;
        this.barW = 10;
        this.max_width = 62;
        this.oldPercent = -1;
        this.isCanRemove = false;
        this.setPercent = function (value) {
            if (this.oldPercent != value) {
                value = Math.max(0, value);
                value = Math.min(value, 100);
                var newWidth = (value * (this.max_width - 2 * this.pad)) / 100;
                this.setWidth(newWidth);
            }
        };
        this.flipped = flipped;
        this.drawBackground();
        this.drawHealthBar();
    }
    var d = __define,c=RoleHPBar,p=c.prototype;
    p.drawBackground = function () {
        this.backGround = new AutoBitmap();
        this.addChild(this.backGround);
        this.backGround.source = "pvp_blood_background_png";
    };
    p.drawHealthBar = function () {
        this.hpBitmap = new AutoBitmap();
        if (this.flipped) {
            this.hpBitmap.source = "pvp_blood_enemy_png";
        }
        else {
            this.hpBitmap.source = "pvp_blood_png";
        }
        this.addChild(this.hpBitmap);
        this.hitBitmap = new AutoBitmap("pvp_blood_hit_png");
        this.hitBitmap.visible = false;
        this.addChild(this.hitBitmap);
        this.effBitmap = new AutoBitmap("pvp_blood_line_png");
        this.addChild(this.effBitmap);
        this.hpBitmap.y = this.pad;
        this.hitBitmap.y = this.pad;
        this.effBitmap.y = this.pad;
    };
    p.active = function (flipped) {
        this.flipped = flipped;
        this.isCanRemove = false;
        this.effBitmap.visible = true;
        if (this.flipped) {
            this.hpBitmap.source = "pvp_blood_enemy_png";
        }
        else {
            this.hpBitmap.source = "pvp_blood_png";
        }
        this.setWidth(this.max_width - this.pad * 2);
    };
    p.update = function (cur, max) {
        var ratio = +(BigNum.div(cur, max)) || 0;
        this.setProgress(ratio);
    };
    p.setProgress = function (value) {
        var _this = this;
        var w = MathUtil.clamp(value, 0, 1) * (this.max_width - this.pad * 2);
        if (this.oldPercent != w) {
            if (this.oldPercent < 0) {
                this.oldPercent = value;
                this.hpBitmap.visible = true;
                this.effBitmap.visible = true;
                this.isCanRemove = true;
                this.setWidth(w);
            }
            else {
                this.hitBitmap.visible = true;
                this.hitBitmap.alpha = 0.8;
                this.effBitmap.visible = false;
                var tween = egret.Tween.get(this.hitBitmap);
                tween.to({ alpha: 1 }, 80);
                tween.to({ alpha: 0.4 }, 80);
                tween.call(function () {
                    egret.Tween.removeTweens(_this.hitBitmap);
                    _this.hpBitmap.visible = true;
                    _this.hitBitmap.visible = false;
                    _this.setWidth(w);
                }, this);
                this.hpBitmap.visible = false;
            }
        }
    };
    p.setWidth = function (width) {
        width = Math.max(width, this.barW);
        this.hpBitmap.width = width;
        this.hitBitmap.width = width;
        this.effBitmap.visible = true;
        if (this.flipped) {
            this.hpBitmap.x = this.max_width - width - this.pad;
            this.hitBitmap.x = this.max_width - width - this.pad;
            this.effBitmap.scaleX = -1;
            var position = this.max_width + this.barW - width - this.pad;
            if (position > this.max_width + this.barW - this.pad) {
                position = this.max_width + this.barW - this.pad;
            }
            else if (position < this.barW + this.pad) {
                position = this.barW + this.pad;
            }
            this.effBitmap.x = position;
        }
        else {
            this.hpBitmap.x = this.pad;
            this.hitBitmap.x = this.pad;
            this.effBitmap.scaleX = 1;
            var position = width - this.barW + this.pad;
            if (position > this.max_width - this.barW - this.pad) {
                position = this.max_width - this.barW - this.pad;
            }
            else if (position < this.pad) {
                position = this.pad;
            }
            this.effBitmap.x = position;
        }
    };
    ;
    p.reset = function () {
        this.oldPercent = -1;
    };
    return RoleHPBar;
}(egret.DisplayObjectContainer));
egret.registerClass(RoleHPBar,'RoleHPBar');
//# sourceMappingURL=RoleHPBar.js.map