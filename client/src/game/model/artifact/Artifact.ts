/**
 * Created by Administrator on 2017/2/28.
 */
module artifact {
    /**
     * 法宝能否升级
     * @param id
     */
    export function checkUpgrade(id:number) {
        let result = checkMaxLv(id);
        let config:ArtifactConfigItem = Config.ArtifactData[id];
        let info = getArtifactInfo(id);
        let lv = info.lv;
        let needPiece = config.lvlup_cost[lv];
        return !result && info.piece >= needPiece;
    }

    /**
     * 检查group能否升级
     * @param groupId
     */
    export function checkGroupUpgrade(groupId:number){
        let result = !checkGroupMaxLv(groupId);
        let config:ArtifactConfigGroupItem = Config.ArtifactGroupData[groupId];
        let info = getArtifactGroupInfo(groupId);
        let lv = info.lv;
        let needPiece = config.lvlup_cost[lv];
        let piece = 0;
        let arr = config.artifact;
        for (let i = 0; i < arr.length; i++) {
            piece += getArtifactInfo(arr[i]).lv;
        }
        return result && piece >= needPiece;
    }

    export function getPieceCount(id:number) {
        return getArtifactInfo(id).piece;
    }

    export function checkMaxLv(id:number) {
        let config:ArtifactConfigItem = Config.ArtifactData[id];
        let level = getArtifactInfo(id).lv;
        let arr = config.lvlup_cost;
        return level >= arr.length;
    }

    export function checkGroupMaxLv(groupId:number) {
        let config:ArtifactConfigGroupItem = Config.ArtifactGroupData[groupId];
        let level = getArtifactGroupInfo(groupId).lv;
        let arr = config.lvlup_cost;
        return level >= arr.length;
    }

    /**
     * 得到神器信息
     * @param id
     * @returns {{lv: number, piece: number}}
     */
    export function getArtifactInfo(id:number){
        let result:{lv:number, piece:number} = null;
        let obj = UserProxy.inst.newObj;
        if (obj && obj.hallows) {
            result = obj.hallows[id];
        } else {
            result = {lv:0, piece:0};
        }
        return result;
    }

    /**
     *  得到套装信息
     * @param groupId
     * @returns {{lv: number}}
     */
    export function getArtifactGroupInfo(groupId:number) {
        let result:{lv:number};
        let obj = UserProxy.inst.newObj;
        if (obj && obj.suit) {
            result = obj.suit[groupId];
        } else {
            result = {lv:0};
        }
        return result;
    }

    /**
     * 神器对英雄属性的加成
     * @param heroVo
     * @returns {number}
     */
    export function getRoleArtifactRatio(heroVo:HeroVO, type:number){
        let result:number = 1;
        for (let i = 1; i <= 30; i++) {
            let info = getArtifactInfo(i);
            let config:ArtifactConfigItem = Config.ArtifactData[i];
            if (config.attr_1[1] == heroVo.id) {
                if (info.lv > 0) {
                    if (config.attr_1[0] == type || config.attr_1[0] == 8) {
                        let baseValue = Config.BaseData[79].value;
                        let prop = Math.pow(config.attr_1[2], baseValue);
                        result = Math.pow(info.lv, prop);
                    }
                }
                break;
            }
        }
        for (let i = 1; i <= 5; i++) {
            let info = getArtifactGroupInfo(i);
            let config:ArtifactConfigGroupItem = Config.ArtifactGroupData[i];
            if (config.attr_1[0] == type || config.attr_1[0] == 8) {
                if (info.lv > 0) {
                    let baseValue = Config.BaseData[79].value;
                    let prop = Math.pow(config.attr_1[2], baseValue);
                    let curResult = Math.pow(info.lv, prop);
                    result *= curResult;
                }
            }
        }
        return result;
    }
}