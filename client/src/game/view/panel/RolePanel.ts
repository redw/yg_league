/**
 * 人物
 * Created by Administrator on 11/25 0025.
 */
class RolePanel extends BasePanel
{
    public roleList:eui.List;
    public btnLook:SimpleButton;
    public btnEmbattle:eui.Button;
    public btnReturn:SimpleButton;
    public btnHelp:SimpleButton;
    public coinShow:CoinShowPanel;

    public roleScroller:eui.Scroller;
    public btnUp:SimpleButton;
    private _upDown:boolean;
    private _moving:boolean = false;
    private _lastVerticalScrollPos: number = 0;

    public constructor()
    {
        super();
        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = RolePanelSkin;
        this._mutex = true;
        this.horizontalCenter = 0;
        this.bottom = 60;
    }

    public init():void
    {
        this.roleList.itemRenderer = RoleRenderer;
        EventManager.inst.addEventListener(ContextEvent.HAVE_NEW_ROLE,this.onRoleRefresh,this);
        this.btnLook.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnEmbattle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHelp,this);

        this.coinShow.startListener();
    }

    private onUpDown():void
    {
        if(this._moving)
        {
            return;
        }
        this._moving = true;
        this._upDown = !this._upDown;
        var time:number = 500;
        if(this._upDown)
        {
            this.btnUp.source = "menu_down_png";
            egret.Tween.get(this).to({height:616},time);
            egret.Tween.get(this.roleScroller).to({height:494},time);
            MenuPanel.inst.menuUp = true;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            egret.Tween.get(this).to({height:282},time);
            egret.Tween.get(this.roleScroller).to({height:150},time);
            MenuPanel.inst.menuUp = false;
        }
        egret.setTimeout(function () {  this._moving = false;},this,time);

    }

    public initData():void
    {
        this.refresh();
        this.checkFormate();

        this._upDown = MenuPanel.inst.menuUp;
        if(MenuPanel.inst.menuUp)
        {
            this.btnUp.source = "menu_down_png";
            this.height = 616;
            this.roleScroller.height = 494;
        }
        else
        {
            this.btnUp.source = "menu_up_png";
            this.height = 282;
            this.roleScroller.height = 160;
        }
    }

    private checkFormate():void
    {
        if(UserMethod.inst.showHelpFormation)
        {
            var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this,"hand");
            if(mc)
            {
                return;
            }

            MovieClipUtils.createMovieClip(Global.getOtherEffect("hand_effect"),"hand_effect",function(mc: egret.MovieClip): void
            {
                mc.x = 420;
                mc.y = 62;
                mc.scaleX = -1;
                mc.name = "hand";
                mc.play(-1);
                this.addChild(mc);
            },this);
        }
    }

    private onRoleRefresh(event: egret.Event): void
    {
        this._lastVerticalScrollPos = this.roleList.scrollV;
        this.refresh();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
    }

    private onEnterFrame(event: egret.Event): void
    {
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        this.roleList.scrollV = this._lastVerticalScrollPos;
    }

    private onHelp():void
    {
        PanelManager.inst.showPanel("HelpPanel",2);
    }


    private refresh():void
    {
        UserMethod.inst.removeRedPoint(this.btnLook.parent,"draw");
        if(UserMethod.inst.drawHeroCheck())
        {
            UserMethod.inst.addRedPoint(this.btnLook.parent,"draw",new egret.Point(this.btnLook.x + 100 ,this.btnLook.y + 10));
        }

        var roleIds:number[] = [];
        var noRoleIds:number[] = [];
        for(var i in UserProxy.inst.heroData.getHeroIds())
        {
            var id:number = UserProxy.inst.heroData.getHeroIds()[i];
            var heroData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
            if(heroData.level)
            {
                roleIds.push(Number(id));
            }
            else
            {
                if(heroData.starPiece)
                {
                    noRoleIds.push(Number(id));
                }
            }
        }
        //排序
        roleIds.sort(soreRole);
        noRoleIds.sort(soreRole);

        function soreRole(a,b)
        {
            var battleArr:any[] = UserProxy.inst.fightData.getPVEIds();
            var heroDataA:HeroVO = UserProxy.inst.heroData.getHeroData(a);
            var heroDataB:HeroVO = UserProxy.inst.heroData.getHeroData(b);
            //上阵
            if(battleArr.indexOf(a) > -1 && battleArr.indexOf(b) > -1)
            {
                if(heroDataA.config.order > heroDataB.config.order)
                {
                    return 1;
                }
            }
            else if(battleArr.indexOf(a)> -1 || battleArr.indexOf(b) > -1)
            {
                if(battleArr.indexOf(a) > -1)
                {
                    return -1;
                }
                else
                {
                    return 1;
                }
            }
            else
            {
                if(heroDataA.config.order > heroDataB.config.order)
                {
                    return 1;
                }
            }
        }

        if(noRoleIds.length)
        {
            noRoleIds.unshift(0);
        }

        UserMethod.inst.nowRoleShow = roleIds;
        this.roleList.dataProvider = new eui.ArrayCollection(roleIds.concat(noRoleIds));
    }

    private onTouch(e:egret.TouchEvent):void
    {
        if (e.currentTarget == this.btnLook)
        {
            if(UserProxy.inst.historyArea < 10)
            {
                Notice.show("通过10关开启！");
                return;
            }
            PanelManager.inst.showPanel("RoleDrawPanel");
        }
        else if (e.currentTarget == this.btnEmbattle)
        {
            UserMethod.inst.showHelpFormation = 0;
            var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this,"hand");
            if(mc)
            {
                DisplayUtil.removeFromParent(mc);
            }

            PanelManager.inst.showPanel("RoleFormationPanel",{type:1});
        }
        else
        {
            if(UserProxy.inst.curArea < 101)
            {
                Notice.show("通过100关开启！");
                return;
            }
            PanelManager.inst.showPanel("CirclePanel");
        }
    }

    public destory():void
    {
        super.destory();

        EventManager.inst.removeEventListener(ContextEvent.HAVE_NEW_ROLE,this.onRoleRefresh,this);
        this.btnLook.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnEmbattle.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnReturn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
        this.btnHelp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHelp,this);
        UserMethod.inst.roleMove = this.roleList.scrollV;
        this.coinShow.endListener();
    }
}
