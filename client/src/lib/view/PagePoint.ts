/**
 * 翻页的点
 * @author j
 * 2016/1/15
 */
class PagePoint extends egret.Sprite
{
    private static POINT_RADIUS:number = 12;
    private static POINT_GAP:number = 8;

    private index:number = 0;
    private length:number = 0;
    private pointList:AutoBitmap[] = [];

    public constructor()
    {
        super();
    }

    public setIndex(value:number):void
    {
        this.index = value;
        this.updatePoint();
    }

    public setLength(value:number):void
    {
        this.length = value;

        while (this.length > this.pointList.length)
        {
            var point:AutoBitmap = new AutoBitmap();
            this.addChild(point);
            this.pointList.push(point);
        }
        while (this.length < this.pointList.length)
        {
            var point:AutoBitmap = this.pointList.shift();
            DisplayUtil.removeFromParent(point);
        }

        for (var i:number = 0; i < this.pointList.length; i++)
        {
            var point:AutoBitmap = this.pointList[i];
            point.x = i * (PagePoint.POINT_RADIUS + PagePoint.POINT_GAP) - (this.pointList.length * (PagePoint.POINT_RADIUS + PagePoint.POINT_GAP) - PagePoint.POINT_GAP) / 2;
            point.y = -PagePoint.POINT_RADIUS / 2;
        }

        this.updatePoint();
    }

    private updatePoint():void
    {
        for (var i:number = 0; i < this.pointList.length; i++)
        {
            var point:AutoBitmap = this.pointList[i];

            if (i == this.index)
            {
                point.source = "page_point_2_png";
            }
            else
            {
                point.source = "page_point_1_png";
            }
        }
    }
}