/**
 * Created by Administrator on 12/20 0020.
 */
var PVPRule = (function (_super) {
    __extends(PVPRule, _super);
    function PVPRule() {
        _super.call(this);
        this.skinName = PVPRuleSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=PVPRule,p=c.prototype;
    p.onShow = function (event) {
        this.lblDesc.text = " 1 本玩法内，角色的属性只跟颜色与星级相关，1星彩将=4星红将=7星橙将=10星紫将\n2 竞技场每周为一个赛季，每周三中午12点结束赛季颁发奖励，奖励通过邮件颁发\n3 随着挑战的胜利，您的段位会不断提升，段位越高，赛季奖励越高\n4 每场比赛后您都会获得一定竞技币，段位越高获得的竞技币越多，与胜负无关\n5 新赛季开始后，您的段位会进行一定幅度的回退\n6 每日有5次免费挑战次数，免费次数用完后继续挑战会消耗元宝";
    };
    p.onHide = function (event) {
    };
    return PVPRule;
}(eui.Component));
egret.registerClass(PVPRule,'PVPRule');
