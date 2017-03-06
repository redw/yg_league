/**
 * Tips工具
 * by Fraser
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var TipsUtils;
(function (TipsUtils) {
    //从下到上弹出
    function showTipsDownToUp(str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var notice = new egret.TextField();
        notice.size = 24;
        notice.y = Global.getStageHeight() / 2;
        notice.textColor = isWarning ? 0xff0000 : 0x00ff00;
        notice.alpha = 0;
        notice.text = str;
        notice.strokeColor = 0x000000;
        notice.x = Global.getStageWidth() / 2 - notice.width / 2;
        notice.stroke = 2;
        notice.bold = true;
        notice.textAlign = egret.HorizontalAlign.CENTER;
        //
        var layer = PanelManager.inst.getLayer(PanelManager.ALERT_LAYER);
        layer.addChild(notice);
        //
        egret.Tween.get(notice).to({
            y: notice.y - 120,
            alpha: 1
        }, 800, egret.Ease.backOut).call(function () {
            egret.Tween.get(notice).to({ alpha: 0 }, 500).call(function () {
                DisplayUtil.removeFromParent(notice);
            }, this);
        }, this);
    }
    TipsUtils.showTipsDownToUp = showTipsDownToUp;
    //从左至右 或者 从右至左
    function showTipsLeftOrRight(str, isWarning, isFromeLeft) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        if (isFromeLeft === void 0) { isFromeLeft = true; }
        var notice = new egret.TextField();
        notice.size = 24;
        notice.y = Global.getStageHeight() / 2;
        notice.textColor = isWarning ? 0xff0000 : 0x00ff00;
        notice.alpha = 0;
        notice.text = str;
        notice.strokeColor = 0x000000;
        if (isFromeLeft) {
            notice.x = -notice.width;
        }
        else {
            notice.x = Global.getStageWidth();
        }
        notice.stroke = 2;
        notice.bold = true;
        notice.textAlign = egret.HorizontalAlign.CENTER;
        var layer = PanelManager.inst.getLayer(PanelManager.ALERT_LAYER);
        layer.addChild(notice);
        if (isFromeLeft) {
            egret.Tween.get(notice).to({
                x: Global.getStageWidth() / 2 - notice.width / 2 - 50,
                alpha: 1
            }, 300, egret.Ease.sineInOut).call(function () {
                egret.Tween.get(notice).to({ x: notice.x + 100 }, 500).call(function () {
                    egret.Tween.get(notice).to({ x: Global.getStageWidth() }, 300, egret.Ease.sineIn).call(function () {
                        DisplayUtil.removeFromParent(notice);
                    }, this);
                }, this);
            }, this);
        }
        else {
            egret.Tween.get(notice).to({
                x: Global.getStageWidth() / 2 - notice.width / 2 + 50,
                alpha: 1
            }, 300, egret.Ease.sineInOut).call(function () {
                egret.Tween.get(notice).to({ x: notice.x - 100 }, 500).call(function () {
                    egret.Tween.get(notice).to({ x: -notice.width }, 300, egret.Ease.sineIn).call(function () {
                        DisplayUtil.removeFromParent(notice);
                    }, this);
                }, this);
            }, this);
        }
    }
    TipsUtils.showTipsLeftOrRight = showTipsLeftOrRight;
    //从里到外
    function showTipsFromCenter(str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var notice = new egret.TextField();
        notice.size = 24;
        notice.y = Global.getStageHeight() / 2;
        notice.textColor = isWarning ? 0xff0000 : 0x00ff00;
        notice.alpha = 0;
        notice.text = str;
        notice.strokeColor = 0x000000;
        notice.x = Global.getStageWidth() / 2;
        notice.stroke = 2;
        notice.bold = true;
        notice.textAlign = egret.HorizontalAlign.CENTER;
        var layer = PanelManager.inst.getLayer(PanelManager.ALERT_LAYER);
        layer.addChild(notice);
        notice.anchorOffsetX = notice.width / 2;
        notice.anchorOffsetY = notice.height / 2;
        notice.scaleX = 0;
        notice.scaleY = 0;
        //
        egret.Tween.get(notice).to({
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        }, 200).wait(1000).call(function () {
            egret.Tween.get(notice).to({ alpha: 0 }, 500).call(function () {
                DisplayUtil.removeFromParent(notice);
            }, this);
        }, this);
    }
    TipsUtils.showTipsFromCenter = showTipsFromCenter;
    //从外到里
    function showTipsBigToSmall(str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var notice = new egret.TextField();
        notice.size = 24;
        notice.y = Global.getStageHeight() / 2;
        notice.textColor = isWarning ? 0xff0000 : 0x00ff00;
        notice.alpha = 0;
        notice.text = str;
        notice.strokeColor = 0x000000;
        notice.x = Global.getStageWidth() / 2;
        notice.stroke = 2;
        notice.bold = true;
        notice.textAlign = egret.HorizontalAlign.CENTER;
        var layer = PanelManager.inst.getLayer(PanelManager.ALERT_LAYER);
        layer.addChild(notice);
        notice.anchorOffsetX = notice.width / 2;
        notice.anchorOffsetY = notice.height / 2;
        notice.scaleX = 4;
        notice.scaleY = 4;
        egret.Tween.get(notice).to({
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        }, 200).wait(1000).call(function () {
            egret.Tween.get(notice).to({ alpha: 0 }, 500).call(function () {
                DisplayUtil.removeFromParent(notice);
            }, this);
        }, this);
    }
    TipsUtils.showTipsBigToSmall = showTipsBigToSmall;
})(TipsUtils || (TipsUtils = {}));
