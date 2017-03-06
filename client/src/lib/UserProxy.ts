/**
 * 用户数据
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
class UserProxy extends egret.HashObject
{
    private static _instance: UserProxy = null;

    static get inst(): UserProxy
    {
        if (UserProxy._instance == null)
        {
            UserProxy._instance = new UserProxy();
            UserProxy._instance.clearTaskCD();
            UserProxy._instance.setup();
        }
        return UserProxy._instance;
    }

    // ************************************************** //

    public uid: number;
    public nickname: string;
    public headimgurl: string;
    public gold: string;
    public diamond: number;
    public curArea:number;                  // 当前开启的最低关卡数
    public lastLoginTime: number;
    public lastAliveTime: number;
    public isGetFocusPrize: number;
    public dayShare: number;
    public lastShareTime: number;
    public server_time:number;
    public offlineGold:number;
    public offlineTime:number;
    public historyArea:number;
    public pill:number;
    public todayEnter:number;


    public guide: string;
    public isFocus: number = 0;//是否关注

    //
    public taskCDList:number[];
    public taskHand:number[];
    public makeMoney:any;

    public heroData:HeroModel = new HeroModel();
    public fightData:FightDataModel = new FightDataModel();

    /**monster*/
    public monsterObj:any;
    public allKindPiece:number;
    public buyVitTimes:number;
    public lastRecoverTime:number;
    public monsterList:any;
    public score:number;
    public vitality:number;
    public vitalityMax:number;
    public recoverNum:number;

    /**weapon*/
    public maxNum:number;//物品栏
    public buyNum:number;
    public weaponCoin:number[];
    public weaponShop:any;
    public weaponShopResetLastTime:number;
    public weaponList:any;

    /**sign*/
    public lastSignTime:number;
    public signDays:number;
    public todayFlag:number;

    /**sevenDay*/
    public sevenDayBegTime:number;
    public sevenDayBit:string;
    public sevenBuyBit:string;
    public rmbDays:number;

    /**friend*/
    public giftMsg:any;
    public newMsg:any;
    public friendList:any;
    public userInfos:any;
    public friendCoin:number;
    public friendTimes:number;
    public getGiftTimes:number;
    public newFriend:any;

    /**draw*/
    public drawTimes:number;
    public lastFreeTime:number;
    public ticket:number;
    public soulCoin:number[];

    /**mail*/
    public mailFlag:number;
    public mail:any;

    /**dungeonObj*/
    public buyTimes:number;
    public dungeonList:any;
    public freeTimes:number;
    public dungeonLastRecoverTime:number;
    public maxTimes:number;

    /**achievementObj*/
    public achievementObj:any;
    public achieveBit:string;
   /**taskObj*/
    public taskObj:any;
    public taskBit:string;
    /**rank*/
    public rankTime:number = 0 ;
    public pvpRankTime:number = 0;
    public pvpNowRankTime:number = 0;
    public pvpHonorTime:number = 0;
    public topRanks:any;
    public myTopRank:number;
    public myScore:number;
    public pvpTopRanks:any;
    public pvpMyTopRank:number;
    public pvpNowTopRanks:any;
    public pvpNowMyTopRank:number;
    public pvpNowMyTopScore:number;
    public pvpHonorTopRanks:any;


    /**missionObj*/
    public missionObj:any;
    public missionBit:string;
    /**dailyObj*/
    public dailyObj:any;
    /**shareObj*/
    public shareObj:any;
    /**vipObj*/
    public vipObj:any;
    /**pvpShopObj*/
    public pvpShopObj:any;
    /**circleObj*/
    public circleObj:any;
    public medal:number;
    /**shopObj*/
    public shopObj:any;
    /**rechargeFlag*/
    public rechargeFlag:number;
    public wheelTimes:number;
    /**inviteObj*/
    public inviteObj:any;
    /**activityObj*/
    public activityObj:any;
    /**home*/
    public home:any;
    public building:any;
    public mineOutputAry:number[];
    public ore:number;

    public inviteUserInfos:any;
    public relationship:any;//情缘

    /** 神器数据 */
    public newObj:any;

    //充值订单
    public rmbGet:any;

    //设置
    public setting:string ="";
    public costAlart:boolean;
    public soundOpen:boolean;
    public musicOpen:boolean;
    public noticeOpen:boolean = false;

    /**buff*/
    public subOpenXunShanMoney:number;
    public subXunShanTime:number;
    public subRiseXunShanMoney:number;
    public addXunShanAward:number;
    public subFriendMoney:number;
    public subMissonHp:number;
    public subSecretHp:number;
    public addSecretAward:number;
    public addTurnMedal:number;


    public setup(): void
    {
        TickerUtil.register(UserProxy.inst.onTicker_1, this, 1000);
        TickerUtil.register(UserProxy.inst.onTicker_4, this, 30000);
        TickerUtil.register(UserProxy.inst.checkTarget, this, 10000);
        this.startAlive();
      /*

        TickerUtil.register(UserProxy.inst.onTicker_3, this, 60000);

        UserProxy.inst.onTicker_2();*/
    }

    public startAlive():void
    {
        TickerUtil.register(UserProxy.inst.onTicker_2, this, 5000);
    }
    public stopAlive():void
    {
        TickerUtil.unregister(UserProxy.inst.onTicker_2, this);
    }

    public setTask():void
    {
        TickerUtil.register(UserProxy.inst.onTaskTick,this,50);
    }

    public startCheckBattle():void
    {
        UserMethod.inst.sendBattleSyncTime = 5;
        TickerUtil.register(UserProxy.inst.checkBattleCmd, this, 5000);
    }

    public endCheckBattle():void
    {
        TickerUtil.unregister(UserProxy.inst.checkBattleCmd, this);
    }

    public checkBattleCmd():void
    {
        if(UserMethod.inst.sendBattleSyncTime > 0)
        {
            UserMethod.inst.sendBattleSyncTime--;
        }
        else
        {
            EventManager.inst.dispatch(ContextEvent.PVE_SYNC_AGAIN);
        }
    }


    public clearTaskCD():void
    {
        this.taskCDList = [];
        this.taskHand = [];
        for(var i:number = 1 ; i < 100 ; i++)
        {
            this.taskCDList[i] = 0;
            this.taskHand[i] = 0;
        }
    }

    public setLastTaskCD():void
    {
        for(var i:number = 1 ; i < 100 ; i++)
        {
            var moneyInfo:any = UserProxy.inst.makeMoney[i];
            if(moneyInfo && moneyInfo["lv"] && moneyInfo["lastMoneyTime"])
            {
                var cdTime:number = (UserProxy.inst.server_time - moneyInfo["lastMoneyTime"])*1000;
                this.taskCDList[i] = cdTime;

                if(moneyInfo["auto"] == 0 && cdTime)
                {
                    this.taskHand[i] = 1;
                }
            }
        }
    }

    public get goldString():string
    {
        return MathUtil.easyNumber(this.gold);
    }

    private onTicker_1(): void
    {
        UserProxy.inst.server_time += 1;
        if(UserMethod.inst.aliveTime)
        {
            UserMethod.inst.aliveTime++;
            if(UserMethod.inst.aliveTime > 30)
            {
                Alert.show("与服务器连接异常，\n请重新登录！", false, function()
                {
                    window.location.reload();
                },null,this);
            }
        }
    }

    private onTicker_2(): void
    {
        this.stopAlive();
        UserMethod.inst.aliveTime = 1;
        Http.inst.send(CmdID.ALIVE);
    }

    private onTicker_3(): void
    {
        Http.inst.send(CmdID.HAS_NEW_MAIL);
        EventManager.inst.dispatch("CHECK_ACTIVE_RED_POINT");
    }

    private onTicker_4():void
    {
        if(PanelManager.inst.isShow("MenuPanel"))
        {
            MenuPanel.inst.checkDraw();
            MenuPanel.inst.checkMoney();
            MenuPanel.inst.checkMine();
            TopPanel.inst.checkFormation();
        }

        TopPanel.inst.showPoint(7);
        TopPanel.inst.checkHide();

        // EventManager.inst.dispatch(ContextEvent.TARGET_HANG);
        EventManager.inst.dispatch(ContextEvent.LABEL_MOVE_SHOW);
    }

    private checkTarget():void
    {
        TopPanel.inst.showPoint(5);
    }

    private _lastNow:number = 0;
    private _lastPass:number = 0;

    private onTaskTick():void
    {
        var delta:number = 50;

        if(this._lastNow)
        {
            var passTime:number = Date.now() - this._lastNow;
            if(passTime < 50)
            {
                this._lastPass += passTime;
                if(this._lastPass >= 50)
                {
                    this._lastPass = 0;
                    return;
                }
            }
        }
        this._lastNow = Date.now();

        for(var i in this.taskCDList)
        {
            var taskInfo:any = this.makeMoney[i];
            if(taskInfo && taskInfo["lv"] &&(taskInfo["auto"] || this.taskHand[i]))
            {
                var taskData:any = Config.MakeMoneyData[i];
                this.taskCDList[i] += delta;
                var dataTime:number = taskData["time"] / UserProxy.inst.subXunShanTime;
                var nextTime:number = dataTime * 1000;
                if(this.taskCDList[i] >= nextTime)
                {
                    this.taskCDList[i] = this.taskCDList[i] % nextTime;

                    if(!taskInfo["auto"])
                    {
                        this.taskHand[i] = 0;
                    }
                }
            }
        }
        EventManager.inst.dispatch(ContextEvent.REFRESH_TASK);
    }


    public nextGuide(): void
    {
        var step:number = UserProxy.inst.getGuideStep();
        if (step == 1)
        {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_HEROUP");
                UserProxy.inst.setBuffer(1);
                UserProxy.inst.nextGuide();
            }, "thisObj": this});
        }
        else if (step == 2)
        {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_HEROUP");
                UserProxy.inst.setBuffer(2);
                UserProxy.inst.nextGuide();
            }, "thisObj": this});
        }
        else if (step == 3)
        {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_HEROUP");
                UserProxy.inst.setBuffer(3);

            }, "thisObj": this});
        }
        else if (step == 4)
        {
            if(UserProxy.inst.historyArea < 10)
            {
                return;
            }
            this.guideClosePanel();
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                PanelManager.inst.showPanel("RoleDrawPanel");
                UserProxy.inst.setBuffer(4);
                UserProxy.inst.nextGuide();

            }, "thisObj": this});
        }
        else if (step == 5)
        {
            if(!PanelManager.inst.isShow("RoleDrawPanel"))
            {
                var hero:any = UserProxy.inst.heroData.getHeroData(103);
                if(hero.level)
                {
                    UserProxy.inst.setBuffer(5);
                    UserProxy.inst.nextGuide();
                }
                else
                {
                    PanelManager.inst.showPanel("RoleDrawPanel")
                }

            }
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                UserMethod.inst.guideBajie = true;
                EventManager.inst.dispatch("GUIDE_DRAW");

            }, "thisObj": this});
        }
        else if (step == 6)
        {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                PanelManager.inst.showPanel("RoleFormationPanel",{type:1});
                UserProxy.inst.setBuffer(6);
                UserProxy.inst.nextGuide();
            }, "thisObj": this});
        }
        else if (step == 7)
        {
            if(!PanelManager.inst.isShow("RoleFormationPanel"))
            {
                PanelManager.inst.showPanel("RoleFormationPanel",{type:1});
            }
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_FORMATION_1");
                UserProxy.inst.setBuffer(7);
                UserProxy.inst.nextGuide();
            }, "thisObj": this});
        }
        else if (step == 8)
        {
            if(!PanelManager.inst.isShow("RoleFormationPanel"))
            {
                UserProxy.inst.setBuffer(7,false);
                UserProxy.inst.nextGuide();
            }

            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_FORMATION_2");
                UserProxy.inst.setBuffer(8);
                UserProxy.inst.nextGuide();
            }, "thisObj": this});
        }
        else if (step == 9)
        {
            if(!PanelManager.inst.isShow("RoleFormationPanel"))
            {
                UserProxy.inst.setBuffer(7,false);
                UserProxy.inst.setBuffer(8,false);
                UserProxy.inst.nextGuide();
            }

            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_CLOSE_FORMATION");
                UserProxy.inst.setBuffer(9);
                UserProxy.inst.nextGuide();

            }, "thisObj": this});
        }
        else if (step == 10)
        {
            MenuPanel.inst.openMenu(2);
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_HEROUP_2");
                UserProxy.inst.setBuffer(10);

            }, "thisObj": this});
        }
        else if (step == 11)
        {
            if(UserProxy.inst.historyArea < 20)
            {
                return;
            }
            this.guideClosePanel();
            MenuPanel.inst.openMenu(1);
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_MONRYUP");
                UserProxy.inst.setBuffer(11);
                UserProxy.inst.nextGuide();

            }, "thisObj": this});
        }
        else if (step == 12)
        {
            MenuPanel.inst.openMenu(1);
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_HEAD");
                UserProxy.inst.setBuffer(12);
                UserProxy.inst.nextGuide();

            }, "thisObj": this});
        }
        else if (step == 13)
        {
            MenuPanel.inst.openMenu(1);
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                EventManager.inst.dispatch("GUIDE_MONRYUP");
                UserProxy.inst.setBuffer(13);
                UserProxy.inst.nextGuide();
            }, "thisObj": this});
        }
        else if (step == 14)
        {
            PanelManager.inst.showPanel("GuidePanel", {"callback": function():void
            {
                UserProxy.inst.setBuffer(14);
                UserProxy.inst.nextGuide();
                PanelManager.inst.showPanel("NoticePanel");
            }, "thisObj": this});
        }
    }

    public isGuideEnd():boolean
    {
        if(UserProxy.inst.getGuideStep() == -1)
        {
            return true;
        }
        else
        {
            return false;
        }

    }

    public getGuideStep(): number
    {
        var step: number = 1;
        var length: number = 13;

        for (var i: number = 0; i < length; i++)
        {
            if (UserProxy.inst.guide.charAt(i) == "0")
            {
                return step;
            }
            step++;
        }

        if (step > length)
        {
            return -1;
        }
        return step;
    }

    public setBuffer(buffer: number, state?: boolean): void
    {
        while (UserProxy.inst.guide.length < buffer)
        {
            UserProxy.inst.guide = UserProxy.inst.guide + "0";
        }
        var str: string = UserProxy.inst.guide.substr(0, buffer - 1);

        if (state == null)
        {
            str = str + "1";
        }
        else
        {
            if (state)
            {
                str = str + "1";
            }
            else
            {
                str = str + "0";
            }
        }

        str = str + UserProxy.inst.guide.substr(buffer);
        UserProxy.inst.guide = str;


        Http.inst.send(CmdID.SET_GUIDE, {"guide": UserProxy.inst.guide});
    }

    public getBuffer(buffer: number): boolean
    {
        while (UserProxy.inst.guide.length < buffer)
        {
            UserProxy.inst.guide = UserProxy.inst.guide + "0";
        }
        return UserProxy.inst.guide.charAt(buffer - 1) != "0";
    }

    public setSetting(idx:number,open:boolean):void
    {
        while (UserProxy.inst.setting.length < idx)
        {
            UserProxy.inst.setting = UserProxy.inst.setting + "0";
        }
        var str: string = UserProxy.inst.setting.substr(0, idx - 1);

        if (open)
        {
            str = str + "1";
        }
        else
        {
            str = str + "0";
        }

        str = str + UserProxy.inst.setting.substr(idx);
        UserProxy.inst.setting = str;
        Http.inst.send(CmdID.SETUP, {"setup": UserProxy.inst.setting});
    }

    public getSetting(idx: number): boolean
    {
        while (UserProxy.inst.setting.length < idx)
        {
            UserProxy.inst.setting = UserProxy.inst.setting + "0";
        }
        return UserProxy.inst.setting.charAt(idx - 1) != "0";
    }

    public guideClosePanel():void
    {
        if(PanelManager.inst.isShow("FriendMainPanel"))
        {
            PanelManager.inst.hidePanel("FriendMainPanel");
        }
        if(PanelManager.inst.isShow("FirstRechargePanel"))
        {
            PanelManager.inst.hidePanel("FirstRechargePanel");
        }
        if(PanelManager.inst.isShow("SevenDayPanel"))
        {
            PanelManager.inst.hidePanel("SevenDayPanel");
        }
        if(PanelManager.inst.isShow("DailyAchievePanel"))
        {
            PanelManager.inst.hidePanel("DailyAchievePanel");
        }
        if(PanelManager.inst.isShow("RankPanel"))
        {
            PanelManager.inst.hidePanel("RankPanel");
        }
        if(PanelManager.inst.isShow("TargetPanel"))
        {
            PanelManager.inst.hidePanel("TargetPanel");
        }
        if(PanelManager.inst.isShow("PrivilegePanel"))
        {
            PanelManager.inst.hidePanel("PrivilegePanel");
        }
        if(PanelManager.inst.isShow("ActivePanel"))
        {
            PanelManager.inst.hidePanel("ActivePanel");
        }
        if(PanelManager.inst.isShow("NoticePanel"))
        {
            PanelManager.inst.hidePanel("NoticePanel");
        }
        if(PanelManager.inst.isShow("MailPanel"))
        {
            PanelManager.inst.hidePanel("MailPanel");
        }
        if(PanelManager.inst.isShow("MailInfoPanel"))
        {
            PanelManager.inst.hidePanel("MailInfoPanel");
        }
        if(PanelManager.inst.isShow("SettingPanel"))
        {
            PanelManager.inst.hidePanel("SettingPanel");
        }
        if(PanelManager.inst.isShow("RoleFormationPanel"))
        {
            PanelManager.inst.hidePanel("RoleFormationPanel");
        }
        if(PanelManager.inst.isShow("RoleDrawPanel"))
        {
            EventManager.inst.dispatch("GUIDE_DRAW_CLOSE");
            PanelManager.inst.hidePanel("RoleDrawPanel");
        }
        if(PanelManager.inst.isShow("RoleDrawInfoPanel"))
        {
            PanelManager.inst.hidePanel("RoleDrawInfoPanel");
        }
        if(PanelManager.inst.isShow("RoleDetailsPanel"))
        {
            PanelManager.inst.hidePanel("RoleDetailsPanel");
        }
        if(PanelManager.inst.isShow("ActiveLimitPanel"))
        {
            PanelManager.inst.hidePanel("ActiveLimitPanel");
        }

    }

    /**
     * 是否是新手阶段
     */
    public isNoviceLevel() {
        return this.curArea < 5 && !this.isGuideEnd()
    }
}