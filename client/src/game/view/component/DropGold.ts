/**
 * 掉落金币显示
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
class DropGold extends egret.DisplayObjectContainer
{
    private _center:egret.Point;
    private _endPos:egret.Point;
    private _jumpPos:egret.Point;
    private _view: AutoBitmap ;
    private _isFly:boolean;
    private _isHide:boolean;
    private _isSuperScale:number;

    public constructor(xpos: number,ypos: number,isSuper: number = 0.6,isFly: boolean = true,isBoss: boolean = false,isHide:boolean = false)
    {
        super();
        
        this._view = new AutoBitmap();
        this._view.source = "drop_gold1";
        this.addChild(this._view);
        var range: number = isSuper;//? 1 : 0.6;
        this._view.scaleX = range;
        this._view.scaleY = range;
        
        this._center = new egret.Point(xpos, ypos);
        var pos: number = isSuper>=1 ? 200 : 160;
        if(isBoss)
        {
            pos = 400;
        }
        this._endPos = new egret.Point(this._center.x + Math.floor(Math.random() * pos - pos / 2),this._center.y);
        this._jumpPos = new egret.Point((this._center.x + this._endPos.x) / 2,this._center.y - pos);
        this._isFly = isFly;
        this._isSuperScale = isSuper;
        this._isHide = isHide;
        
        this.x = this._center.x;
        this.y = this._center.y ;
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height;
        this.rotation = Math.floor(Math.random() * 80) - 40;

        this.factor = 0;
        
        egret.Tween.get(this).to({ factor: 1 },MathUtil.rangeRandom(400,900)).call(this.dropDown,this);
        egret.setTimeout(this.dropOver,this,1100);
        
    }
    
    private dropDown(): void 
    {
        this._view.source = "drop_gold2";
        var self = this;
//        MovieClipUtils.createMovieClip(Global.getEffectURL("gold_shine"),"effect",afterAdd,this);
//        function afterAdd(data): void 
//        {
//            var shine: egret.MovieClip = data;
//            shine.x = 0;
//            shine.y = 0;
//            
//            shine.scaleX = self._isSuperScale ;//? 1 : 0.6;
//            shine.scaleY = self._isSuperScale;// ? 1 : 0.6;
//            self.addChild(shine);
//            MovieClipUtils.playMCOnce(shine,function(): void
//            {
//                DisplayUtil.removeFromParent(shine);
//            },this);
//        }
      
    }

    private dropOver():void
    {
        if (this._isFly)
        {
            if (this.stage)
            {
                var globalPos:egret.Point = this.localToGlobal(0, 0);
                this.x = globalPos.x;
                this.y = globalPos.y;
            }
            else
            {
                this.alpha = 0.7;
                this.x = Global.getStageWidth() / 2;
                this.y = Global.getStageHeight()  - 20;
            }
            Global.getStage().addChild(this);
            egret.Tween.get(this).to({ x: Global.getStageWidth() - 20, y: 20, alpha: 0}, 300).call(function()
            {
                DisplayUtil.removeFromParent(this);
            }, this);
        }
        else
        {
            if(!this._isHide)
            {
                egret.Tween.get(this).to({ alpha: 0 },300).call(function() 
                {
                    DisplayUtil.removeFromParent(this);
                },this);
            }
            
        }
    }

    get factor():number
    {
        return 0;
    }

    set factor(value:number)
    {
        this.x = (1 - value) * (1 - value) * this._center.x + 2 * value * (1 - value) * this._jumpPos.x + value * value * this._endPos.x;
        this.y = (1 - value) * (1 - value) * this._center.y + 2 * value * (1 - value) * this._jumpPos.y + value * value * this._endPos.y;
    }
}