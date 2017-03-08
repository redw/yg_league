/**
 * Created by Administrator on 2017/2/28.
 */
var artifact;
(function (artifact) {
    /**
     * 法宝能否升级
     * @param id
     */
    function checkUpgrade(id) {
        var result = checkMaxLv(id);
        var config = Config.ArtifactData[id];
        var info = getArtifactInfo(id);
        var lv = info.lv;
        var needPiece = config.lvlup_cost[lv];
        return !result && info.piece >= needPiece;
    }
    artifact.checkUpgrade = checkUpgrade;
    /**
     * 检查group能否升级
     * @param groupId
     */
    function checkGroupUpgrade(groupId) {
        var result = !checkGroupMaxLv(groupId);
        var config = Config.ArtifactGroupData[groupId];
        var info = getArtifactGroupInfo(groupId);
        var lv = info.lv;
        var needPiece = config.lvlup_cost[lv];
        var piece = 0;
        var arr = config.artifact;
        for (var i = 0; i < arr.length; i++) {
            piece += getArtifactInfo(arr[i]).lv;
        }
        return result && piece >= needPiece;
    }
    artifact.checkGroupUpgrade = checkGroupUpgrade;
    function getPieceCount(id) {
        return getArtifactInfo(id).piece;
    }
    artifact.getPieceCount = getPieceCount;
    function checkMaxLv(id) {
        var config = Config.ArtifactData[id];
        var level = getArtifactInfo(id).lv;
        var arr = config.lvlup_cost;
        return level >= arr.length;
    }
    artifact.checkMaxLv = checkMaxLv;
    function checkGroupMaxLv(groupId) {
        var config = Config.ArtifactGroupData[groupId];
        var level = getArtifactGroupInfo(groupId).lv;
        var arr = config.lvlup_cost;
        return level >= arr.length;
    }
    artifact.checkGroupMaxLv = checkGroupMaxLv;
    /**
     * 得到神器信息
     * @param id
     * @returns {{lv: number, piece: number}}
     */
    function getArtifactInfo(id) {
        var result = null;
        var obj = UserProxy.inst.newObj;
        if (obj && obj.hallows) {
            result = obj.hallows[id];
        }
        else {
            result = { lv: 0, piece: 0 };
        }
        return result;
    }
    artifact.getArtifactInfo = getArtifactInfo;
    /**
     *  得到套装信息
     * @param groupId
     * @returns {{lv: number}}
     */
    function getArtifactGroupInfo(groupId) {
        var result;
        var obj = UserProxy.inst.newObj;
        if (obj && obj.suit) {
            result = obj.suit[groupId];
        }
        else {
            result = { lv: 0 };
        }
        return result;
    }
    artifact.getArtifactGroupInfo = getArtifactGroupInfo;
    /**
     * 神器对英雄属性的加成
     * @param heroVo
     * @returns {number}
     */
    function getRoleArtifactRatio(heroVo, type) {
        var result = 1;
        for (var i = 1; i <= 30; i++) {
            var info = getArtifactInfo(i);
            var config = Config.ArtifactData[i];
            if (config.attr_1[1] == heroVo.id) {
                if (info.lv > 0) {
                    if (config.attr_1[0] == type || config.attr_1[0] == 8) {
                        var baseValue = Config.BaseData[79].value;
                        var prop = Math.pow(config.attr_1[2], baseValue);
                        result = Math.pow(info.lv, prop);
                    }
                }
                break;
            }
        }
        for (var i = 1; i <= 5; i++) {
            var info = getArtifactGroupInfo(i);
            var config = Config.ArtifactGroupData[i];
            if (config.attr_1[0] == type || config.attr_1[0] == 8) {
                if (info.lv > 0) {
                    var baseValue = Config.BaseData[79].value;
                    var prop = Math.pow(config.attr_1[2], baseValue);
                    var curResult = Math.pow(info.lv, prop);
                    result *= curResult;
                }
            }
        }
        return result;
    }
    artifact.getRoleArtifactRatio = getRoleArtifactRatio;
})(artifact || (artifact = {}));
