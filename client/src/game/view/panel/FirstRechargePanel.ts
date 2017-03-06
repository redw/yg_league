/**
 * Created by Administrator on 1/9 0009.
 */
class FirstRechargePanel extends BasePanel
{
    public btnBuy:eui.Button;
    public btnClose:SimpleButton;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = FirstReChargePanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init(): void
    {
        Http.inst.addCmdListener(CmdID.VIP_PRICE,this.awardBack,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);
    }

    public initData(): void
    {
        var firstData:any = Config.FirstBloodData[1];
        var pos:egret.Point[] = [];
        for(var i:number = 1;i < 5; i ++)
        {
            var weaponIcon:WeaponIcon = <WeaponIcon>DisplayUtil.getChildByName(this,"award" + i);

            var awardNum:eui.Label = <eui.Label>DisplayUtil.getChildByName(this,"awardNum" + i);
            var reward:any[] = firstData["reward_" + i].concat();
            var rewardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
            weaponIcon.imgIcon = rewardData.icon;
            awardNum.text = "x" + reward[2];
            weaponIcon.touchReward = reward;
            if(parseInt(reward[0]) == 101)
            {
                weaponIcon.qualityBg = "3";
            }

            pos.push(new egret.Point(weaponIcon.x,weaponIcon.y));
        }

        for(let y:number = 1; y < 5 ;y++)
        {
            MovieClipUtils.createMovieClip(Global.getOtherEffect("first_light_effect"),"first_light_effect",afterAdd,this);
            function afterAdd(data): void
            {
                let mc = data;
                mc.x = pos[y-1].x - 8;
                mc.y = pos[y-1].y - 8;
                mc.play(-1);
                mc.touchEnabled = false;
                mc.name = "mc" + y;
                this.addChild(mc);
            }
        }

        if(UserProxy.inst.rechargeFlag == 1)
        {
            this.btnBuy.label = "领 取";
        }
        else if(UserProxy.inst.rechargeFlag == 2)
        {
            this.btnBuy.label = "已领取";
            this.btnBuy.enabled = false;
        }
    }

    private awardBack(e:egret.Event):void
    {
        UserMethod.inst.showAward(e.data);
        UserProxy.inst.rechargeFlag = e.data["rechargeFlag"];
        this.btnBuy.label = "已领取";
        this.btnBuy.enabled = false;
        TopPanel.inst.showPoint(1);
    }

    private onBuy():void
    {
        if(!UserProxy.inst.rechargeFlag)
        {
            MenuPanel.inst.menuUp = true;
            MenuPanel.inst.openMenu(6);
            this.onClose();
            // ExternalUtil.inst.pay(PidType.PID_2);
        }
        else if(UserProxy.inst.rechargeFlag == 1)
        {
           Http.inst.send(CmdID.VIP_PRICE);
        }
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("FirstRechargePanel");
    }

    public destory():void
    {
        super.destory();
        Http.inst.removeCmdListener(CmdID.VIP_PRICE,this.awardBack,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBuy,this);

        for(var i:number = 1;i < 5;i++)
        {
            var mc:egret.MovieClip = <egret.MovieClip>DisplayUtil.getChildByName(this,"mc" + i);
            mc.stop();
            DisplayUtil.removeFromParent(mc);
        }

    }

}