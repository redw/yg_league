/**
 * Created by Administrator on 12/19 0019.
 */
class MailInfoPanel extends BasePanel
{
    public btnClose:SimpleButton;
    public btnGet:eui.Button;
    public lblName:eui.Label;
    public lblDesc:eui.Label;
    public imgHadGot:eui.Image;


    private _state:number;

    public constructor()
    {
        super();

        this._layer = PanelManager.TOP_LAYER;
        this._modal = true;
        this.skinName = MailInfoPanelSkin;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;

    }

    public init():void
    {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);

        Http.inst.addCmdListener(CmdID.MAIL_ENCLOSE,this.onGetMail,this);
        Http.inst.addCmdListener(CmdID.DELETE_MAIL,this.onDeletaMail,this);
    }

    public initData():void
    {
        this.lblName.text = "亲爱的" + StringUtil.decodeName(UserProxy.inst.nickname)+"：";
        var mailInfo:any = UserProxy.inst.mail[this.data];
        this._state = mailInfo["state"];

        this.lblDesc.text = StringUtil.replaceDescribe(mailInfo["text"]);

        var item:any = mailInfo["item"];
        var count:number = 0;
        var awardGroups:eui.Group[] = [];
        for(var i:number = 0;i < 4;i++)
        {
            var awardGroup:eui.Group = <eui.Group>DisplayUtil.getChildByName(this,"awardGroup" + i);
            var reward:any = item["reward_" + (i+1)];
            if(reward)
            {
                awardGroup.visible = true;
                awardGroups.push(awardGroup);
                var weaponIcon:WeaponIcon = <WeaponIcon>DisplayUtil.getChildByName(awardGroup,"icon");
                var num:eui.Label = <eui.Label>DisplayUtil.getChildByName(awardGroup,"num");
                var awardName:eui.Label = <eui.Label>DisplayUtil.getChildByName(awardGroup,"awardName");
                var awardData:RewardData = UserMethod.inst.rewardJs[reward[0]];
                weaponIcon.touchReward = reward;
                awardName.text = awardData.name;
                weaponIcon.imgIcon = awardData.icon;
                num.text = "x" + MathUtil.easyNumber(reward[2]);
                count++;
            }
            else
            {
                awardGroup.visible = false;
            }
        }

        switch (count)
        {
            case 1:
                awardGroups[0].x = 208;
                break;
            case 2:
                awardGroups[0].x = 158;
                awardGroups[1].x = 258;
                break;
            case 3:
                awardGroups[0].x = 208;
                awardGroups[1].x = 118;
                awardGroups[2].x = 298;
                break;
            case 4:
                awardGroups[0].x = 258;
                awardGroups[1].x = 348;
                awardGroups[2].x = 168;
                awardGroups[3].x = 78;
                break;
        }

        if(this._state)
        {
            this.btnGet.label = "删 除";
            this.imgHadGot.visible = true;
        }
        else
        {
            this.imgHadGot.visible = false;
            this.btnGet.label = "领 取";
        }


    }

    public onGet():void
    {
        if(this._state)
        {
            Http.inst.send(CmdID.DELETE_MAIL,{id:this.data});
        }
        else
        {
            Http.inst.send(CmdID.MAIL_ENCLOSE,{id:this.data});
        }

    }

    private onGetMail(e:egret.Event):void
    {
        var mailInfo:any = UserProxy.inst.mail[this.data];
        this._state = mailInfo["state"];
        if(this._state)
        {
            this.btnGet.label = "删 除";
            this.imgHadGot.visible = true;
        }

        TopPanel.inst.showPoint(13);

    }

    private onDeletaMail(e:egret.Event):void
    {
        var refreshId:number = e.data["mailId"];
        delete UserProxy.inst.mail[refreshId];
        PanelManager.inst.hidePanel("MailInfoPanel");
        EventManager.inst.dispatch(ContextEvent.DELETA_MAIL);
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("MailInfoPanel");
    }

    public destory():void
    {
        super.destory();
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGet,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        Http.inst.removeCmdListener(CmdID.MAIL_ENCLOSE,this.onGetMail,this);
        Http.inst.removeCmdListener(CmdID.DELETE_MAIL,this.onDeletaMail,this);
    }

}