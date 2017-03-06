/**
 * Created by Administrator on 11/25 0025.
 */
class RoleRenderer extends eui.ItemRenderer
{
    public roleIcon:RoleIcon;
    public imgAtk:AutoBitmap;
    public imgAtkType:AutoBitmap;
    public lblAtk:eui.Label;
    public lblHp:eui.Label;
    public lblName:eui.Label;
    public btnUpGroup:eui.Group;
    public btnUpThree:YellowCoinButton;
    public btnUpTwo:YellowCoinButton;
    public btnUp:YellowCoinButton;
    public bitLbl:eui.BitmapLabel;
    public contentGroup:eui.Group;
    public imgBattle:eui.Image;
    public imgCellBg:AutoBitmap;
    public btnCall:GreenCoinButton;
    public imgLine:eui.Image;

    private _touchCount:number = 0;
    private _delayTimes:number;
    private _topLv:number;

    private _continueTimes:number = 0;
    private _continueTouch:number = 0;

    public constructor()
    {
        super();
        this.skinName = RoleRendererSkin;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        EventManager.inst.addEventListener(ContextEvent.CHANGE_ROLE_SHOW,this.refreshShow,this);
        EventManager.inst.addEventListener(ContextEvent.REFRESH_BASE,this.dataChanged,this);
        Http.inst.addCmdListener(CmdID.HERO_UP,this.onRefreshSoldier,this);
        Http.inst.addCmdListener(CmdID.STAR_UP,this.dataChanged,this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this);
        this.btnUpTwo.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this);
        this.btnUpThree.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this);
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRole,this);
        this.btnUp.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
        this.btnCall.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCall,this);

        EventManager.inst.addEventListener("GUIDE_HEROUP",this.onGuide,this);
        EventManager.inst.addEventListener("GUIDE_HEROUP_2",this.onGuide2,this);
        this.btnUpGroup.visible = false;
    }

    private onHide(event:egret.Event):void
    {
        EventManager.inst.removeEventListener(ContextEvent.CHANGE_ROLE_SHOW,this.refreshShow,this);
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_BASE,this.dataChanged,this);
        Http.inst.removeCmdListener(CmdID.HERO_UP,this.onRefreshSoldier,this);
        Http.inst.removeCmdListener(CmdID.STAR_UP,this.dataChanged,this);

        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this);
        this.btnUpTwo.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this);
        this.btnUpThree.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onLvUp,this);
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRole,this);
        this.btnUp.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
        this.btnCall.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onCall,this);
        EventManager.inst.removeEventListener("GUIDE_HEROUP",this.onGuide,this);
        EventManager.inst.removeEventListener("GUIDE_HEROUP_2",this.onGuide2,this);
    }

    private onGuide():void
    {
        if(this.data == 102)
        {
            this.btnUp.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }

    }
    private onGuide2():void
    {
        if(this.data == 103)
        {
            this.btnUp.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }

    }

    private onRefreshSoldier(event: egret.Event): void
    {
        var data:any = event.data;
        for(var i in data["heroList"])
        {
            if(parseInt(i) == this.data)
            {
                MovieClipUtils.createMovieClip(Global.getOtherEffect("level_up_effect"),"level_up_effect",(data)=>
                {
                    var mc: egret.MovieClip = data;
                    mc.x = 6;
                    mc.y = 5;
                    this.addChild(mc);
                    MovieClipUtils.playMCOnce(mc,function(): void
                    {
                        DisplayUtil.removeFromParent(mc);
                    },this);
                },this);

                this.dataChanged();
                this.delayShow();
            }
        }
    }

    private refreshShow(e:egret.Event):void
    {
        this.dataChanged();
    }

    private onTouch():void
    {
        this.btnUp.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

    }
    private onTouchEnd():void
    {
        this.btnUp.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    }

    private onEnterFrame():void
    {
        this._continueTimes++;
        if(this._continueTimes > 10 && !this._continueTouch)
        {
            this._continueTimes = 0;
            this._continueTouch = 1;
            this._touchCount = 3;
            this.delayShow();
            this.onTouchEnd();
        }
    }


    public onLvUp(e:egret.TouchEvent)
    {
        var lv:number = 0;
        if(e.currentTarget == this.btnUp)
        {
            lv = 1;
        }
        else if(e.currentTarget == this.btnUpTwo)
        {
            lv = 10;
        }
        else
        {
            lv = this._topLv;
        }

        Http.inst.send(CmdID.HERO_UP,{hid:this.data,upLel:lv});

    }

    private onCall():void
    {
        Http.inst.send(CmdID.STAR_UP,{hid:this.data});
    }

    private onRole(e:egret.TouchEvent):void
    {
        PanelManager.inst.showPanel("RoleDetailsPanel",this.data);
    }

    private delayShow():void
    {
        this._touchCount ++;
        if(this._touchCount > 3)
        {
            this.btnUpGroup.visible = true;
        }

        if(this.btnUpGroup.visible)
        {
            if(this._delayTimes)
            {
                egret.clearTimeout(this._delayTimes);
            }
            this._delayTimes = egret.setTimeout(clearShow,this,2000);
        }

        function clearShow():void
        {
            this.btnUpGroup.visible = false;
            this._continueTouch = 0;
            this._touchCount = 0;
        }
    }

    public dataChanged(): void
    {
        super.dataChanged();

        if(this.data)
        {
            this.height = 72;
            this.contentGroup.visible = true;
            this.imgLine.visible = false;
            this.imgCellBg.visible = true;

            var roleData = UserProxy.inst.heroData.getHeroData(this.data);
            this.lblName.text = roleData.config.name;

            this.lblHp.text = ""  + MathUtil.easyNumber(roleData.maxHP);
            this.roleIcon.setLv = roleData.level;
            this.roleIcon.setStar = roleData.starLevel;
            this.roleIcon.imgIcon = Global.getChaIcon(this.data);

            if(roleData.level)
            {
                this.btnCall.visible = false;
                this.btnUp.visible = true;
                this.imgCellBg.source = "common_cell_png";
            }
            else
            {
                this.btnCall.visible = true;
                this.btnUp.visible = false;
                this.imgCellBg.source = "role_unhad_cell_png";

                var starData:any = Config.HeroStarData[1];
                var needChip:number = starData["rank_chip_" + roleData.config.quality];

                this.btnCall.label = roleData.starPiece + "/" + needChip;
                /*if(roleData.starPiece >= needChip)
                {
                    this.btnCall.label = roleData.starPiece + "/" + needChip + "(合成)";
                }
                else
                {

                }*/
                this.btnCall.enabled = roleData.starPiece >= needChip;
                this.btnCall.imgType.source = Global.getChaChipIcon(this.data);
            }

            var battleArr:any[] = UserProxy.inst.fightData.getPVEIds();
            this.imgBattle.visible = battleArr.indexOf(this.data) > -1;

            this.imgAtkType.source = "job_" + roleData.config.job + "_png";
            if(parseInt(roleData.config.damage_type) == 1)
            {
                this.imgAtk.source = "common_atk_png";
                this.lblAtk.text = MathUtil.easyNumber(roleData.phyAtk);
            }
            else
            {
                this.imgAtk.source = "common_mgAtk_png";
                this.lblAtk.text = MathUtil.easyNumber(roleData.magAtk);
            }

            if(roleData.strengthenLevel)
            {
                this.bitLbl.visible = true;
                this.bitLbl.text = "+" + roleData.strengthenLevel;
            }
            else
            {
                this.bitLbl.visible = false;
            }

            //btnMoney
            var upGold:number = parseFloat(Config.BaseData[2]["value"]) / UserProxy.inst.subFriendMoney;
            var baseAdd:number = Config.BaseData[3]["value"];
            var baseLv:number = Math.pow(baseAdd,roleData.level);
            var baseDiv:number = 1 - baseAdd;

            var before_1: number = (1- Math.pow(baseAdd,1)) / baseDiv;
            var before_2: number = (1- Math.pow(baseAdd,10)) / baseDiv;
            var before_3: number = (1- Math.pow(baseAdd,100)) / baseDiv;
            var before_4: number = (1- Math.pow(baseAdd,1000)) / baseDiv;

            var baseUp_1:string = BigNum.mul(baseLv,before_1);
            var baseUp_2:string = BigNum.mul(baseLv,before_2);
            var baseUp_3:string = BigNum.mul(baseLv,before_3);
            var baseUp_4:string = BigNum.mul(baseLv,before_4);

            var upGold_1:string = BigNum.mul(upGold,baseUp_1);
            this.btnUp.label =  MathUtil.easyNumber(upGold_1) ;
            this.btnUp.extraLabel = "升级";
            this.btnUp.enabled = BigNum.greaterOrEqual(UserProxy.inst.gold,upGold_1);

            if(!UserProxy.inst.isGuideEnd() && this.data == 102)
            {
                var hand:any = DisplayUtil.getChildByName(this,"hand");
                if(!hand)
                {
                    var step:number = UserProxy.inst.getGuideStep();

                    if(step > 3 && step < 10 && BigNum.greaterOrEqual(UserProxy.inst.gold,upGold_1))
                    {
                        MovieClipUtils.createMovieClip(Global.getOtherEffect("hand_effect"),"hand_effect",function(mc: egret.MovieClip): void
                        {
                            mc.x = 410;
                            mc.y = 20;
                            mc.scaleX = -1;
                            mc.name = "hand";
                            mc.play(-1);
                            this.addChild(mc);
                        },this);
                    }
                }
                else
                {
                    var nowGuide:boolean = false;
                    if(PanelManager.inst.isShow("GuidePanel"))
                    {
                        nowGuide = true;
                    }

                    if(BigNum.lessOrEqual(UserProxy.inst.gold,upGold_1) || nowGuide)
                    {
                        hand.stop();
                        DisplayUtil.removeFromParent(hand);
                    }
                }
            }

            var upGold_10:string = BigNum.mul(upGold,baseUp_2);
            this.btnUpTwo.label =  MathUtil.easyNumber(upGold_10) ;
            this.btnUpTwo.extraLabel = "升10级";
            this.btnUpTwo.enabled = BigNum.greaterOrEqual(UserProxy.inst.gold,upGold_10);

            var upGold_100:string = BigNum.mul(upGold,baseUp_3);
            var upGold_1000:string = BigNum.mul(upGold,baseUp_4);

            if(BigNum.less(UserProxy.inst.gold,upGold_100))
            {
                this.btnUpThree.label =  MathUtil.easyNumber(upGold_100) ;
                this.btnUpThree.extraLabel = "升100级";
                this.btnUpThree.enabled = false;
            }
            else if(BigNum.greaterOrEqual(UserProxy.inst.gold,upGold_100) && BigNum.less(UserProxy.inst.gold,upGold_1000))
            {
                this.btnUpThree.label =  MathUtil.easyNumber(upGold_100) ;
                this.btnUpThree.extraLabel = "升100级";
                this.btnUpThree.enabled = true;
                this._topLv = 100;
            }
            else
            {
                this.btnUpThree.label =  MathUtil.easyNumber(upGold_1000) ;
                this.btnUpThree.extraLabel = "升1000级";
                this.btnUpThree.enabled = true;
                this._topLv = 1000;
            }

            var ship:boolean = false;
            var star:boolean = false;

            UserMethod.inst.removeRedPoint(this.roleIcon.parent,"star");
            if(UserMethod.inst.oneStarCheck(this.data))
            {
                star = true;
            }
            if(UserMethod.inst.oneShipCheck(this.data))
            {
                ship = true;
            }

            if(star||ship)
            {
                UserMethod.inst.addRedPoint(this.roleIcon.parent,"star",new egret.Point(this.roleIcon.x + 60 ,this.roleIcon.y + 5));
            }
        }
        else
        {
            this.height = 18;
            this.btnCall.visible = false;
            this.btnUp.visible = false;
            this.contentGroup.visible = false;
            this.imgLine.visible = true;
            this.imgCellBg.visible = false;
        }
    }

}