/**
 * Created by Administrator on 12/21 0021.
 */
class PVPFormation extends eui.Component
{
    public mainRoleGroup:eui.Group;

    private _roleNumbers:number[] = [];
    private _lastSelectName:string = null;

    public constructor()
    {
        super();
        this.skinName = PVPFormationSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        var hadHero:any[] =  UserProxy.inst.heroData.getHeroIds();
        for(var c in hadHero)
        {
            var id:number = parseInt(hadHero[c]);
            var hero:any = UserProxy.inst.heroData.getHeroData(id);
            if(hero.starLevel)
            {
                this._roleNumbers.push(id);
            }
        }

        var length:number = this._roleNumbers.length;
        for(var i:number = 0; i < length; i++)
        {
            var roleGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.mainRoleGroup,"role" + (i+1));
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(roleGroup,"group");
            var roleIcon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(group,"roleIcon");
            var battled:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"battled");
            roleGroup.visible = true;
            roleIcon.setLv = 0;
            var roleData = UserProxy.inst.heroData.getHeroData(this._roleNumbers[i]);
            roleIcon.setStar = roleData.starLevel;
            roleIcon.imgIcon = Global.getChaIcon(this._roleNumbers[i]);
            roleGroup["id"] = this._roleNumbers[i];

            if(UserMethod.inst.pvp_up_arr.indexOf(this._roleNumbers[i]) > -1)
            {
                battled.visible = true;
            }
            else
            {
                battled.visible = false;
            }

            roleGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSelect,this);
        }
        EventManager.inst.addEventListener(ContextEvent.PVP_CHANGE_END,this.ChangeEnd,this);
        EventManager.inst.addEventListener(ContextEvent.PVP_BATTLE_DOWN,this.changeDown,this);
    }

    private onHide(event:egret.Event):void
    {
        var length:number = this._roleNumbers.length;
        for(var i:number = 0; i < length; i++)
        {
            var roleGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.mainRoleGroup,"role" + (i+1));
            roleGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSelect,this);
        }
        EventManager.inst.removeEventListener(ContextEvent.PVP_CHANGE_END,this.ChangeEnd,this);
        EventManager.inst.removeEventListener(ContextEvent.PVP_BATTLE_DOWN,this.changeDown,this);
    }

    private onSelect(e:egret.TouchEvent):void
    {
        var id:number = parseInt(e.currentTarget["id"]);
        if(UserMethod.inst.pvp_up_arr.indexOf(id) > -1)
        {
            return;
        }

        if(this._lastSelectName)
        {
            var roleGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.mainRoleGroup,this._lastSelectName);
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(roleGroup,"group");
            var battled:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"battled");
            battled.visible = false;
            DisplayUtil.removeFromParent(group.getChildByName("select"));
            egret.Tween.removeTweens(group);
            group.rotation = 0;

            if(this._lastSelectName == e.currentTarget.name)
            {
                this._lastSelectName = null;
                EventManager.inst.dispatch(ContextEvent.PVP_CHANGE_POS,0 );
                return;
            }
        }

        this._lastSelectName = e.currentTarget.name;
        var roleGroup:eui.Group = e.currentTarget;
        var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(roleGroup,"group");
        var battled:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"battled");
        if(UserMethod.inst.pvp_up_arr.indexOf(id) > -1)
        {
            battled.visible = true;
        }
        else
        {
            battled.visible = false;
        }
        var select:AutoBitmap = new AutoBitmap();
        select.source = "pvp_select_role_png";
        select.x = -6;
        select.y = -6;
        select.name = "select";
        group.addChildAt(select,0);
        egret.Tween.get(group,{loop:true}).to({rotation:-10},100).to({rotation:0},100).to({rotation:10},100).to({rotation:0},100);

        EventManager.inst.dispatch(ContextEvent.PVP_CHANGE_POS,parseInt(roleGroup["id"]) );

    }

    private ChangeEnd():void
    {
        if(this._lastSelectName)
        {
            var roleGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.mainRoleGroup,this._lastSelectName);
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(roleGroup,"group");
            var battled:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"battled");
            battled.visible = true;
            group.rotation = 0;
            DisplayUtil.removeFromParent(group.getChildByName("select"));
            egret.Tween.removeTweens(group);
            this._lastSelectName = null;
            this.changeDown();
        }
    }

    private changeDown():void
    {
        var length:number = this._roleNumbers.length;
        for(var i:number = 0; i < length; i++)
        {
            var roleGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.mainRoleGroup,"role" + (i+1));
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(roleGroup,"group");
            var battled:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"battled");
            if(UserMethod.inst.pvp_up_arr.indexOf(this._roleNumbers[i]) > -1)
            {
                battled.visible = true;
            }
            else
            {
                battled.visible = false;
            }
        }

    }
}