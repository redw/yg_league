/**
 * Created by Administrator on 12/20 0020.
 */
class PVPPanel extends BasePanel
{
    public imgMyIconBg:AutoBitmap;
    public imgEnemyIconBg:AutoBitmap;
    public imgMyHead:AutoBitmap;
    public imgEnemyHead:AutoBitmap;
    public lblMyPoint:eui.BitmapLabel;
    public lblEnemyPoint:eui.BitmapLabel;
    public lblName:eui.Label;
    public lblEnemyName:eui.Label;
    public imgMyLevel:AutoBitmap;
    public imgEnemyLevel:AutoBitmap;
    public lblSeason:eui.Label;
    public lblChangeTimes:eui.Label;
    public lblFightTimes:eui.Label;
    public btnChange:eui.Button;
    public btnFight:eui.Button;
    public btnGroup:eui.Group;
    public imgTop:eui.Image;
    public btnClose:SimpleButton;
    public layerGroup:eui.Group;
    public btnBack:SimpleButton;
    public positionGroup:eui.Group;
    public lblRank:eui.Label;
    public myStar1:eui.Image;
    public myStar2:eui.Image;
    public myStar3:eui.Image;
    public enemyStar1:eui.Image;
    public enemyStar2:eui.Image;
    public enemyStar3:eui.Image;

    private _lastIndex:number = 0;
    private _moving:boolean ;
    private _upChangeId:number = 0;
    private _challengeTimes:number;
    private _searchTimes:number;
    private _buyTimes:number;


    // 自己的角色
    private selfRoleInfo;
    // 匹配的角色
    private matchRoleInfo;

    public static _inst:PVPPanel;
    static  get inst():PVPPanel
    {
        return PVPPanel._inst;
    }

    public constructor()
    {
        super();
        PVPPanel._inst = this;
        this._layer = PanelManager.TOP_LAYER;
        this.skinName = PVPPanelSkin;
        this.horizontalCenter = 0;
        this._modal = true;
        this.bottom = 0;
    }


    public init():void
    {
        EventManager.inst.addEventListener(ContextEvent.PVP_REFRESH_ROLE_REQ, this.onRefreshReq, this);
        EventManager.inst.addEventListener(ContextEvent.PVP_FIGHT_END,this.pvpEnd,this);
        Http.inst.addCmdListener(CmdID.OPEN_PVP,this.onOpenBack,this);
        Http.inst.addCmdListener(CmdID.CHANGE_OP,this.onChangeBack,this);

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseLayer,this);
        this.btnChange.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnFight.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        for(var i:number = 1; i <= 6; i++)
        {
            var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.btnGroup,"btn" + i);
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBottomChange,this);
        }

        for(var i:number = 0; i < 6; i++)
        {
            var myGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"myGroup" + i);
            myGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onChangeOrDown,this);
        }

        for(var i:number = 0; i < 6; i++)
        {
            var circle:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.positionGroup,"pos" + i);
            circle.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUp,this);
        }

        this.btnClose.visible = false;
        this.positionGroup.visible = false;


        EventManager.inst.addEventListener(ContextEvent.PVP_CHANGE_POS,this.showChange,this );
    }

    private onRefreshReq(){
        this.matchRoleInfo = null;
        Http.inst.send(CmdID.CHANGE_OP);
    }

    public initData():void
    {
        Http.inst.send(CmdID.OPEN_PVP);
        this.checkSeason();
    }

    private pvpEnd(e:egret.Event):void
    {
        UserMethod.inst.showAward(e.data);

        Http.inst.send(CmdID.OPEN_PVP);
    }


    private checkSeason():void
    {
        var pvpBeginTime:number = Config.PVPData[7]["value"];
        var nowTime:number = UserProxy.inst.server_time;
        var divTime:number = nowTime - pvpBeginTime;
        var divDay:number = Math.floor(divTime/86400);
        var oneSeasonTime:number = 7;
        var times:number = Math.floor(divDay / oneSeasonTime);

        var nowSeasonEnd:number = pvpBeginTime + (times+1) * oneSeasonTime*86400;

        var endData:Date = new Date(nowSeasonEnd*1000);
        var endYear:number = endData.getFullYear();
        var endMon:number = endData.getMonth()+1;
        var endDay:number = endData.getDate();
        var endHour:number = endData.getHours();
        this.lblSeason.text =  "本赛季结算时间：(" + endYear +"年" + endMon + "月" + endDay + "日" + endHour + "时)";

    }


    private onOpenBack(e:egret.Event):void
    {
        var data:any = e.data;
        this.selfRoleInfo = data;

        this._searchTimes = parseInt(Config.PVPData[3]["value"]) - data["searchTimes"];
        if(this._searchTimes <= 0)
        {
            this._searchTimes = 0;
        }
        this.lblChangeTimes.text = this._searchTimes + "/" + Config.PVPData[3]["value"];

        this._challengeTimes = parseInt(Config.PVPData[1]["value"]) - data["challengeTimes"];
        if(this._challengeTimes <= 0)
        {
            this._buyTimes = data["challengeTimes"] - parseInt(Config.PVPData[1]["value"]);
            this._challengeTimes = 0;
        }

        // if(this._buyTimes == 10)
        // {
        //     this.btnFight.enabled = false;
        // }


        this.lblFightTimes.text = this._challengeTimes + "/" + Config.PVPData[1]["value"];

        if(data["myrank"])
        {
            this.lblRank.visible = true;
            this.lblRank.text = "第" + data["myrank"] + "名";

        }
        else
        {
            this.lblRank.visible = false;
        }

        this.showLevelStar(data["score"]);

        if(data["lastSeasonRank"])
        {
            if(data["lastSeasonRank"] < 4)
            {
                this.imgMyIconBg.source = "pvp_icon_" + data["lastSeasonRank"] + "_png";
            }
            else if(data["lastSeasonRank"] >= 4 && data["lastSeasonRank"] <= 100)
            {
                this.imgMyIconBg.source = "pvp_icon_4_png";
            }
            else
            {
                this.imgMyIconBg.source = "pvp_icon_5_png";
            }
        }
        else
        {
            this.imgMyIconBg.source = "pvp_icon_5_png";
        }

        this.lblName.text = StringUtil.decodeName(UserProxy.inst.nickname);
        if(UserProxy.inst.headimgurl)
        {
            this.imgMyHead.source = UserMethod.inst.getHeadImg(UserProxy.inst.headimgurl);
        }

        this.lblMyPoint.text = data["power"];

        this.showEnemy(data["opInfo"]);

        var pos:number[] = [0,0,0,0,0,0,0,0,0];
        var length:number = data["pos"].length;
        for(var i:number = 0;i < length;i++)
        {
            if(data["pos"][i])
            {
                pos[i] = data["pos"][i];
            }
        }


        UserMethod.inst.pvp_up_arr = pos.concat();
        this.myPosition(pos);
    }

    private onChangeBack(e:egret.Event):void
    {
        if(e.data["diamond"])
        {
            UserProxy.inst.diamond = e.data["diamond"];
        }

        this._searchTimes = parseInt(Config.PVPData[3]["value"]) - e.data["searchTimes"];
        if(this._searchTimes <= 0)
        {
            this._searchTimes = 0;
        }
        this.lblChangeTimes.text = this._searchTimes + "/" + Config.PVPData[3]["value"];
        this.showEnemy(e.data["opInfo"]);
    }

    private showEnemy(data:any):void
    {
        this.matchRoleInfo = data;
        this.lblEnemyPoint.text = data["power"];
        this.showLevelStar(data["score"],true);
        if(data["type"] == 2)//电脑
        {
            var pvpNameData:any = Config.PVPNameData[data["uid"]];
            this.lblEnemyName.text = StringUtil.decodeName(pvpNameData["Name"]);
            var randomId:number = MathUtil.rangeRandom(1,12);
            var res:string = Config.HeadData[randomId];
            this.imgEnemyHead.source =  Global.getSecretIcon(res["head_res"]);
        }
        else
        {
            if(data["headImg"])
            {
                this.imgEnemyHead.source = UserMethod.inst.getHeadImg(data["headImg"]);
            }
            this.lblEnemyName.text = data["nickname"]? StringUtil.decodeName(data["nickname"]):data["uid"] ;
        }
        if(data["lastSeasonRank"])
        {
            if(data["lastSeasonRank"] < 4)
            {
                this.imgEnemyIconBg.source = "pvp_icon_" + data["lastSeasonRank"] + "_png";
            }
            else if(data["lastSeasonRank"] >= 4 && data["lastSeasonRank"] <= 100)
            {
                this.imgEnemyIconBg.source = "pvp_icon_4_png";
            }
            else
            {
                this.imgEnemyIconBg.source = "pvp_icon_5_png";
            }
        }
        else
        {
            this.imgEnemyIconBg.source = "pvp_icon_5_png";
        }


        var pos:number[] = [];
        var length:number = data["pos"].length;
        for(var i:number = 0;i < length;i++)
        {
            // if(data["pos"][i])
            // {
                pos.push(data["pos"][i]);
            // }
        }
        var length2:number = pos.length;

        for(var i:number = 0; i < 6; i++)
        {
            let enemyGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"enemyGroup" + i);
            var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(enemyGroup,"mc");
            enemyGroup.visible = false;
            if(mc)
            {
                mc.stop();
                DisplayUtil.removeFromParent(mc);
            }
        }

        for(var i:number = 0; i < length2; i++)
        {
            let enemyGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"enemyGroup" + i);
            if(pos[i])
            {
                enemyGroup.visible = true;
                var starNum:eui.Label = <eui.Label>DisplayUtil.getChildByName(enemyGroup,"starNum");
                var id:number = pos[i];
                if(data["hero"][id])
                {
                    starNum.text = data["hero"][id]["star"];
                }
                else
                {
                    starNum.text = "1";
                }
                var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(enemyGroup,"mc");
                if(mc)
                {
                    mc.stop();
                    DisplayUtil.removeFromParent(mc);
                }
                if(i < length2)
                {
                    enemyGroup.visible = true;
                    MovieClipUtils.createMovieClip(Global.getChaStay(id),""+ id,afterAdd,this);
                    function afterAdd(data): void
                    {
                        var mc = data;
                        mc.x = 50;
                        mc.y = 80;
                        mc.play(-1);
                        mc.name = "mc";
                        enemyGroup.addChildAt(mc,0);
                    }
                }

            }
        }
    }

    private myPosition(pos:number[]):void
    {
        for(var i:number = 0; i < 6; i++)
        {
            this.myGroupShow(i,pos[i]);
        }
    }

    private myGroupShow(pos:number,id:number):void
    {
        if (id) {
            let myGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"myGroup" + pos);
            var starNum:eui.Label = <eui.Label>DisplayUtil.getChildByName(myGroup,"starNum");

            UserMethod.inst.pvp_up_arr[pos] = id;
            var roleData = UserProxy.inst.heroData.getHeroData(id);
            starNum.text = roleData.starLevel + "";
            var mc = myGroup.getChildByName("mc");
            if(mc)
            {
                DisplayUtil.removeFromParent(mc);
            }

            myGroup.visible = true;
            MovieClipUtils.createMovieClip(Global.getChaStay(id),""+id,afterAdd,this);
            function afterAdd(data): void
            {
                var mc = data;
                mc.x = 50;
                mc.y = 80;
                mc.name = "mc";
                mc.scaleX = -1;
                mc.play(-1);
                myGroup.addChildAt(mc,0);
            }
        }
    }

    private removeGroupShow(pos:number):void
    {
        let myGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"myGroup" + pos);
        var mc = myGroup.getChildByName("mc");
        if(mc)
        {
            DisplayUtil.removeFromParent(mc);
        }
        myGroup.visible = false;
        var oldId:number = UserMethod.inst.pvp_up_arr[pos];
        UserMethod.inst.pvp_up_arr[pos] = 0;
        EventManager.inst.dispatch(ContextEvent.PVP_BATTLE_DOWN,oldId);
    }

    private onTouch(e:egret.TouchEvent):void
    {
        var self = this;
        if(e.currentTarget == this.btnChange)
        {
            this.onChangeNow();
            /*Processing.inst.show();
            egret.setTimeout(function () {

                Processing.inst.hide();
            },this,5000);*/

        }
        else if (e.currentTarget == this.btnFight)
        {

            if(self._challengeTimes )
            {
                if (self.matchRoleInfo && self.selfRoleInfo) {
                    PanelManager.inst.showPanel("PVPFightPanel", [UserMethod.inst.pvp_up_arr, this.selfRoleInfo, this.matchRoleInfo]);
                } else {
                    console.log("请请求数据或屏掉按钮");
                }
            }
            else
            {
                var cost:number = 0;
                if(this._buyTimes < 5)
                {
                    cost = 100;
                }
                else if(this._buyTimes >= 5 && this._buyTimes < 10)
                {
                   cost = 200;
                }
                else
                {
                    cost = 400;
                }
                if(UserProxy.inst.costAlart)
                {
                    showFightCost();
                }
                else
                {
                    Alert.showCost(cost,"购买一次挑战机会",true,showFightCost,null,this);
                }

                function showFightCost():void
                {
                    if(UserProxy.inst.diamond >= cost)
                    {
                        if (self.matchRoleInfo && self.selfRoleInfo) {
                            PanelManager.inst.showPanel("PVPFightPanel", [UserMethod.inst.pvp_up_arr, self.selfRoleInfo, self.matchRoleInfo]);
                        } else {
                            console.log("请请求数据或屏掉按钮");
                        }
                    }
                    else
                    {
                        ExternalUtil.inst.diamondAlert();
                    }
                }
            }
        }
    }

    private onChangeNow():void
    {
        if(this._searchTimes)
        {
            Http.inst.send(CmdID.CHANGE_OP);
        }
        else
        {
            var cost:number = parseInt(Config.PVPData[15]["value"]);
            if(UserProxy.inst.costAlart)
            {
                showCost();
            }
            else
            {
                Alert.showCost(cost,"换一个对手",true,showCost,null,this);
            }

            function showCost():void
            {
                if(UserProxy.inst.diamond >= cost)
                {
                    Http.inst.send(CmdID.CHANGE_OP);
                }
                else
                {
                    ExternalUtil.inst.diamondAlert();
                }
            }
        }
    }


    private showChange(e:egret.Event):void
    {
        if(e.data)
        {
            this.positionGroup.visible = true;
            this._upChangeId = e.data;
        }
        else
        {
            this.positionGroup.visible = false;
        }

    }

    private onChangeOrDown(e:egret.TouchEvent):void
    {
        if(this._lastIndex != 1)
        {
            return;
        }
        var pos:number = parseInt(e.currentTarget.name.replace("myGroup",""));
        if(this._upChangeId)
        {
            this.onUpEnd(pos);
        }
        else
        {
            this.removeGroupShow(pos);
        }
    }

    private onUp(e:egret.TouchEvent):void
    {
        var pos:number = parseInt(e.currentTarget.name.replace("pos",""));
        var myGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"myGroup" + pos);
        var starNum:eui.Label = <eui.Label>DisplayUtil.getChildByName(myGroup,"starNum");
        this.onUpEnd(pos);

    }

    private onUpEnd(pos:number):void
    {
        this.myGroupShow(pos,this._upChangeId);
        this._upChangeId = 0;
        this.positionGroup.visible = false;
        EventManager.inst.dispatch(ContextEvent.PVP_CHANGE_END);
    }


    private onBottomChange(e:egret.TouchEvent):void
    {
        if( this._moving)
        {
            return;
        }
        var index: number = parseInt(e.currentTarget.name.replace("btn",""));

        if(index == 5)
        {
            Notice.show("敬请期待！");
            return;
        }

        if(this._lastIndex)
        {
            this.closeLayer(this._lastIndex);
            if(this._lastIndex != index)
            {

                this._lastIndex = index;
                egret.setTimeout(function ()
                {
                    this.openLayer(this._lastIndex);
                },this,250);
            }
            else
            {
                this._lastIndex = 0;
            }
        }
        else
        {
            this._lastIndex = index;
            this.openLayer(this._lastIndex);
        }
    }

    private closeLayer(index:number):void
    {
        var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.btnGroup,"btn" + index);
        switch (index)
        {
            case 1:
                btn.source = "pvp_formation_png";
                this.positionGroup.visible = false;
                break;
            case 2:
                btn.source = "pvp_rule_png";
                break;
            case 3:
                btn.source = "pvp_rank_png";
                break;
            case 4:
                btn.source = "pvp_honor_png";
                break;
            case 5:
                btn.source = "pvp_report_png";
                break;
            case 6:
                btn.source = "pvp_shop_png";
                break;
        }

        this.removeLayer();
    }

    private openLayer(index:number):void
    {
        var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.btnGroup,"btn" + index);



        var layer:eui.Component;
        var layerTop:number;
        switch (index)
        {
            case 1:
                btn.source = "pvp_formation_open_png";
                layer = new PVPFormation();
                break;
            case 2:
                btn.source = "pvp_rule_open_png";
                layer = new PVPRule();
                break;
            case 3:
                btn.source = "pvp_rank_open_png";
                layer = new PVPRank();
                break;
            case 4:
                btn.source = "pvp_honor_open_png";
                layer = new PVPHonor();
                break;
            case 5:
                btn.source = "pvp_report_open_png";
                layer = new PVPReport();
                break;
            case 6:
                btn.source = "pvp_shop_open_png";
                layer = new PVPShop();
                break;
        }
        layerTop = layer.height - 15;
        layer.name = "layer";
        this.layerGroup.addChild(layer);
        this.layerOpenMove(layerTop);
    }

    private layerOpenMove(moveTop:number):void
    {
        this._moving = true;
        egret.Tween.get(this.imgTop).to({y:675 - moveTop},500);
        egret.Tween.get(this.layerGroup).to({y:730 - moveTop},500);
        this.btnClose.y = 690 - moveTop;
        egret.setTimeout(function ()
        {
            this.btnClose.visible = true;
            this._moving = false;
        },this,500)

    }

    private onCloseLayer():void
    {
        if( this._moving)
        {
            return;
        }
        this.closeLayer(this._lastIndex);
        this._lastIndex = 0;
    }

    private removeLayer():void
    {
        this._moving = true;
        this.btnClose.visible = false;
        var layer:eui.Component = <eui.Component>DisplayUtil.getChildByName(this.layerGroup,"layer");
        if(layer)
        {
            egret.Tween.get(this.imgTop).to({y:673},250);
            egret.Tween.get(this.layerGroup).to({y:730},250);
            egret.setTimeout(function ()
            {
                DisplayUtil.removeFromParent(layer);
                this._moving = false;
            },this,250);

        }
    }

    private showLevelStar(score:number,enemy?:boolean):void
    {
        var nowIdx:number = 0;
        for(var i in Config.PVPPointData)
        {
            var data:any = Config.PVPPointData[i];
            var point:number = parseInt(data["point"]);
            if(score >= point)
            {
                nowIdx = parseInt(i);
                break;
            }
        }

        if(enemy)
        {
            this.imgEnemyLevel.source = "pvp_level_" + Math.ceil(nowIdx/4) +"_png";
            switch (nowIdx % 4)
            {
                case 0:this.enemyStar1.visible = false;this.enemyStar2.visible = false;this.enemyStar3.visible = false;break;
                case 1:this.enemyStar1.visible = true;this.enemyStar2.visible = true;this.enemyStar3.visible = true;break;
                case 2:this.enemyStar1.visible = true;this.enemyStar2.visible = true;this.enemyStar3.visible = false;break;
                case 3:this.enemyStar1.visible = true;this.enemyStar2.visible = false;this.enemyStar3.visible = false;break;
            }
        }
        else
        {
            this.imgMyLevel.source = "pvp_level_" + Math.ceil(nowIdx/4) +"_png";
            switch (nowIdx % 4)
            {
                case 0:this.myStar1.visible = false;this.myStar2.visible = false;this.myStar3.visible = false;break;
                case 1:this.myStar1.visible = true;this.myStar2.visible = true;this.myStar3.visible = true;break;
                case 2:this.myStar1.visible = true;this.myStar2.visible = true;this.myStar3.visible = false;break;
                case 3:this.myStar1.visible = true;this.myStar2.visible = false;this.myStar3.visible = false;break;
            }
        }


    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("PVPPanel");
    }

    public destory():void
    {
        super.destory();
        Http.inst.removeCmdListener(CmdID.OPEN_PVP,this.onOpenBack,this);
        Http.inst.removeCmdListener(CmdID.CHANGE_OP,this.onChangeBack,this);
        EventManager.inst.removeEventListener(ContextEvent.PVP_FIGHT_END,this.pvpEnd,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseLayer,this);
        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnChange.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        this.btnFight.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
        for(var i:number = 1; i <= 6; i++)
        {
            var btn:SimpleButton = <SimpleButton>DisplayUtil.getChildByName(this.btnGroup,"btn" + i)
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBottomChange,this);
        }

        for(var i:number = 0; i < 6; i++)
        {
            var myGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"myGroup" + i);
            myGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onChangeOrDown,this);
        }

        for(var i:number = 0; i < 6; i++)
        {
            var circle:eui.Group = <eui.Group>DisplayUtil.getChildByName(this.positionGroup,"pos" + i);
            circle.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onUp,this);
        }
    }
}

