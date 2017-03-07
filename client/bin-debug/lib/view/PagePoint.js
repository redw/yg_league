/**
 * 翻页的点
 * @author j
 * 2016/1/15
 */
var PagePoint = (function (_super) {
    __extends(PagePoint, _super);
    function PagePoint() {
        _super.call(this);
        this.index = 0;
        this.length = 0;
        this.pointList = [];
    }
    var d = __define,c=PagePoint,p=c.prototype;
    p.setIndex = function (value) {
        this.index = value;
        this.updatePoint();
    };
    p.setLength = function (value) {
        this.length = value;
        while (this.length > this.pointList.length) {
            var point = new AutoBitmap();
            this.addChild(point);
            this.pointList.push(point);
        }
        while (this.length < this.pointList.length) {
            var point = this.pointList.shift();
            DisplayUtil.removeFromParent(point);
        }
        for (var i = 0; i < this.pointList.length; i++) {
            var point = this.pointList[i];
            point.x = i * (PagePoint.POINT_RADIUS + PagePoint.POINT_GAP) - (this.pointList.length * (PagePoint.POINT_RADIUS + PagePoint.POINT_GAP) - PagePoint.POINT_GAP) / 2;
            point.y = -PagePoint.POINT_RADIUS / 2;
        }
        this.updatePoint();
    };
    p.updatePoint = function () {
        for (var i = 0; i < this.pointList.length; i++) {
            var point = this.pointList[i];
            if (i == this.index) {
                point.source = "page_point_2_png";
            }
            else {
                point.source = "page_point_1_png";
            }
        }
    };
    PagePoint.POINT_RADIUS = 12;
    PagePoint.POINT_GAP = 8;
    return PagePoint;
}(egret.Sprite));
egret.registerClass(PagePoint,'PagePoint');
//# sourceMappingURL=PagePoint.js.map