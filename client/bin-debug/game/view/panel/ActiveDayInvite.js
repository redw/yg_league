/**
 * Created by Administrator on 12/9 0009.
 */
var ActiveDayInvite = (function (_super) {
    __extends(ActiveDayInvite, _super);
    function ActiveDayInvite() {
        _super.call(this);
        this.skinName = ActiveDayInviteSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=ActiveDayInvite,p=c.prototype;
    p.onShow = function (event) {
        this.awardList.itemRenderer = ActDayInviteRenderer;
        if (ExternalUtil.inst.getIsYYB()) {
            this.imgTitle.source = "d_show_dec_yyb_png";
        }
        this.refresh();
    };
    p.onHide = function (event) {
    };
    p.refresh = function () {
        var ids = [];
        var doneIds = [];
        for (var i in Config.DailyInviteData) {
            if (UserMethod.inst.isBitGet(parseInt(i), UserProxy.inst.shareObj["shareBit"])) {
                doneIds.push(parseInt(i));
            }
            else {
                ids.push(parseInt(i));
            }
        }
        this.awardList.dataProvider = new eui.ArrayCollection(ids.concat(doneIds));
    };
    return ActiveDayInvite;
}(eui.Component));
egret.registerClass(ActiveDayInvite,'ActiveDayInvite');
