var CmdID = (function (_super) {
    __extends(CmdID, _super);
    function CmdID() {
        _super.apply(this, arguments);
    }
    var d = __define,c=CmdID,p=c.prototype;
    CmdID.initCmd = function () {
        //游戏
        CmdID.addCmd(CmdID.ENTER, NetEnterCmd);
        CmdID.addCmd(CmdID.ALIVE, NetKeepLiveCmd, false, true);
        CmdID.addCmd(CmdID.HERO_UP, NetHeroUpCmd, false, false);
        CmdID.addCmd(CmdID.WEAPON_SHOP_RESET, NetWeaponShopCmd, false, false);
        CmdID.addCmd(CmdID.WEAPON_SHOP_BUY, NetWeaponBuyCmd, false, false);
        CmdID.addCmd(CmdID.WEAPON_UP, NetWeaponUpCmd, false, false);
        CmdID.addCmd(CmdID.WEAPON_SHOP_SELL, NetWeaponSellCmd, false, false);
        CmdID.addCmd(CmdID.MONSTER_UP, NetMonsterUpCmd, false, false);
        CmdID.addCmd(CmdID.SIGN_IN, BaseCmd, false, false);
        CmdID.addCmd(CmdID.ANSWER_FRIEND, BaseCmd, false, false);
        CmdID.addCmd(CmdID.OPEN_FRIEND, BaseCmd, true, false);
        CmdID.addCmd(CmdID.GET_ONE, BaseCmd, false, false);
        CmdID.addCmd(CmdID.ONE_KEY, BaseCmd, false, false);
        CmdID.addCmd(CmdID.DRAW_HERO, NetDrawHeroCmd, true, false);
        CmdID.addCmd(CmdID.MAIL_ENCLOSE, NetMailCmd, false, false);
        CmdID.addCmd(CmdID.MONEY, NetMakeMoneyCmd, false, false);
        CmdID.addCmd(CmdID.MONEY_UP, NetMoneyUpCmd, false, false);
        CmdID.addCmd(CmdID.AUTO_MONEY, NetAutoMoneyCmd, false, false);
        CmdID.addCmd(CmdID.MONSTER_OPEN, BaseCmd, false, false);
        CmdID.addCmd(CmdID.OPEN_PVP, BaseCmd, true, false);
        CmdID.addCmd(CmdID.DUNGEON_FIGHT, NetDungeonFightCmdReq, true, false);
        CmdID.addCmd(CmdID.CHANGE_OP, BaseCmd, true, false);
        CmdID.addCmd(CmdID.ACHIEVEMENT, NetAcieveCmd, false, false);
        CmdID.addCmd(CmdID.TASK, NetTaskCmd, false, false);
        CmdID.addCmd(CmdID.RANK, BaseCmd, false, false);
        CmdID.addCmd(CmdID.MISSION, BaseCmd, false, false);
        CmdID.addCmd(CmdID.LAST_PVP_RANK, BaseCmd, false, false);
        CmdID.addCmd(CmdID.FIGHT_PVP_BEGIN, NetPVPReqFightDataCmd, false, false);
        CmdID.addCmd(CmdID.DAILY, BaseCmd, false, false);
        CmdID.addCmd(CmdID.ACTIVITY, NetActivityCmd, false, false);
        CmdID.addCmd(CmdID.TREE_MONEY, BaseCmd, false, false);
        CmdID.addCmd(CmdID.PVP_RANK, BaseCmd, false, false);
        CmdID.addCmd(CmdID.PVP_TOPS, BaseCmd, false, false);
        CmdID.addCmd(CmdID.PVP_SHOP_RESET, BaseCmd, false, false);
        CmdID.addCmd(CmdID.PVP_SHOP_BUY, BaseCmd, false, false);
        CmdID.addCmd(CmdID.ENHANCE_UP, NetEnhanceUpCmd, false, false);
        CmdID.addCmd(CmdID.DUNGEON_OPEN, BaseCmd, false, false);
        CmdID.addCmd(CmdID.ENHANCE_RESET, NetEnhanceResetCmd, false, false);
        CmdID.addCmd(CmdID.STAR_UP, NetStarUpCmd, false, false);
        CmdID.addCmd(CmdID.SHOP, BaseCmd, false, false);
        CmdID.addCmd(CmdID.SEVEN_DAY_GIFT, BaseCmd, false, false);
        CmdID.addCmd(CmdID.GET_INVITE_INFO, NetInviteCmd, false, false);
        CmdID.addCmd(CmdID.INVITE_PRICE, NetInvitePriceCmd, false, false);
        CmdID.addCmd(CmdID.RELATIONSHIP, NetRelationCmd, false, false);
        CmdID.addCmd(CmdID.WEAPON_POS_BUY, NetWeaponPosBuyCmd, false, false);
        CmdID.addCmd(CmdID.VIP_REWARD, BaseCmd, false, false);
        CmdID.addCmd(CmdID.VIP_PRICE, BaseCmd, false, false);
        CmdID.addCmd(CmdID.GIFT_CODE, BaseCmd, false, false);
        CmdID.addCmd(CmdID.DUNGEON_TIMES, BaseCmd, false, false);
        CmdID.addCmd(CmdID.GET_SHARE_PRIZE, NetShareCmd, false, false);
        CmdID.addCmd(CmdID.RMB_GET, NetRechargeCmd, false, false);
        CmdID.addCmd(CmdID.SETUP, BaseCmd, false, false);
        CmdID.addCmd(CmdID.CIRCLE, NetCircleCmd, false, false);
        CmdID.addCmd(CmdID.SHARE_PRICE, NetSharePriceCmd, false, false);
        CmdID.addCmd(CmdID.PROP_USE, NetUsePropCmd, false, false);
        CmdID.addCmd(CmdID.SET_GUIDE, BaseCmd, false, false);
        CmdID.addCmd(CmdID.DELETE_FRIEND, BaseCmd, false, false);
        CmdID.addCmd(CmdID.OPEN_CIRCLE, BaseCmd, false, false);
        CmdID.addCmd(CmdID.FIND_FRIEND, BaseCmd, false, false);
        CmdID.addCmd(CmdID.ADD_FRIEND, BaseCmd, false, false);
        CmdID.addCmd(CmdID.SET_HEAD, BaseCmd, false, false);
        CmdID.addCmd(CmdID.GET_BACK, NetCircleGoBackCmd, false, false);
        CmdID.addCmd(CmdID.EXCHANGE, NetExchangeCmd, false, false);
        CmdID.addCmd(CmdID.OPEN_HOME, BaseCmd, false, false);
        CmdID.addCmd(CmdID.MINE_HERO, BaseCmd, false, false);
        CmdID.addCmd(CmdID.SHARE_HERO_PRICE, NetShareHeroPriceCmd, false, false);
        CmdID.addCmd(CmdID.FARM_ORE, NetOreCmd, false, false);
        CmdID.addCmd(CmdID.BUILDING_UP, NetBuildingUpCmd, false, false);
        CmdID.addCmd(CmdID.HALLOWS_UP, BaseCmd, true, false);
        CmdID.addCmd(CmdID.HALLOWS_SUIT, BaseCmd, true, false);
        CmdID.addCmd(CmdID.INVEST, BaseCmd, false, false);
        CmdID.addCmd(CmdID.MINE_UP, NetMineUp, false, false);
        CmdID.addCmd(CmdID.FIGHT_SYNC, NetFightSyncCmd, false, false);
        CmdID.addCmd("testBattle", NetFightSyncCmd, false, false);
        CmdID.addCmd(CmdID.FIGHT_FORMATION, NetFormationCmd, false, false);
        // CmdID.addCmd(CmdID.GET_INVITE_COUNT, BaseCmd, false, false);
        //
    };
    CmdID.addCmd = function (cmd, cls, isWait, isPost) {
        if (isWait === void 0) { isWait = false; }
        if (isPost === void 0) { isPost = false; }
        CmdID.cmdMap[cmd] = cls;
        if (isWait) {
            CmdID.waitCmdList.push(cmd);
        }
        if (isPost) {
            CmdID.postCmdList.push(cmd);
        }
    };
    //创建一个协议对应的处理命令
    CmdID.createCmd = function (cmd, data) {
        if (CmdID.cmdMap[cmd]) {
            var inst = new CmdID.cmdMap[cmd](data);
            inst.execute();
        }
        else {
            console.warn("[" + cmd + "] Class Not Defined....");
        }
    };
    //登录
    CmdID.ENTER = "enter";
    //心跳
    CmdID.ALIVE = "keepLive";
    //英雄升级
    CmdID.HERO_UP = "heroUp";
    //刷新物品商店
    CmdID.WEAPON_SHOP_RESET = "weaponShopReset";
    //购买法宝
    CmdID.WEAPON_SHOP_BUY = "weaponShopBuy";
    //出售法宝
    CmdID.WEAPON_SHOP_SELL = "weaponShopSell";
    //升级法宝
    CmdID.WEAPON_UP = "weaponUp";
    //购买法宝格子
    CmdID.WEAPON_POS_BUY = "weaponPosBuy";
    //小妖升级
    CmdID.MONSTER_UP = "monsterUp";
    //小妖挑战
    CmdID.MONSTER_CHALLENGE = "monsterChallenge";
    //小妖扫荡
    CmdID.MONSTER_SWEEP = "monsterSweep";
    //小妖重置
    CmdID.MONSTER_RESET = "monsterReset";
    //小妖买体力
    CmdID.MONSTER_BUY_VIT = "monsterBuyVit";
    //反馈
    CmdID.ADVICE = "advice";
    //签到
    CmdID.SIGN_IN = "signin";
    //接受拒绝好友
    CmdID.ANSWER_FRIEND = "answerFriend";
    //打开好友
    CmdID.OPEN_FRIEND = "openFriend";
    //好友一键接送体力
    CmdID.ONE_KEY = "oneKey";
    //好友单领体力
    CmdID.GET_ONE = "getOne";
    //寻仙
    CmdID.DRAW_HERO = "drawHero";
    //领取邮件
    CmdID.MAIL_ENCLOSE = "mailEnclose";
    //删除邮件
    CmdID.DELETE_MAIL = "deleteMail";
    //巡山获得钱
    CmdID.MONEY = "money";
    //巡山升级
    CmdID.MONEY_UP = "moneyUp";
    //巡山自动开启
    CmdID.AUTO_MONEY = "autoMoney";
    //打开秘境
    CmdID.DUNGEON_OPEN = "dungeonOpen";
    //购买秘境次数
    CmdID.DUNGEON_TIMES = "buyTimes";
    //秘境挑战
    CmdID.DUNGEON_FIGHT = "dungeonFight";
    //打开小妖
    CmdID.MONSTER_OPEN = "monsterOpen";
    //打开竞技场
    CmdID.OPEN_PVP = "openPVP";
    //更换对手
    CmdID.CHANGE_OP = "changeOp";
    //成就
    CmdID.ACHIEVEMENT = "achievement";
    //每日任务
    CmdID.TASK = "task";
    //排行
    CmdID.RANK = "rank";
    //pvp排行
    CmdID.LAST_PVP_RANK = "lastPVPrank";
    //pvp排行实时
    CmdID.PVP_RANK = "PVPrank";
    //目标任务
    CmdID.MISSION = "mission";
    //日常活动
    CmdID.DAILY = "daily";
    //限时活动
    CmdID.ACTIVITY = "activity";
    //分享奖励
    CmdID.SHARE_PRICE = "sharePrice";
    //摇钱树的钱
    CmdID.TREE_MONEY = "treeMoney";
    //历届冠军
    CmdID.PVP_TOPS = "PVPtops";
    //打开、刷新pvp商店
    CmdID.PVP_SHOP_RESET = "pvpShopReset";
    //购买pvp商店
    CmdID.PVP_SHOP_BUY = "pvpShopBuy";
    //英雄强化升级
    CmdID.ENHANCE_UP = "enhanceUp";
    //强化重置
    CmdID.ENHANCE_RESET = "enhanceReset";
    //升星
    CmdID.STAR_UP = "starUp";
    //商城
    CmdID.SHOP = "shop";
    //七日礼包
    CmdID.SEVEN_DAY_GIFT = "sevenDayGift";
    //获取邀请信息
    CmdID.GET_INVITE_INFO = "getInviteInfo";
    //获取邀请奖励
    CmdID.INVITE_PRICE = "invitePrice";
    //情缘升级
    CmdID.RELATIONSHIP = "relationship";
    //每日月卡终身卡
    CmdID.VIP_REWARD = "vipReward";
    //首冲
    CmdID.VIP_PRICE = "recharge";
    //礼品吗
    CmdID.GIFT_CODE = "giftCode";
    //充值发货
    CmdID.RMB_GET = "rmbGet";
    //设置
    CmdID.SETUP = "setup";
    //获取分享奖励
    CmdID.GET_SHARE_PRIZE = "share";
    //转生
    CmdID.CIRCLE = "circle";
    //轮回突进
    CmdID.GET_BACK = "getBack";
    //兑换碎片
    CmdID.EXCHANGE = "exchange";
    //打开洞天
    CmdID.OPEN_HOME = "openHome";
    //助手矿坑
    CmdID.MINE_HERO = "mineHero";
    //获取英雄分享奖励
    CmdID.SHARE_HERO_PRICE = "heroSharePrice";
    //收矿
    CmdID.FARM_ORE = "farmOre";
    //升级科技
    CmdID.BUILDING_UP = "buildingUp";
    //购买红利
    CmdID.INVEST = "invest";
    //矿坑升级
    CmdID.MINE_UP = "mineUp";
    //
    CmdID.DELETE_FRIEND = "delFriend";
    CmdID.OPEN_CIRCLE = "openCircle";
    CmdID.ADD_FRIEND = "addFriend";
    CmdID.FIND_FRIEND = "getInfo";
    //邀请
    CmdID.INVITE = "invite";
    //新手引导
    CmdID.SET_GUIDE = "setGuide";
    //是否有新邮件
    CmdID.HAS_NEW_MAIL = "hasNewMail";
    //设置头像
    CmdID.SET_HEAD = "setHead";
    // 战斗同步
    CmdID.FIGHT_SYNC = "battleSync";
    // 布阵
    CmdID.FIGHT_FORMATION = "changeHero";
    // pvp开战
    CmdID.FIGHT_PVP_BEGIN = "beginPVP";
    // 使用道具(不含技能,buff等改变战力的道具)
    CmdID.PROP_USE = "useItem";
    // 神器升级
    CmdID.HALLOWS_UP = "hallowsUp";
    // 神器套装升级
    CmdID.HALLOWS_SUIT = "hallowsSuit";
    //要做协议与类的映射
    CmdID.cmdMap = {};
    CmdID.waitCmdList = [];
    CmdID.postCmdList = [];
    return CmdID;
}(egret.HashObject));
egret.registerClass(CmdID,'CmdID');
//# sourceMappingURL=CmdID.js.map