/**
 * CheckBox
 * @author j
 * 2016/1/13
 */
class CheckBox extends eui.Component
{
    public imageBg:eui.Image;
    public imageGrayBg:eui.Image;
    public imageSelect:eui.Image;
    public imageGraySelect:eui.Image;
    public labelText:eui.Label;

    public isEnabled:boolean = true;

    public constructor()
    {
        super();
    }

    public childrenCreated():void
    {
        this.setEnabled(true);
        super.childrenCreated();
    }

    public setEnabled(bool:boolean)
    {
        this.isEnabled = bool;

        this.touchEnabled = this.isEnabled;
        this.touchChildren = this.isEnabled;

        this.imageBg.visible = this.isEnabled == true;
        this.imageGrayBg.visible = this.isEnabled == false;
        this.imageSelect.visible = this.isEnabled == true;
        this.imageGraySelect.visible = this.isEnabled == false;

        if (this.isEnabled)
        {
            this.labelText.textColor = 0xF8F6C4;
            this.labelText.strokeColor = 0x6b2407;
        }
        else
        {
            this.labelText.textColor = 0x154963;
            this.labelText.strokeColor = 0x333333;
        }
    }

    public getEnabled():boolean
    {
        return this.isEnabled;
    }

    public setSelect(bool:boolean)
    {
        this.imageSelect.visible = bool;
    }

    public getSelect():boolean
    {
        return this.imageSelect.visible;
    }

    public setLabel(value:string)
    {
        this.labelText.text = value;
    }

    public getLabel():string
    {
        return this.labelText.text;
    }

    public setColor(value:number)
    {
        this.labelText.textColor = value;
    }

    public getColor():number
    {
        return this.labelText.textColor;
    }
}