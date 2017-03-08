/**
 * 角色血条栏
 * Created by hh on 2016/12/26.
 */
class RoleHPBar extends egret.DisplayObjectContainer {
    private backGround:AutoBitmap;
    private hitBitmap:AutoBitmap;
    private hpBitmap:AutoBitmap;
    private effBitmap:AutoBitmap;

    private flipped:boolean;
    private pad:number = 1;
    private barW:number = 10;
    private max_width:number = 62;
    private oldPercent:number = -1;

    public isCanRemove:boolean = false;

    public constructor(flipped:boolean) {
        super();
        this.flipped = flipped;
        this.drawBackground();
        this.drawHealthBar();
    }

    private drawBackground(){
        this.backGround = new AutoBitmap();
        this.addChild(this.backGround);
        this.backGround.source = "pvp_blood_background_png";
    }

    private drawHealthBar(){
        this.hpBitmap = new AutoBitmap();
        if (this.flipped) {
            this.hpBitmap.source = "pvp_blood_enemy_png";
        } else {
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
    }

    public active(flipped:boolean){
        this.flipped = flipped;
        this.isCanRemove = false;
        this.effBitmap.visible = true;
        if (this.flipped) {
            this.hpBitmap.source = "pvp_blood_png";
        } else {
            this.hpBitmap.source = "pvp_blood_enemy_png";
        }
        this.setWidth(this.max_width - this.pad * 2);
    }

    public update(cur:string, max:string) {
        let ratio = +(BigNum.div(cur, max)) || 0;
        this.setProgress(ratio);
    }

    public setProgress(value:number){
        let w = MathUtil.clamp(value, 0, 1) * (this.max_width - this.pad * 2);
        if (this.oldPercent != w) {
            if (this.oldPercent < 0) {
                this.oldPercent = value;
                this.hpBitmap.visible = true;
                this.effBitmap.visible = true;
                this.isCanRemove = true;
                this.setWidth(w);
            } else {
                this.hitBitmap.visible = true;
                this.hitBitmap.alpha = 0.8;
                this.effBitmap.visible = false;
                let tween = egret.Tween.get(this.hitBitmap);
                tween.to({alpha:1}, 80);
                tween.to({alpha:0.4}, 80);
                tween.call(()=>{
                    egret.Tween.removeTweens(this.hitBitmap);
                    this.hpBitmap.visible = true;
                    this.hitBitmap.visible = false;
                    this.setWidth(w);
                }, this);
                this.hpBitmap.visible = false;
            }
        }
    }

    public setPercent = function(value:number){
        if (this.oldPercent != value) {
            value = Math.max(0, value);
            value = Math.min(value, 100);
            var newWidth =  (value * (this.max_width - 2 * this.pad)) / 100;
            this.setWidth(newWidth);
        }
    };

    public setWidth(width:number){
        width = Math.max(width, this.barW);
        this.hpBitmap.width = width;
        this.hitBitmap.width = width;
        this.effBitmap.visible = true;
        if (this.flipped) {
            this.hpBitmap.x = this.pad;
            this.hitBitmap.x = this.pad;
            this.effBitmap.scaleX = 1;
            let position = width - this.barW + this.pad;
            if (position > this.max_width - this.barW - this.pad ) {
                position = this.max_width - this.barW - this.pad;
            } else if (position < this.pad) {
                position = this.pad;
            }
            this.effBitmap.x = position;
        } else {
            this.hpBitmap.x = this.max_width - width - this.pad;
            this.hitBitmap.x = this.max_width - width - this.pad;
            this.effBitmap.scaleX = -1;
            let position = this.max_width + this.barW - width - this.pad;
            if (position > this.max_width + this.barW - this.pad ) {
                position = this.max_width + this.barW - this.pad;
            } else if (position < this.barW + this.pad) {
                position = this.barW + this.pad;
            }
            this.effBitmap.x = position;
        }
    };

    public reset(){
        this.oldPercent = -1;
    }
}