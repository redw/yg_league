/**
 * 英雄角色值对象
 * Created by hh on 2017/1/4.
 */
class HeroVO{
    private _id:number;             // 角色id
    public starPiece:number;        // 碎片
    public skill:number;            // 解锁技能
    public level:number;            // 等级
    public starLevel:number;        // 星级
    public strengthenLevel:number;  // 强化等级
    public evolution:number;        // 分享
    public config:RoleConfig;       // 角色配置

    public constructor(value?:any){
        this.parse(value);
    }

    public get id(){
        return this._id;
    }

    public set id(value:number) {
        this._id = value;
        this.config = Config.HeroData[value];
    }

    public get phyAtk(){
        let base = this.getBaseValue(this.config.physical_atk);
        if(this.level)
        {
            return this.getValue(base, 1);
        }
        return base + "";

    }

    public get maxHP(){
        let base = this.getBaseValue(this.config.hp);
        if(this.level)
        {
            return this.getValue(base, 2);
        }
        return base + "";
    }

    public get phyDef(){
        let base = this.getBaseValue(this.config.physical_def);
        if(this.level)
        {
            return this.getValue(base, 3);
        }
        return base + "";
    }

    public get magAtk(){
        let base = this.getBaseValue(this.config.magical_atk);
        if(this.level)
        {
            return this.getValue(base, 1);
        }
        return base + "";
    }

    public get magDef(){
        let base = this.getBaseValue(this.config.magical_def);
        if(this.level)
        {
            return this.getValue(base, 3);
        }
        return base + "";
    }

    public get critDamge()
    {
        let base = Number(this.config.crit_damage);
        if(this.level)
        {
            return this.getValue(base, 4);
        }
        return base + "";
    }

    /**
     * 额外的暴击系数
     * @returns {string}
     */
    public get extraCritRatio(){
        let base = 1;
        if(this.level)
        {
            return this.getValue(base, 4);
        }
        return base + "";
    }


    private getBaseValue(value:number){
        // if (this.level == 0) {
        //     return value;
        // } else {
        let paraA:number = Config.BaseData[4]["value"];
        let paraB:number = Config.BaseData[5]["value"];
        var quality:number = parseInt(this.config.quality);
        var star:number;
        if(!this.starLevel)
        {
            star = 1;
        }
        else
        {
            star = this.starLevel;
        }
        var starData:any = Config.HeroStarData[star];
        var paraC:number = parseInt(starData["rank_value_" + quality]);

        var lv:number;
        if(!this.level)
        {
            lv = 1;
        }
        else
        {
            lv = this.level;
        }
        let heroLv:number = lv;
        let heroEnhanceLv:number = this.strengthenLevel;
        let lvAdd:number = Math.pow(paraA,heroLv-1);
        let enhanceAdd:number = Math.pow(paraB,heroEnhanceLv);
        let base:number = value * paraC * lvAdd * enhanceAdd;
        return base;
        // }
    }

    private getValue(base:number,atkType:number):string
    {
        if (this.level == 0) {
            return base + "";
        }
        var total:string;
        var targetArr = [];
        targetArr.push(Number(this.id));//自己
        targetArr.push(2);//全体
        if(parseInt(this.config.job) == 1 || parseInt(this.config.job) == 5) //近战
        {
            targetArr.push(6);
        }
        else //远程
        {
            targetArr.push(7);
        }

        if(parseInt(this.config.quality) == 4)//彩将
        {
            targetArr.push(11);
        }

        if(parseInt(this.config.race) == 3) //人
        {
            targetArr.push(3);
            targetArr.push(8);
            targetArr.push(9);
        }
        else if (parseInt(this.config.race) == 4)
        {
            targetArr.push(4);
            targetArr.push(8);
            targetArr.push(10);
        }
        else if(parseInt(this.config.race) == 5)
        {
            targetArr.push(5);
            targetArr.push(9);
            targetArr.push(10);
        }

        var addBuff:number = 1;
        //天赋
        for(var c in UserProxy.inst.heroData.getHeroIds())
        {
            var id:number = UserProxy.inst.heroData.getHeroIds()[c];
            var heroData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
            var talent:any = Config.TalentData[id];
            for(var a in talent)
            {
                if(a != "id")
                {
                    var key:string = a.replace("effect_","");
                    var value:any = talent[a];
                    var target:number = parseInt(value[1]);//加成目标
                    var nature:number = parseInt(value[0]);//加成类型
                    var add:number = parseFloat(value[2]);//加成值

                    if(heroData.level >= parseInt(key) && targetArr.indexOf(target) > -1)
                    {
                        if(atkType == 4)
                        {
                            if(nature == atkType)
                            {
                                if(heroData.strengthenLevel >= parseInt(key))
                                {
                                    addBuff *= (1 + add * 3);
                                }
                                else
                                {
                                    addBuff *= (1 + add);
                                }
                            }
                        }
                        else
                        {
                            if(nature == 8 || nature == atkType)
                            {
                                if(heroData.strengthenLevel >= parseInt(key))
                                {
                                    addBuff *= (1 + add * 3);
                                }
                                else
                                {
                                    addBuff *= (1 + add);
                                }
                            }
                        }

                    }
                }
            }
        }
        total = BigNum.mul(base,addBuff);
        // console.log("id:" + this._id + "天赋：" + total);

        //法宝
        var addWeapon:number = 1;
        for(var c in UserProxy.inst.weaponList)
        {
            var weaponInfo: any = UserProxy.inst.weaponList[c];
            var weaponData: any = Config.WeaponData[c];
            var value1: any = weaponData["attr_1"];
            var value2: any = weaponData["attr_2"];
            var add1: number = parseFloat(value1[2]) * (1 + 0.1 * weaponInfo["lv"]);
            var add2: number = 0;
            if (value2) {
                add2 = parseFloat(value2[2]) * (1 + 0.1 * weaponInfo["lv"]);
            }

            var target1: number = parseInt(value1[1]);//加成目标
            var target2: number = parseInt(value2[1]);//加成目标
            var nature1: number = parseInt(value1[0]);//加成类型
            var nature2: number = parseInt(value2[0]);//加成类型
            if (targetArr.indexOf(target1) > -1)
            {
                if(atkType == 4)
                {
                    if(nature1 == atkType)
                    {
                        addWeapon += add1;
                    }
                }
                else
                {
                    if (nature1 == 8 || nature1 == atkType) {
                        addWeapon += add1;
                    }
                }


            }

            if (targetArr.indexOf(target2) > -1)
            {
                if(atkType == 4)
                {
                    if(nature2 == atkType)
                    {
                        addWeapon += add2;
                    }
                }
                else
                {
                    if (nature2 == 8 || nature2 == atkType)
                    {
                        addWeapon += add2;
                    }
                }
            }
        }
        total = BigNum.mul(total,addWeapon);
        //套装
        var addSuit:number = 1;
        var addedSuit = [];
        for(var c in UserProxy.inst.weaponList)
        {
            var weaponData: any = Config.WeaponData[c];
            if(weaponData["suit"])
            {
                if(addedSuit.indexOf(weaponData["suit"]) > -1)
                {
                    continue;
                }
                var suitData:any = Config.WeaponSuit[weaponData["suit"]];
                var suitNum:any[] = suitData["suitnum"];

                var count:number = 0;
                var length:number = suitData["itemgroup"].length;
                for(var p:number = 0;p < length ; p++)
                {
                    var weaponId:number = suitData["itemgroup"][p];
                    var weaponInfo:any = UserProxy.inst.weaponList[weaponId];
                    if(weaponInfo)
                    {
                        count++;
                    }
                }

                for(var j:number= 0;j < suitNum.length;j++)
                {
                    if(count >= parseInt(suitNum[j]))
                    {
                        var suitValue:any[] = suitData["attr_" + (j+1)];
                        var target: number = parseInt(suitValue[1]);//加成目标
                        var nature: number = parseInt(suitValue[0]);//加成类型
                        var add: number = parseFloat(suitValue[2]);//加成值

                        if(targetArr.indexOf(target) > -1)
                        {
                            if(atkType == 4)
                            {
                                if( nature == atkType)
                                {
                                    addSuit *= (1 + add);
                                    break;
                                }
                            }
                            else
                            {
                                if(nature == 8 || nature == atkType)
                                {
                                    addSuit *= (1 + add);
                                    break;
                                }
                            }
                        }
                    }
                }
                addedSuit.push(weaponData["suit"]);
            }
        }

        total = BigNum.mul(total,addSuit);


        //情缘
        var addShip:number = 1;
        for(var k in UserProxy.inst.relationship)
        {
            var shipInfo:any = UserProxy.inst.relationship[k];
            var shipData:any = Config.FriendshipData[k];
            var parm:number = shipData["attr_parm"];
            if(shipInfo["lv"])
            {
                var shipValue:any = shipData["attr_1"];
                var target:number = parseInt(shipValue[1]);//加成目标
                var nature:number = parseInt(shipValue[0]);//加成类型
                var add:number = parseFloat(shipValue[2])*(Math.pow(parm,shipInfo["lv"]-1));//加成值
                if(targetArr.indexOf(target) > -1)
                {
                    if(atkType == 4)
                    {
                        if( nature == atkType)
                        {
                            addShip *= (1 + add);
                        }
                    }
                    else
                    {
                        if(nature == 8 || nature == atkType)
                        {
                            addShip *= (1 + add);
                        }
                    }

                }
            }
        }
        total = BigNum.mul(total,addShip);

        // 添加神器
        let ratio = artifact.getRoleArtifactRatio(this, atkType);
        total = BigNum.mul(total, ratio);

        // console.log("id:" + this._id +"情缘：" + total);

        //

        return total;
    }

    public parse(value:any) {
        if (value) {
            this.id = value.id;
            this.level = value["lv"] || value.level || 0;
            this.starLevel = value["star"] || value.starLevel || 0;
            this.strengthenLevel = value["enhanceLv"] || value.strengthenLevel || 0;
            this.starPiece = value["starPiece"] || value.starLevel || 0;
            this.skill = value["skill"] || 0;
            this.evolution = value["evolution"] || value.evolution || 0;
        }
    }
}