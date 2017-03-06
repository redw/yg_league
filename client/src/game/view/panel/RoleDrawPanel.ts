/**
 * Created by Administrator on 12/15 0015.
 */
class RoleDrawPanel extends BasePanel
{
    public imgCloud1:eui.Image;
    public imgCloud2:eui.Image;
    public imgCloud3:eui.Image;
    public btnOne:YellowBigBtn;
    public btnTen:YellowBigBtn;
    public lblFreeTime:eui.Label;
    public btnShowAll:SimpleButton;
    public btnNotice:SimpleButton;
    public lblDrawPoint:eui.Label;
    public roleShowGroup:eui.Group;
    public lblRoleName:eui.Label;
    public atkType:AutoBitmap;
    public imgSay:eui.Image;
    public lblSay:eui.Label;
    public oneDrawGroup:eui.Group;
    public imgBody:AutoBitmap;
    public roleShowGroup2:eui.Group;
    public lblRoleName2:eui.Label;
    public atkType2:AutoBitmap;
    public imgSay2:eui.Image;
    public lblSay2:eui.Label;
    public drawHideGroup:eui.Group;
    public imgBody2:AutoBitmap;
    public drawOverGroup:eui.Group;
    public imgRotate:eui.Image;
    public lblName:eui.Label;
    public drawGroup:eui.Group;
    public drawTurnIcon:RoleIcon;
    public drawTurnNum:eui.Label;
    public imgShowBody:AutoBitmap;
    public drawTenGroup:eui.Group;
    public imgTenFly:eui.Image;
    public imgTenBg:eui.Image;
    public btnClose:SimpleButton;
    public lblGold:eui.Label;
    public oneBg:eui.Image;
    public btnDrawShop:SimpleButton;

    public btnOneAgain:YellowBigBtn;
    public btnOneBack:eui.Button;
    public btnTenBack:eui.Button;
    public btnTenAgain:YellowBigBtn;
    public coinShow:CoinShowPanel;

    private _startX:number = 550;
    private _endX:number = -220;

    private _roleIds:number[] = [];
    private _roleIdx:number;
    private _nowMc:egret.MovieClip;
    private _nextMc:egret.MovieClip;

    private _nowFirstMoveId:number;
    private _nowNextMoveId:number;

    private _canCloseDraw:boolean;
    private _drawType:number;
    private _drawTenIdx:number;
    private _rotations:number[] = [-35,-20,0,20,35,-45,-25,0,25,45];
    private _tenMovePos:egret.Point[] = [new egret.Point(80,200),new egret.Point(165,200),new egret.Point(220,200),new egret.Point(275,200),new egret.Point(360,220), new egret.Point(100,260),new egret.Point(170,280),new egret.Point(220,280),new egret.Point(270,280),new egret.Point(330,260)];
    private _rewardAry:number[] ;
    private _cdTime:number;
    private _drawHeroList:any;

    private _say1:number;
    private _wait1:number;
    private _say2:number;
    private _wait2:number;
    private _stopMove:number;

    private _isTenAgain:boolean;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = RoleDrawPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        this.btnOne.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDraw,this);
        this.btnTen.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDraw,this);
        this.roleShowGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRoleShow,this);
        this.roleShowGroup2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRoleShow,this);
        this.btnShowAll.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnNotice.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.drawOverGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeRoleDrawOver,this);
        this.imgTenBg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tenDrawEnd,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);

        this.btnOneBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDrawEnd,this);
        this.btnTenBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tenDrawEnd,this);
        this.btnOneAgain.addEventListener(egret.TouchEvent.TOUCH_TAP,this.oneAgain,this);
        this.btnTenAgain.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tenAgain,this);

        this.btnDrawShop.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDrawShop,this);


        Http.inst.addCmdListener(CmdID.DRAW_HERO,this.drawBack,this);
        EventManager.inst.addEventListener("GUIDE_DRAW",this.onGuide,this);
        EventManager.inst.addEventListener(ContextEvent.CONTINUE_MOVE,this.continueMove,this);
        EventManager.inst.addEventListener("GUIDE_DRAW_CLOSE",this.guideClose,this);

        this.coinShow.startListener();
    }

    public initData(): void
    {
        this.cloudMove();
        this._roleIds = [];
        for(var i in Config.HeroData)
        {
            this._roleIds.push(parseInt(i));
        }

        this.btnOne.label = Config.BaseData[41]["value"];
        this.btnOne.imgType = "reward_3_s_png";
        if(UserProxy.inst.ticket > 0)
        {
            this.btnOne.label = UserProxy.inst.ticket + "";
            this.btnOne.imgType = "reward_14_s_png";
        }

        this.btnOne.extraLabel = "来一发！";
        this.btnTen.label = Config.BaseData[42]["value"];
        this.btnTen.extraLabel = "十连发！！";
        this.oneDrawGroup.visible = false;
        this.drawOverGroup.visible = false;
        this.drawTenGroup.visible = false;



        this.btnOneAgain.label = Config.BaseData[41]["value"];
        this.btnOneAgain.extraLabel = "来一发！";
        this.btnOneAgain.imgType = "reward_3_s_png";
        if(UserProxy.inst.ticket > 0)
        {
            this.btnOneAgain.label = UserProxy.inst.ticket + "";
            this.btnOneAgain.imgType = "reward_14_s_png";
        }
        this.btnTenAgain.label = Config.BaseData[42]["value"];
        this.btnTenAgain.extraLabel = "十连发！！";


        this.drawTicketAndTime();
        this._roleIdx = 0;
        this.startShowMove();
    }

    private onGuide():void
    {
        if(this._cdTime <= 0)
        {
            this.btnOne.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
        }

    }

    private startShowMove():void
    {
        this.roleShowGroup.x = this._startX;
        this.lblSay.visible = false;
        this.imgSay.visible = false;
        var id:number = this._roleIds[this._roleIdx];
        this._roleIdx++;
        if(this._roleIdx > 32)
        {
            this._roleIdx = 0;
        }

        this._nowFirstMoveId = id;
        if(this._nowMc)
        {
            this._nowMc.stop();
            DisplayUtil.removeFromParent(this._nowMc);
        }

        var roleData = UserProxy.inst.heroData.getHeroData(id);
        this.lblRoleName.text = roleData.config.name;
        this.atkType.source = "job_" + roleData.config.job + "_png";

        this.lblSay.text = roleData.config.slogan;
        this.imgBody.source = Global.getHerobody(id);

       /* MovieClipUtils.createMovieClip(Global.getChaStay(id),id.toString(),afterAdd,this);
        function afterAdd(data): void
        {
            this._nowMc = data;
            this._nowMc.x = 30;
            this._nowMc.y = 80;
            this._nowMc.play(-1);
            this._nowMc.scaleX = 1.8;
            this._nowMc.scaleY = 1.8;
            this.roleGroup.addChild(this._nowMc);
        }*/
        egret.Tween.get(this.roleShowGroup).to({x:this._endX},9000);
        if(this._wait1)
        {
            egret.clearTimeout(this._wait1);
        }
        if(this._say1)
        {
            egret.clearTimeout(this._say1);
        }

        this._wait1 = egret.setTimeout(function ()
        {
            this.startShowMove2();
        },this,7200);
        this._say1 = egret.setTimeout(function ()
        {
            this.lblSay.visible = true;
            this.imgSay.visible = true;
        },this,2500);
    }

    private continueMove1():void
    {
        var time:number = (this.roleShowGroup.x + 78)/77*900;
        var endTime:number = (this.roleShowGroup.x + 220)/77*900;
        egret.Tween.get(this.roleShowGroup).to({x:this._endX},endTime);
        this.lblSay.visible = true;
        this.imgSay.visible = true;
        if(time >= 0)
        {
            this._wait1 = egret.setTimeout(function ()
            {
                this.startShowMove2();
            },this,time);
        }
    }

    private stopMove1():void
    {
        egret.Tween.removeTweens(this.roleShowGroup);
        if(this._wait1)
        {
            egret.clearTimeout(this._wait1);
        }
        if(this._say1)
        {
            egret.clearTimeout(this._say1);
        }
    }

    private startShowMove2():void
    {
        this.roleShowGroup2.x = this._startX;
        this.lblSay2.visible = false;
        this.imgSay2.visible = false;
        var id:number = this._roleIds[this._roleIdx];
        this._roleIdx++;
        if(this._roleIdx > 32)
        {
            this._roleIdx = 0;
        }

        this._nowNextMoveId = id;
        if(this._nextMc)
        {
            this._nextMc.stop();
            DisplayUtil.removeFromParent(this._nextMc);
        }


        var roleData = UserProxy.inst.heroData.getHeroData(id);
        this.lblRoleName2.text = roleData.config.name;
        this.atkType2.source = "job_" + roleData.config.job + "_png";
        this.lblSay2.text = roleData.config.slogan;
        this.imgBody2.source = Global.getHerobody(id);

        egret.Tween.get(this.roleShowGroup2).to({x:this._endX},9000);
        this._wait2 =  egret.setTimeout(function ()
        {
            this.startShowMove();
        },this,7200);
        this._say2 = egret.setTimeout(function ()
        {
            this.lblSay2.visible = true;
            this.imgSay2.visible = true;
        },this,2500);
    }

    private continueMove2():void
    {
        var time:number = (this.roleShowGroup2.x + 78)/71*900;
        var endTime:number = (this.roleShowGroup2.x + 220)/71*900;
        egret.Tween.get(this.roleShowGroup2).to({x:this._endX},endTime);
        this.lblSay2.visible = true;
        this.imgSay2.visible = true;
        if(time >= 0)
        {
            this._wait2 = egret.setTimeout(function ()
            {
                this.startShowMove();
            },this,time);
        }

    }

    private stopMove2():void
    {
        egret.Tween.removeTweens(this.roleShowGroup2);
        if(this._wait2)
        {
            egret.clearTimeout(this._wait2);
        }
        if(this._say2)
        {
            egret.clearTimeout(this._say2);
        }
    }

    private continueMove():void
    {
        if(this._stopMove == 1)
        {
            this.continueMove1();
        }
        else
        {
            this.continueMove2();
        }
    }


    private drawBack(e:egret.Event):void
    {
        var length:number = e.data["rewardAry"].length;
        this._rewardAry = [];
        for(var i:number = 0;i < length;i++)
        {
            this._rewardAry.push(e.data["rewardAry"][i]["id"]);
        }

        this.drawTicketAndTime();
        this.drawStart();
        this._drawHeroList = e.data["heroList"];

        MenuPanel.inst.checkDraw();
    }

    private drawTicketAndTime():void
    {
        this.lblGold.text = UserProxy.inst.diamond +"";
        this.lblDrawPoint.text = UserProxy.inst.ticket + "";
        var base:number = parseInt(Config.BaseData[43]["value"]);
        this._cdTime = (base * 60) - (UserProxy.inst.server_time - UserProxy.inst.lastFreeTime);
        if(this._cdTime > 0)
        {
            this.lblFreeTime.visible = true;
            this.btnOne.label = Config.BaseData[41]["value"];
            this.btnOneAgain.label = Config.BaseData[41]["value"];
            this.btnOne.imgType = "reward_3_s_png";
            this.btnOneAgain.imgType = "reward_3_s_png";
            if(UserProxy.inst.ticket > 0)
            {
                this.btnOne.label = UserProxy.inst.ticket + "";
                this.btnOne.imgType = "reward_14_s_png";
            }

            if(UserProxy.inst.ticket > 0)
            {
                this.btnOneAgain.label = UserProxy.inst.ticket + "";
                this.btnOneAgain.imgType = "reward_14_s_png";
            }

            this.tickerTime();
            TickerUtil.register(this.tickerTime, this, 1000);
        }
        else
        {
            this.btnOne.label = "免 费";
            this.lblFreeTime.visible = false;
        }
    }

    public tickerTime():void
    {
        this.lblFreeTime.text =  StringUtil.timeToString(this._cdTime,true) + "后免费";
        this._cdTime--;
        if(!this._cdTime)
        {
            TickerUtil.unregister(this.tickerTime,this);
        }
    }


    private onDraw(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.btnOne)
        {
            if(UserProxy.inst.costAlart || this._cdTime <= 0 || UserProxy.inst.ticket)
            {
                this.drawOneWarning();
            }
            else
            {
                Alert.showCost(Config.BaseData[41]["value"],"寻仙一次",true,this.drawOneWarning,null,this);
            }
        }
        else
        {
            this._isTenAgain = false;
            if(UserProxy.inst.costAlart)
            {
                this.drawTenWarning();
            }
            else
            {
                Alert.showCost(Config.BaseData[42]["value"],"寻仙十次",true,this.drawTenWarning,null,this);
            }
        }
    }

    private drawOneWarning():void
    {
        if(UserProxy.inst.diamond >= parseInt(Config.BaseData[41]["value"]) || this._cdTime <= 0 || UserProxy.inst.ticket )
        {
            this.drawDisable();
            this._drawType = 1;
            Http.inst.send(CmdID.DRAW_HERO,{type:this._drawType});
        }
        else
        {
            ExternalUtil.inst.diamondAlert();
        }
    }

    private drawTenWarning():void
    {
        if(UserProxy.inst.diamond >= parseInt(Config.BaseData[42]["value"]))
        {
            this.drawDisable();
            this._drawType = 2;
            this._drawTenIdx = 0;
            this.hideTenIcons();
            Http.inst.send(CmdID.DRAW_HERO,{type:this._drawType});
        }
        else
        {
            ExternalUtil.inst.diamondAlert();
        }
    }

    private hideTenIcons():void
    {
        for(var i:number = 0;i < 10;i++)
        {
            var awardGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.drawTenGroup,"awardGroup" + i);
            awardGroup.visible = false;
        }
    }

    private drawStart():void
    {
        var self = this;
        MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_ball"),"draw_ball",(data)=>
        {
            var mc: egret.MovieClip = data;
            mc.x = 240;
            mc.y = 440;
            self.addChild(mc);
            MovieClipUtils.playMCOnce(mc,function(): void
            {
                DisplayUtil.removeFromParent(mc);
                drawCommonLight();
            },this);
        },this);

        function drawCommonLight():void
        {
            MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_common_effect"),"draw_common_effect",(data)=>
            {
                var mc: egret.MovieClip = data;
                mc.x = 240;
                mc.y = 385;
                self.addChild(mc);
                MovieClipUtils.playMCOnce(mc,function(): void
                {
                    DisplayUtil.removeFromParent(mc);
                    if(self._drawType == 1)
                    {
                        self.drawOneLight();
                    }
                    else
                    {
                        self.drawTenGroup.visible = true;
                        self.btnTenAgain.visible = false;
                        self.btnTenBack.visible = false;
                        self.drawTenLight();
                    }
                },this);
            },this);
        }
    }

    private drawOneLight():void
    {
        var id:number = this._rewardAry[0];
        var reward:any[] = Config.HeroDrawData[id]["reward_1"];
        var icon:WeaponIcon = <WeaponIcon>DisplayUtil.getChildByName(this.oneDrawGroup,"icon");
        var num:eui.Label = <eui.Label>DisplayUtil.getChildByName(this.oneDrawGroup,"num");
        var light:eui.Image = <eui.Image>DisplayUtil.getChildByName(this.oneDrawGroup,"light");
        var name:eui.Label = <eui.Label>DisplayUtil.getChildByName(this.oneDrawGroup,"name");
        icon.touchReward = reward;
        var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
        num.text = "x" + reward[2];
        var quality:string = UserProxy.inst.heroData.getHeroData(reward[1]).config.quality;
        icon.qualityBg = quality;
        light.visible = false;
        egret.Tween.get(light,{loop:true}).to({rotation:360},15000);
        var heroData:any = UserProxy.inst.heroData.getHeroData(reward[1]);
        if(rewardData.id == 6)
        {
            icon.imgIcon = Global.getChaIcon(reward[1]);
            light.visible = true;
            name.text = heroData.config.name;
        }
        else
        {
            icon.imgIcon = Global.getChaChipIcon(reward[1]);
            name.text = heroData.config.name + "元神";
            if(parseInt(reward[1]) == 126 || parseInt(reward[1]) == 129 || parseInt(reward[1]) == 130)
            {
                light.visible = true;
            }
        }

        var self = this;
        MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_one_effect"),"draw_one_effect",(data)=>
        {
            var mc: egret.MovieClip = data;
            mc.x = 240;
            mc.y = 385;
            self.addChild(mc);
            MovieClipUtils.playMCOnce(mc,function(): void
            {
                DisplayUtil.removeFromParent(mc);
                self.oneDrawGroup.visible = true;
                self.btnOneAgain.visible = false;
                self.btnOneBack.visible = false;
                self.drawIconShine();
            },this);

        },this);
    }

    private drawTenLight():void
    {
        var self = this;

        var mc:egret.MovieClip;
        MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_ten_light"),"draw_ten_light",(data)=>
        {
            mc = data;
            mc.x = 245;
            mc.y = 375;
            mc.name = "tenLight";
            self.addChild(mc);
            mc.play(-1);
            self.startFly();
        },this);

    }

    private startFly():void
    {
        this.imgTenFly.x = 220;
        this.imgTenFly.y = 370;
        this.imgTenFly.scaleY = 0.3;

        this.imgTenFly.rotation = this._rotations[this._drawTenIdx];
        var moveX:number = this._tenMovePos[this._drawTenIdx].x;
        var moveY:number = this._tenMovePos[this._drawTenIdx].y;
        this.imgTenFly.visible = true;

        if(this._isTenAgain)
        {
            egret.Tween.get(this.imgTenFly).to({scaleY:0.6,x:moveX,y:moveY},0);
            egret.setTimeout(flyOver,this,0);
        }
        else
        {
            egret.Tween.get(this.imgTenFly).to({scaleY:0.6,x:moveX,y:moveY},50);
            egret.setTimeout(flyOver,this,50);
        }



        var self = this;
        function flyOver():void
        {
            self.imgTenFly.visible = false;
            var awardGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(self.drawTenGroup,"awardGroup" + self._drawTenIdx);
            MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_ten_effect"),"draw_ten_effect",(data)=>
            {
                var mc: egret.MovieClip = data;
                mc.x = awardGroup.x + 32;
                mc.y = awardGroup.y + 32;
                self.addChild(mc);
                MovieClipUtils.playMCOnce(mc,function(): void
                {
                    DisplayUtil.removeFromParent(mc);
                    showAwardGet();
                },this);

            },this);
        }

        function showAwardGet():void
        {
            var id:number = self._rewardAry[self._drawTenIdx];
            var reward:any[] = Config.HeroDrawData[id]["reward_1"];
            var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];

            var awardGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(self.drawTenGroup,"awardGroup" + self._drawTenIdx);
            awardGroup.visible = true;
            var icon:WeaponIcon = <WeaponIcon>DisplayUtil.getChildByName(awardGroup,"icon");
            var num:eui.Label = <eui.Label>DisplayUtil.getChildByName(awardGroup,"num");
            var light:eui.Image = <eui.Image>DisplayUtil.getChildByName(awardGroup,"light");
            icon.touchReward = reward;
            num.text = "x" + reward[2];
            var quality:string = UserProxy.inst.heroData.getHeroData(reward[1]).config.quality;
            icon.qualityBg = quality;
            light.visible = false;
            egret.Tween.get(light,{loop:true}).to({rotation:360},15000);

            if(rewardData.id == 6)
            {
                icon.imgIcon = Global.getChaIcon(reward[1]);
                light.visible = true;
            }
            else
            {
                icon.imgIcon = Global.getChaChipIcon(reward[1]);
                if(parseInt(reward[1]) == 126 || parseInt(reward[1]) == 129 || parseInt(reward[1]) == 130)
                {
                    light.visible = true;
                }
            }

            self._drawTenIdx++;
            if(self._drawTenIdx <= 10)
            {
                if(id <= 199)//如果是英雄
                {
                    self.showDrawRole(id);
                }
                else
                {
                    if(self._drawTenIdx <= 9)
                    {
                        self.startFly();
                    }
                }

                if(self._drawTenIdx == 10)
                {
                    self.btnTenAgain.visible = true;
                    self.btnTenBack.visible = true;
                    var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(self,"tenLight");
                    if(mc)
                    {
                        mc.stop();
                        DisplayUtil.removeFromParent(mc);
                    }
                }
            }
        }
    }

    private drawIconShine():void
    {
        var self = this;

        MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_icon_shine"),"draw_icon_shine",(data)=>
        {
            var mc: egret.MovieClip = data;
            mc.x = 240;
            mc.y = 337;
            self.addChild(mc);
            MovieClipUtils.playMCOnce(mc,function(): void
            {
                DisplayUtil.removeFromParent(mc);

                //如果是role
                if(this._rewardAry[0] <= 199)
                {
                    self.showDrawRole(this._rewardAry[0]);
                    self.oneDrawGroup.visible = false;
                }
                else
                {
                    self.btnOneAgain.visible = true;
                    self.btnOneBack.visible = true;
                    self.oneBg.addEventListener(egret.TouchEvent.TOUCH_TAP,self.onDrawEnd,self);
                }
            },this);

        },this);
    }

    private showDrawRole(id:number):void
    {
        this.imgShowBody.source = Global.getHerobody(id);
        this.imgShowBody.visible = true;
        this.imgShowBody.scaleX = 0.2;
        this.imgShowBody.scaleY = 0.2;
        egret.Tween.get(this.imgShowBody).to({scaleX:0.8,scaleY:0.8},400);
        egret.setTimeout(function ()
        {
            this.showRoleDrawOver(id);
        },this,180);
    }


    private showRoleDrawOver(id:number):void
    {
        this._canCloseDraw = false;

        this.setChildIndex(this.drawOverGroup,100);
        this.drawOverGroup.visible = true;
        this.drawGroup.visible = false;
        var roleData = UserProxy.inst.heroData.getHeroData(id);
        this.drawTurnIcon.setLv = 0;
        this.drawTurnIcon.setStar = 0;
        this.drawTurnIcon.imgIcon = Global.getChaChipIcon(id);
        this.drawTurnNum.text = "x" + roleData.config.piece;

        this.imgRotate.visible = true;
        this.drawGroup.y = 300;
        egret.Tween.get(this.imgRotate,{loop:true}).to({rotation:360},10000);

        this.lblName.text = roleData.config.name;
        egret.setTimeout(roleChangeFragment,this,1200);
        egret.setTimeout(()=>{this._canCloseDraw = true;},this,1500);

        var self = this;
        function roleChangeFragment():void
        {
            if(roleData.level)//had
            {
                egret.Tween.removeTweens(self.imgRotate);
                self.imgRotate.visible = false;
                self.imgShowBody.visible = false;

                MovieClipUtils.createMovieClip(Global.getDrawEffect("draw_role_change"),"draw_role_change",(data)=>
                {
                    var mc: egret.MovieClip = data;
                    mc.x = 245;
                    mc.y = 330;
                    self.drawOverGroup.addChild(mc);
                    MovieClipUtils.playMCOnce(mc,function(): void
                    {
                        DisplayUtil.removeFromParent(mc);
                        self.drawGroup.visible = true;
                        egret.Tween.get(self.drawGroup).to({y:310},500);
                    },this);
                },this);
            }
            else
            {
                PanelManager.inst.showPanel("RoleDrawInfoPanel",{id:id,from:1});
            }
        }
    }

    private closeRoleDrawOver():void
    {
        if(!this._canCloseDraw)
        {
            return;
        }

        this.drawOverGroup.visible = false;
        var mc = DisplayUtil.getChildByName(this,"roleMc");
        if(mc)
        {
            DisplayUtil.removeFromParent(mc);
        }

        if(this._drawType == 1)
        {
            this.drawEnable();
        }
        else
        {
            if(this._drawTenIdx < 10)
            {
                this.startFly();
            }
        }

        if( UserMethod.inst.guideBajie)
        {
            UserMethod.inst.guideBajie = false;
            PanelManager.inst.hidePanel("RoleDrawPanel");
            UserProxy.inst.setBuffer(5);
            UserProxy.inst.nextGuide();
        }
    }

    private oneAgain():void
    {
        var self = this;
        if(UserProxy.inst.costAlart || this._cdTime <= 0 || UserProxy.inst.ticket)
        {
            oneWarning();
        }
        else
        {
            Alert.showCost(Config.BaseData[41]["value"],"寻仙一次",true,oneWarning,null,this);
        }


        function oneWarning()
        {
            if(UserProxy.inst.diamond >= parseInt(Config.BaseData[41]["value"]) || this._cdTime <= 0 || UserProxy.inst.ticket )
            {
                self.onDrawEnd();
                self.drawDisable();
                self._drawType = 1;
                Http.inst.send(CmdID.DRAW_HERO,{type:self._drawType});
            }
            else
            {
                ExternalUtil.inst.diamondAlert();
            }
        }
    }

    private tenAgain():void
    {
        this._isTenAgain = true;
        var self = this;
        if(UserProxy.inst.costAlart)
        {
            tenWarning();
        }
        else
        {
            Alert.showCost(Config.BaseData[42]["value"],"寻仙十次",true,tenWarning,null,this);
        }

        function tenWarning()
        {
            if(UserProxy.inst.diamond >= parseInt(Config.BaseData[42]["value"]))
            {
                self.tenDrawEnd();
                self.drawDisable();
                self._drawType = 2;
                self._drawTenIdx = 0;
                self.hideTenIcons();
                Http.inst.send(CmdID.DRAW_HERO,{type:self._drawType});
            }
            else
            {
                ExternalUtil.inst.diamondAlert();
            }
        }
    }

    private onDrawEnd():void
    {
        this.oneDrawGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDrawEnd,this);
        this.oneDrawGroup.visible = false;
        this.drawEnable();
    }

    private tenDrawEnd():void
    {
        if(this._drawTenIdx <= 9)
        {
            return;
        }
        this.drawTenGroup.visible = false;
        this.drawEnable();
    }

    private drawDisable():void
    {
        this.drawHideGroup.visible = false;
    }

    private drawEnable():void
    {
        for(var i in this._drawHeroList)
        {
            var hero:any = this._drawHeroList[i];
            var id:number = parseInt(i);
            var roleData = UserProxy.inst.heroData.getHeroData(id);
            hero["evolution"] = roleData.evolution;
        }

        UserProxy.inst.heroData.parse(this._drawHeroList);
        EventManager.inst.dispatch(ContextEvent.HAVE_NEW_ROLE);
        this.drawHideGroup.visible = true;
    }

    private guideClose():void
    {
        UserProxy.inst.heroData.parse(this._drawHeroList);
        EventManager.inst.dispatch(ContextEvent.HAVE_NEW_ROLE);
    }

    private onRoleShow(e:egret.TouchEvent):void
    {
        var id:number;
        if(e.currentTarget == this.roleShowGroup)
        {
            id = this._nowFirstMoveId;
            this._stopMove = 1;
            this.stopMove1();
        }
        else
        {
            id = this._nowNextMoveId;
            this._stopMove = 2;
            this.stopMove2();
        }
        PanelManager.inst.showPanel("RoleDrawInfoPanel",{id:id,from:0});
    }





    private onTouch(e:egret.TouchEvent):void
    {
        if(e.currentTarget == this.btnShowAll)
        {

        }
        else
        {

        }
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("RoleDrawPanel");
    }


    private cloudMove():void
    {
        egret.Tween.get(this.imgCloud2,{loop:true}).to({x:100},55000).wait(4800).to({x:282},37000).wait(6800);
        egret.Tween.get(this.imgCloud1,{loop:true}).to({x:32},32000).wait(3800).to({x:-212},59000).wait(1800);
        egret.Tween.get(this.imgCloud3,{loop:true}).to({x:-250},39000).wait(5300).to({x:-50},21000).wait(2800);
    }

    private onDrawShop():void
    {
        PanelManager.inst.showPanel("RoleChangePanel");
    }

    public destory():void
    {
        super.destory();

        this.btnOne.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDraw,this);
        this.btnTen.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDraw,this);
        this.roleShowGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRoleShow,this);
        this.roleShowGroup2.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRoleShow,this);
        this.btnShowAll.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnNotice.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.drawOverGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.closeRoleDrawOver,this);
        this.drawTenGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.tenDrawEnd,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        Http.inst.removeCmdListener(CmdID.DRAW_HERO,this.drawBack,this);
        EventManager.inst.removeEventListener("GUIDE_DRAW",this.onGuide,this);
        EventManager.inst.removeEventListener("GUIDE_DRAW_CLOSE",this.guideClose,this);
        EventManager.inst.removeEventListener(ContextEvent.CONTINUE_MOVE,this.continueMove,this);

        this.btnOneBack.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDrawEnd,this);
        this.btnTenBack.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.tenDrawEnd,this);
        this.btnOneAgain.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.oneAgain,this);
        this.btnTenAgain.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.tenAgain,this);
        this.btnDrawShop.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDrawShop,this);

        egret.Tween.removeTweens(this.imgCloud2);
        egret.Tween.removeTweens(this.imgCloud1);
        egret.Tween.removeTweens(this.imgCloud3);
        TickerUtil.unregister(this.tickerTime,this);
        this.coinShow.endListener();
    }

}