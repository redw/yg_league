/**
 * Created by Administrator on 12/26 0026.
 */
class RoleFormationPanel extends BasePanel
{
    public posGroup0:eui.Group;
    public posGroup1:eui.Group;
    public posGroup2:eui.Group;
    public posGroup3:eui.Group;
    public posGroup4:eui.Group;
    public posGroup5:eui.Group;


    public lblHadHero:eui.Label;
    public btnClose:SimpleButton;
    public upList:eui.List;
    public btnInto:eui.Button;
    public scroll:eui.Scroller;
    public txtBg:eui.Group;
    public lblSecretDesc:eui.Label;
    public lblHelp:eui.Label;

    // private _groupPosArr:eui.Group[];

    public constructor()
    {
        super();
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = RoleFormationPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }


    public init():void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.posGroup0.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup3.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup4.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup5.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.btnInto.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onInto,this);
        EventManager.inst.addEventListener("GUIDE_FORMATION_2",this.onGuide,this);
        EventManager.inst.addEventListener("GUIDE_CLOSE_FORMATION",this.onClose,this);
        EventManager.inst.addEventListener(ContextEvent.BATTLE_CHANGE_POS,this.showArrow,this);

        /*for(var i:number = 0; i < 6; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"battleGroup" + i);
            var mcGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(group,"mcGroup");
            mcGroup["id"] = i;
            mcGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDownRole,this);
        }*/

        this.upList.itemRenderer = RoleFormationRenderer;

    }

    public initData():void
    {
        UserMethod.inst.battle_type_pos = this.data.type;

        var ids:number[] = [];
        var idArrays:any[] = [];
        var heroIds:number[] = UserProxy.inst.heroData.getHeroIds();
        var count:number = 0;
        var total:number = 0;
        for(var i in heroIds)
        {
            var roleId:number = Number(heroIds[i]);
            var hero = UserProxy.inst.heroData.getHeroData(roleId);
            if(UserMethod.inst.battle_type_pos == 1)
            {
                total++;
                if(hero.level)
                {
                    ids.push(roleId);
                    count++;
                }
            }
            else
            {
                switch (Math.floor(this.data.id/1000))
                {
                    case 1:
                        if(parseInt(hero.config.race) != 3)
                        {
                            total++;
                            if(hero.level)
                            {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                    case 2:
                        if(parseInt(hero.config.race) != 4)
                        {
                            total++;
                            if(hero.level)
                            {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                    case 3:
                        if(parseInt(hero.config.race) != 5)
                        {
                            total++;
                            if(hero.level)
                            {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                    case 4:
                        if(parseInt(hero.config.range) != 1)
                        {
                            total++;
                            if(hero.level)
                            {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                    case 5:
                        if(parseInt(hero.config.range) != 2)
                        {
                            total++;
                            if(hero.level)
                            {
                                ids.push(roleId);
                                count++;
                            }
                        }
                        break;
                }

            }



            if(ids.length == 4)
            {
                idArrays.push(ids);
                ids = [];
            }


        }
        if(ids.length > 0)
        {
            idArrays.push(ids);
        }



        this.upList.dataProvider = new eui.ArrayCollection(idArrays);
        this.lblHadHero.text = count + "/" + total ;

        /*this._groupPosArr = [];
        this._groupPosArr.push(this.posGroup0);
        this._groupPosArr.push(this.posGroup1);
        this._groupPosArr.push(this.posGroup2);
        this._groupPosArr.push(this.posGroup3);
        this._groupPosArr.push(this.posGroup4);
        this._groupPosArr.push(this.posGroup5);*/


        var battleArr:number[] =[];
        UserMethod.inst.battle_pos = [0,0,0,0,0,0,0,0,0];
        switch (UserMethod.inst.battle_type_pos)
        {
            case 1:
                this.txtBg.visible = true;
                this.lblSecretDesc.visible = false;
                battleArr = UserProxy.inst.fightData.getPVEFormation();
                this.btnInto.visible = false;
                this.upList.height = 400;
                var length:number = battleArr.length;
                for(var l:number = 0; l < length; l++)
                {
                    UserMethod.inst.battle_pos[battleArr[l]["pos"]] = battleArr[l]["id"];
                }

                var canUp:boolean = false;
                for(var p:number = 0; p < 6;p++)
                {
                    if(!UserMethod.inst.battle_pos[p])
                    {
                        canUp = true;
                    }
                }
                if(canUp)
                {
                    this.lblHelp.text = "请点击下方需要上阵的英雄";
                }

                break;
            case 2:
                this.txtBg.visible = false;
                this.lblSecretDesc.visible = true;
                var secretData:any = Config.WeaponFbOp[UserMethod.inst.secret_type];
                this.lblSecretDesc.text = secretData["disc"];
                this.scroll.height = 340;
                var dungeonInfo:any = UserProxy.inst.dungeonList[UserMethod.inst.secret_type];
                var dungeonArr:number[] = dungeonInfo["dungeonPos"].concat();
                battleArr = dungeonArr;
                this.btnInto.visible = true;
                this.upList.height = 340;
                var length:number = battleArr.length;
                for(var l:number = 0; l < length; l++)
                {
                    UserMethod.inst.battle_pos[l] = battleArr[l];
                }
                break;
        }
        this.refreshBattleRoles();
    }

    private onGuide():void
    {
        this.posGroup0.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    }

    private refreshBattleRoles():void
    {
        for(var i:number = 0; i < 6 ; i++)
        {
            this.changePosRole(i,UserMethod.inst.battle_pos[i]);
        }
    }

    private changePosRole(pos,roleId):void
    {
        var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"battleGroup" + pos);
        var posGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"posGroup" + pos);
        var mcGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(group,"mcGroup");
        var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(mcGroup,"mc");
        if(mc)
        {
            DisplayUtil.removeFromParent(mc);
        }

        if(roleId)
        {
            group.visible = true;
            var lv:eui.Label = <eui.Label>DisplayUtil.getChildByName(group,"lv");
            var star:eui.Label = <eui.Label>DisplayUtil.getChildByName(group,"star");
            var type:AutoBitmap = <AutoBitmap>DisplayUtil.getChildByName(group,"type");
            var strength:eui.Label = <eui.Label>DisplayUtil.getChildByName(group,"strength");
            var imgLvMis:eui.Image = <eui.Image>DisplayUtil.getChildByName(group,"imgLvMis");
            var roleData = UserProxy.inst.heroData.getHeroData(roleId);
            lv.text = "Lv." + roleData.level;
            star.text = "" + roleData.starLevel;
            type.source = "job_" + roleData.config.job + "_png";
            strength.text = "+" + roleData.strengthenLevel;

            if(UserMethod.inst.battle_type_pos != 2)
            {
                imgLvMis.visible = false;
            }

            MovieClipUtils.createMovieClip(Global.getChaStay(roleId),""+ roleId,afterAdd,this);
            function afterAdd(data): void
            {
                var mc:egret.MovieClip = data;
                mc.x = 45;
                mc.y = 70;
                mc.scaleX = -1;
                mc.name = "mc";
                mc.play(-1);
                mc.touchEnabled = false;
                mcGroup.addChild(mc);
            }
        }
        else
        {
            group.visible = false;
        }
    }

    private onTouchPos(e:egret.TouchEvent):void
    {
        var pos:number;
        switch (e.currentTarget)
        {
            case this.posGroup0:pos = 0; break;
            case this.posGroup1:pos = 1; break;
            case this.posGroup2:pos = 2; break;
            case this.posGroup3:pos = 3; break;
            case this.posGroup4:pos = 4; break;
            case this.posGroup5:pos = 5; break;
        }

        if(UserMethod.inst.battle_select_role)
        {
            this.changePosRole(pos,UserMethod.inst.battle_select_role);
            var oldSelect:number = UserMethod.inst.battle_select_role;
            UserMethod.inst.battle_select_role = 0;
            this.changeBattleRole(pos,oldSelect);
        }
        else
        {
            if(UserMethod.inst.battle_pos[pos])
            {
                this.changePosRole(pos,0);
                this.changeBattleRole(pos,0);
            }
        }

        this.removeArrow();
    }

    /*private onDownRole(e:egret.TouchEvent):void
    {
        var touchId:number = e.currentTarget["id"];
        this.changeBattleRole(touchId,0);
        this.changePosRole(touchId,0);
    }*/

    private showArrow():void
    {
        var arrowPosY:number[] = [75,155,235,75,155,235];
        var canUp:boolean = false;
        for(var i:number = 0; i < 6;i++)
        {
            if(!UserMethod.inst.battle_pos[i])
            {
                var arrow:eui.Image = <eui.Image>DisplayUtil.getChildByName(this,"arrow" + i);
                arrow.visible = true;
                egret.Tween.get(arrow,{loop:true}).to({y:arrow.y - 10},800).to({y:arrowPosY[i]},800);
                canUp = true;
            }
        }

        if(canUp)
        {
            this.lblHelp.text = "请点击上方需要摆放位置";
        }

    }

    private removeArrow():void
    {
        for(var i:number = 0; i < 6;i++)
        {
            var arrow:eui.Image = <eui.Image>DisplayUtil.getChildByName(this,"arrow" + i);
            egret.Tween.removeTweens(arrow);
            arrow.visible = false;
        }

        this.lblHelp.text = "完成上阵,关闭后生效";

    }

    private changeBattleRole(pos:number,roleId:number):void
    {
        UserMethod.inst.battle_pos[pos] = roleId;
        EventManager.inst.dispatch(ContextEvent.BATTLE_CHANGE_END,roleId);
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("RoleFormationPanel");
        UserMethod.inst.battle_select_role = 0;
        //改变阵容
        switch (UserMethod.inst.battle_type_pos)
        {
            case 1:
                Http.inst.send(CmdID.FIGHT_FORMATION,{type:1,posAry:JSON.stringify(UserMethod.inst.battle_pos)});
                // 此处只是改变数据,不通知服务器端,下关开始时，才通知服务器端
                // UserProxy.inst.fightData.changePVEFormation(UserMethod.inst.battle_pos);
                break;

        }
    }

    private onInto():void
    {
        var had:boolean = false;
        for(var i in UserMethod.inst.battle_pos)
        {
            if(UserMethod.inst.battle_pos[i])
            {
                had = true;
                break;
            }
        }

        if(!had)
        {
            Notice.show("必须上阵一个伙伴才能进行战斗！");
            return;
        }

        PanelManager.inst.hidePanel("RoleFormationPanel");
        if(PanelManager.inst.isShow("SecretAreaPanel"))
        {
            PanelManager.inst.hidePanel("SecretAreaPanel");
        }
        PanelManager.inst.showPanel("BossFightPanel", {id:this.data.id, hero:UserMethod.inst.battle_pos.concat()});
    }

    public destory():void
    {
        super.destory();
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.posGroup0.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup1.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup2.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup3.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup4.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.posGroup5.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchPos,this);
        this.btnInto.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onInto,this);
        /*for(var i:number = 0; i < 6; i++)
        {
            var group:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"battleGroup" + i);
            var mcGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(group,"mcGroup");
            mcGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDownRole,this);
        }*/
        EventManager.inst.removeEventListener(ContextEvent.BATTLE_CHANGE_POS,this.showArrow,this);
        EventManager.inst.removeEventListener("GUIDE_FORMATION_2",this.onGuide,this);
        EventManager.inst.removeEventListener("GUIDE_CLOSE_FORMATION",this.onClose,this);
        this.removeArrow();
        TopPanel.inst.hideFormation();
    }

}