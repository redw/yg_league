/**
 * 进度条
 * @author j
 * 2016/7/21
 */
var ProgressBar = (function (_super) {
    __extends(ProgressBar, _super);
    function ProgressBar() {
        _super.call(this);
    }
    var d = __define,c=ProgressBar,p=c.prototype;
    p.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.imageProgress_2.mask = new egret.Rectangle();
    };
    d(p, "label",undefined
        ,function (value) {
            this.labelProgress.text = value;
        }
    );
    d(p, "value",undefined
        ,function (value) {
            this.imageProgress.mask = new egret.Rectangle(0, 0, Math.min(this.width, value * this.width), this.height);
        }
    );
    d(p, "value_2",undefined
        ,function (value) {
            this.imageProgress_2.mask = new egret.Rectangle(0, 0, Math.min(this.width, value * this.width), this.height);
        }
    );
    return ProgressBar;
}(eui.Component));
egret.registerClass(ProgressBar,'ProgressBar');
