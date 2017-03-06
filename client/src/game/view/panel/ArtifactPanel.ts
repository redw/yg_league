/**
 * 神器面板
 * Created by hh on 2017/2/28.
 */
class ArtifactPanel extends BasePanel {
    public btnClose:SimpleButton;
    public groupBtnList:eui.List;

    private artifactGroup:eui.Group;
    private artifactArr:ArtifactItem[];
    private suitDesTxt:egret.TextField;
    private artifactNameLbl:egret.TextField;
    private artifactDesTxt:egret.TextField;
    private upgradeBtn:StarButton;
    private groupUpgradeBtn:StarButton;
    private groupId:number;
    private artifactId:number;

    public constructor() {
        super();
        this._layer = PanelManager.MIDDLE_LAYER;
        this.skinName = ArtifactPanelSkin;
        this.horizontalCenter = 0;
        this.bottom = 0;
    }

    public init():void {
        this.initArtifact();
        this.initGroupArtifact();
        this.initGroupList();
        this.addListeners();
    }

    private addListeners(){
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.groupUpgradeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroupUpgrade, this);
        this.upgradeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
        Http.inst.addCmdListener(CmdID.HALLOWS_UP,this.onUpgradeBack,this);
        Http.inst.addCmdListener(CmdID.HALLOWS_SUIT,this.onSuitUpgradeBack,this);
        this.groupBtnList.addEventListener(egret.Event.CHANGING, this.onSelectGroup, this);
    }

    private onSuitUpgradeBack(e:egret.Event){
        UserProxy.inst.newObj.suit = e.data.suit;
        this.onSelectGroup(null);
    }

    private onUpgradeBack(e:egret.Event){
        UserProxy.inst.newObj.hallows = e.data.hallows;
        this.onSelectArtifact(this.artifactId);
    }

    // artifact组升级
    private onGroupUpgrade(e:egret.TouchEvent) {
        Http.inst.send(CmdID.HALLOWS_SUIT, {id:this.groupId});
    }

    // artifact升级
    private onUpgrade(e:egret.TouchEvent) {
        Http.inst.send(CmdID.HALLOWS_UP, {id:this.artifactId});
    }

    private initGroupList(){
        this.groupBtnList.itemRenderer = ArtifactGroupBtnItem;
        let groupArr = [];
        for (let i = 1; i < 1000000; i++) {
            if (Config.ArtifactGroupData[i]) {
                groupArr.push(Config.ArtifactGroupData[i]);
            } else {
                break;
            }
        }
        this.groupBtnList.dataProvider = new eui.ArrayCollection(groupArr);
        this.groupBtnList.touchEnabled = true;
        this.groupBtnList.selectedIndex = 0;
        this.onSelectGroup(null);
    }

    private initGroupArtifact(){
        this.artifactGroup = new eui.Group();
        this.artifactGroup.addEventListener(egret.Event.CHANGE, this.onSelectArtifact, this);
        this.artifactGroup.x = 164;
        this.artifactGroup.y = 100;
        this.artifactArr = [];
        this.addChild(this.artifactGroup);
        for (let i = 0; i < 6; i++) {
            let item = new ArtifactItem(this.artifactGroup);
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
    }

    private initArtifact(){
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
    }

    private onClose():void {
        PanelManager.inst.hidePanel("ArtifactPanel");
    }

    // 选择artifact组
    private onSelectGroup(e:egret.Event) {
        this.groupId = this.groupBtnList.selectedIndex + 1;
        let config:ArtifactConfigGroupItem = Config.ArtifactGroupData[this.groupId];
        let artifacts = config.artifact;
        let star = 0;
        for (let i = 0; i < artifacts.length; i++) {
            this.artifactArr[i].data = artifacts[i];
            star += artifact.getArtifactInfo(artifacts[i]).lv;
        }
        for (let i = artifacts.length; i < 6; i++) {
            this.artifactArr[i].data = 0;
        }
        let htmlTxtParser = new egret.HtmlTextParser();
        this.suitDesTxt.textFlow = (htmlTxtParser.parser(
            `<font color="#ff0000" fontFamily="微软雅黑">套装效果:</font>` +
            `<font color="#ffff00" fontFamily="微软雅黑">${config.name}</font>`
        ));
        this.artifactArr[0].selected = true;
        let info = artifact.getArtifactGroupInfo(this.groupId);
        let needStar = config.lvlup_cost[info.lv];
        this.groupUpgradeBtn.label = `${star}/${needStar}`;
        this.groupUpgradeBtn.enabled = artifact.checkGroupUpgrade(this.groupId);
    }

    // 选择artifact
    private onSelectArtifact(e:any) {
        if (typeof e == "number" || typeof e == "string") {
            this.artifactId = +e;
        } else {
            this.artifactId = e.data;
        }
        let len = this.artifactArr.length;
        for (let i = 0; i < len; i++) {
            if (this.artifactArr[i] != e.data) {
                this.artifactArr[i].selected = false;
            }
        }
        this.showArtifactInfo(this.artifactId);
    }

    // 显示artifact信息
    private showArtifactInfo(id:number) {
        let config:ArtifactConfigItem = Config.ArtifactData[id];
        this.artifactNameLbl.text = config.name;
        let count = artifact.getPieceCount(id);
        let lv = artifact.getArtifactInfo(id).lv;
        let needCount = config.lvlup_cost[lv];
        this.upgradeBtn.label = `${count}/${needCount}`;
        this.upgradeBtn.enabled = artifact.checkUpgrade(id);
    }

    private removeListeners(){
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.groupUpgradeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGroupUpgrade, this);
        this.upgradeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
        Http.inst.removeCmdListener(CmdID.HALLOWS_UP,this.onUpgradeBack,this);
        Http.inst.removeCmdListener(CmdID.HALLOWS_SUIT,this.onSuitUpgradeBack,this);
        this.groupBtnList.removeEventListener(egret.Event.CHANGING, this.onSelectGroup, this);
        this.artifactGroup.removeEventListener(egret.Event.CHANGE, this.onSelectArtifact, this);
    }

    public destory():void {
        super.destory();
        this.removeListeners();
        this.groupBtnList.dataProvider = null;
        this.groupBtnList = null;
    }
}

class ArtifactGroupBtnItem extends eui.ItemRenderer {
    private image:eui.Image;
    private label:eui.Label;

    public constructor(){
        super();
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
        this.label.y = 17;     // 怎么垂直居中?
    }

    public set selected(value:boolean) {
        if (value) {
            this.image.source = `artifact_btn_down_png`
        } else {
            this.image.source = `artifact_btn_up_png`
        }
    }

    public dataChanged(): void {
        super.dataChanged();
        let config:ArtifactConfigGroupItem = this.data;
        this.label.text = config.name;
    }
}

class ArtifactItem extends egret.DisplayObjectContainer{
    private bgImg:eui.Image;
    private starCountComp:StarCountComp;
    private nameTxt:eui.Label;
    private _selected:boolean = false;
    private par:egret.DisplayObjectContainer;

    public constructor(par:egret.DisplayObjectContainer){
        super();
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

    private onTouchTap(e:egret.TouchEvent){
        this.selected = true;
    }

    public get selected() {
        return this._selected;
    }

    public set selected(value:boolean) {
        if (value != this._selected) {
            this._selected = value;
            if (this._selected) {
                for (let i = 0; i < this.par.numChildren; i++) {
                    let item:ArtifactItem = <ArtifactItem>this.par.getChildAt(i);
                    if (item != this) {
                        item.selected = false;
                    }
                }
                console.log("......");
                this.par.dispatchEventWith(egret.Event.CHANGE, false, this.data);
            }
        }
    }

    private _data:any;
    public get data(){
        return this._data;
    }

    public set data(value:any){
        this._data = value;
        this.visible = !!value;
        if (value) {
            let config:ArtifactItem = Config.ArtifactData[value];
            this.nameTxt.text = config.name;
            this.touchChildren = true;
        } else {
            this.touchEnabled = false;
        }
    }

    public dispose(){

    }
}

class ArtifactShowContainer {

}

