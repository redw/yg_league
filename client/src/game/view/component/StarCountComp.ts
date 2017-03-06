/**
 * 星数
 * Created by hh on 2017/2/28.
 */
class StarCountComp extends egret.DisplayObjectContainer {
    private starBgImg:eui.Image;
    private starCountTxt:eui.Label;

    public constructor(){
        super();

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

    public set count(value:number) {
        this.visible = value <= 0;
        this.starCountTxt.text = value + "";
    }
}