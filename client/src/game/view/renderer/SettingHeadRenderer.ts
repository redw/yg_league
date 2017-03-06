/**
 * Created by Administrator on 3/2 0002.
 */
class SettingHeadRenderer extends eui.ItemRenderer
{
    public constructor()
    {
        super();
        this.skinName = SettingHeadRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        EventManager.inst.addEventListener("CHANGE_HEAD",this.showSelect,this);
        for(var i:number = 0;i < 6; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            group.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onIcon,this);
        }
    }

    private onHide(event: egret.Event): void
    {
        EventManager.inst.removeEventListener("CHANGE_HEAD",this.showSelect,this);
        for(var i:number = 0;i < 6; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            group.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onIcon,this);
        }
    }

    private onIcon(e:egret.TouchEvent):void
    {
        var group:eui.Group = e.currentTarget;
        UserMethod.inst.settingHeadId = group["id"] - 88;
        EventManager.inst.dispatch("CHANGE_HEAD",UserMethod.inst.settingHeadId );
    }

    private showSelect(e:egret.Event):void
    {
        var id:number = e.data;
        var length:number = this.data.length;
        for(var i:number = 0;i < length; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            var select:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"select");
            if(id + 88 == this.data[i])
            {
                select.visible = true;
            }
            else
            {
                select.visible = false;
            }
        }
    }

    public dataChanged(): void
    {
        super.dataChanged();
        for(var i:number = 0;i < 6; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            group.visible = false;
        }

        var length:number = this.data.length;
        for(var i:number = 0;i < length; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            var select:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"select");
            var role:AutoBitmap = <AutoBitmap>DisplayUtil.getChildByName(group,"role");
            var id:number = this.data[i];
            role.source =  Global.getChaIcon(id);
            group["id"] = id;
            group.visible = true;
            select.visible = false;

            if(UserMethod.inst.settingHeadId + 88 == id)
            {
                select.visible = true;
            }
        }
    }
}