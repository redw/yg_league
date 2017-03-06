class CmdID extends egret.HashObject {
    //登录
    public static ENTER: string = "enter";
    //心跳
    public static ALIVE: string = "keepLive";
    //英雄升级
    public static HERO_UP:string = "heroUp";
    //刷新物品商店
    public static WEAPON_SHOP_RESET:string = "weaponShopReset";
    //购买法宝
    public static WEAPON_SHOP_BUY:string = "weaponShopBuy";
    //出售法宝
    public static WEAPON_SHOP_SELL:string = "weaponShopSell";
    //升级法宝
    public static WEAPON_UP:string = "weaponUp";
    //购买法宝格子
    public static WEAPON_POS_BUY:string = "weaponPosBuy";
    //小妖升级
    public static MONSTER_UP:string = "monsterUp";
    //小妖挑战
    public static MONSTER_CHALLENGE:string = "monsterChallenge";
    //小妖扫荡
    public static MONSTER_SWEEP:string = "monsterSweep";
    //小妖重置
    public static MONSTER_RESET:string = "monsterReset";
    //小妖买体力
    public static MONSTER_BUY_VIT:string = "monsterBuyVit";
    //反馈
    public static ADVICE:string = "advice";
    //签到
    public static SIGN_IN:string = "signin";
    //接受拒绝好友
    public static ANSWER_FRIEND:string = "answerFriend";
    //打开好友
    public static OPEN_FRIEND:string = "openFriend";
    //好友一键接送体力
    public static ONE_KEY:string = "oneKey";
    //好友单领体力
    public static GET_ONE:string = "getOne";
    //寻仙
    public static DRAW_HERO:string = "drawHero";
    //领取邮件
    public static MAIL_ENCLOSE:string = "mailEnclose";
    //删除邮件
    public static DELETE_MAIL:string = "deleteMail";
    //巡山获得钱
    public static MONEY:string = "money";
    //巡山升级
    public static MONEY_UP:string = "moneyUp";
    //巡山自动开启
    public static AUTO_MONEY:string = "autoMoney";
    //打开秘境
    public static DUNGEON_OPEN:string = "dungeonOpen";
    //购买秘境次数
    public static DUNGEON_TIMES:string = "buyTimes";
    //秘境挑战
    public static DUNGEON_FIGHT:string = "dungeonFight";
    //打开小妖
    public static MONSTER_OPEN:string = "monsterOpen";
    //打开竞技场
    public static OPEN_PVP:string = "openPVP";
    //更换对手
    public static CHANGE_OP:string = "changeOp";
    //成就
    public static ACHIEVEMENT:string = "achievement";
    //每日任务
    public static TASK:string = "task";
    //排行
    public static RANK:string = "rank";
    //pvp排行
    public static LAST_PVP_RANK:string = "lastPVPrank";
    //pvp排行实时
    public static PVP_RANK:string = "PVPrank";
    //目标任务
    public static MISSION:string = "mission";
    //日常活动
    public static DAILY:string = "daily";
    //限时活动
    public static ACTIVITY:string = "activity";
    //分享奖励
    public static SHARE_PRICE:string = "sharePrice";
    //摇钱树的钱
    public static TREE_MONEY:string = "treeMoney";
    //历届冠军
    public static PVP_TOPS:string = "PVPtops";
    //打开、刷新pvp商店
    public static PVP_SHOP_RESET:string = "pvpShopReset";
    //购买pvp商店
    public static PVP_SHOP_BUY:string = "pvpShopBuy";
    //英雄强化升级
    public static ENHANCE_UP:string = "enhanceUp";
    //强化重置
    public static ENHANCE_RESET:string = "enhanceReset";
    //升星
    public static STAR_UP:string = "starUp";
    //商城
    public static SHOP:string = "shop";
    //七日礼包
    public static SEVEN_DAY_GIFT = "sevenDayGift";
    //获取邀请信息
    public static GET_INVITE_INFO = "getInviteInfo";
    //获取邀请奖励
    public static INVITE_PRICE = "invitePrice";
    //情缘升级
    public static RELATIONSHIP = "relationship";
    //每日月卡终身卡
    public static VIP_REWARD = "vipReward";
    //首冲
    public static VIP_PRICE = "recharge";
    //礼品吗
    public static GIFT_CODE = "giftCode";
    //充值发货
    public static RMB_GET = "rmbGet";
    //设置
    static SETUP:string = "setup";
    //获取分享奖励
    public static GET_SHARE_PRIZE: string = "share";
    //转生
    public static CIRCLE:string = "circle";
    //轮回突进
    public static GET_BACK:string = "getBack";
    //兑换碎片
    public static EXCHANGE:string = "exchange";
    //打开洞天
    public static OPEN_HOME:string = "openHome";
    //助手矿坑
    public static MINE_HERO:string = "mineHero";
    //获取英雄分享奖励
    public static SHARE_HERO_PRICE:string = "heroSharePrice";
    //收矿
    public static FARM_ORE:string = "farmOre";
    //升级科技
    public static BUILDING_UP:string = "buildingUp";
    //购买红利
    public static INVEST:string = "invest";
    //矿坑升级
    public static MINE_UP:string = "mineUp";

    //
    public static DELETE_FRIEND:string = "delFriend";
    public static OPEN_CIRCLE:string = "openCircle";
    public static ADD_FRIEND:string = "addFriend";
    public static FIND_FRIEND:string = "getInfo";


    //邀请
    public static INVITE: string = "invite";
    //新手引导
    public static SET_GUIDE: string = "setGuide";
    //是否有新邮件
    public static HAS_NEW_MAIL: string = "hasNewMail";
    //设置头像
    public static SET_HEAD:string = "setHead";



    // 战斗同步
    public static FIGHT_SYNC:string = "battleSync";
    // 布阵
    public static FIGHT_FORMATION:string = "changeHero";
    // pvp开战
    public static FIGHT_PVP_BEGIN:string = "beginPVP";
    // 使用道具(不含技能,buff等改变战力的道具)
    public static PROP_USE:string = "useItem";

    // 神器升级
    public static HALLOWS_UP:string = "hallowsUp";
    // 神器套装升级
    public static HALLOWS_SUIT:string = "hallowsSuit";

    //要做协议与类的映射
    public static cmdMap: any = {};
    public static waitCmdList: string[] = [];
    public static postCmdList: string[] = [];

    public static initCmd(): void {
        //游戏
        CmdID.addCmd(CmdID.ENTER, NetEnterCmd);
        CmdID.addCmd(CmdID.ALIVE, NetKeepLiveCmd, false, true);
        CmdID.addCmd(CmdID.HERO_UP, NetHeroUpCmd, false, false);
        CmdID.addCmd(CmdID.WEAPON_SHOP_RESET, NetWeaponShopCmd, false, false);
        CmdID.addCmd(CmdID.WEAPON_SHOP_BUY,NetWeaponBuyCmd,false,false);
        CmdID.addCmd(CmdID.WEAPON_UP,NetWeaponUpCmd,false,false);
        CmdID.addCmd(CmdID.WEAPON_SHOP_SELL,NetWeaponSellCmd,false,false);
        CmdID.addCmd(CmdID.MONSTER_UP,NetMonsterUpCmd,false,false);
        CmdID.addCmd(CmdID.SIGN_IN,BaseCmd,false,false);
        CmdID.addCmd(CmdID.ANSWER_FRIEND,BaseCmd,false,false);
        CmdID.addCmd(CmdID.OPEN_FRIEND,BaseCmd,true,false);
        CmdID.addCmd(CmdID.GET_ONE,BaseCmd,false,false);
        CmdID.addCmd(CmdID.ONE_KEY,BaseCmd,false,false);
        CmdID.addCmd(CmdID.DRAW_HERO,NetDrawHeroCmd,true,false);
        CmdID.addCmd(CmdID.MAIL_ENCLOSE,NetMailCmd,false,false);
        CmdID.addCmd(CmdID.MONEY,NetMakeMoneyCmd,false,false);
        CmdID.addCmd(CmdID.MONEY_UP,NetMoneyUpCmd,false,false);
        CmdID.addCmd(CmdID.AUTO_MONEY,NetAutoMoneyCmd,false,false);
        CmdID.addCmd(CmdID.MONSTER_OPEN,BaseCmd,false,false);
        CmdID.addCmd(CmdID.OPEN_PVP,BaseCmd,true,false);
        CmdID.addCmd(CmdID.DUNGEON_FIGHT, NetDungeonFightCmdReq,true,false);
        CmdID.addCmd(CmdID.CHANGE_OP,BaseCmd,true,false);
        CmdID.addCmd(CmdID.ACHIEVEMENT,NetAcieveCmd,false,false);
        CmdID.addCmd(CmdID.TASK,NetTaskCmd,false,false);
        CmdID.addCmd(CmdID.RANK,BaseCmd,false,false);
        CmdID.addCmd(CmdID.MISSION,BaseCmd,false,false);
        CmdID.addCmd(CmdID.LAST_PVP_RANK,BaseCmd,false,false);
        CmdID.addCmd(CmdID.FIGHT_PVP_BEGIN,NetPVPReqFightDataCmd,false,false);
        CmdID.addCmd(CmdID.DAILY,BaseCmd,false,false);
        CmdID.addCmd(CmdID.ACTIVITY,NetActivityCmd,false,false);
        CmdID.addCmd(CmdID.TREE_MONEY,BaseCmd,false,false);
        CmdID.addCmd(CmdID.PVP_RANK,BaseCmd,false,false);
        CmdID.addCmd(CmdID.PVP_TOPS,BaseCmd,false,false);
        CmdID.addCmd(CmdID.PVP_SHOP_RESET,BaseCmd,false,false);
        CmdID.addCmd(CmdID.PVP_SHOP_BUY,BaseCmd,false,false);
        CmdID.addCmd(CmdID.ENHANCE_UP,NetEnhanceUpCmd,false,false);
        CmdID.addCmd(CmdID.DUNGEON_OPEN,BaseCmd,false,false);
        CmdID.addCmd(CmdID.ENHANCE_RESET,NetEnhanceResetCmd,false,false);
        CmdID.addCmd(CmdID.STAR_UP,NetStarUpCmd,false,false);
        CmdID.addCmd(CmdID.SHOP,BaseCmd,false,false);
        CmdID.addCmd(CmdID.SEVEN_DAY_GIFT,BaseCmd,false,false);
        CmdID.addCmd(CmdID.GET_INVITE_INFO,NetInviteCmd,false,false);
        CmdID.addCmd(CmdID.INVITE_PRICE,NetInvitePriceCmd,false,false);
        CmdID.addCmd(CmdID.RELATIONSHIP,NetRelationCmd,false,false);
        CmdID.addCmd(CmdID.WEAPON_POS_BUY,NetWeaponPosBuyCmd,false,false);
        CmdID.addCmd(CmdID.VIP_REWARD,BaseCmd,false,false);
        CmdID.addCmd(CmdID.VIP_PRICE,BaseCmd,false,false);
        CmdID.addCmd(CmdID.GIFT_CODE,BaseCmd,false,false);
        CmdID.addCmd(CmdID.DUNGEON_TIMES,BaseCmd,false,false);
        CmdID.addCmd(CmdID.GET_SHARE_PRIZE,NetShareCmd,false,false);
        CmdID.addCmd(CmdID.RMB_GET,NetRechargeCmd,false,false);
        CmdID.addCmd(CmdID.SETUP,BaseCmd,false,false);
        CmdID.addCmd(CmdID.CIRCLE,NetCircleCmd,false,false);
        CmdID.addCmd(CmdID.SHARE_PRICE,NetSharePriceCmd,false,false);
        CmdID.addCmd(CmdID.PROP_USE, NetUsePropCmd, false, false);
        CmdID.addCmd(CmdID.SET_GUIDE,BaseCmd,false,false);
        CmdID.addCmd(CmdID.DELETE_FRIEND,BaseCmd,false,false);
        CmdID.addCmd(CmdID.OPEN_CIRCLE,BaseCmd,false,false);
        CmdID.addCmd(CmdID.FIND_FRIEND,BaseCmd,false,false);
        CmdID.addCmd(CmdID.ADD_FRIEND,BaseCmd,false,false);
        CmdID.addCmd(CmdID.SET_HEAD,BaseCmd,false,false);
        CmdID.addCmd(CmdID.GET_BACK,NetCircleGoBackCmd,false,false);
        CmdID.addCmd(CmdID.EXCHANGE,NetExchangeCmd,false,false);
        CmdID.addCmd(CmdID.OPEN_HOME,BaseCmd,false,false);
        CmdID.addCmd(CmdID.MINE_HERO,BaseCmd,false,false);
        CmdID.addCmd(CmdID.SHARE_HERO_PRICE,NetShareHeroPriceCmd,false,false);
        CmdID.addCmd(CmdID.FARM_ORE,NetOreCmd,false,false);
        CmdID.addCmd(CmdID.BUILDING_UP,NetBuildingUpCmd,false,false);
        CmdID.addCmd(CmdID.HALLOWS_UP, BaseCmd, true, false);
        CmdID.addCmd(CmdID.HALLOWS_SUIT, BaseCmd, true, false);
        CmdID.addCmd(CmdID.INVEST,BaseCmd,false,false);
        CmdID.addCmd(CmdID.MINE_UP,NetMineUp,false,false);

        CmdID.addCmd(CmdID.FIGHT_SYNC, NetFightSyncCmd, false, false);
        CmdID.addCmd("testBattle", NetFightSyncCmd, false, false);
        CmdID.addCmd(CmdID.FIGHT_FORMATION, NetFormationCmd, false, false);

        // CmdID.addCmd(CmdID.GET_INVITE_COUNT, BaseCmd, false, false);
        //



    }

    public static addCmd(cmd: string, cls: any, isWait: Boolean = false, isPost: Boolean = false): void {
        CmdID.cmdMap[cmd] = cls;

        if (isWait) {
            CmdID.waitCmdList.push(cmd);
        }
        if (isPost) {
            CmdID.postCmdList.push(cmd);
        }
    }

    //创建一个协议对应的处理命令
    public static createCmd(cmd: string, data: any): void {
        if (CmdID.cmdMap[cmd]) {
            var inst: BaseCmd = new CmdID.cmdMap[cmd](data);
            inst.execute();
        }
        else {
            console.warn("[" + cmd + "] Class Not Defined....");
        }
    }
}