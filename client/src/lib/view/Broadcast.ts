/**
 * 广播
 * @author j
 * 2016/5/26
 */
class Broadcast extends egret.HashObject
{
    private static TICKER_DELAY:number = 1000 / 60;

    private static list:any[] = [];
    private static isShowing:boolean = false;

    public static show(text:any, root?:egret.DisplayObjectContainer): void
    {
        if (root == null)
        {
            root = Global.getStage();
        }

        Broadcast.list.push({text: text, root: root});
        Broadcast.next();
    }

    private static next(): void
    {
        if (Broadcast.isShowing == false)
        {
            if (Broadcast.list.length > 0)
            {
                new Broadcast(Broadcast.list.shift());
            }
        }
    }

    private root:egret.Sprite;
    private text:egret.TextField;

    public constructor(data:any)
    {
        super();
        Broadcast.isShowing = true;

        this.root = new egret.Sprite();
        this.root.y = 115;
        data["root"].addChild(this.root);

        var bg:AutoBitmap = new AutoBitmap();
        bg.x = 100;
        bg.width = 280;
        bg.scale9Grid = new egret.Rectangle(20, 6, 40, 10);
        bg.source = "txt_bg_7_png";
        this.root.addChild(bg);

        var icon:AutoBitmap = new AutoBitmap();
        icon.x = 120;
        icon.y = 4;
        icon.source = "boardcast_icon_png";
        this.root.addChild(icon);

        this.text = new egret.TextField();
        this.text.x = 360;
        this.text.y = 8;
        this.text.size = 16;
        this.text.bold = true;
        this.text.textColor = 0xffffcc;
        this.text.stroke = 2;
        this.text.strokeColor = 0x6b2407;
        this.text.fontFamily = "微软雅黑";
        this.root.addChild(this.text);

        if (typeof(data["text"]) == "string")
        {
            this.text.text = data["text"];
        }
        else
        {
            this.text.textFlow = data["text"];
        }

        TickerUtil.register(this.onTick, this, Broadcast.TICKER_DELAY);
        this.onTick();
    }

    private onTick():void
    {
        this.text.x = this.text.x - 2;
        this.text.mask = new egret.Rectangle(150 - this.text.x, 0, 210, 16);

        if (this.text.x + this.text.textWidth < 150)
        {
            TickerUtil.unregister(this.onTick, this);
            DisplayUtil.removeFromParent(this.root);

            Broadcast.isShowing = false;
            Broadcast.next();
        }
    }
}