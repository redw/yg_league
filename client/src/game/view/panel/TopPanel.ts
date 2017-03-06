/**
 * Created by Administrator on 12/12 0012.
 */
class TopPanel extends BasePanel
{
    public btnSevenDay:SimpleButton;
    public btnActive:SimpleButton;
    public btnFeed:SimpleButton;
    public btnFriend:SimpleButton;
    public btnMail:SimpleButton;
    public btnInvite:SimpleButton;
    public btnAttention:SimpleButton;
    public btnPoster:SimpleButton;
    public btnFirstRecharge:SimpleButton;
    public btnPrivilege:SimpleButton;
    public btnDayTask:SimpleButton;
    public btnTurnLeft:SimpleButton;
    public btnTarget:SimpleButton;
    public btnRank:SimpleButton;
    public btnSetting:SimpleButton;
    public btnDial:SimpleButton;
    public btnNotice:SimpleButton;
    public btnLimitActive:SimpleButton;
    public btnCircleBack:SimpleButton;
    public contentGroup:eui.Group;
    public newGroup:eui.Group;
    public imgBg:eui.Image;
    public btnFormation:SimpleButton;

    public btnFirstRechargeNew:SimpleButton;
    public btnAttentionNew:SimpleButton;
    public btnTargetNew:SimpleButton;
    public btnInviteNew:SimpleButton;

    private _f_hide:boolean = false;
    private _m_hide:boolean = false;

    public hideRightGroup:eui.Group;

    private _leftRight:boolean;
    private _leftRightGroup:SimpleButton[] = [];
    private _leftRightTurning:boolean = false;
    private _boardShow:boolean;

    private _lineOneGroup:SimpleButton[] = [];
    private _lineOneCount:number = 0;
    private _lineOneX:number[] = [419,361,303,245,187,129];
    private _lineOneY:number[] = [10,10,10,10,10,10];

    private _lineMissGroup:SimpleButton[] = [];
    private _lineMissPosX:number[] = [187,126,68,10];
    private _lineMissPosY:number[] = [75,75,75,75];

    private _lastPayShow:boolean = false;
    private _lastTargetShow:boolean = false;

    public static _inst:TopPanel;
    static  get inst():TopPanel
    {
        return TopPanel._inst;
    }

    public constructor()
    {
        super();
        TopPanel._inst = this;
        this._layer = PanelManager.BOTTOM_LAYER;
        this.skinName = TopPanelSkin;
        this.horizontalCenter = 0;
        this.top = 0;
    }

    public init(): void
    {

        EventManager.inst.addEventListener(ContextEvent.OPEN_FUNCTION,this.checkOpen,this);

        this.btnSevenDay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSevenDay,this);
        this.btnActive.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onActive,this);
        this.btnFeed.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onFeed,this);
        this.btnFriend.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onFriend,this);
        this.btnMail.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMail,this);
        this.btnDayTask.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDayTask,this);
        this.btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRank,this);
        this.btnTarget.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTarget,this);
        this.btnTargetNew.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTarget,this);
        this.btnTurnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTurnUpDown,this);
        this.btnFirstRecharge.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onFirstRecharge,this);
        this.btnFirstRechargeNew.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onFirstRecharge,this);
        this.btnAttention.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAttention,this);
        this.btnAttentionNew.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onAttention,this);
        this.btnPrivilege.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onPrivilege,this);
        this.btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSetting,this);
        this.btnPoster.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onPoster,this);
        this.btnInvite.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
        this.btnInviteNew.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
        this.btnDial.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDial,this);
        this.btnNotice.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onNotice,this);
        this.btnLimitActive.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLimitActive,this);
        this.btnCircleBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCircleBack,this);
        this.btnFormation.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onFormation,this);

        // EventManager.inst.addEventListener(ContextEvent.GUIDE_CLOSE_FORMATION,this.showTargetHand,this);
        EventManager.inst.addEventListener(ContextEvent.PVE_SYNC_RES, this.showHelp, this);
    }

    private showHelp(e:egret.Event):void
    {
        if(e.data.ret = 0)
        {
            if(UserProxy.inst.server_time > UserMethod.inst.helpTime + 180)
            {
                UserMethod.inst.helpTime = UserProxy.inst.server_time;
                if(UserProxy.inst.historyArea < 100 || UserProxy.inst.circleObj["circleTimes"] < 1)
                {
                    var random:number = MathUtil.rangeRandom(1,2);
                    PanelManager.inst.showPanel("HelpPanel",random);
                }
            }
        }
    }

    public initData(): void
    {
        if(Global.TEST_SERVER == "")
        {
            this.btnFeed.visible = false;
        }

        this.checkFormation();
        this.checkOpen();
        // this.showTargetHand();


    }

    public checkHide():void
    {
        UserMethod.inst.removeRedPoint(this.btnTurnLeft.parent,"board");
        if(this._boardShow)
        {
            UserMethod.inst.addRedPoint(this.btnTurnLeft.parent,"board",new egret.Point(this.btnTurnLeft.x + 20,this.btnTurnLeft.y-15));
        }
    }

    /*private showTargetHand():void
    {
        if(UserProxy.inst.isGuideEnd())
        {
            var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this,"hand");
            if(mc)
            {
               return;
            }

            if(UserProxy.inst.server_time >= UserMethod.inst.handTime + 120  && UserProxy.inst.circleObj["circleTimes"] < 1)
            {
                UserMethod.inst.handTime = UserProxy.inst.server_time;
                MovieClipUtils.createMovieClip(Global.getOtherEffect("hand_effect"),"hand_effect",function(mc: egret.MovieClip): void
                {
                    mc.x = 445;
                    mc.y = 125;
                    mc.scaleX = -1;
                    mc.name = "hand";
                    mc.play(-1);
                    this.addChild(mc);
                },this);
            }
        }
    }*/


    public onTurnUpDown():void
    {
        if (this._leftRightTurning)
        {
            return;
        }

        this._leftRight = !this._leftRight;
        this._leftRightTurning = true;
        var time: number = 200;
        if (this._leftRight)
        {
            UserMethod.inst.removeRedPoint(this.btnTurnLeft.parent,"board");
            Global.getStage().addEventListener(egret.TouchEvent.TOUCH_TAP,this.onOther,this);
            egret.Tween.get(this.contentGroup).to({y: 0}, time);
            egret.Tween.get(this.btnTurnLeft).to({rotation: 0}, time);
            EventManager.inst.dispatch(ContextEvent.FIGHT_PROGRESS_POS,false);
        }
        else
        {
            if(this._boardShow)
            {
                UserMethod.inst.addRedPoint(this.btnTurnLeft.parent,"board",new egret.Point(this.btnTurnLeft.x + 20,this.btnTurnLeft.y-15));
            }

            Global.getStage().removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onOther,this);
            egret.Tween.get(this.contentGroup).to({y: -70}, time);
            egret.Tween.get(this.btnTurnLeft).to({rotation: 180}, time);
            EventManager.inst.dispatch(ContextEvent.FIGHT_PROGRESS_POS,true);
        }
        egret.setTimeout(function () {this._leftRightTurning = false;},this,time);
    }

    private onOther(e:egret.TouchEvent):void
    {
        var bResult:boolean = this.contentGroup.hitTestPoint( e.stageX, e.stageY );
        if(!bResult)
        {
            this.onTurnUpDown();
        }
    }

    private onTurnLeft():void
    {
        if(this._leftRightTurning)
        {
            return;
        }
        this._leftRight = !this._leftRight;
        this._leftRightTurning = true;
        var length:number = this._leftRightGroup.length;
        var interval:number = 125;
        var time:number = interval*length;
        if(this._leftRight)
        {
            egret.Tween.get(this.btnTurnLeft).to({rotation:-90},time);
            egret.Tween.get(this.hideRightGroup).to({x:744},time);
            for(var i:number = 0;i < length;i++)
            {
                let btn:SimpleButton = this._leftRightGroup[i];
                egret.setTimeout(function () {btn.visible = false},this,interval*(i+1));
            }
        }
        else
        {
            egret.Tween.get(this.btnTurnLeft).to({rotation:90},time);
            egret.Tween.get(this.hideRightGroup).to({x:414},time-100);
            for(var i:number = 0;i < length;i++)
            {
                let btn:SimpleButton = this._leftRightGroup[i];
                egret.setTimeout(function () {btn.visible = true},this,time - interval*(i+1));
            }
        }

        egret.setTimeout(function () {  this._leftRightTurning = false;},this,time);
    }

    private checkOpen():void
    {
        if(UserProxy.inst.historyArea < 10)
        {
            this.contentGroup.visible = false;
            this.newGroup.visible = true;
        }
        else
        {
            this.contentGroup.visible = true;
            this.newGroup.visible = false;

            this._leftRight = false;
            this.onTurnUpDown();
        }

        this.showPoint();
    }

    public checkFormation():void
    {
        if(UserMethod.inst.formationCheck())
        {
            this.btnFormation.visible = true;
        }
        else
        {
            this.btnFormation.visible = false;
        }
    }

    public hideFormation():void
    {
        this.btnFormation.visible = false;
    }

    //首冲1 海报2 分享3 每日4 目标5 转盘6 七日7 限时8
    public showPoint(type?:number,limit?:number):void
    {
        var showAll:boolean = type ? false : true;

        var attentionShow:boolean = false;
        var firstPayShow:boolean = false;
        var postShow:boolean = false;
        var targetShow:boolean = false;
        var sevenDayShow:boolean = false;

        if(type == 14 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnAttention.parent,"attention");
            UserMethod.inst.removeRedPoint(this.btnAttentionNew.parent,"attention");
            var isFocus:boolean = false;
            if(ExternalUtil.inst.getIsHT())
            {
                isFocus = ExternalUtil.inst.getIsHtForce();
                this.btnAttention.source = "top_ht_attention _png";
                this.btnAttentionNew.source = "top_ht_attention _png";
            }
            else if(ExternalUtil.inst.getIsYYB())
            {
                isFocus = true;
            }
            else
            {
                isFocus = UserProxy.inst.isFocus == 1;
            }

            if(!isFocus)
            {
                attentionShow = true;
            }
            else
            {
                this.btnAttention.visible = false;
                this.btnAttentionNew.visible = false;
            }
        }


        if(type == 1 || showAll) //首冲
        {
            UserMethod.inst.removeRedPoint(this.btnFirstRecharge.parent,"first");
            UserMethod.inst.removeRedPoint(this.btnFirstRechargeNew.parent,"first");
            if(UserProxy.inst.rechargeFlag == 0 || UserProxy.inst.rechargeFlag == 1)
            {
                firstPayShow = true;
            }
            else if(UserProxy.inst.rechargeFlag == 2)
            {
                this.btnFirstRecharge.visible = false;
                this.btnFirstRechargeNew.visible = false;
            }
        }

        if(type == 2 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnPoster.parent,"poster");
            if(ExternalUtil.inst.getIsYYB())
            {
                this.btnPoster.visible = false;
            }
            else
            {
                if(UserMethod.inst.posterCheck()) //海报判断
                {
                    postShow = true;
                }
            }
        }

        if(type == 5 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnTarget.parent,"target");

            if(UserMethod.inst.isTargetEnd())
            {
                this.btnTarget.visible = false;
            }
            else
            {
                if(UserMethod.inst.targetCheck()) //目标
                {
                    targetShow = true;
                }
            }
        }

        if(type == 7 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnSevenDay.parent,"seven");
            this.btnSevenDay.visible = true;
            if(UserMethod.inst.sevenDayCheck()) //7日
            {
                sevenDayShow = true;
            }
            else
            {
                if(UserMethod.inst.activeDayEndTime() < UserProxy.inst.server_time)
                {
                    this.btnSevenDay.visible = false;
                }
            }
        }

        if(showAll || this.btnTarget.visible != this._lastTargetShow || this.btnFirstRecharge.visible != this._lastPayShow)
        {
            this._lineOneGroup = [];
            this._lineMissGroup = [];
            this._lineOneGroup.push(this.btnMail);this._lineOneGroup.push(this.btnRank);this._lineOneGroup.push(this.btnPoster);
            this._lineOneGroup.push(this.btnFriend);this._lineOneGroup.push(this.btnNotice);this._lineOneGroup.push(this.btnSetting);
            this._lineMissGroup.push(this.btnTarget);this._lineMissGroup.push(this.btnSevenDay);
            this._lineMissGroup.push(this.btnAttention);this._lineMissGroup.push(this.btnFirstRecharge);
            this._lineOneCount = 6;
            if(this.btnFirstRecharge.visible == false){this._lineOneCount -= 1;this._lineMissGroup.splice(this._lineMissGroup.indexOf(this.btnFirstRecharge),1);}
            if(this.btnAttention.visible == false){this._lineOneCount -= 1;this._lineMissGroup.splice(this._lineMissGroup.indexOf(this.btnAttention),1);}
            if(this.btnSevenDay.visible == false){this._lineOneCount -= 1;this._lineMissGroup.splice(this._lineMissGroup.indexOf(this.btnSevenDay),1);}
            if(this.btnTarget.visible == false){this._lineOneCount -= 1;this._lineMissGroup.splice(this._lineMissGroup.indexOf(this.btnTarget),1);}
            // if(this.btnPoster.visible == false){this._lineOneCount -= 1;this._lineMissGroup.splice(this._lineMissGroup.indexOf(this.btnPoster),1);}

            var subCount:number = 6 - this._lineOneCount;
            var needMove:boolean = false;
            if(this._lineOneGroup.length > this._lineOneCount)
            {
                for(var j:number = 0; j < subCount ;j ++)
                {
                    var btn:SimpleButton = this._lineOneGroup.shift();
                    this._lineMissGroup.push(btn);
                    needMove = true;
                }
            }

            if(this.btnPoster.visible == false)
            {
                if(this._lineOneGroup.indexOf(this.btnPoster) > -1)
                {
                    this._lineOneGroup.splice(this._lineOneGroup.indexOf(this.btnPoster),1);
                }
                if(this._lineMissGroup.indexOf(this.btnPoster) > -1)
                {
                    this._lineMissGroup.splice(this._lineMissGroup.indexOf(this.btnPoster),1);
                    var btn:SimpleButton = this._lineOneGroup.shift();
                    this._lineMissGroup.push(btn);
                }
            }

            if(needMove)
            {
                var oneCount:number = this._lineOneGroup.length;
                for(var j:number = 0; j < oneCount;j++)
                {
                    this._lineOneGroup[j].x = this._lineOneX[j];
                    this._lineOneGroup[j].y = this._lineOneY[j];
                }

                for(var l:number = 0; l < 4;l++)
                {
                    this._lineMissGroup[l].x = this._lineMissPosX[l];
                    this._lineMissGroup[l].y = this._lineMissPosY[l];
                }
            }

        }

        if(attentionShow)
        {
            UserMethod.inst.addRedPoint(this.btnAttentionNew.parent,"attention",new egret.Point(this.btnAttentionNew.x + 40,this.btnAttentionNew.y + 10));
            UserMethod.inst.addRedPoint(this.btnAttention.parent,"attention",new egret.Point(this.btnAttention.x + 40,this.btnAttention.y + 10));
        }

        if(firstPayShow)
        {
            UserMethod.inst.addRedPoint(this.btnFirstRechargeNew.parent,"first",new egret.Point(this.btnFirstRechargeNew.x + 40,this.btnFirstRechargeNew.y + 10));
            UserMethod.inst.addRedPoint(this.btnFirstRecharge.parent,"first",new egret.Point(this.btnFirstRecharge.x + 40,this.btnFirstRecharge.y + 10));
        }

        if(targetShow)
        {
            UserMethod.inst.addRedPoint(this.btnTarget.parent,"target",new egret.Point(this.btnTarget.x + 40,this.btnTarget.y + 10));
        }

        if(sevenDayShow)
        {
            UserMethod.inst.addRedPoint(this.btnSevenDay.parent,"seven",new egret.Point(this.btnSevenDay.x + 40,this.btnSevenDay.y + 10));
        }

        if(postShow)
        {
            UserMethod.inst.addRedPoint(this.btnPoster.parent,"poster",new egret.Point(this.btnPoster.x + 40,this.btnPoster.y + 10));
        }

        if(type == 3 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnInvite.parent,"share");
            if(UserMethod.inst.shareCheck()) //分享
            {
                UserMethod.inst.addRedPoint(this.btnInvite.parent,"share",new egret.Point(this.btnInvite.x + 40,this.btnInvite.y + 10));
            }
        }

        if(type == 4 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnDayTask.parent,"day");
            var daily:boolean = false;
            var achieve:boolean = false;
            if(UserMethod.inst.dailyCheck())
            {
                daily = true;
            }
            if(UserMethod.inst.achieveCheck())
            {
                achieve = true;
            }
            if(daily || achieve) //每日
            {
                UserMethod.inst.addRedPoint(this.btnDayTask.parent,"day",new egret.Point(this.btnDayTask.x + 40,this.btnDayTask.y + 10));
            }
        }

        if(type == 6 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnDial.parent,"dial");
            this.btnDial.visible = true;
            if(UserMethod.inst.dialCheck()) //转盘
            {
                UserMethod.inst.addRedPoint(this.btnDial.parent,"dial",new egret.Point(this.btnDial.x + 50,this.btnDial.y + 10));
            }
            else
            {
                this.btnDial.visible = false;
            }
        }



        if(type == 8 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnLimitActive.parent,"limit");
            this.btnLimitActive.visible = true;
            if(UserMethod.inst.openLimitActive()) //限时
            {
                if(UserMethod.inst.limitActiveCheck(limit))
                {
                    UserMethod.inst.addRedPoint(this.btnLimitActive.parent,"limit",new egret.Point(this.btnLimitActive.x + 40,this.btnLimitActive.y + 10));
                }
            }
            else
            {
                this.btnLimitActive.visible = false;
            }
        }

        if(type == 9 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnCircleBack.parent,"circle");
            this.btnCircleBack.visible = true;
            if(UserMethod.inst.circleGoCheck()) //
            {
                UserMethod.inst.addRedPoint(this.btnCircleBack.parent,"circle",new egret.Point(this.btnCircleBack.x + 50,this.btnCircleBack.y + 10));
            }
            else
            {
                this.btnCircleBack.visible = false;
            }
        }

        if(type == 10 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnPrivilege.parent,"privilege");
            if(UserMethod.inst.privilegeCheck()) //特权
            {
                UserMethod.inst.addRedPoint(this.btnPrivilege.parent,"privilege",new egret.Point(this.btnPrivilege.x + 40,this.btnPrivilege.y + 10));
            }
        }

        if(type == 11 || showAll)
        {
            UserMethod.inst.removeRedPoint(this.btnActive.parent,"active");
            if(UserMethod.inst.activeCheck(limit)) //活动
            {
                UserMethod.inst.addRedPoint(this.btnActive.parent,"active",new egret.Point(this.btnActive.x + 40 ,this.btnActive.y + 10));
            }
        }

        if(type == 12 || showAll)
        {
            this._f_hide = false;
            UserMethod.inst.removeRedPoint(this.btnFriend.parent,"friend");
            if(UserMethod.inst.friendCheck()) //好友
            {
                this._f_hide = true;
                UserMethod.inst.addRedPoint(this.btnFriend.parent,"friend",new egret.Point(this.btnFriend.x + 40,this.btnFriend.y + 10));
            }
        }

        if(type == 13 || showAll)
        {
            this._m_hide = false;
            UserMethod.inst.removeRedPoint(this.btnMail.parent,"mail");
            if(UserMethod.inst.mailCheck()) //邮件
            {
                this._m_hide = true;
                UserMethod.inst.addRedPoint(this.btnMail.parent,"mail",new egret.Point(this.btnMail.x + 40,this.btnMail.y + 10));
            }
        }

        if(this._m_hide||this._f_hide)
        {
            var mail:boolean = false;
            var friend:boolean = false;
            if(this._m_hide)
            {
                if(this._lineOneGroup.indexOf(this.btnMail) > -1)
                {
                    mail = true;
                }
            }

           if(this._f_hide)
           {
               if(this._lineOneGroup.indexOf(this.btnFriend) > -1)
               {
                   friend = true;
               }
           }
            if(mail || friend)
            {
                this._boardShow = true;
            }
        }
        else
        {
            this._boardShow = false;
        }

        this._lastPayShow = this.btnFirstRecharge.visible;
        this._lastTargetShow = this.btnTarget.visible;

    }

    private onSevenDay():void
    {
        PanelManager.inst.showPanel("SevenDayPanel");
    }

    private onActive():void
    {
        PanelManager.inst.showPanel("ActivePanel");
    }

    private onFeed():void
    {
        PanelManager.inst.showPanel("FeedBackPanel");
    }

    private onFriend():void
    {
        PanelManager.inst.showPanel("FriendMainPanel",3);
    }

    private onMail():void
    {
        PanelManager.inst.showPanel("MailPanel");
    }

    private onAchieve():void
    {
        PanelManager.inst.showPanel("DailyAchievePanel",2);
    }

    private onDayTask():void
    {
        PanelManager.inst.showPanel("DailyAchievePanel",1);
    }

    private onRank():void
    {
        PanelManager.inst.showPanel("RankPanel");
    }

    private onTarget():void
    {
        var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this,"hand");
        if(mc)
        {
            mc.stop();
            DisplayUtil.removeFromParent(mc);
        }
        PanelManager.inst.showPanel("TargetPanel");
    }

    private onAttention():void
    {
        ExternalUtil.inst.showFocus();
    }

    private onLimitActive():void
    {
        PanelManager.inst.showPanel("ActiveLimitPanel");
    }

    private onFirstRecharge():void
    {
        UserMethod.inst.removeRedPoint(this.btnFirstRecharge.parent,"first");
        PanelManager.inst.showPanel("FirstRechargePanel");
    }

    private onPrivilege():void
    {
        PanelManager.inst.showPanel("PrivilegePanel");
    }

    private onSetting():void
    {
        PanelManager.inst.showPanel("SettingPanel");
    }

    private onDial():void
    {
        PanelManager.inst.showPanel("DialPanel");
    }

    private onPoster():void
    {
        PanelManager.inst.showPanel("FriendMainPanel",2);
    }

    private onShare():void
    {
        PanelManager.inst.showPanel("FriendMainPanel",1);
    }

    private onNotice():void
    {
        PanelManager.inst.showPanel("NoticePanel");

    }

    public onCircleBack():void
    {
        PanelManager.inst.showPanel("CircleGoPanel");
    }

    public onFormation():void
    {
        UserMethod.inst.showHelpFormation = 1;
        MenuPanel.inst.openMenu(2);
    }


    public destory():void
    {
        super.destory();

        this.btnSevenDay.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSevenDay,this);
        this.btnActive.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onActive,this);
        this.btnFeed.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onFeed,this);
        this.btnFriend.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onFriend,this);
        this.btnMail.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMail,this);
        this.btnDayTask.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDayTask,this);
        this.btnRank.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onRank,this);
        this.btnTarget.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTarget,this);
        this.btnTurnLeft.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTurnUpDown,this);
        this.btnFirstRecharge.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onFirstRecharge,this);
        this.btnAttention.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onAttention,this);
        this.btnPrivilege.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onPrivilege,this);
        this.btnSetting.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSetting,this);
        this.btnPoster.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onPoster,this);
        this.btnInvite.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
        this.btnDial.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onDial,this);
        this.btnNotice.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onNotice,this);
        this.btnLimitActive.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onLimitActive,this);
        this.btnFormation.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onFormation,this);

        // EventManager.inst.removeEventListener(ContextEvent.GUIDE_CLOSE_FORMATION,this.showTargetHand,this);
        // EventManager.inst.removeEventListener(ContextEvent.TARGET_HANG,this.showTargetHand,this);
        EventManager.inst.removeEventListener(ContextEvent.PVE_SYNC_RES, this.showHelp, this);
    }
}