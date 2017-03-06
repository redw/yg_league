/**
 * 显示对象工具
 * @author j
 *
 */
module DisplayUtil
{
    export function createMask(alpha?:number):eui.Image
    {
        if (alpha == null)
        {
            alpha = 0.6;
        }

        var model:eui.Image = new eui.Image();
        model.source = "guide_gray_png";
        model.x = 0;
        model.y = 0;
        model.alpha = alpha;
        model.width =  Global.getStageWidth();
        model.height = Global.getStageHeight();
        model.touchEnabled  = true;
        return model;

       /* var sprite:egret.Sprite = new egret.Sprite();
        sprite.graphics.beginFill(0, alpha);
        sprite.graphics.drawRect(0, 0, Global.getStageWidth(), Global.getStageHeight());
        sprite.graphics.endFill();
        sprite.touchEnabled  = true;
        sprite.touchChildren = false;
        return sprite;*/
    }

    export function removeFromParent(displayObject:egret.DisplayObject):void
    {
        if (displayObject && displayObject.parent)
        {
            displayObject.parent.removeChild(displayObject);
        }
    }

    export function removeAllChildren(displayObjectContainer:egret.DisplayObjectContainer):void
    {
        while (displayObjectContainer.numChildren > 0)
        {
            displayObjectContainer.removeChildAt(0);
        }
    }

    export function getChildByName(parent:egret.DisplayObjectContainer, name:string):egret.DisplayObject
    {
        for (var i:number = 0; i < parent.numChildren; i++)
        {
            var child:egret.DisplayObject = parent.getChildAt(i);

            if (child.name == name)
            {
                return child;
            }
        }
        return null;
    }

    export function depthSortChildren(container:egret.DisplayObjectContainer):void
    {
        var len:number = container.numChildren;
        var arr:any[] = [];

        for (var i:number = 0; i < len; i++)
        {
            arr.push(container.getChildAt(i));
        }

        arr.sort(function(child_1:egret.DisplayObject, child_2:egret.DisplayObject):number
        {
            if (child_1.y != child_2.y)
            {
                return child_1.y - child_2.y;
            }
            return child_1.x - child_2.x
        });

        for (i = 0; i < len; i++)
        {
            var child:any = arr[i];

            if (container.getChildAt(i) == child)
            {
                continue;
            }
            container.setChildIndex(child, i);
        }
    }
}