/**
 * 角色工厂
 * Created by hh on 2016/12/23.
 */
var FightRoleFactory = (function () {
    function FightRoleFactory() {
    }
    var d = __define,c=FightRoleFactory,p=c.prototype;
    FightRoleFactory.createRole = function (fightContainer, data) {
        var arr = FightRoleFactory.map[data.id];
        var role;
        if (arr && arr.length > 0) {
            role = arr.shift();
            role.active(fightContainer, data);
            role.idle();
        }
        else {
            role = new FightRole(fightContainer, data);
        }
        return role;
    };
    FightRoleFactory.freeRole = function (role) {
        if (!FightRoleFactory.map[role.id]) {
            FightRoleFactory.map[role.id] = [];
        }
        FightRoleFactory.map[role.id].push(role);
    };
    FightRoleFactory.hasFreeRole = function (id) {
        var arr = FightRoleFactory.map[id];
        return arr && arr.length > 0;
    };
    FightRoleFactory.map = {};
    return FightRoleFactory;
}());
egret.registerClass(FightRoleFactory,'FightRoleFactory');
