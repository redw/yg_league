/**
 * Tips工具
 * by Fraser
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
module TipsUtils
{
    //从下到上弹出
    export function showTipsDownToUp(str:string = "", isWarning:boolean = false):void
    {
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
        var layer:eui.Group = PanelManager.inst.getLayer(PanelManager.ALERT_LAYER);
        layer.addChild(notice);
        //
        egret.Tween.get(notice).to({
            y: notice.y - 120,
            alpha: 1
        }, 800, egret.Ease.backOut).call(function ():void
        {
            egret.Tween.get(notice).to({alpha: 0}, 500).call(function ():void
            {
                DisplayUtil.removeFromParent(notice);
            }, this);
        }, this);
    }

    //从左至右 或者 从右至左
    export function showTipsLeftOrRight(str:string = "", isWarning:boolean = false, isFromeLeft:boolean = true):void
    {
        var notice = new egret.TextField();

        notice.size = 24;
        notice.y = Global.getStageHeight() / 2;
        notice.textColor = isWarning ? 0xff0000 : 0x00ff00;
        notice.alpha = 0;

        notice.text = str;
        notice.strokeColor = 0x000000;
        if (isFromeLeft)
        {
            notice.x = -notice.width;
        }
        else
        {
            notice.x = Global.getStageWidth();
        }
        notice.stroke = 2;
        notice.bold = true;
        notice.textAlign = egret.HorizontalAlign.CENTER;

        var layer:eui.Group = PanelManager.inst.getLayer(PanelManager.ALERT_LAYER);
        layer.addChild(notice);

        if (isFromeLeft)
        {
            egret.Tween.get(notice).to({
                x: Global.getStageWidth() / 2 - notice.width / 2 - 50,
                alpha: 1
            }, 300, egret.Ease.sineInOut).call(function ():void
            {
                egret.Tween.get(notice).to({x: notice.x + 100}, 500).call(
                    function ():void
                    {
                        egret.Tween.get(notice).to({x: Global.getStageWidth()}, 300, egret.Ease.sineIn).call(function ():void
                        {
                            DisplayUtil.removeFromParent(notice);
                        }, this);
                    }, this
                );
            }, this);
        }
        else
        {
            egret.Tween.get(notice).to({
                x: Global.getStageWidth() / 2 - notice.width / 2 + 50,
                alpha: 1
            }, 300, egret.Ease.sineInOut).call(function ():void
            {
                egret.Tween.get(notice).to({x: notice.x - 100}, 500).call(function ():void
                {
                    egret.Tween.get(notice).to({x: -notice.width}, 300, egret.Ease.sineIn).call(function ():void
                    {
                        DisplayUtil.removeFromParent(notice);
                    }, this);
                }, this);
            }, this)
        }
    }

    //从里到外
    export function showTipsFromCenter(str:string = "", isWarning:boolean = false):void
    {
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

        var layer:eui.Group = PanelManager.inst.getLayer(PanelManager.ALERT_LAYER);
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
        }, 200).wait(1000).call(
            function ():void
            {
                egret.Tween.get(notice).to({alpha: 0}, 500).call(function ():void
                {
                    DisplayUtil.removeFromParent(notice);
                }, this);
            }, this
        )
    }

    //从外到里
    export function showTipsBigToSmall(str:string = "", isWarning:boolean = false):void
    {
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

        var layer:eui.Group = PanelManager.inst.getLayer(PanelManager.ALERT_LAYER);
        layer.addChild(notice);

        notice.anchorOffsetX = notice.width / 2;
        notice.anchorOffsetY = notice.height / 2;
        notice.scaleX = 4;
        notice.scaleY = 4;

        egret.Tween.get(notice).to({
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        }, 200).wait(1000).call(
            function ():void
            {
                egret.Tween.get(notice).to({alpha: 0}, 500).call(function ():void
                {
                    DisplayUtil.removeFromParent(notice);
                }, this);
            },
            this
        );
    }
}