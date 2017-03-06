/**
 * Created by Administrator on 1/23 0023.
 */
class SettingHeadPanel extends BasePanel
{
    public img_select:eui.Image;
    public btnClose:SimpleButton;
    private roleList:eui.List;

    public constructor()
    {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SettingHeadPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public init()
    {
        this.roleList.itemRenderer = SettingHeadRenderer;
        EventManager.inst.addEventListener("CHANGE_HEAD",this.selectRoleIcon,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        for(var i:number = 1;i < 13;i++)
        {
            var res:string = Config.HeadData[i];
            var head:AutoBitmap = <AutoBitmap>DisplayUtil.getChildByName(this,"head" + i);
            head.source =  Global.getSecretIcon(res["head_res"]);
            head["id"] = res["id"];
            head.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHead,this);
        }
    }

    public initData()
    {
        var head:number = UserMethod.inst.getConfigHeadId(UserProxy.inst.headimgurl);
        this.changeSelect(head);
        this.refresh();
    }

    private refresh():void
    {
        var heroIds:number[] = UserProxy.inst.heroData.getHeroIds();
        var idsLength:number = heroIds.length;
        var ids:number[] = [];
        var idArrays:any[] = [];

        for(var j:number = 0; j < idsLength ;j++)
        {
            var id:number = Number(heroIds[j]);
            var roleData:HeroVO = UserProxy.inst.heroData.getHeroData(id);
            if(roleData.starLevel >= 3)
            {
                ids.push(id);

                if(ids.length == 6)
                {
                    idArrays.push(ids);
                    ids = [];
                }
            }
        }
        idArrays.push(ids);

        this.roleList.dataProvider = new eui.ArrayCollection(idArrays);
    }

    private selectRoleIcon(e:egret.Event):void
    {
        if(e.data > 12)
        {
            this.img_select.visible = false;
        }
        else
        {
            this.changeSelect(e.data);
        }

    }


    private changeSelect(id:number):void
    {
        UserMethod.inst.settingHeadId = id;
        if(id <= 12)
        {
            var headImg:AutoBitmap ;
            headImg = <AutoBitmap>DisplayUtil.getChildByName(this,"head" + id);
            this.img_select.visible = true;
            this.img_select.x = headImg.x - 2;
            this.img_select.y = headImg.y - 2;
        }
        else
        {
            this.img_select.visible = false;
        }
    }

    private onHead(e:egret.TouchEvent):void
    {
        var id:number = parseInt(e.currentTarget["id"]);
        EventManager.inst.dispatch("CHANGE_HEAD",id);
    }

    private onClose():void
    {
        PanelManager.inst.hidePanel("SettingHeadPanel");
        var sendId:number = UserMethod.inst.settingHeadId;
        Http.inst.send(CmdID.SET_HEAD,{id:sendId});
    }

    public destory()
    {
        super.destory();
        EventManager.inst.removeEventListener("CHANGE_HEAD",this.selectRoleIcon,this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClose,this);
        for(var i:number = 1;i < 13;i++)
        {
            var head:AutoBitmap = <AutoBitmap>DisplayUtil.getChildByName(this,"head" + i);
            head.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHead,this);
        }
    }

}