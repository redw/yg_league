/**
 * Created by Administrator on 1/23 0023.
 */
var SettingHeadPanel = (function (_super) {
    __extends(SettingHeadPanel, _super);
    function SettingHeadPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = SettingHeadPanelSkin;
        this._modal = true;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=SettingHeadPanel,p=c.prototype;
    p.init = function () {
        this.roleList.itemRenderer = SettingHeadRenderer;
        EventManager.inst.addEventListener("CHANGE_HEAD", this.selectRoleIcon, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        for (var i = 1; i < 13; i++) {
            var res = Config.HeadData[i];
            var head = DisplayUtil.getChildByName(this, "head" + i);
            head.source = Global.getSecretIcon(res["head_res"]);
            head["id"] = res["id"];
            head.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHead, this);
        }
    };
    p.initData = function () {
        var head = UserMethod.inst.getConfigHeadId(UserProxy.inst.headimgurl);
        this.changeSelect(head);
        this.refresh();
    };
    p.refresh = function () {
        var heroIds = UserProxy.inst.heroData.getHeroIds();
        var idsLength = heroIds.length;
        var ids = [];
        var idArrays = [];
        for (var j = 0; j < idsLength; j++) {
            var id = Number(heroIds[j]);
            var roleData = UserProxy.inst.heroData.getHeroData(id);
            if (roleData.starLevel >= 3) {
                ids.push(id);
                if (ids.length == 6) {
                    idArrays.push(ids);
                    ids = [];
                }
            }
        }
        idArrays.push(ids);
        this.roleList.dataProvider = new eui.ArrayCollection(idArrays);
    };
    p.selectRoleIcon = function (e) {
        if (e.data > 12) {
            this.img_select.visible = false;
        }
        else {
            this.changeSelect(e.data);
        }
    };
    p.changeSelect = function (id) {
        UserMethod.inst.settingHeadId = id;
        if (id <= 12) {
            var headImg;
            headImg = DisplayUtil.getChildByName(this, "head" + id);
            this.img_select.visible = true;
            this.img_select.x = headImg.x - 2;
            this.img_select.y = headImg.y - 2;
        }
        else {
            this.img_select.visible = false;
        }
    };
    p.onHead = function (e) {
        var id = parseInt(e.currentTarget["id"]);
        EventManager.inst.dispatch("CHANGE_HEAD", id);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("SettingHeadPanel");
        var sendId = UserMethod.inst.settingHeadId;
        Http.inst.send(CmdID.SET_HEAD, { id: sendId });
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        EventManager.inst.removeEventListener("CHANGE_HEAD", this.selectRoleIcon, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        for (var i = 1; i < 13; i++) {
            var head = DisplayUtil.getChildByName(this, "head" + i);
            head.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHead, this);
        }
    };
    return SettingHeadPanel;
}(BasePanel));
egret.registerClass(SettingHeadPanel,'SettingHeadPanel');
