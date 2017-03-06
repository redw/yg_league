/**
 * 全局配置
 * by Rock
 * (c) copyright 2014 - 2035
 * All Rights Reserved.
 */
module Global
{
    export function initConfig(data:any):void
    {
        Global.DEBUG = data["DEBUG"];
        Global.GAME_ID = data["GAME_ID"];
        Global.TEST_TOKEN = data["TEST_TOKEN"];
        Global.SERVER_ADDR = data["TEST_SERVER"];
        Global.PAY_ENABLED = data["PAY_ENABLED"];
        Global.FOCUS_ENABLED = data["FOCUS_ENABLED"];
        Global.SOUND_ENABLED = data["SOUND_ENABLED"];
        Global.SHARE_ENABLED = data["SHARE_ENABLED"];
        Global.TEST_SERVER = data["TEST_SERVER"];

        if(ExternalUtil.inst.getIsYYB())
        {
            Global.GAME_ID = 199;
        }

        if(ExternalUtil.inst.getIsHT())
        {
            Global.GAME_ID = 203;
        }

    }

    export var DEBUG:boolean;// 是否调试模式
    export var GAME_ID:number;// 游戏ID
    export var TEST_TOKEN:string;// 测试TOKEN
    export var SERVER_ADDR:string;// 服务器地址
    export var TEST_SERVER:string;//测试地址
    export var PAY_ENABLED:string;// 支付地址
    export var FOCUS_ENABLED:string;// 关注地址
    export var SOUND_ENABLED:boolean = true;// 声音是否开启
    export var SHARE_ENABLED:boolean;// 是否可分享
    export var SYS_FONT:string = "微软雅黑";// 系统字体
    export var COIN_TOP_HEIGHT:number = 630;// 货币栏 高
    export var COIN_BOTTOM_HEIGHT:number = 360;//货币栏 低
    export var TOKEN:string;

    export function getStage():egret.Stage
    {
        return egret.MainContext.instance.stage;
    }

    export function getStageWidth():number
    {
        return egret.MainContext.instance.stage.stageWidth;
    }

    export function getStageHeight():number
    {
        return egret.MainContext.instance.stage.stageHeight;
    }

    export function getResURL(name:string):string
    {
        return "resource/" + name;
    }
    export function getHeroURL(name:string):string
    {
        return getResURL("gui/hero/" + name);
    }
    export function getWeaponURL(id:number):string
    {
        return getResURL("gui/weapon_icon/" + id + ".png");
    }
    export function getChaStay(id): any
    {
        return getResURL("gui/hero_stay/" + id);
    }
    export function getChaIcon(id): any
    {
        return getResURL("gui/hero_icon/" + id + ".png");
    }
    export function getChaChipIcon(id):any
    {
        return getResURL("gui/hero_icon/chip_" + id + ".png");
    }

    export function getDrawEffect(name:string):string
    {
        return getResURL("gui/effect/draw/" + name);
    }
    export function getFruitEffect(name:string):string
    {
        return getResURL("gui/effect/fruit/" + name);
    }
    /*export function getTaskIcon(id):string
    {
        return getResURL("gui/make_money_icon/makeMoney_" + id + ".png");
    }*/
    export function getHero(name):string
    {
        return getResURL("gui/hero/" + name);
    }
    export function getSkillIcon(id):string
    {
        return getResURL("gui/skill_icon/" + id + ".png");
    }
    export function getTalentIcon(id):string
    {
        return getResURL("gui/talent_icon/talent_" + id + ".png");
    }
    export function getHerobody(id):string
    {
        return getResURL("gui/hero_body/" + id + ".png");
    }
    export function getHeroWeapon(id):string
    {
        return getResURL("gui/hero_weapon/" + id + ".png");
    }
    export function getOtherEffect(name):string
    {
        return getResURL("gui/effect/other_effect/" + name);
    }
    export function getSecretIcon(name):string
    {
        return getResURL("gui/secret_icon/" + name + ".png");
    }
    export function getPVPHeadIcon(id):string
    {
        return getResURL("gui/pvp_head/pvp_head_" + id + ".png");
    }




}
