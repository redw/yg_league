/**
 * 特效工具
 * @author j
 * 2016/2/19
 */
module EffectUtil
{
    export function playJumpEffect(view:any, offsetY:number):void
    {
        if (!view._play_effecting)
        {
            view._play_effecting = true;
            view.measure();

            var lastY:number = view.y;

            egret.Tween.get(view).to({y: lastY - offsetY}, 200, egret.Ease.sineIn).to({y: lastY}, 500, egret.Ease.bounceOut).call(function():void
            {
                view._play_effecting = false;
            }, view);
        }
    }

    export function stopScaleEffect(view:any):void{
        view._play_effecting = false;
        egret.Tween.removeTweens(view);
    }

    export function playScaleEffect(view:any, scale:number,loop:boolean = false):void
    {
        if (!view._play_effecting)
        {
            view._play_effecting = true;
            view.measure();

            var lastX:number = view.x;
            var lastY:number = view.y;
            var lastScaleX:number = view.scaleX;
            var lastScaleY:number = view.scaleY;

            egret.Tween.get(view).to({scaleX: lastScaleX * scale, scaleY: lastScaleY * scale, x: lastX + view.width * (1 - scale) / 2, y: lastY + view.height * (1 - scale) / 2}, 100, egret.Ease.sineIn).call(function():void
            {
                egret.Tween.get(view).to({scaleX: lastScaleX, scaleY: lastScaleY, x: lastX, y: lastY}, 100).call(function():void
                {
                    view._play_effecting = false;
                    if(loop){
                        EffectUtil.playScaleEffect(view,scale,loop) ;
                    }
                }, this);
            }, this);
        }
    }

    export function playLabelColorEffect(view:eui.Label, color:number = 0xffffff, toColor:number = 0xff0000, time:number = 3):void
    {
        if (time > 0)
        {
            egret.Tween.removeTweens(view);

            egret.Tween.get(view).wait(150).to({textColor: toColor}, 0).wait(150).to({textColor: color}, 0).call(function()
            {
                playLabelColorEffect(view, color, toColor, time - 1);
            }, this);
        }
    }
}