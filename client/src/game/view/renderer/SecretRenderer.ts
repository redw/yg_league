/**
 * Created by Administrator on 12/5 0005.
 */
class SecretRenderer extends eui.ItemRenderer
{
    public lblName:eui.Label;
    public btnGo:SimpleButton;
    public lblGoTime:eui.Label;
    public imgType:AutoBitmap;
    public imgIcon:AutoBitmap;

    private _openDay:number[] = [] ;

    public constructor()
    {
        super();
        this.skinName = SecretRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }

    private onShow(event:egret.Event):void
    {
        this.btnGo.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
    }

    private onHide(event:egret.Event):void
    {
        this.btnGo.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGo,this);
    }

    private onGo(e:egret.TouchEvent):void
    {
        if(!UserProxy.inst.freeTimes)
        {
            this.onAdd();
            return;
        }
        PanelManager.inst.showPanel("SecretAreaPanel",this.data);
    }

    private onAdd():void
    {
        var cost:number = parseInt(Config.BaseData[29]["value"]) * (1 + 0.5 * (UserProxy.inst.buyTimes - 1));
        Alert.showCost(cost,"买一次体力（ps:人参果可以增加次数哦~）",true,showCost,null,this);

        function showCost():void
        {
            if(UserProxy.inst.diamond >= cost)
            {
                Http.inst.send(CmdID.DUNGEON_TIMES);
            }
            else
            {
                ExternalUtil.inst.diamondAlert();
            }
        }
    }

    public dataChanged(): void
    {
        super.dataChanged();

        var secretData:any = Config.WeaponFbOp[this.data];
        this.lblName.text = secretData["name"];
        this.imgType.source = UserMethod.inst.rewardJs[secretData["reward_icon"]].icon_s;
        this.lblGoTime.text = this.openDay(secretData["open_day"]);
        this.imgIcon.source = Global.getSecretIcon(secretData["head_icon"]);

        this.checkDay();
    }

    private openDay(openArr:string[]):string
    {
        var openStr:string = "（入场：";
        var length:number = openArr.length;
        this._openDay = [];
        for(var i:number = 0;i < length; i++)
        {
            if(parseInt(openArr[i]))
            {
                this._openDay.push(i);
                switch (i)
                {
                    case 0:openStr += "周日、"; break;
                    case 1:openStr += "周一、"; break;
                    case 2:openStr += "周二、"; break;
                    case 3:openStr += "周三、"; break;
                    case 4:openStr += "周四、"; break;
                    case 5:openStr += "周五"; break;
                    case 6:openStr += "周六"; break;
                }
            }
        }

        openStr += "）";
        return openStr;
    }

    private checkDay():void
    {
        this.btnGo.source = "secret_area_close_png";
        this.btnGo.touchEnabled = false;
        this.btnGo.touchScaleEffect = false;

        var length:number = this._openDay.length;
        var myData: Date = new Date();
        myData.setTime(UserProxy.inst.server_time * 1000);
        var today:number = myData.getDay();
        for (var i:number = 0;i<length;i++)
        {
            if(this._openDay[i] == today)
            {
                this.btnGo.source = "secret_area_in_png";
                this.btnGo.touchEnabled = true;
                this.btnGo.touchScaleEffect = true;
                return;
            }

        }
    }
}
