/**
 * Created by Administrator on 12/26 0026.
 */
class RoleFormationRenderer extends eui.ItemRenderer
{
    public constructor()
    {
        super();
        this.skinName = RoleFormationRendererSkin;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        EventManager.inst.addEventListener(ContextEvent.BATTLE_CHANGE_END,this.removeShake,this);

        for(var i:number = 1; i < 5; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            group.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpRole,this);
        }

        EventManager.inst.addEventListener("GUIDE_FORMATION_1",this.onGuide,this);
    }

    private onHide(event:egret.Event):void
    {
        EventManager.inst.removeEventListener(ContextEvent.BATTLE_CHANGE_END,this.removeShake,this);
        for(var i:number = 1; i < 5; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            group.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpRole,this);
        }

        EventManager.inst.removeEventListener("GUIDE_FORMATION_1",this.onGuide,this);
    }

    private onGuide():void
    {
        var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + 2);
        group.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    }

    private onUpRole(e:egret.TouchEvent):void
    {
        var id:number = e.currentTarget["id"];
        if(UserMethod.inst.battle_pos.indexOf(id) > -1)
        {
            return;
        }

        if(UserMethod.inst.battle_select_role)
        {
            //移除选中
            var oldSelect:number = UserMethod.inst.battle_select_role;
            EventManager.inst.dispatch(ContextEvent.BATTLE_CHANGE_END,oldSelect);
            if(UserMethod.inst.battle_select_role == id)
            {
                UserMethod.inst.battle_select_role = 0;
                return;
            }
        }

        UserMethod.inst.battle_select_role = id;
        var group:eui.Group = e.currentTarget;
        var select:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"select");
        select.visible = true;
        egret.Tween.get(group,{loop:true}).to({rotation:-10},100).to({rotation:0},100).to({rotation:10},100).to({rotation:0},100);
        EventManager.inst.dispatch(ContextEvent.BATTLE_CHANGE_POS);

    }

    private removeShake(e:egret.Event):void
    {
        var oldSelectId:number = e.data;
        for(var i:number = 1; i < 5; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            var bg:AutoBitmap = <eui.Image>DisplayUtil.getChildByName(group,"bg");
            if(UserMethod.inst.battle_pos.indexOf(group["id"]) > -1)
            {
                bg.source = "role_had_battle_bg_png";
            }
            else
            {
                bg.source = "role_unbattle_bg_png";
            }
           if(group["id"] == oldSelectId)
           {
               this.removeSelect(group);
           }
        }
    }

    private removeSelect(group:eui.Group):void
    {
        var select:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"select");
        select.visible = false;
        egret.Tween.removeTweens(group);
        group.rotation = 0;

    }


    public dataChanged(): void
    {
        super.dataChanged();

        var dataLength:number =  this.data.length;

        for(var i:number = 1; i < 5; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"group" + i);
            if(dataLength >= i)
            {
                var roleId:number = this.data[i-1];
                group.visible = true;
                group["id"] = roleId;

                var select:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"select");
                var bg:AutoBitmap = <eui.Image>DisplayUtil.getChildByName(group,"bg");
                var atkType:AutoBitmap = <eui.Image>DisplayUtil.getChildByName(group,"atkType");
                var name:eui.Label = <eui.Label>DisplayUtil.getChildByName(group,"name");
                var roleIcon:RoleIcon = <RoleIcon>DisplayUtil.getChildByName(group,"roleIcon");
                var strength:eui.Label = <eui.Label>DisplayUtil.getChildByName(group,"strength");
                var roleData = UserProxy.inst.heroData.getHeroData(roleId);

                if(UserMethod.inst.battle_pos.indexOf(roleId) > -1)
                {
                    bg.source = "role_had_battle_bg_png";
                }
                else
                {
                    bg.source = "role_unbattle_bg_png";
                }

                select.visible = false;
                atkType.source = "job_" + roleData.config.job + "_png";
                name.text = roleData.config.name;

                if(UserMethod.inst.battle_type_pos == 2)
                {
                    roleIcon.setLv = 0;
                }
                else
                {
                    roleIcon.setLv = roleData.level;
                }


                roleIcon.setStar = roleData.starLevel;
                roleIcon.imgIcon = Global.getChaIcon(roleId);
                strength.visible = roleData.strengthenLevel > 0 ;
                strength.text = "+" + roleData.strengthenLevel;

                if(UserMethod.inst.battle_select_role)
                {
                    if(roleId == UserMethod.inst.battle_select_role)
                    {
                        egret.Tween.get(group,{loop:true}).to({rotation:-10},100).to({rotation:0},100).to({rotation:10},100).to({rotation:0},100);
                        select.visible = true;
                    }
                    else
                    {
                        egret.Tween.removeTweens(group);
                        group.rotation = 0;
                        select.visible = false;
                    }
                }
            }
            else
            {
                group.visible = false;
            }
        }
    }

}