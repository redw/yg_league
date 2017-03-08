/**
 * 全局配置
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
var Global;
(function (Global) {
    function initConfig(data) {
        Global.DEBUG = data["DEBUG"];
        Global.GAME_ID = data["GAME_ID"];
        Global.TEST_TOKEN = data["TEST_TOKEN"];
        Global.SERVER_ADDR = data["TEST_SERVER"];
        Global.PAY_ENABLED = data["PAY_ENABLED"];
        Global.FOCUS_ENABLED = data["FOCUS_ENABLED"];
        Global.SOUND_ENABLED = data["SOUND_ENABLED"];
        Global.SHARE_ENABLED = data["SHARE_ENABLED"];
        Global.TEST_SERVER = data["TEST_SERVER"];
        if (ExternalUtil.inst.getIsYYB()) {
            Global.GAME_ID = 199;
        }
        if (ExternalUtil.inst.getIsHT()) {
            Global.GAME_ID = 203;
        }
    }
    Global.initConfig = initConfig;
    Global.SOUND_ENABLED = true; // 声音是否开启
    Global.SYS_FONT = "微软雅黑"; // 系统字体
    Global.COIN_TOP_HEIGHT = 630; // 货币栏 高
    Global.COIN_BOTTOM_HEIGHT = 360; //货币栏 低
    function getStage() {
        return egret.MainContext.instance.stage;
    }
    Global.getStage = getStage;
    function getStageWidth() {
        return egret.MainContext.instance.stage.stageWidth;
    }
    Global.getStageWidth = getStageWidth;
    function getStageHeight() {
        return egret.MainContext.instance.stage.stageHeight;
    }
    Global.getStageHeight = getStageHeight;
    function getResURL(name) {
        return "resource/" + name;
    }
    Global.getResURL = getResURL;
    function getHeroURL(name) {
        return getResURL("gui/hero/" + name);
    }
    Global.getHeroURL = getHeroURL;
    function getWeaponURL(id) {
        return getResURL("gui/weapon_icon/" + id + ".png");
    }
    Global.getWeaponURL = getWeaponURL;
    function getChaStay(id) {
        return getResURL("gui/hero_stay/" + id);
    }
    Global.getChaStay = getChaStay;
    function getChaIcon(id) {
        return getResURL("gui/hero_icon/" + id + ".png");
    }
    Global.getChaIcon = getChaIcon;
    function getChaChipIcon(id) {
        return getResURL("gui/hero_icon/chip_" + id + ".png");
    }
    Global.getChaChipIcon = getChaChipIcon;
    function getDrawEffect(name) {
        return getResURL("gui/effect/draw/" + name);
    }
    Global.getDrawEffect = getDrawEffect;
    function getFruitEffect(name) {
        return getResURL("gui/effect/fruit/" + name);
    }
    Global.getFruitEffect = getFruitEffect;
    /*export function getTaskIcon(id):string
    {
        return getResURL("gui/make_money_icon/makeMoney_" + id + ".png");
    }*/
    function getHero(name) {
        return getResURL("gui/hero/" + name);
    }
    Global.getHero = getHero;
    function getSkillIcon(id) {
        return getResURL("gui/skill_icon/" + id + ".png");
    }
    Global.getSkillIcon = getSkillIcon;
    function getTalentIcon(id) {
        return getResURL("gui/talent_icon/talent_" + id + ".png");
    }
    Global.getTalentIcon = getTalentIcon;
    function getHerobody(id) {
        return getResURL("gui/hero_body/" + id + ".png");
    }
    Global.getHerobody = getHerobody;
    function getHeroWeapon(id) {
        return getResURL("gui/hero_weapon/" + id + ".png");
    }
    Global.getHeroWeapon = getHeroWeapon;
    function getOtherEffect(name) {
        return getResURL("gui/effect/other_effect/" + name);
    }
    Global.getOtherEffect = getOtherEffect;
    function getSecretIcon(name) {
        return getResURL("gui/secret_icon/" + name + ".png");
    }
    Global.getSecretIcon = getSecretIcon;
    function getPVPHeadIcon(id) {
        return getResURL("gui/pvp_head/pvp_head_" + id + ".png");
    }
    Global.getPVPHeadIcon = getPVPHeadIcon;
})(Global || (Global = {}));
