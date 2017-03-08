/**
 * 特效工具
 * @author j
 * 2016/2/19
 */
var EffectUtil;
(function (EffectUtil) {
    function playJumpEffect(view, offsetY) {
        if (!view._play_effecting) {
            view._play_effecting = true;
            view.measure();
            var lastY = view.y;
            egret.Tween.get(view).to({ y: lastY - offsetY }, 200, egret.Ease.sineIn).to({ y: lastY }, 500, egret.Ease.bounceOut).call(function () {
                view._play_effecting = false;
            }, view);
        }
    }
    EffectUtil.playJumpEffect = playJumpEffect;
    function stopScaleEffect(view) {
        view._play_effecting = false;
        egret.Tween.removeTweens(view);
    }
    EffectUtil.stopScaleEffect = stopScaleEffect;
    function playScaleEffect(view, scale, loop) {
        if (loop === void 0) { loop = false; }
        if (!view._play_effecting) {
            view._play_effecting = true;
            view.measure();
            var lastX = view.x;
            var lastY = view.y;
            var lastScaleX = view.scaleX;
            var lastScaleY = view.scaleY;
            egret.Tween.get(view).to({ scaleX: lastScaleX * scale, scaleY: lastScaleY * scale, x: lastX + view.width * (1 - scale) / 2, y: lastY + view.height * (1 - scale) / 2 }, 100, egret.Ease.sineIn).call(function () {
                egret.Tween.get(view).to({ scaleX: lastScaleX, scaleY: lastScaleY, x: lastX, y: lastY }, 100).call(function () {
                    view._play_effecting = false;
                    if (loop) {
                        EffectUtil.playScaleEffect(view, scale, loop);
                    }
                }, this);
            }, this);
        }
    }
    EffectUtil.playScaleEffect = playScaleEffect;
    function playLabelColorEffect(view, color, toColor, time) {
        if (color === void 0) { color = 0xffffff; }
        if (toColor === void 0) { toColor = 0xff0000; }
        if (time === void 0) { time = 3; }
        if (time > 0) {
            egret.Tween.removeTweens(view);
            egret.Tween.get(view).wait(150).to({ textColor: toColor }, 0).wait(150).to({ textColor: color }, 0).call(function () {
                playLabelColorEffect(view, color, toColor, time - 1);
            }, this);
        }
    }
    EffectUtil.playLabelColorEffect = playLabelColorEffect;
})(EffectUtil || (EffectUtil = {}));
