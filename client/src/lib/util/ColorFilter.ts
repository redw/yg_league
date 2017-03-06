/**
 * 颜色滤镜
 * @author j
 * 2016/11/4
 */
module ColorFilter
{
    /**
     * 去色
     */
    export function getDecolorFilter():egret.ColorMatrixFilter
    {
        return new egret.ColorMatrixFilter([
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0]);
    }

    /**
     * 色调
     * strength 0~100
     * r 0~255
     * g 0~255
     * b 0~255
     */
    export function getHueFilter(strength:number, r:number, g:number, b:number):egret.ColorMatrixFilter
    {
        strength = MathUtil.clamp(strength, 0, 100) / 100;
        r = MathUtil.clamp(r, 0, 255);
        g = MathUtil.clamp(g, 0, 255);
        b = MathUtil.clamp(b, 0, 255);

        return new egret.ColorMatrixFilter([
            1 - strength, 0, 0, 0, r * strength,
            0, 1 - strength, 0, 0, g * strength,
            0, 0, 1 - strength, 0, b * strength,
            0, 0, 0, 1, 0]);
    }
}