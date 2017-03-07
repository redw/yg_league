/**
 * 神器面板
 * Created by hh on 2017/2/28.
 */
var ArtifactPanel = (function (_super) {
    __extends(ArtifactPanel, _super);
    function ArtifactPanel() {
        _super.call(this);
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = ArtifactPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }
    var d = __define,c=ArtifactPanel,p=c.prototype;
    p.init = function () {
        this.initArtifact();
        this.initGroupArtifact();
        this.initGroupList();
        this.addListeners();
    };
    p.addListeners = function () {
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.groupUpgradeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroupUpgrade, this);
        this.upgradeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
        Http.inst.addCmdListener(CmdID.HALLOWS_UP, this.onUpgradeBack, this);
        Http.inst.addCmdListener(CmdID.HALLOWS_SUIT, this.onSuitUpgradeBack, this);
        this.groupBtnList.addEventListener(egret.Event.CHANGING, this.onSelectGroup, this);
    };
    p.onSuitUpgradeBack = function (e) {
        UserProxy.inst.newObj.suit = e.data.suit;
        this.onSelectGroup(null);
    };
    p.onUpgradeBack = function (e) {
        UserProxy.inst.newObj.hallows = e.data.hallows;
        this.onSelectArtifact(this.artifactId);
    };
    // artifact组升级
    p.onGroupUpgrade = function (e) {
        Http.inst.send(CmdID.HALLOWS_SUIT, { id: this.groupId });
    };
    // artifact升级
    p.onUpgrade = function (e) {
        Http.inst.send(CmdID.HALLOWS_UP, { id: this.artifactId });
    };
    p.initGroupList = function () {
        this.groupBtnList.itemRenderer = ArtifactGroupBtnItem;
        var groupArr = [];
        for (var i = 1; i < 1000000; i++) {
            if (Config.ArtifactGroupData[i]) {
                groupArr.push(Config.ArtifactGroupData[i]);
            }
            else {
                break;
            }
        }
        this.groupBtnList.dataProvider = new eui.ArrayCollection(groupArr);
        this.groupBtnList.touchEnabled = true;
        this.groupBtnList.selectedIndex = 0;
        this.onSelectGroup(null);
    };
    p.initGroupArtifact = function () {
        this.artifactGroup = new eui.Group();
        this.artifactGroup.addEventListener(egret.Event.CHANGE, this.onSelectArtifact, this);
        this.artifactGroup.x = 164;
        this.artifactGroup.y = 100;
        this.artifactArr = [];
        this.addChild(this.artifactGroup);
        for (var i = 0; i < 6; i++) {
            var item = new ArtifactItem(this.artifactGroup);
            item.x = (i % 3) * 96;
            item.y = Math.floor(i / 3) * 100;
            this.artifactGroup.addChild(item);
            this.artifactArr.push(item);
        }
        this.suitDesTxt = new egret.TextField();
        this.suitDesTxt.width = 270;
        this.suitDesTxt.height = 50;
        this.suitDesTxt.x = 176;
        this.suitDesTxt.y = 300;
        this.suitDesTxt.size = 14;
        this.suitDesTxt.bold = true;
        this.suitDesTxt.backgroundColor = 0x888888;
        this.addChild(this.suitDesTxt);
    };
    p.initArtifact = function () {
        this.artifactDesTxt = new egret.TextField();
        this.artifactDesTxt.width = 270;
        this.artifactDesTxt.height = 50;
        this.artifactDesTxt.x = 170;
        this.artifactDesTxt.y = 580;
        this.artifactDesTxt.size = 14;
        this.artifactDesTxt.bold = true;
        this.artifactDesTxt.backgroundColor = 0x888888;
        this.addChild(this.artifactDesTxt);
        this.artifactDesTxt.text = "道具描述";
    };
    p.onClose = function () {
        PanelManager.inst.hidePanel("ArtifactPanel");
    };
    // 选择artifact组
    p.onSelectGroup = function (e) {
        this.groupId = this.groupBtnList.selectedIndex + 1;
        var config = Config.ArtifactGroupData[this.groupId];
        var artifacts = config.artifact;
        var star = 0;
        for (var i = 0; i < artifacts.length; i++) {
            this.artifactArr[i].data = artifacts[i];
            star += artifact.getArtifactInfo(artifacts[i]).lv;
        }
        for (var i = artifacts.length; i < 6; i++) {
            this.artifactArr[i].data = 0;
        }
        var htmlTxtParser = new egret.HtmlTextParser();
        this.suitDesTxt.textFlow = (htmlTxtParser.parser("<font color=\"#ff0000\" fontFamily=\"\u5FAE\u8F6F\u96C5\u9ED1\">\u5957\u88C5\u6548\u679C:</font>" +
            ("<font color=\"#ffff00\" fontFamily=\"\u5FAE\u8F6F\u96C5\u9ED1\">" + config.name + "</font>")));
        this.artifactArr[0].selected = true;
        var info = artifact.getArtifactGroupInfo(this.groupId);
        var needStar = config.lvlup_cost[info.lv];
        this.groupUpgradeBtn.label = star + "/" + needStar;
        this.groupUpgradeBtn.enabled = artifact.checkGroupUpgrade(this.groupId);
    };
    // 选择artifact
    p.onSelectArtifact = function (e) {
        if (typeof e == "number" || typeof e == "string") {
            this.artifactId = +e;
        }
        else {
            this.artifactId = e.data;
        }
        var len = this.artifactArr.length;
        for (var i = 0; i < len; i++) {
            if (this.artifactArr[i] != e.data) {
                this.artifactArr[i].selected = false;
            }
        }
        this.showArtifactInfo(this.artifactId);
    };
    // 显示artifact信息
    p.showArtifactInfo = function (id) {
        var config = Config.ArtifactData[id];
        this.artifactNameLbl.text = config.name;
        var count = artifact.getPieceCount(id);
        var lv = artifact.getArtifactInfo(id).lv;
        var needCount = config.lvlup_cost[lv];
        this.upgradeBtn.label = count + "/" + needCount;
        this.upgradeBtn.enabled = artifact.checkUpgrade(id);
    };
    p.removeListeners = function () {
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.groupUpgradeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroupUpgrade, this);
        this.upgradeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
        Http.inst.removeCmdListener(CmdID.HALLOWS_UP, this.onUpgradeBack, this);
        Http.inst.removeCmdListener(CmdID.HALLOWS_SUIT, this.onSuitUpgradeBack, this);
        this.groupBtnList.removeEventListener(egret.Event.CHANGING, this.onSelectGroup, this);
        this.artifactGroup.removeEventListener(egret.Event.CHANGE, this.onSelectArtifact, this);
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.removeListeners();
        this.groupBtnList.dataProvider = null;
        this.groupBtnList = null;
    };
    return ArtifactPanel;
}(BasePanel));
egret.registerClass(ArtifactPanel,'ArtifactPanel');
var ArtifactGroupBtnItem = (function (_super) {
    __extends(ArtifactGroupBtnItem, _super);
    function ArtifactGroupBtnItem() {
        _super.call(this);
        this.height = 54;
        this.width = 125;
        this.touchEnabled = true;
        this.touchChildren = false;
        this.image = new eui.Image();
        this.selected = false;
        this.addChild(this.image);
        this.image.x = 2;
        this.image.y = 2;
        this.label = new eui.Label();
        this.addChild(this.label);
        this.label.textColor = 0x583C26;
        this.label.fontFamily = "微软雅黑";
        this.label.size = 18;
        this.label.textAlign = "center";
        this.label.verticalCenter = "verticalCenter";
        this.label.width = this.width;
        this.label.y = 17; // 怎么垂直居中?
    }
    var d = __define,c=ArtifactGroupBtnItem,p=c.prototype;
    d(p, "selected",undefined
        ,function (value) {
            if (value) {
                this.image.source = "artifact_btn_down_png";
            }
            else {
                this.image.source = "artifact_btn_up_png";
            }
        }
    );
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var config = this.data;
        this.label.text = config.name;
    };
    return ArtifactGroupBtnItem;
}(eui.ItemRenderer));
egret.registerClass(ArtifactGroupBtnItem,'ArtifactGroupBtnItem');
var ArtifactItem = (function (_super) {
    __extends(ArtifactItem, _super);
    function ArtifactItem(par) {
        _super.call(this);
        this._selected = false;
        this.par = par;
        this.width = 90;
        this.height = 100;
        this.bgImg = new eui.Image();
        this.bgImg.source = "artifact_item_eff_png";
        this.addChild(this.bgImg);
        this.starCountComp = new StarCountComp();
        this.addChild(this.starCountComp);
        this.starCountComp.count = 1;
        this.nameTxt = new eui.Label();
        this.nameTxt.y = 84;
        this.nameTxt.textColor = 0x583C26;
        this.nameTxt.fontFamily = "微软雅黑";
        this.nameTxt.size = 16;
        this.nameTxt.bold = true;
        this.nameTxt.x = 0;
        this.nameTxt.width = this.width;
        this.nameTxt.textAlign = "center";
        this.addChild(this.nameTxt);
        this.touchEnabled = true;
        this.touchChildren = false;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }
    var d = __define,c=ArtifactItem,p=c.prototype;
    p.onTouchTap = function (e) {
        this.selected = true;
    };
    d(p, "selected"
        ,function () {
            return this._selected;
        }
        ,function (value) {
            if (value != this._selected) {
                this._selected = value;
                if (this._selected) {
                    for (var i = 0; i < this.par.numChildren; i++) {
                        var item = this.par.getChildAt(i);
                        if (item != this) {
                            item.selected = false;
                        }
                    }
                    console.log("......");
                    this.par.dispatchEventWith(egret.Event.CHANGE, false, this.data);
                }
            }
        }
    );
    d(p, "data"
        ,function () {
            return this._data;
        }
        ,function (value) {
            this._data = value;
            this.visible = !!value;
            if (value) {
                var config = Config.ArtifactData[value];
                this.nameTxt.text = config.name;
                this.touchChildren = true;
            }
            else {
                this.touchEnabled = false;
            }
        }
    );
    p.dispose = function () {
    };
    return ArtifactItem;
}(egret.DisplayObjectContainer));
egret.registerClass(ArtifactItem,'ArtifactItem');
var ArtifactShowContainer = (function () {
    function ArtifactShowContainer() {
    }
    var d = __define,c=ArtifactShowContainer,p=c.prototype;
    return ArtifactShowContainer;
}());
egret.registerClass(ArtifactShowContainer,'ArtifactShowContainer');
//# sourceMappingURL=ArtifactPanel.js.map