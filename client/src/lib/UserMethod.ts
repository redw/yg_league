/**
 * 用户方法
 * Created by Administrator on 11/24 0024.
 */

class UserMethod extends egret.HashObject
{
    public roleMove:number;
    public roleSelectId:number;
    public rewardJs:any;
    public pvp_up_arr:number[] = [];
    public daily_achieve:number;
    public rank_pvp:number;
    public sell_change:number;
    public recharge_cost:number;
    public battle_select_role:number;
    public battle_pos:number[];
    public battle_type_pos:number;//1-pve 2-秘境
    public secret_type:number;
    public secret_id:number;
    public home_up_arr:number[] = [];

    public sendBattleSyncTime:number;
    public guideBajie:boolean;
    public inviteTime:number = 0;
    public helpTime:number = 0;
    public handTime:number = 0;
    public scenceMoveTime:number = 0;
    public aliveTime:number = 0;
    public shopMoveTo:number = 0;
    public shareHeroId:number = 0;
    public showHelpFormation:number = 0;
    public settingHeadId:number = 0;

    public nowRoleShow:number[] = [];

    //红点判断
    public _dailyPointShow:boolean = false;
    public _achievePointShow:boolean = false;
    public _starPointShow:boolean = false;
    public _shipPointShow:boolean = false;
    public _drawPointShow:boolean = false;
    public _fruitPointShow:boolean = false;
    public _fundPointShow:boolean = false;
    public _inviteShowPoint:boolean = false;
    public _shareShowPoint:boolean = false;
    public _invitePoint:boolean = false;
    public _actWordShow:boolean = false;
    public _actRechargeShow:boolean = false;
    public _actCostShow:boolean = false;
    public _actOnePayShow:boolean = false;
    public _actFestivalShow:boolean = false;
    public _mineFullPoint:boolean = false;
    public _mineBuildPoint:boolean = false;



    private static _instance: UserMethod = null;

    static get inst(): UserMethod
    {
        if (UserMethod._instance == null)
        {
            UserMethod._instance = new UserMethod();
        }
        return UserMethod._instance;
    }

    // ************************************************** //

    public getAddSting(addArr:any[],para?:number):string
    {
        var index_1:number = parseFloat(addArr[0]);
        var index_2:number = parseFloat(addArr[1]);
        var index_3:number = para ? para : parseFloat(addArr[2]);
        if(para == 0){index_3 = 0;}
        
        var dec1:string;
        var dec2:string;
        switch (index_1)
        {
            case 1:dec2 = "攻击增加";break;
            case 2:dec2 = "生命增加";break;
            case 3:dec2 = "防御增加";break;
            case 4:dec2 = "暴击伤害增加";break;
            case 5:dec2 = "暴击率增加";break;
            case 6:dec2 = "闪避率增加";break;
            case 7:dec2 = "格挡率增加";break;
            case 8:dec2 = "全属性增加";break;
            case 9:dec2 = "减少巡山的开启铜钱";break;
            case 10:dec2 = "减少巡山获得铜钱的时间";break;
            case 11:dec2 = "减少巡山的升级铜钱";break;
            case 12:dec2 = "增加巡山获得的铜钱";break;
            case 13:dec2 = "减少伙伴的升级铜钱";break;
            case 14:dec2 = "减少闯关怪物血量";break;
            case 15:dec2 = "减少秘境怪物属性";break;
            case 16:dec2 = "增加秘境掉落材料倍数";break;
            case 17:dec2 = "增加轮回获得的仙玉倍数";break;
            default :dec2 = "";break;
        }

        switch (index_2)
        {
            case 1:dec1 = "自己的";break;
            case 2:dec1 = "全体伙伴的";break;
            case 3:dec1 = "人族的";break;
            case 4:dec1 = "妖族的";break;
            case 5:dec1 = "仙族的";break;
            case 6:dec1 = "近战的";break;
            case 7:dec1 = "远程的";break;
            case 8:dec1 = "人妖两族的";break;
            case 9:dec1 = "人仙两族的";break;
            case 10:dec1 = "妖仙两族的";break;
            case 11:dec1 = "全体彩将的";break;
            default :dec1 = "";break;
        }

        var showStr:string =  dec1 + dec2  + "：";
        if(index_3 * 100 < 1000)
        {
            showStr += StringUtil.toFixed(index_3 * 100) + "%"
        }
        else
        {
            showStr += MathUtil.easyNumber(index_3 * 100) + "%"
        }

        return showStr;
    }

    public getWeaponCostType(cost:number[]):any
    {
        var costType1:Object = {"key":-1,"value":0};
        var costType2:Object = {"key":-1,"value":0};
        for(var i in cost)
        {
            if(cost[i] > 0)
            {
                if(costType1["key"] < 0)
                {
                    costType1["key"] = i;
                    costType1["value"] = cost[i];
                }
                else
                {
                    costType2["key"] = i;
                    costType2["value"] = cost[i];
                }
            }
        }
        return [costType1,costType2];
    }

    public getWeaponCount():number
    {
        var count:number = 0;
        for(var i in UserProxy.inst.weaponList)
        {
            count++;
        }
        return count;
    }

    /**
     * @returns {number} 0未开启或已结束
     */
    public activeDay():number
    {
        if(!UserProxy.inst.sevenDayBegTime)
        {
            return 0;
        }
        //补到零点的时间
        var time:Date = new Date();
        time.setTime(UserProxy.inst.sevenDayBegTime*1000);
        time.setHours(23);
        time.setMinutes(59);
        time.setSeconds(59);
        var todayEnd: number = Math.floor(time.valueOf() / 1000 ) + 1; //第一天结束
        for(var i:number = 1; i < 8 ;i++)
        {
            if(todayEnd >= UserProxy.inst.server_time)
            {
                return i;
            }
            todayEnd += 86400;
        }
        return 0;
    }

    public activeDayEndTime():number
    {
        if(!UserProxy.inst.sevenDayBegTime)
        {
            return 0;
        }
        //补到零点的时间
        var time:Date = new Date();
        time.setTime(UserProxy.inst.sevenDayBegTime*1000);
        time.setHours(23);
        time.setMinutes(59);
        time.setSeconds(59);
        var todayEnd: number = Math.floor(time.valueOf() / 1000 ) + 1; //第一天结束
        var activeEnd:number = todayEnd + 86400 * 8;

        return activeEnd;
    }

    /**
     *7日
     * @param sevenDayData
     * @returns {number}
     */
    public sevenDayFinish(sevenDayData:any):number
    {
        var nowValue:number = 0;
        switch (sevenDayData["task_type"])
        {
            case 1:
                nowValue = UserProxy.inst.shareObj["shareCount"];
                break;
            case 2:
                nowValue =  UserProxy.inst.rmbDays ;
                break;
            case 3:
                for(var i in UserProxy.inst.makeMoney)
                {
                    if(UserProxy.inst.makeMoney[i]["lv"])
                    {
                        nowValue++;
                    }
                }
                break;
            case 4:
                var roleIds:number[] = UserProxy.inst.heroData.getHeroIds();
                for(var i in roleIds)
                {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    if(heroData.strengthenLevel >= parseInt(sevenDayData["task_id"]))
                    {
                        nowValue++;
                    }
                }
                break;
            case 5:
                var heroData = UserProxy.inst.heroData.getHeroData(parseInt(sevenDayData["task_id"]));
                nowValue = heroData.level ? 1 : 0;
                break;
            case 6:
                for(var i in UserProxy.inst.weaponList)
                {
                    var weaponData:any = Config.WeaponData[i];
                    if(parseInt(weaponData["rank"]) >=  sevenDayData["task_id"])
                    {
                        nowValue++;
                    }
                }
                break;
            case 7:
                var roleIds:number[] = UserProxy.inst.heroData.getHeroIds();
                for(var i in roleIds)
                {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    if(heroData.starLevel >= parseInt(sevenDayData["task_id"]))
                    {
                        nowValue++;
                    }
                }
                break;
            case 8:
               nowValue = UserProxy.inst.achievementObj["pvpWinNum"];
                break;
            case 9:
                nowValue = UserProxy.inst.achievementObj["pvpContinueWin"];
                break;
            case 10:
                break;
            case 11:
                nowValue = UserProxy.inst.historyArea;
                break;
            case 12:
                nowValue = UserProxy.inst.achievementObj["relationNum"];
                break;
        }
        return nowValue;
    }

    /**
     * 目标任务
     * @param TargetData
     * @returns {number}
     */
    public targetFinish(TargetData:any):number
    {
       /* var statue:number = 0;
        if(this.isBitGet(Number(TargetData["id"]),UserProxy.inst.missionBit))
        {
            statue = 1;
            return statue;
        }*/
        var nowValue:number = 0;
        switch (TargetData["task_type"])
        {
            case 1:
                break;
            case 2:
                nowValue = UserProxy.inst.makeMoney[TargetData["task_id"]]["lv"] ? 1 : 0;
                break;
            case 3:
                var roleIds:number[] = UserProxy.inst.heroData.getHeroIds();
                for(var i in roleIds)
                {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    if(heroData.strengthenLevel >= parseInt(TargetData["task_id"]))
                    {
                        nowValue++;
                    }
                }
                break;
            case 4:
                for(var i in UserProxy.inst.weaponList)
                {
                    var weaponData:any = Config.WeaponData[i];
                    if(parseInt(weaponData["rank"]) >=  TargetData["task_id"])
                    {
                        nowValue++;
                    }
                }
                break;
            case 5:
                var roleIds:number[] = UserProxy.inst.heroData.getHeroIds();
                for(var i in roleIds)
                {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    if(heroData.starLevel >= parseInt(TargetData["task_id"]))
                    {
                        nowValue++;
                    }
                }
                break;
            case 6:
                nowValue = UserProxy.inst.achievementObj["pvpWinNum"];
                break;
            case 7:
                nowValue = UserProxy.inst.achievementObj["pvpContinueWin"];
                break;
            case 8:
                nowValue = Object.keys(UserProxy.inst.friendList).length;
                break;
            case 9:
                nowValue = UserProxy.inst.historyArea;
                break;
            case 10:
                nowValue = UserProxy.inst.achievementObj["relationNum"];
                break;
            case 11:
                nowValue = UserProxy.inst.achievementObj["circle"];
                break;
            case 12:
                var lv:number = 0;
                var roleIds:number[] = UserProxy.inst.heroData.getHeroIds();
                for(var i in roleIds)
                {
                    var heroData = UserProxy.inst.heroData.getHeroData(roleIds[i]);
                    lv += heroData.level;
                }
                nowValue = lv;
                break;
            case 13:
                var lv:number = 0;
                for(var i in UserProxy.inst.makeMoney)
                {
                    lv += UserProxy.inst.makeMoney[i]["lv"];
                }
                nowValue = lv;
                break;
        }
        return nowValue;
    }

    public isMissionGet(id:number):boolean
    {
        return BitUtil.isBitTrueByString(id - 1,UserProxy.inst.missionBit);
    }

    public isBitGet(id:number,bit:string)
    {
        return BitUtil.isBitTrueByString(id - 1,bit);
    }

    /**
     * 提示红点
     * @param parent
     * @param name
     * @param pos
     */
    public addRedPoint(parent:egret.DisplayObjectContainer,name:string,pos:egret.Point):void
    {
        if(!DisplayUtil.getChildByName(parent,name))
        {
            var redPoint:RedPoint = new RedPoint();
            redPoint.x = pos.x;
            redPoint.y = pos.y;
            redPoint.name = name;
            parent.addChild(redPoint);
        }
    }

    /**
     * 移除红点
     * @param parent
     */
    public removeRedPoint(parent:egret.DisplayObjectContainer,name:string):void
    {
        var redPoint:RedPoint = <RedPoint>DisplayUtil.getChildByName(parent,name);
        if(redPoint)
        {
            redPoint.clear();
            DisplayUtil.removeFromParent(redPoint);
        }
    }

    /**
     * 奖励展示
     */
    public showAward(data:any):void
    {
        var bonusList:BonusList = new BonusList();
        if(data["diamond"])
        {
            var addDiamond:number = data["diamond"] - UserProxy.inst.diamond;
            UserProxy.inst.diamond = data["diamond"];
            if(addDiamond > 0)
            {
                bonusList.push(BonusType.GOLD, addDiamond);
            }
        }
        if(data["gold"])
        {
            var addGold: string = BigNum.sub(data["gold"],UserProxy.inst.gold);
            UserProxy.inst.gold = data["gold"];
            if(parseFloat(addGold) > 0)
            {
                bonusList.push(BonusType.COIN,parseFloat(addGold));
            }
        }
        if(data["pill"])
        {
            var add:number = data["pill"] - UserProxy.inst.pill;
            UserProxy.inst.pill = data["pill"];
            if(add > 0)
            {
                bonusList.push(BonusType.STAR_PILL, add);
            }
        }

        if(data["medal"])
        {
            var add:number = data["medal"] - UserProxy.inst.medal;
            UserProxy.inst.medal = data["medal"];
            if(add > 0)
            {
                bonusList.push(BonusType.JADE, add);
            }
        }

        if(data["weaponCoin"])
        {
            var add_0:number = data["weaponCoin"][0] -  UserProxy.inst.weaponCoin[0];UserProxy.inst.weaponCoin[0] = data["weaponCoin"][0];
            var add_1:number = data["weaponCoin"][1] -  UserProxy.inst.weaponCoin[1];UserProxy.inst.weaponCoin[1] = data["weaponCoin"][1];
            var add_2:number = data["weaponCoin"][2] -  UserProxy.inst.weaponCoin[2];UserProxy.inst.weaponCoin[2] = data["weaponCoin"][2];
            var add_3:number = data["weaponCoin"][3] -  UserProxy.inst.weaponCoin[3];UserProxy.inst.weaponCoin[3] = data["weaponCoin"][3];
            var add_4:number = data["weaponCoin"][4] -  UserProxy.inst.weaponCoin[4];UserProxy.inst.weaponCoin[4] = data["weaponCoin"][4];
            if(add_0 > 0)
            {
                bonusList.push(BonusType.METAL, add_0);
            }
            if(add_1 > 0)
            {
                bonusList.push(BonusType.WOOD, add_1);
            }
            if(add_2 > 0)
            {
                bonusList.push(BonusType.WATER, add_2);
            }
            if(add_3 > 0)
            {
                bonusList.push(BonusType.FIRE, add_3);
            }
            if(add_4 > 0)
            {
                bonusList.push(BonusType.SOIL, add_4);
            }
        }

        if(data["soulCoin"])
        {
            var add_0:number = data["soulCoin"][0] -  UserProxy.inst.soulCoin[0];UserProxy.inst.soulCoin[0] = data["soulCoin"][0];
            var add_1:number = data["soulCoin"][1] -  UserProxy.inst.soulCoin[1];UserProxy.inst.soulCoin[1] = data["soulCoin"][1];
            var add_2:number = data["soulCoin"][2] -  UserProxy.inst.soulCoin[2];UserProxy.inst.soulCoin[2] = data["soulCoin"][2];
            var add_3:number = data["soulCoin"][3] -  UserProxy.inst.soulCoin[3];UserProxy.inst.soulCoin[3] = data["soulCoin"][3];

            if(add_0 > 0)
            {
                bonusList.push(BonusType.SOUL_1, add_0);
            }
            if(add_1 > 0)
            {
                bonusList.push(BonusType.SOUL_2, add_1);
            }
            if(add_2 > 0)
            {
                bonusList.push(BonusType.SOUL_3, add_2);
            }
            if(add_3 > 0)
            {
                bonusList.push(BonusType.SOUL_4, add_3);
            }

        }


        if(data["ticket"])
        {
            var add:number = data["ticket"] - UserProxy.inst.ticket;
            UserProxy.inst.ticket = data["ticket"];
            if(add > 0)
            {
                bonusList.push(BonusType.HERO_DRAW, add);
            }
        }

        if(data["nowTimes"])
        {
            var add:number = data["nowTimes"] - UserProxy.inst.circleObj["nowTimes"];
            UserProxy.inst.circleObj["nowTimes"] = data["nowTimes"];
            if(add > 0)
            {
                bonusList.push(BonusType.CIRCLE_TIMES, add);
            }
        }

        if(data["maxNum"])
        {
            var add:number = data["maxNum"] - UserProxy.inst.maxNum;
            UserProxy.inst.maxNum = data["maxNum"];
            if(add > 0)
            {
                bonusList.push(BonusType.WEAPON_BOX, add);
            }
        }

        if(data["maxTimes"])
        {
            var add:number = data["maxTimes"] - UserProxy.inst.maxTimes;
            UserProxy.inst.maxTimes = data["maxTimes"];
            if(add > 0)
            {
                bonusList.push(BonusType.WEAPON_FB, add);
            }
        }

        if(data["pvpCoin"])
        {
            var add:number = data["pvpCoin"] - UserProxy.inst.pvpShopObj["pvpCoin"];
            UserProxy.inst.pvpShopObj["pvpCoin"] = data["pvpCoin"];
            if(add > 0)
            {
                bonusList.push(BonusType.PVP_COIN, add);
            }
        }

        if(data["heroList"])
        {
            var changeIds:number[] = [];
            for(var i in data["heroList"])
            {
                changeIds.push(parseInt(i));
            }
            var length:number = changeIds.length;
            for(var j:number = 0;j < length ;j++)
            {
                var heroData:HeroVO = UserProxy.inst.heroData.getHeroData(changeIds[j]);
                var newLv:number = data["heroList"][changeIds[j]]["lv"];
                var newPiece:number = data["heroList"][changeIds[j]]["starPiece"];
                var addPiece:number = newPiece - heroData.starPiece;
                if(newLv > 0 && heroData.level == 0) //新英雄
                {
                    bonusList.push(BonusType.HERO, 1,changeIds[j]);
                }
                if(addPiece > 0)
                {
                    bonusList.push(BonusType.HERO_CHIP, addPiece,changeIds[j]);
                }
            }
            UserProxy.inst.heroData.parseHeroList(data["heroList"]);
            EventManager.inst.dispatch(ContextEvent.HAVE_NEW_ROLE);
        }
        bonusList.show();
    }


    public setExterAdd():void
    {
        UserProxy.inst.subOpenXunShanMoney = this.addExtraNature(9);
        UserProxy.inst.subXunShanTime = this.addExtraNature(10);
        UserProxy.inst.subRiseXunShanMoney = this.addExtraNature(11);
        UserProxy.inst.addXunShanAward = this.addExtraNature(12);
        UserProxy.inst.subFriendMoney = this.addExtraNature(13);
        UserProxy.inst.subMissonHp = this.addExtraNature(14);
        UserProxy.inst.subSecretHp = this.addExtraNature(15);
        UserProxy.inst.addSecretAward = this.addExtraNature(16);
        UserProxy.inst.addTurnMedal = this.addExtraNature(17);
    }


    public addExtraNature(type:number):number
    {
        var shouldAdd:number = 1;
        //法宝
        var addWeapon:number = 1;
        for(var c in UserProxy.inst.weaponList)
        {
            var weaponInfo: any = UserProxy.inst.weaponList[c];
            var weaponData: any = Config.WeaponData[c];
            var value1: any = weaponData["attr_1"];
            var value2: any = weaponData["attr_2"];
            var add1: number = parseFloat(value1[2]) * (1 + 0.1 * weaponInfo["lv"]);
            var target1: number = parseInt(value1[0]);//加成目标
            var add2: number = 0;
            var target2: number = 0;
            if (value2)
            {
                add2 = parseFloat(value2[2]) * (1 + 0.1 * weaponInfo["lv"]);
                target2 = parseInt(value2[0]);//加成目标
            }

            if (target1 == type)
            {
                addWeapon += add1;
            }
            if (target2 == type)
            {
                addWeapon += add2;
            }
        }

        //套装
        var addSuit:number = 1;
        var addedSuit = [];
        for(var c in UserProxy.inst.weaponList)
        {
            var weaponData: any = Config.WeaponData[c];
            if(weaponData["suit"] )
            {
                if(addedSuit.indexOf(weaponData["suit"]) > -1)
                {
                    continue;
                }

                var suitData:any = Config.WeaponSuit[weaponData["suit"]];
                var suitNum:any[] = suitData["suitnum"];

                var count:number = 0;
                var length:number = suitData["itemgroup"].length;
                for(var p:number = 0;p < length ; p++)
                {
                    var weaponId:number = suitData["itemgroup"][p];
                    var weaponInfo:any = UserProxy.inst.weaponList[weaponId];
                    if(weaponInfo)
                    {
                        count++;
                    }
                }

                for(var j:number = 1;j <= suitNum.length;j++)
                {
                    if(count >= parseInt(suitNum[j - 1]))
                    {
                        var suitValue:any[] = suitData["attr_" + j];
                        var nature: number = parseInt(suitValue[0]);//加成类型
                        var add: number = parseFloat(suitValue[2]);//加成值

                        if(type == nature)
                        {
                            addSuit *= (1 + add);
                            break;
                        }
                    }
                }
                addedSuit.push(weaponData["suit"]);
            }
        }
        //情缘
        var addShip:number = 1;
        for(var k in UserProxy.inst.relationship)
        {
            var shipInfo:any = UserProxy.inst.relationship[k];
            var shipData:any = Config.FriendshipData[k];
            var parm:number = shipData["attr_parm"];
            if(shipInfo["lv"])
            {
                var shipValue:any = shipData["attr_1"];
                var nature:number = parseInt(shipValue[0]);//加成类型
                var add:number = parseFloat(shipValue[2])*(Math.pow(parm,shipInfo["lv"]-1));//加成值

                if(type == nature)
                {
                    addShip *= (1 + add);
                }
            }
        }

        //矿洞
        var addCave:number = 1;
        var building:any = UserProxy.inst.building;
        if(building)
        {
            for(var c in building)
            {
                var id:number = parseInt(c);
                var build:any = building[c];
                if(build["lv"])
                {
                    var caveData:any = Config.CaveData[build["lv"]];
                    var caveValue:any = caveData["attr_" + id];
                    var nature:number = parseInt(caveValue[0]);//加成类型
                    var add: number = parseFloat(caveValue[2]);//加成值
                    if(type == nature)
                    {
                        addCave *= add;
                        break;
                    }
                }
            }
        }

        add = shouldAdd * addShip * addWeapon * addSuit * addCave;
        return add;
    }

    /**
     * 前往
     * @param goType
     */
    public typeGo(goType:number):void
    {
        switch (goType)
        {
            case 1:
                PanelManager.inst.showPanel("FriendMainPanel",1);
                break;
            case 2:

                MenuPanel.inst.openMenu(6);
                break;
            case 3:
                MenuPanel.inst.openMenu(1);
                break;
            case 4:
                PanelManager.inst.showPanel("ActivePanel",3);
                break;
            case 5:
                MenuPanel.inst.openMenu(2);
                break;
            case 6:
                MenuPanel.inst.openMenu(2);
                break;
            case 7:
                MenuPanel.inst.openMenu(2);
                PanelManager.inst.showPanel("RoleDrawPanel");
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                MenuPanel.inst.openMenu(3);
                break;
            case 11:
                break;
            case 12:
                PanelManager.inst.showPanel("FriendMainPanel",3);
                break;
            case 13:
                break;
        }
    }

    public sevenDayGo(type:number):void
    {
        PanelManager.inst.hidePanel("SevenDayPanel");
        switch (type)
        {
            case 1:
                PanelManager.inst.showPanel("ActivePanel",1);
                break;
            case 2:

                MenuPanel.inst.openMenu(6);
                break;
            case 3:
                MenuPanel.inst.openMenu(1);
                break;
            case 4:
                MenuPanel.inst.openMenu(2);
                break;
            case 5:
                MenuPanel.inst.openMenu(2);
                PanelManager.inst.showPanel("RoleDrawPanel");
                break;
            case 6:
                MenuPanel.inst.openMenu(4);
                break;
            case 7:
                MenuPanel.inst.openMenu(2);
                break;
            case 8:
                MenuPanel.inst.openMenu(5);
                break;
            case 9:
                MenuPanel.inst.openMenu(5);
                break;
            case 11:
                break;
            case 12:
                MenuPanel.inst.openMenu(2);
                break;
        }


    }

    public getStageJade(awardNum:string):string
    {
        var reward3:number = parseFloat(awardNum);
        var award:number;
        if(UserProxy.inst.historyArea >= 50)
        {
            award = Math.floor((UserProxy.inst.historyArea - 50 + parseFloat(Config.BaseData[12]["value"])) * reward3);
        }
        else
        {
            award = Math.floor(parseFloat(Config.BaseData[12]["value"])*reward3);
        }

        return MathUtil.easyNumber(award);
    }

    public getWeaponCoinStage(rewardData:any):string
    {
        var award:number;
        var reward:any[] = rewardData.concat();
        var dataAdd:number = parseFloat(rewardData[2]);
        var base:number = parseFloat(Config.BaseData[60]["value"]);
        var id:number = 0;
        switch (parseInt(reward[0]))
        {
            case 17:
                var level:number = UserProxy.inst.dungeonList[1]["dungeonId"];
                id = 1000 + level;
                break;
            case 18:
                var level:number = UserProxy.inst.dungeonList[2]["dungeonId"];
                id = 2000 + level;
                break;
            case 19:
                var level:number = UserProxy.inst.dungeonList[3]["dungeonId"];
                id = 3000 + level;
                break;
            case 20:
                var level:number = UserProxy.inst.dungeonList[4]["dungeonId"];
                id = 4000 + level;
                break;
            case 21:
                var level:number = UserProxy.inst.dungeonList[5]["dungeonId"];
                id = 5000 + level;
                break;
        }

        if(level)
        {
            var weaponFb:any = Config.WeaponFb[id];
            var add:number = parseInt(weaponFb["reward_1"][2]);
            award = Math.floor(add * dataAdd);
        }
        else
        {
            award = Math.floor(base * dataAdd);
        }

        return MathUtil.easyNumber(award);
    }


    public dailyNowPar(id:number):number
    {
        var nowParm:number;
        switch (id)
        {
            case 1:
                nowParm = UserProxy.inst.taskObj["invite"];
                break;
            case 2:
                nowParm = UserProxy.inst.taskObj["rmb"];
                break;
            case 3:
                nowParm = UserProxy.inst.taskObj["moneyUp"];
                break;
            case 4:
                nowParm = UserProxy.inst.taskObj["moneyTree"];
                break;
            case 5:
                nowParm = UserProxy.inst.taskObj["heroUp"];
                break;
            case 6:
                nowParm = UserProxy.inst.taskObj["enhance"];
                break;
            case 7:
                nowParm = UserProxy.inst.taskObj["drawHero"];
                break;
            case 8:
                nowParm = UserProxy.inst.taskObj["area"];
                break;
            case 9:
                nowParm = UserProxy.inst.taskObj["monster"];
                break;
            case 10:
                nowParm = UserProxy.inst.taskObj["dungeon"];
                break;
            case 11:
                nowParm = UserProxy.inst.taskObj["circle"];
                break;
            case 12:
                nowParm = UserProxy.inst.taskObj["sendVit"];
                break;
            case 13:
                nowParm = UserProxy.inst.taskObj["event"];
                break;
            case 14:
                nowParm = UserProxy.inst.taskObj["pvpNum"];
                break;
        }
        return nowParm;
    }

    public achieveNowPar(id:number):number
    {
        var nowParm:number;
        switch (id)
        {
            case 1:
                nowParm = UserProxy.inst.achievementObj["area"];
                break;
            case 2:
                nowParm = UserProxy.inst.achievementObj["box"];
                break;
            case 3:
                nowParm = UserProxy.inst.achievementObj["circle"];
                break;
            case 4:
                nowParm = UserProxy.inst.achievementObj["drawHero"];
                break;
            case 5:
                nowParm = UserProxy.inst.achievementObj["heroNum"];
                break;
            case 6:
                nowParm = UserProxy.inst.achievementObj["enhance"];
                break;
            case 7:
                nowParm = UserProxy.inst.achievementObj["star"];
                break;
            case 8:
                nowParm = UserProxy.inst.achievementObj["relationNum"];
                break;
            case 9:
                nowParm = UserProxy.inst.achievementObj["monsterNum"];
                break;
            case 10:
                nowParm = UserProxy.inst.achievementObj["monsterUp"];
                break;
            case 11:
                nowParm = UserProxy.inst.achievementObj["weaponRank"];
                break;
            case 12:
                nowParm = UserProxy.inst.achievementObj["weaponNum"];
                break;
            case 13:
                nowParm = UserProxy.inst.achievementObj["moneyNum"];
                break;
            case 14:
                nowParm = UserProxy.inst.achievementObj["pvpWinNum"];
                break;
            case 15:
                nowParm = UserProxy.inst.achievementObj["pvpContinueWin"];
                break;
        }
        return nowParm;
    }



    public shareCheck():boolean
    {
        if (UserProxy.inst.shareObj["dayShareCount"] < 3)
        {
            var leftTime:number = parseInt(Config.BaseData[36]["value"])*60 - (UserProxy.inst.server_time - UserProxy.inst.shareObj["lastShareTime"]);
            if(leftTime <= 0)
            {
                this._shareShowPoint = true;
                return true;
            }
        }
        this._shareShowPoint = false;
        return false;
    }


    public dailyCheck():boolean
    {
        for (var i in Config.DailyTaskData)
        {
            var dailyData:any = Config.DailyTaskData[i];
            if (!UserMethod.inst.isBitGet(parseInt(dailyData["id"]),UserProxy.inst.taskBit))
            {
                var endParm:number = dailyData["task_parm"];
                var nowParm:number = UserMethod.inst.dailyNowPar(parseInt(dailyData["task_type"]));
                if(nowParm >= endParm)
                {
                    this._dailyPointShow = true;
                    return true;
                }
            }
        }
        this._dailyPointShow = false;
        return false;
    }

    public achieveCheck():boolean
    {
        for (var i in Config.AchievementData)
        {
            var achievementData:any = Config.AchievementData[i];
            if (!UserMethod.inst.isBitGet(parseInt(i),UserProxy.inst.achieveBit))
            {
                var endParm:number = achievementData["achv_parm"];
                var nowParm:number = UserMethod.inst.achieveNowPar(parseInt(achievementData["achv_type"]));

                if(nowParm >= endParm)
                {
                    this._achievePointShow = true;
                    return true;
                }
            }
        }
        this._achievePointShow = false;
        return false;
    }

    public targetCheck():boolean
    {
        if(this.isTargetEnd())
        {
            return false;
        }

        var nowGroup:number = UserProxy.inst.missionObj["group"];
        var firstId:number = Math.floor(nowGroup / 5) * 5  + 1;
        var groupId:number = firstId + 4;

        for(var i:number = firstId;i < groupId ;i++)
        {
            var missionData:any = Config.TargetData[i];
            var endParm:number = missionData["task_num"];
            var nowParm:number = UserMethod.inst.targetFinish(missionData);
            if(!UserMethod.inst.isBitGet(missionData["id"],UserProxy.inst.missionBit))
            {
                if(nowParm >= endParm)
                {
                    return true;
                }
            }
        }
        return false;
    }

    public isTargetEnd():boolean
    {
        var nowGroup:number = UserProxy.inst.missionObj["group"];
        var firstId:number = Math.floor(nowGroup / 5) * 5  + 1;
        var firstMission:any = Config.TargetData[firstId];
        if(!firstMission)
        {
            return true;
        }
        return false;
    }

    public dialCheck():boolean
    {
        return UserProxy.inst.wheelTimes > 0;
    }

    public posterCheck():boolean
    {
        if(UserProxy.inst.inviteUserInfos)
        {
            var inviteLength:number = UserProxy.inst.inviteUserInfos.length;
            for(var i in Config.InviteData)
            {
                if(UserProxy.inst.inviteUserInfos && parseInt(i) <= inviteLength)
                {
                    var id:number = parseInt(i);
                    if(!UserMethod.inst.isBitGet(id,UserProxy.inst.inviteObj["inviteBit"]))
                    {
                        this._invitePoint = true;
                        return true;
                    }
                }
            }
        }
        this._invitePoint = false;
        return false;
    }

    public sevenDayCheck():boolean
    {
        var today:number = UserMethod.inst.activeDay();
        if(!today)
        {
            if(this.activeDayEndTime() > UserProxy.inst.server_time)
            {
                today = 7;
            }
        }


        if(today)
        {
            for(var i:number = 1;i < 8; i++)
            {
                for(var c in Config.SevenDayData)
                {
                    var sevenDayData:any = Config.SevenDayData[c];
                    if(parseInt(sevenDayData["day"]) == today)
                    {
                        var endValue: number = sevenDayData["task_num"];
                        var nowValue:number = UserMethod.inst.sevenDayFinish(sevenDayData);
                        if(!UserMethod.inst.isBitGet(Number(sevenDayData["id"]),UserProxy.inst.sevenDayBit))
                        {
                            if(nowValue >= endValue)
                            {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }

    public privilegeCheck():boolean
    {
        if(UserProxy.inst.vipObj["monthVIP"])
        {
            if(!UserProxy.inst.vipObj["monthFlag"])
            {
                return true;
            }
        }

        if(UserProxy.inst.vipObj["foreverVIP"])
        {
            if(!UserProxy.inst.vipObj["foreverFlag"])
            {
                return true;
            }
        }

        return false;
    }

    public mailCheck():boolean
    {
        for(var i in UserProxy.inst.mail)
        {
            var mailInfo:any = UserProxy.inst.mail[i];
            if(!mailInfo["state"])
            {
                return true;
            }
        }
        return false;
    }

    public activeCheck(actNum?:number):boolean
    {
        var signShow:boolean = false;
        var dayInviteShow:boolean = false;
        var fundCheckShow:boolean = false;
        var fruitShow:boolean = false;

        if(actNum)
        {
            signShow = this.signCheck();
            dayInviteShow = this._inviteShowPoint;
            fundCheckShow = this._fundPointShow;
            fruitShow = this._fruitPointShow;
            switch (actNum)
            {
                case 1:
                    signShow = this.signCheck();
                    break;
                case 2:
                    dayInviteShow = this.dayInviteCheck();
                    break;
                case 3:
                    fundCheckShow = this.fundCheck();
                    break;
                case 4:
                    fruitShow = this.fruitCheck();
                    break;
            }
        }
        else
        {
            signShow = this.signCheck();
            dayInviteShow = this.dayInviteCheck();
            fundCheckShow = this.fundCheck();
            fruitShow = this.fruitCheck();
        }

        if(signShow || dayInviteShow || fundCheckShow || fruitShow)
        {
            return true;
        }

        return false;

    }

    public friendCheck():boolean
    {
        if(this.shareCheck() || this.posterCheck())
        {
            return true;
        }
    }

    public openLimitActive():boolean
    {
        if(this.isWordOpen() || this.isRechargeOpen() || this.isCostOpen() || this.isOnePayOpen() || this.isInviteDoubleOpen() || this.isFestivalOpen())
        {
            return true;
        }

        return false;
    }

    public limitActiveCheck(limit?:number):boolean
    {
        var rechargeShow:boolean = false;
        var wordShow:boolean = false;
        var costShow:boolean = false;
        var onPay:boolean = false;
        var festivalShow:boolean = false;

        if(limit)
        {
            rechargeShow = this._actRechargeShow;
            wordShow = this._actWordShow;
            costShow = this._actCostShow;
            onPay = this._actOnePayShow;
            festivalShow = this._actFestivalShow;

            switch (limit)
            {
                case 1:
                    rechargeShow = this.checkRechargePoint();
                    break;
                case 2:
                    wordShow = this.checkWordPoint();
                    break;
                case 3:
                    costShow = this.checkCostPoint();
                    break;
                case 4:
                    onPay = this.checkOnePayPoint();
                    break;
                case 5:
                    festivalShow = this.checkFestivalPoint();
                    break;
            }
        }
        else
        {
            rechargeShow = this.checkRechargePoint();
            wordShow = this.checkWordPoint();
            costShow = this.checkCostPoint();
            onPay = this.checkOnePayPoint();
            festivalShow = this.checkFestivalPoint();
        }

        if(rechargeShow || wordShow || costShow || onPay || festivalShow)
        {
            return true;
        }

        return false;
    }

    public circleGoCheck():boolean
    {
        var goMission:number = UserProxy.inst.circleObj["lastCircleArea"] - parseInt(Config.BaseData[69]["value"]);
        if(UserProxy.inst.circleObj["lastCircleArea"] >= parseInt(Config.BaseData[68]["value"]) && UserProxy.inst.curArea < goMission)
        {
            return true;
        }
        return false;
    }

    public noticeShowCheck():void
    {
        var version:number = Config.NoticeData[1]["version"];
        var noticeTime:Date = new Date();
        noticeTime.setTime(version*1000);
        var noticeYear:number = noticeTime.getFullYear();
        var noticeMonth:number = noticeTime.getMonth();
        var noticeDay:number = noticeTime.getDay();

        var nowTime:Date = new Date();
        nowTime.setTime(UserProxy.inst.server_time*1000);
        var nowYear:number = nowTime.getFullYear();
        var nowMonth:number = nowTime.getMonth();
        var nowDay:number = nowTime.getDay();

        if(noticeYear == nowYear && noticeMonth == nowMonth && noticeDay == nowDay)
        {
            UserProxy.inst.noticeOpen = true;
        }
        else
        {
            UserProxy.inst.noticeOpen = false;
        }

    }


    public signCheck():boolean
    {
        return !UserProxy.inst.todayFlag;
    }

    public dayInviteCheck():boolean
    {
        for(var c in Config.DailyInviteData)
        {
            var dailyInviteData:any = Config.DailyInviteData[c];
            if(!UserMethod.inst.isBitGet(parseInt(dailyInviteData["id"]),UserProxy.inst.shareObj["shareBit"]))
            {
                if(UserProxy.inst.shareObj["shareCount"] >= parseInt(dailyInviteData["invite_days"]))
                {
                    this._inviteShowPoint = true;
                    return true;
                }
            }
        }
        this._inviteShowPoint = false;
        return false;
    }

    public fundCheck():boolean
    {
        if(UserProxy.inst.vipObj["fund"] )
        {
            for (var i in Config.DailyFundData)
            {
                var fundData:any = Config.DailyFundData[i];
                if(! UserMethod.inst.isBitGet(parseInt(i),UserProxy.inst.vipObj["fundBit"]))
                {
                    if(UserProxy.inst.historyArea > parseInt( fundData["floor"]))
                    {
                        this._fundPointShow = true;
                        return true;
                    }
                }
            }
        }
        this._fundPointShow = false;
        return false;
    }

    public fruitCheck():boolean
    {
        if(UserProxy.inst.circleObj["circleTimes"] < 1)
        {
            this._fruitPointShow = false;
            return false;
        }

        var date:Date = new Date(UserProxy.inst.server_time*1000);
        var hour:number = date.getHours();
        if(hour >= 11 && hour < 15)
        {
            if(!BitUtil.isBitTrueByString(0,UserProxy.inst.dailyObj["freeVitBit"]))
            {
                this._fruitPointShow = true;
                return true;
            }
        }
        else if(hour >= 15 && hour < 19)
        {
            if(!BitUtil.isBitTrueByString(1,UserProxy.inst.dailyObj["freeVitBit"]))
            {
                this._fruitPointShow = true;
                return true;
            }
        }
        else if(hour >= 19 && hour < 23)
        {
            if(!BitUtil.isBitTrueByString(2,UserProxy.inst.dailyObj["freeVitBit"]))
            {
                this._fruitPointShow = true;
                return true;
            }
        }
        this._fruitPointShow = false;
        return false;
    }

    public drawHeroCheck():boolean
    {
        if(UserProxy.inst.historyArea < 10)
        {
            this._drawPointShow = false;
            return false;
        }

        var base:number = parseInt(Config.BaseData[43]["value"]);
        var time:number = (base * 60) - (UserProxy.inst.server_time - UserProxy.inst.lastFreeTime);
        if(time <= 0 || UserProxy.inst.ticket)
        {
            this._drawPointShow = true;
            return true;
        }
        this._drawPointShow = false;
        return false;
    }

    public formationCheck():boolean
    {
        if(UserProxy.inst.circleObj["circleTimes"] >= 1)
        {
            return false;
        }

        var battleArr:number[] = UserProxy.inst.fightData.getPVEFormation();
        var length:number = battleArr.length;

        if(length >= 6)
        {
            return false;
        }

        var count:number = 0;
        for(var i in UserProxy.inst.heroData.getHeroIds())
        {
            var id:number = UserProxy.inst.heroData.getHeroIds()[i];
            var heroData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
            if(heroData.level)
            {
                count++;
            }
        }

        if(count > length && length < 6)
        {
            return true;
        }
        return false;
    }

    public starCheck():boolean
    {
        for(var i in UserProxy.inst.heroData.getHeroIds())
        {
            var id:number = UserProxy.inst.heroData.getHeroIds()[i];
            var heroData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
            if(heroData.starPiece)
            {
                var quality:number = parseInt(heroData.config.quality);
                var starData:any = Config.HeroStarData[heroData.starLevel + 1];
                var needChip:number = starData["rank_chip_" + quality];
                var needPill:number = starData["rank_pill_" + quality];

                var starPiece:number = heroData.starPiece;

                var chipEnough:number = 0;
                var pillEnough:number = 0;
                if( starPiece >= needChip)
                {
                    chipEnough = 1;
                }
                if(UserProxy.inst.pill >= needPill)
                {
                    pillEnough = 1;
                }

                if(chipEnough && pillEnough)
                {
                    var starMax:number = parseInt(Config.BaseData[67]["value"][quality-1]);
                    if(heroData.starLevel < starMax)
                    {
                        this._starPointShow = true;
                        return true;
                    }
                }
            }
        }
        this._starPointShow = false;
        return false;
    }

    public oneStarCheck(id:number):boolean
    {
        var heroData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
        var quality:number = parseInt(heroData.config.quality);
        var starData:any = Config.HeroStarData[heroData.starLevel + 1];
        var needChip:number = starData["rank_chip_" + quality];
        var needPill:number = starData["rank_pill_" + quality];
        var starPiece:number = heroData.starPiece;
        var chipEnough:number = 0;
        var pillEnough:number = 0;
        var starMax:number = parseInt(Config.BaseData[67]["value"][quality-1]);
        if(heroData.starLevel < starMax)
        {
            if( starPiece >= needChip)
            {
                chipEnough = 1;
            }
            if(UserProxy.inst.pill >= needPill)
            {
                pillEnough = 1;
            }
        }

        if(chipEnough && pillEnough)
        {
            return true;
        }
        return false;
    }

    public shipCheck():boolean
    {
        for(var i in UserProxy.inst.heroData.getHeroIds())
        {
            var id:number = UserProxy.inst.heroData.getHeroIds()[i];
            var heroData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
            var ships:number[] = heroData.config.friendly;
            var shipsLength:number = ships.length;
            for(var j:number = 0; j < shipsLength;j++)
            {
                var shipData:any = Config.FriendshipData[ships[j]];
                var shipInfo:any = UserProxy.inst.relationship[ships[j]];
                var heroLength:number = shipData["herogroup"].length;
                var starCount:number = 0;
                var notHad:boolean = true;

                for(var k:number = 0;k < heroLength ; k++)
                {
                    var roleId:number = shipData["herogroup"][k];
                    var roleInfo = UserProxy.inst.heroData.getValue(roleId);
                    starCount += roleInfo.starLevel;
                    if(!roleInfo.starLevel)
                    {
                        notHad = false;
                    }
                }

                var shipLv:number = shipInfo["lv"];
                var needStar:number = shipData["stars"][shipLv];
                if(shipLv < 10)
                {
                    if(starCount >= needStar && notHad)
                    {
                        this._shipPointShow = true;
                        return true;
                    }
                }
            }
        }
        this._shipPointShow = false;
        return false;
    }

    public oneShipCheck(id:number):boolean
    {
        var heroData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
        var ships:number[] = heroData.config.friendly;
        var shipsLength:number = ships.length;
        for(var j:number = 0; j < shipsLength;j++)
        {
            var shipData:any = Config.FriendshipData[ships[j]];
            var shipInfo:any = UserProxy.inst.relationship[ships[j]];
            var heroLength:number = shipData["herogroup"].length;
            var starCount:number = 0;
            var notHad:boolean = true;

            for(var k:number = 0;k < heroLength ; k++)
            {
                var roleId:number = shipData["herogroup"][k];
                var roleInfo = UserProxy.inst.heroData.getValue(roleId);
                starCount += roleInfo.starLevel;
                if(!roleInfo.starLevel)
                {
                    notHad = false;
                }
            }

            var shipLv:number = shipInfo["lv"];
            var needStar:number = shipData["stars"][shipLv];
            if(shipLv < 10)
            {
                if(starCount >= needStar && notHad)
                {
                    return true;
                }
            }
        }

        return false;
    }


    public getConfigHeadId(string:string):number
    {
        var index:number = string.indexOf("_");
        var head:string = string.substring(0,index);
        return parseInt(head);
    }

    public getHeadImg(string:string):string
    {
        var headStr:string = null;
        var index:number = string.indexOf("_");
        var head:string = string.substring(0,index);
        var headId:number = parseInt(head);
        var headData:any = Config.HeadData[headId];
        if(headData)
        {
            if(headId > 12)
            {

                headStr = Global.getChaIcon(headData["head_res"]);
            }
            else
            {
                headStr = Global.getSecretIcon(headData["head_res"]);
            }
        }
        return headStr;
    }

    /**
     * 限时活动----
     */
    public isWordOpen():boolean
    {
        var actWord:any = UserProxy.inst.activityObj[101];

        if(!actWord || !actWord["id"])
        {
            return false;
        }

        var id:number = actWord["id"];
        var actData:any = Config.ActivityData[id];
        if(!actData)
        {
            return false;
        }

        var start_time: number = actData["time_start"];
        var end_time: number = actData["time_exchange"];

        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    }

    public checkWordPoint():boolean
    {
        if(!this.isWordOpen())
        {
            this._actWordShow = false;
            return false;
        }

        for(var i:number = 1 ;i < 6;i++)
        {
            var enable: number[] = [];
            var wordData:any = Config.ActWordData[i];
            var wordLength:number = wordData["condition"].length;
            for(var j:number = 0;j < wordLength ; j++)
            {
                var wordId:number = parseInt(wordData["condition"][j]);
                var collectWord:number[] = UserProxy.inst.activityObj[101]["collectWord"].concat();
                var count:number = collectWord[wordId-1];
                if(count > 0)
                {
                    enable.push(1);
                }
                else
                {
                    enable.push(0);
                }
            }
            var calEnable:number = 1;
            for(var j: number = 0;j < enable.length;j++)
            {
                calEnable *= enable[j];
            }
            if(calEnable)
            {
                this._actWordShow = true;
                return true;
            }
        }
        this._actWordShow = false;
        return false;
    }

    public isRechargeOpen():boolean
    {
        var actRecharge:any = UserProxy.inst.activityObj[102];

        if(!actRecharge || !actRecharge["id"])
        {
            return false;
        }
        var id:number = actRecharge["id"];
        var actData:any = Config.ActivityData[id];
        if(!actData)
        {
            return false;
        }

        var start_time: number = actData["time_start"];
        var end_time: number = actData["time_exchange"];

        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    }

    public checkRechargePoint():boolean
    {
        if(!this.isRechargeOpen())
        {
            this._actRechargeShow = false;
            return false;
        }

        for(var i in Config.ActAddBuyData)
        {
            var payData:any = Config.ActAddBuyData[i];
            var actObj:any = UserProxy.inst.activityObj[102];
            if(!UserMethod.inst.isBitGet(parseInt(payData["id"]),actObj["rmbActBit"]))
            {
                if(parseInt(payData["condition"]) <= actObj["rmbAct"])
                {
                    this._actRechargeShow = true;
                    return true;
                }
            }

        }
        this._actRechargeShow = false;
        return false;
    }

    public isCostOpen():boolean
    {
        var actRecharge:any = UserProxy.inst.activityObj[103];
        if(!actRecharge || !actRecharge["id"])
        {
            return false;
        }
        var id:number = actRecharge["id"];
        var actData:any = Config.ActivityData[id];
        if(!actData)
        {
            return false;
        }

        var start_time: number = actData["time_start"];
        var end_time: number = actData["time_exchange"];

        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    }

    public checkCostPoint():boolean
    {
        if(!this.isCostOpen())
        {
            this._actCostShow = false;
            return false;
        }

        for(var i in Config.ActAddCostData)
        {
            var costData:any = Config.ActAddCostData[i];
            var actObj:any = UserProxy.inst.activityObj[103];
            if(!UserMethod.inst.isBitGet(parseInt(costData["id"]),actObj["consumeActBit"]))
            {
                if(parseInt(costData["condition"]) <= actObj["consumeAct"])
                {
                    this._actCostShow = true;
                    return true;
                }
            }

        }
        this._actCostShow = false;
        return false;
    }

    public isOnePayOpen():boolean
    {
        var actRecharge:any = UserProxy.inst.activityObj[106];
        if(!actRecharge || !actRecharge["id"])
        {
            return false;
        }
        var id:number = actRecharge["id"];
        var actData:any = Config.ActivityData[id];
        if(!actData)
        {
            return false;
        }
        var start_time: number = actData["time_start"];
        var end_time: number = actData["time_exchange"];

        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    }


    public checkOnePayPoint():boolean
    {
        if(!this.isOnePayOpen())
        {
            this._actOnePayShow = false;
            return false;
        }

        for(var i in Config.ActSingleBuyData)
        {
            var costData:any = Config.ActSingleBuyData[i];
            var actObj:any = UserProxy.inst.activityObj[106];
            if(!UserMethod.inst.isBitGet(parseInt(costData["id"]),actObj["dayRMBBit"]))
            {
                if( actObj["todayRMB"][parseInt(i) - 1] >= 1)
                {
                    this._actOnePayShow = true;
                    return true;
                }
            }

        }
        this._actOnePayShow = false;
        return false;
    }

    public isInviteDoubleOpen():boolean
    {
        var actRecharge:any = UserProxy.inst.activityObj[105];
        if(!actRecharge || !actRecharge["id"])
        {
            return false;
        }
        var id:number = actRecharge["id"];
        var actData:any = Config.ActivityData[id];
        if(!actData)
        {
            return false;
        }
        var start_time: number = Config.ActivityData[id]["time_start"];
        var end_time: number = Config.ActivityData[id]["time_exchange"];

        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    }

    public checkMinePoint():boolean
    {
        //矿满
        var mineData:any = UserProxy.inst.home["mine"];
        this._mineFullPoint = false;
        for(var i:number = 0; i < 3;i++)
        {
            if(!UserProxy.inst.mineOutputAry)
            {
                this._mineFullPoint = false;
                break;
            }
            var outPut:number = UserProxy.inst.mineOutputAry[i];
            var outPutMax:number = mineData[i+1]["maxOutput"];

            if(outPut >= outPutMax)
            {
                this._mineFullPoint = true;
                break;
            }
        }
        //建筑可升级
        this._mineBuildPoint = false;
        var openArea:string[] = Config.BaseData[74]["value"];
        for(var c in UserProxy.inst.building)
        {
            var buildInfo:any = UserProxy.inst.building[c];
            if(!buildInfo)
            {
                this._mineBuildPoint = false;
                break;
            }
            var nextCaveData:any;
            var lv:number = buildInfo["lv"];
            if(!lv)
            {
                nextCaveData= Config.CaveData[1];
            }
            else
            {
                nextCaveData= Config.CaveData[lv+1];
            }

            if(nextCaveData)
            {
                var idx:number = parseInt(c)
                var cost:number = nextCaveData["build_cost_" + idx];
                if(UserProxy.inst.ore >= cost)
                {
                    if(idx == 1)
                    {
                        this._mineBuildPoint = true;
                    }
                    else if(idx == 2 && UserProxy.inst.historyArea >= parseInt(openArea[1]))
                    {
                        this._mineFullPoint = true;
                    }
                    else if(idx == 3 && UserProxy.inst.historyArea >= parseInt(openArea[2]))
                    {
                        this._mineFullPoint = true;
                    }
                    break;
                }
            }
        }

        if(this._mineBuildPoint || this._mineFullPoint)
        {
            return true;
        }

        return false;
    }


    public isFestivalOpen():boolean
    {
        var actRecharge:any = UserProxy.inst.activityObj[111];
        if(!actRecharge || !actRecharge["id"])
        {
            return false;
        }
        var id:number = actRecharge["id"];
        var actData:any = Config.ActivityData[id];
        if(!actData)
        {
            return false;
        }
        var start_time: number = Config.ActivityData[id]["time_start"];
        var end_time: number = Config.ActivityData[id]["time_exchange"];

        return !!(end_time >= UserProxy.inst.server_time && start_time <= UserProxy.inst.server_time);
    }

    public checkFestivalPoint():boolean
    {
        if(!this.isFestivalOpen())
        {
            this._actFestivalShow = false;
            return false;
        }

        var actFestival:any = UserProxy.inst.activityObj[111];
        var buyFlag:number[] = actFestival["buyFlag"];
        var timesAry:number[] = actFestival["timesAry"];
        var todayFlag:number[] = actFestival["todayFlag"];
        for(var i:number = 0;i < 3; i++)
        {
            var actInvest:any = Config.ActInvestData;
            var nowActData:any = actInvest[i+1];
            var buy:number = buyFlag[i];
            var times:number = timesAry[i];
            var today:number = todayFlag[i];

            if(buy)
            {
                if(!today && times < parseInt(nowActData["days"]))
                {
                    this._actFestivalShow = true;
                    return true;
                }
            }
        }
        this._actFestivalShow = false;
        return false;
    }
}

