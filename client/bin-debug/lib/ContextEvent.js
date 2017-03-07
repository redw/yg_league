var ContextEvent = (function (_super) {
    __extends(ContextEvent, _super);
    function ContextEvent() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ContextEvent,p=c.prototype;
    ContextEvent.HTTP_OK = "HTTP_OK";
    ContextEvent.HTTP_ERROR = "HTTP_ERROR";
    ContextEvent.REFRESH_BASE = "REFRESH_BASE";
    ContextEvent.REFRESH_WEAPON_COIN = "REFRESH_WEAPON_COIN";
    ContextEvent.REFRESH_WEAPON = "REFRESH_WEAPON";
    ContextEvent.SHOW_PANEL = "SHOW_PANEL";
    ContextEvent.HIDE_PANEL = "HIDE_PANEL";
    ContextEvent.ROLE_DATA_UPDATE = "ROLE_DATA_UPDATE";
    ContextEvent.FRIEND_POINT = "FRIEND_POINT";
    ContextEvent.REFRESH_TASK = "REFRESH_TASK";
    ContextEvent.DELETA_MAIL = "DELETA_MAIL";
    ContextEvent.PVP_CHANGE_POS = "PVP_CHANGE_POS";
    ContextEvent.PVP_CHANGE_END = "PVP_CHANGE_END";
    ContextEvent.PVP_SHOP_BUY = "PVP_SHOP_BUY";
    ContextEvent.BATTLE_CHANGE_POS = "BATTLE_CHANGE_POS";
    ContextEvent.BATTLE_CHANGE_END = "BATTLE_CHANGE_END";
    ContextEvent.BATTLE_CHANGE_CELL = "BATTLE_CHANGE_CELL";
    ContextEvent.CHANGE_ROLE_SHOW = "CHANGE_ROLE_SHOW";
    ContextEvent.HAVE_NEW_ROLE = "HAVE_NEW_ROLE";
    ContextEvent.ADD_EARN_MONEY = "ADD_EARN_MONEY";
    ContextEvent.PVP_BATTLE_DOWN = "PVP_BATTLE_DOWN";
    ContextEvent.OPEN_FUNCTION = "OPEN_FUNCTION";
    ContextEvent.PVE_SYNC_AGAIN = "PVE_SYNC_AGAIN";
    ContextEvent.HERO_SHIP_UP = "HERO_SHIP_UP";
    ContextEvent.GUIDE_CLOSE_FORMATION = "GUIDE_CLOSE_FORMATION";
    ContextEvent.RECHARGE_BACK = "RECHARGE_BACK";
    ContextEvent.CONTINUE_MOVE = "CONTINUE_MOVE";
    ContextEvent.OPEN_DEBLOCKING = "OPEN_DEBLOCKING";
    ContextEvent.REFRESH_DUNGEON_INFO = "REFRESH_DUNGEON_INFO";
    ContextEvent.FORMATION_CHECK = "FORMATION_CHECK";
    ContextEvent.LABEL_MOVE_SHOW = "LABEL_MOVE_SHOW";
    ContextEvent.REFRESH_SOUL_COIN = "REFRESH_SOUL_COIN";
    ContextEvent.MINE_UP_CHANGE = "MINE_UP_CHANGE";
    ContextEvent.MINE_NEED_UP = "MINE_NEED_UP";
    ContextEvent.MiNE_FORMATION_CLOSE = "MiNE_FORMATION_CLOSE";
    ContextEvent.FIGHT_PROGRESS_POS = "FIGHT_PROGRESS_POS";
    ContextEvent.REFRESH_CAVE_STONE = "REFRESH_CAVE_STONE";
    // pve战斗同步
    ContextEvent.PVE_SYNC_RES = "PVE_SYNC_RES";
    // 变阵
    ContextEvent.PVE_CHANGE_FORMATION_RES = "PVE_CHANGE_FORMATION_RES";
    // 战斗血条进度
    ContextEvent.FIGHT_BLOOD_PROGRESS = "FIGHT_BLOOD_PROGRESS";
    // 战斗预警
    ContextEvent.FIGHT_WARN = "FIGHT_WARN";
    // pvp战斗数据
    ContextEvent.PVP_FIGHT_DATA_RES = "PVP_FIGHT_DATA_RES";
    ContextEvent.FIGHT_ROLE_HP_CHANGE = "FIGHT_ROLE_HP_CHANGE";
    // 战斗结速
    ContextEvent.FIGHT_END = "fight_end";
    // 秘镜战斗数据返回
    ContextEvent.DUNGEON_FIGHT_DATA_RES = "dungeon_fight_data_res";
    // 使用道具返回
    ContextEvent.PROP_USE_RES = "prop_use_res";
    // 强制跳转到某关卡
    ContextEvent.FORCE_TO_STAGE = "force_to_stage";
    // 秘镜战结束
    ContextEvent.BOSS_FIGHT_END = "boss_fight_end";
    // PVP战结束
    ContextEvent.PVP_FIGHT_END = "pvp_fight_end";
    ContextEvent.PVP_REFRESH_ROLE_REQ = "PVP_REFRESH_ROLE_REQ";
    ContextEvent.TOGGLE_PVE_BATTLE = "TOGGLE_PVE_BATTLE";
    //
    ContextEvent.CHA_REMOVE = "CHA_REMOVE";
    ContextEvent.CHA_RESET = "CHA_RESET";
    ContextEvent.CHA_HURT = "CHA_HURT";
    ContextEvent.CHA_MOVE = "CHA_MOVE";
    return ContextEvent;
}(egret.HashObject));
egret.registerClass(ContextEvent,'ContextEvent');
//# sourceMappingURL=ContextEvent.js.map