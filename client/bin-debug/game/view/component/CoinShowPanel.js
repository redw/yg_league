/**
 * Created by Administrator on 2/22 0022.
 */
var CoinShowPanel = (function (_super) {
    __extends(CoinShowPanel, _super);
    function CoinShowPanel() {
        _super.call(this);
        this.skinName = CoinShowPanelSkin;
    }
    var d = __define,c=CoinShowPanel,p=c.prototype;
    p.startListener = function () {
        EventManager.inst.addEventListener(ContextEvent.REFRESH_BASE, this.refresh, this);
        this.imgShow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUtil, this);
        this.imgShow1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUtil, this);
        EventManager.inst.addEventListener(ContextEvent.ADD_EARN_MONEY, this.showAdd, this);
        this.refresh();
    };
    p.refresh = function () {
        if (UserProxy.inst.gold == undefined || UserProxy.inst.medal == undefined) {
            return;
        }
        this.lblDiamond.text = UserProxy.inst.diamond + "";
        this.lblGold.text = MathUtil.easyNumber(UserProxy.inst.gold);
        this.lblMedal.text = MathUtil.easyNumber(UserProxy.inst.medal);
    };
    p.endListener = function () {
        EventManager.inst.removeEventListener(ContextEvent.REFRESH_BASE, this.refresh, this);
        this.imgShow.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUtil, this);
        this.imgShow1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUtil, this);
        EventManager.inst.removeEventListener(ContextEvent.ADD_EARN_MONEY, this.showAdd, this);
    };
    p.onUtil = function () {
        PanelManager.inst.showPanel("MoneyUnitPanel");
    };
    p.showAdd = function (e) {
        var showAdd = new eui.Label();
        showAdd.fontFamily = Global.SYS_FONT;
        showAdd.size = 12;
        showAdd.bold = true;
        showAdd.stroke = 1;
        showAdd.strokeColor = 0x432A00;
        showAdd.textColor = 0xFFDB5F;
        var add = BigNum.sub(e.data, UserProxy.inst.gold);
        if (BigNum.greaterOrEqual(add, 1)) {
            showAdd.text = "+" + MathUtil.easyNumber(add);
            showAdd.x = 400;
            showAdd.y = 23;
            this.addChild(showAdd);
            UserProxy.inst.gold = e.data;
            egret.Tween.get(showAdd).to({ y: 1, alpha: 0 }, 800).call(removeShow);
            function removeShow() {
                DisplayUtil.removeFromParent(showAdd);
            }
            EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        }
    };
    return CoinShowPanel;
}(eui.Component));
egret.registerClass(CoinShowPanel,'CoinShowPanel');
