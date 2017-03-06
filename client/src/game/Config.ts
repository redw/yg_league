/**
 * 配表数据
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
class Config extends egret.HashObject
{
    static ErrorData:Object;
    static HeroData:Object;
    static EnemyData:Object;
    static SkillData:Object;
    static BuffData:Object;
    static BaseData:Object;
    static TalentData:Object;
    static FriendshipData:Object;
    static WeaponData:Object;
    static WeaponSuit:Object;
    static WeaponFbOp:Object;
    static WeaponFb:Object;
    static SmallMonsterData:Object;
    static MonsterLvUpData:Object;
    static MonsterFb:Object;
    static DailySigninData:Object;
    static RewardData:Object;
    static SevenDayData:Object;
    static InviteData:Object;
    static HeroDrawData:Object;
    static AchievementData:Object;
    static DailyTaskData:Object;
    static TargetData:Object;
    static DropData:Object;
    static DailyInviteData:Object;
    static DailyFundData:Object;
    static PVPData:Object;
    static PVPShopData:Object;
    static HeroJadeCostData:Object;
    static HeroStarData:Object;
    static ShopData:Object;
    static SevenBuyData:Object;
    static FirstBloodData:Object;
    static WheelFloorData:Object;
    static PVPNameData:Object;
    static PVPPointData:Object;
    static HeadData:Object;
    static TipsData:Object;
    static ActWordData:Object;
    static ActAddBuyData:Object;
    static ActivityData:Object;
    static ActDrawHeroData:Object;
    static ActPVPData:Object;
    static DrawShopSellData:Object;
    static DrawShopBuyData:Object;
    static NoticeData:Object;
    static ActAddCostData:Object;
    static ActSingleBuyData:Object;
    static OreData:Object;
    static NewTipsData:Object;
    static CaveData:Object;
    static ActInvestData:Object;
    static OreUpData:Object;

    static ArtifactData:Object;
    static ArtifactGroupData:Object;

    /** 关卡数据 */
    static StageData:Object;
    static StageCommonData:Object;
    static MakeMoneyData:Object;
    static TriggerChanceData:Object;

    static loadError = function(): void
    {
        Config.ErrorData = RES.getRes("error_json");
    };

    static loadNotice = function ():void
    {
        if(ExternalUtil.inst.getIsHT())
        {
            Config.NoticeData = RES.getRes("n2_notice_fk_json");
        }
        else if(ExternalUtil.inst.getIsYYB())
        {
            Config.NoticeData = RES.getRes("n2_notice_yyb_json");
        }
        else
        {
            Config.NoticeData = RES.getRes("n2_notice_json");
        }
    };

    static loadTip = function ():void
    {
        Config.NewTipsData = RES.getRes("n2_tips_xs_json");
    };
    
    static init = function():void
    {
        DataConfig.initData(RES.getRes("data_json"));
        Config.AchievementData = DataConfig.getTableData("n2_achievement");
        Config.ActWordData = DataConfig.getTableData("n2_act_word");
        Config.ActAddBuyData = DataConfig.getTableData("n2_act_addbuy");
        Config.ActivityData = DataConfig.getTableData("n2_act_activity");
        Config.ActDrawHeroData = DataConfig.getTableData("n2_act_drawhero");
        Config.ActPVPData = DataConfig.getTableData("n2_act_pvp");
        Config.ActAddCostData = DataConfig.getTableData("n2_act_addcost");
        Config.ActSingleBuyData = DataConfig.getTableData("n2_act_singlebuy");
        Config.ActInvestData = DataConfig.getTableData("n2_act_invest");
        Config.BaseData = DataConfig.getTableData("n2_basedata");
        Config.BuffData = DataConfig.getTableData("n2_buff");
        Config.CaveData = DataConfig.getTableData("n2_cave");
        Config.DailyFundData = DataConfig.getTableData("n2_daily_fund");
        Config.DailyInviteData = DataConfig.getTableData("n2_daily_senddiamond");
        Config.DailySigninData = DataConfig.getTableData("n2_daily_signin");
        Config.DrawShopSellData = DataConfig.getTableData("n2_drawshop_sell");
        Config.DrawShopBuyData = DataConfig.getTableData("n2_drawshop_buy");
        Config.FirstBloodData = DataConfig.getTableData("n2_firstblood");
        Config.FriendshipData = DataConfig.getTableData("n2_friendship");
        Config.HeadData = DataConfig.getTableData("n2_head");
        Config.HeroData = DataConfig.getTableData("n2_hero");
        Config.HeroDrawData = DataConfig.getTableData("n2_hero_draw");
        Config.HeroJadeCostData = DataConfig.getTableData("n2_hero_jadecost");
        Config.SkillData = DataConfig.getTableData("n2_hero_skill");
        Config.HeroStarData = DataConfig.getTableData("n2_hero_star");
        Config.TalentData = DataConfig.getTableData("n2_hero_talent");
        Config.InviteData = DataConfig.getTableData("n2_invite");
        Config.MakeMoneyData = DataConfig.getTableData("n2_makemoney");
        Config.TargetData = DataConfig.getTableData("n2_mission");
        // Config.SmallMonsterData = DataConfig.getTableData("n2_monster");
        // Config.MonsterFb = DataConfig.getTableData("n2_monster_fb");
        // Config.MonsterLvUpData = DataConfig.getTableData("n2_monster_lvup");
        Config.OreData = DataConfig.getTableData("n2_ore");
        Config.OreUpData = DataConfig.getTableData("n2_oreup");
        Config.StageCommonData = DataConfig.getTableData("n2_pve_asset");
        Config.EnemyData = DataConfig.getTableData("n2_pve_enemy");
        Config.DropData = DataConfig.getTableData("n2_pve_item");
        Config.StageData = DataConfig.getTableData("n2_pve_stage");
        Config.PVPData = DataConfig.getTableData("n2_pvp_data");
        Config.PVPPointData = DataConfig.getTableData("n2_pvp_point");
        Config.PVPShopData = DataConfig.getTableData("n2_pvp_shop");
        Config.RewardData = DataConfig.getTableData("n2_reward");
        Config.SevenBuyData = DataConfig.getTableData("n2_sevenbuy");
        Config.SevenDayData = DataConfig.getTableData("n2_sevenday");
        Config.ShopData = DataConfig.getTableData("n2_shop");
        Config.DailyTaskData = DataConfig.getTableData("n2_task");
        Config.TipsData = DataConfig.getTableData("n2_tips");
        Config.TriggerChanceData = DataConfig.getTableData("n2_trigger_chance");
        Config.WeaponData = DataConfig.getTableData("n2_weapon");
        Config.WeaponFb = DataConfig.getTableData("n2_weapon_fb");
        Config.WeaponFbOp = DataConfig.getTableData("n2_weapon_fbop");
        Config.WeaponSuit = DataConfig.getTableData("n2_weapon_suit");
        Config.WheelFloorData = DataConfig.getTableData("n2_wheel_floor");
        Config.PVPNameData = DataConfig.getTableData("pvp_name");
        Config.ArtifactData = DataConfig.getTableData("n2_artifact");
        Config.ArtifactGroupData = DataConfig.getTableData("n2_artifact_group");

        //奖励表用的地方多提出来
        Config.createRewardData(Config.RewardData);
    };

    static createRewardData(jsonData: any): void
    {

        var reward: RewardData;
        UserMethod.inst.rewardJs = [];
        for(var c in jsonData)
        {
            reward = new RewardData();
            reward.id = parseInt(jsonData[c]["id"]);
            reward.name = jsonData[c]["name"];
            reward.icon = jsonData[c]["icon"] + "_png";
            reward.icon_s = jsonData[c]["icon_s"] + "_png";
            reward.Disc = jsonData[c]["Disc"];
            reward.TipsName = jsonData[c]["TipsName"];
            reward.TipsDisc = jsonData[c]["TipsDisc"];
            UserMethod.inst.rewardJs[reward.id] = reward;
        }
    }
}

class RewardData
{
    id:number;
    name:string;
    icon:string;
    icon_s:string;
    Disc:string;
    TipsName:string;
    TipsDisc:string;

}

enum PidType
{
    PID_MONTH = 8783,
    PID_FOREVER = 8784,
    PID_FUND = 8785,
    PID_2 = 8776,
    PID_6 = 8777,
    PID_30 = 8778,
    PID_50 = 8779,
    PID_98 = 8780,
    PID_198 = 8781,
    PID_648 = 8782
}