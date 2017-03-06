/**
 * Created by Administrator on 2/20 0020.
 */
class MineInRoleRenderer extends eui.ItemRenderer
{
    public constructor()
    {
        super();
        this.skinName = MineInRoleRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event: egret.Event): void
    {
        EventManager.inst.addEventListener(ContextEvent.MINE_NEED_UP,this.needShake,this);
        for(var i:number = 0;i < 6; i++)
        {
            var icon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this,"role" + i);
            icon.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onIcon,this);
        }
    }

    private onHide(event: egret.Event): void
    {
        EventManager.inst.removeEventListener(ContextEvent.MINE_NEED_UP,this.needShake,this);
        for(var i:number = 0;i < 6; i++)
        {
            var icon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this,"role" + i);
            icon.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onIcon,this);
        }
    }

    private needShake(e:egret.Event):void
    {
        for(var i:number = 0;i < 6; i++)
        {
            var icon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this,"role" + i);
            egret.Tween.get(icon,{loop:true}).to({rotation:-10},100).to({rotation:0},100).to({rotation:10},100).to({rotation:0},100);
        }
    }

    private stopShake():void
    {
        for(var i:number = 0;i < 6; i++)
        {
            var icon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this,"role" + i);
            egret.Tween.removeTweens(icon);
        }
    }

    private onIcon(e:egret.TouchEvent):void
    {
        var icon:RoleIcon = e.currentTarget;
        this.stopShake();
        EventManager.inst.dispatch(ContextEvent.MINE_UP_CHANGE,icon["id"]);

    }

    public dataChanged(): void
    {
        super.dataChanged();
        for(var i:number = 0;i < 6; i++)
        {
            var icon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this,"role" + i);
            icon.visible = false;
        }

        var length:number = this.data.length;
        for(var i:number = 0;i < length; i++)
        {
            var icon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(this,"role" + i);
            icon.visible = true;

            var id:number = this.data[i];
            var roleData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
            icon.imgIcon = Global.getChaIcon(id);
            icon["id"] = id;
            icon.setStar = roleData.starLevel;
            icon.setLv = 0;

        }

    }
}