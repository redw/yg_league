/**
 * 角色工厂
 * Created by hh on 2016/12/23.
 */
class FightRoleFactory{
    private static map = {};

    public static createRole(fightContainer:FightContainer, data:{id:number, pos:number}) {
        let arr = FightRoleFactory.map[data.id];
        let role:FightRole;
        if (arr && arr.length > 0) {
            role = arr.shift();
            role.active(fightContainer, data);
            role.idle();
        } else {
            role = new FightRole(fightContainer, data);
        }
        return role;
    }

    public static freeRole(role:FightRole) {
        if (!FightRoleFactory.map[role.id]) {
            FightRoleFactory.map[role.id] = [];
        }
        FightRoleFactory.map[role.id].push(role);
    }

    public static hasFreeRole(id:number) {
        let arr = FightRoleFactory.map[id];
        return arr && arr.length > 0
    }
}