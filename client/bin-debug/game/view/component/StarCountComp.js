/**
 * 星数
 * Created by hh on 2017/2/28.
 */
var StarCountComp = (function (_super) {
    __extends(StarCountComp, _super);
    function StarCountComp() {
        _super.call(this);
        this.starBgImg = new eui.Image();
        this.starBgImg.source = "imageStar";
        this.addChild(this.starBgImg);
        this.starCountTxt = new eui.Label();
        this.addChild(this.starCountTxt);
        this.starCountTxt.textColor = 0x583C26;
        this.starCountTxt.fontFamily = "微软雅黑";
        this.starCountTxt.size = 14;
        this.starCountTxt.bold = true;
        this.starCountTxt.x = -8;
        this.starCountTxt.width = 16;
    }
    var d = __define,c=StarCountComp,p=c.prototype;
    d(p, "count",undefined
        ,function (value) {
            this.visible = value <= 0;
            this.starCountTxt.text = value + "";
        }
    );
    return StarCountComp;
}(egret.DisplayObjectContainer));
egret.registerClass(StarCountComp,'StarCountComp');
//# sourceMappingURL=StarCountComp.js.map