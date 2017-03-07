/**
 * Created by Administrator on 11/28 0028.
 */
var RoleSkillRenderer = (function (_super) {
    __extends(RoleSkillRenderer, _super);
    function RoleSkillRenderer() {
        _super.call(this);
        this.skinName = RoleSkillRendererSkin;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onShow, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHide, this);
    }
    var d = __define,c=RoleSkillRenderer,p=c.prototype;
    p.onShow = function (event) {
        this.imgTouchShow.visible = false;
        this.contentGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
    };
    p.onHide = function (event) {
        this.contentGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
    };
    p.onTouch = function (e) {
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().addEventListener(egret.TouchEvent.TOUCH_END, this.onCloseSkillTip, this);
    };
    p.onEnterFrame = function (event) {
        if (!this.imgTouchShow.visible) {
            this.imgTouchShow.visible = true;
        }
    };
    p.onCloseSkillTip = function () {
        this.imgTouchShow.visible = false;
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        Global.getStage().removeEventListener(egret.TouchEvent.TOUCH_END, this.onCloseSkillTip, this);
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var roleInfo = UserProxy.inst.heroData.getValue(UserMethod.inst.roleSelectId);
        var skillData = Config.SkillData[this.data["skillId"]];
        var openStar = parseInt(this.data["openStar"]);
        this.imgIcon.source = Global.getSkillIcon(this.data["skillId"]);
        this.lblStar.text = this.data["openStar"];
        if (roleInfo.starLevel >= openStar) {
            this.imgMask.visible = false;
            this.imgStar.visible = false;
            this.lblOpen.visible = false;
            this.lblStar.visible = false;
        }
        else {
            this.imgMask.visible = true;
            this.imgStar.visible = true;
            this.lblOpen.visible = true;
            this.lblStar.visible = true;
        }
        this.lblName.text = skillData["name"];
        this.lblDec.text = skillData["tip"];
    };
    return RoleSkillRenderer;
}(eui.ItemRenderer));
egret.registerClass(RoleSkillRenderer,'RoleSkillRenderer');
//# sourceMappingURL=RoleSkillRenderer.js.map