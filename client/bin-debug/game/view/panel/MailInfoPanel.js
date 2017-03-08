/**
 * Created by Administrator on 12/19 0019.
 */
var MailInfoPanel = (function (_super) {
    __extends(MailInfoPanel, _super);
    function MailInfoPanel() {
        _super.call(this);
        this._layer = PanelManager.TOP_LAYER;
        this._modal = true;
        this.skinName = MailInfoPanelSkin;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }
    var d = __define,c=MailInfoPanel,p=c.prototype;
    p.init = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        Http.inst.addCmdListener(CmdID.MAIL_ENCLOSE, this.onGetMail, this);
        Http.inst.addCmdListener(CmdID.DELETE_MAIL, this.onDeletaMail, this);
    };
    p.initData = function () {
        this.lblName.text = "亲爱的" + StringUtil.decodeName(UserProxy.inst.nickname) + "：";
        var mailInfo = UserProxy.inst.mail[this.data];
        this._state = mailInfo["state"];
        this.lblDesc.text = StringUtil.replaceDescribe(mailInfo["text"]);
        var item = mailInfo["item"];
        var count = 0;
        var awardGroups = [];
        for (var i = 0; i < 4; i++) {
            var awardGroup = DisplayUtil.getChildByName(this, "awardGroup" + i);
            var reward = item["reward_" + (i + 1)];
            if (reward) {
                awardGroup.visible = true;
                awardGroups.push(awardGroup);
                var weaponIcon = DisplayUtil.getChildByName(awardGroup, "icon");
                var num = DisplayUtil.getChildByName(awardGroup, "num");
                var awardName = DisplayUtil.getChildByName(awardGroup, "awardName");
                var awardData = UserMethod.inst.rewardJs[reward[0]];
                weaponIcon.touchReward = reward;
                awardName.text = awardData.name;
                weaponIcon.imgIcon = awardData.icon;
                num.text = "x" + MathUtil.easyNumber(reward[2]);
                count++;
            }
            else {
                awardGroup.visible = false;
            }
        }
        switch (count) {
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
        if (this._state) {
            this.btnGet.label = "删 除";
            this.imgHadGot.visible = true;
        }
        else {
            this.imgHadGot.visible = false;
            this.btnGet.label = "领 取";
        }
    };
    p.onGet = function () {
        if (this._state) {
            Http.inst.send(CmdID.DELETE_MAIL, { id: this.data });
        }
        else {
            Http.inst.send(CmdID.MAIL_ENCLOSE, { id: this.data });
        }
    };
    p.onGetMail = function (e) {
        var mailInfo = UserProxy.inst.mail[this.data];
        this._state = mailInfo["state"];
        if (this._state) {
            this.btnGet.label = "删 除";
            this.imgHadGot.visible = true;
        }
        TopPanel.inst.showPoint(13);
    };
    p.onDeletaMail = function (e) {
        var refreshId = e.data["mailId"];
        delete UserProxy.inst.mail[refreshId];
        PanelManager.inst.hidePanel("MailInfoPanel");
        EventManager.inst.dispatch(ContextEvent.DELETA_MAIL);
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("MailInfoPanel");
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        Http.inst.removeCmdListener(CmdID.MAIL_ENCLOSE, this.onGetMail, this);
        Http.inst.removeCmdListener(CmdID.DELETE_MAIL, this.onDeletaMail, this);
    };
    return MailInfoPanel;
}(BasePanel));
egret.registerClass(MailInfoPanel,'MailInfoPanel');
