/**
 * Created by Administrator on 11/10 0010.
 */
var ScencePanel = (function (_super) {
    __extends(ScencePanel, _super);
    function ScencePanel() {
        _super.call(this);
        this.skinName = "resource/skins/game/panel/ScencePanelSkin.exml";
        this._mutex = false;
        this._modal = true;
        this._layer = PanelManager.BOTTOM_LAYER;
        //
        this.bottom = 0;
        this.horizontalCenter = 0;
        this.height = Global.getStageHeight();
    }
    var d = __define,c=ScencePanel,p=c.prototype;
    p.destory = function () {
        _super.prototype.destory.call(this);
    };
    p.init = function () {
        EventManager.inst.addEventListener(ContextEvent.LABEL_MOVE_SHOW, this.showMoveLabel, this);
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
        this.scene = new PVEFightContainer();
        this.contentGroup.addChild(this.scene);
        this.scene.startLevel(1);
        this.commonGroup.visible = false;
        this.newGroup.visible = false;
        this.newScr.visible = false;
        this.showMoveLabel();
    };
    p.showMoveLabel = function () {
        if (UserProxy.inst.server_time >= UserMethod.inst.scenceMoveTime + 120) {
            var tips;
            var moveLabel;
            if (UserProxy.inst.historyArea > 100) {
                var random = MathUtil.rangeRandom(1, 15);
                tips = Config.TipsData[random]["tips"];
                moveLabel = this.lblMove;
                this.commonGroup.visible = true;
            }
            else {
                var tipData = this.getNowHelpTipData(UserProxy.inst.historyArea);
                if (!tipData) {
                    return;
                }
                this.lblName.text = tipData["name"];
                tips = tipData["disc"];
                moveLabel = this.lblMoveNew;
                this.newGroup.visible = true;
                this.newScr.visible = true;
            }
            if (!tips) {
                return;
            }
            UserMethod.inst.scenceMoveTime = UserProxy.inst.server_time;
            moveLabel.x = 480;
            moveLabel.text = tips;
            egret.Tween.get(moveLabel).to({ x: 0 }, 5000).wait(1200).to({ x: -moveLabel.width - 10 }, 8000).to({ x: 480 }, 0).to({ x: 0 }, 5000).wait(1200).to({ x: -moveLabel.width - 10 }, 8000).call(endMove);
            var self = this;
            function endMove() {
                self.commonGroup.visible = false;
                self.newGroup.visible = false;
                self.newScr.visible = false;
            }
        }
    };
    p.getNowHelpTipData = function (area) {
        for (var c in Config.NewTipsData) {
            var data = Config.NewTipsData[c];
            if (parseInt(data["floor"]) > area) {
                return Config.NewTipsData[c];
            }
        }
        return null;
    };
    return ScencePanel;
}(BasePanel));
egret.registerClass(ScencePanel,'ScencePanel');
