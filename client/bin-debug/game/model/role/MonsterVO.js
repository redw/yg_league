/**
 * 怪物角色值对象
 * Created by hh on 2017/1/4.
 */
var MonsterVO = (function () {
    function MonsterVO(value) {
        if (value)
            this.parse(value);
    }
    var d = __define,c=MonsterVO,p=c.prototype;
    d(p, "id"
        ,function () {
            return this._id;
        }
        ,function (value) {
            this._id = value;
            this.config = Config.EnemyData[value];
        }
    );
    p.parse = function (value) {
        if (value) {
            this.id = value.id;
            this.level = value.level;
        }
    };
    d(p, "phyAtk"
        ,function () {
            return this.getValue(this.config.physical_atk);
        }
    );
    d(p, "phyDef"
        ,function () {
            return this.getValue(this.config.physical_def);
        }
    );
    d(p, "magAtk"
        ,function () {
            return this.getValue(this.config.magical_atk);
        }
    );
    d(p, "magDef"
        ,function () {
            return this.getValue(this.config.magical_def);
        }
    );
    d(p, "maxHP"
        ,function () {
            return this.getValue(this.config.hp);
        }
    );
    p.getValue = function (value) {
        // let ratio = +Config.BaseData[59].value;
        var levelArr = Config.BaseData[71].value;
        var index = 0;
        for (var i = 0; i < levelArr.length; i++) {
            if (this.level >= +levelArr[i]) {
                index++;
            }
        }
        var ratio = Config.BaseData[72].value[index] || +Config.BaseData[59].value;
        var level = this.level;
        return value * Math.pow(ratio, level) + "";
    };
    return MonsterVO;
}());
egret.registerClass(MonsterVO,'MonsterVO');
//# sourceMappingURL=MonsterVO.js.map