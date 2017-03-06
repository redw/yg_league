/**
 * 道具掉落
 * Created by hh on 2016/12/19.
 */
class DropItem extends egret.DisplayObjectContainer {
    private propEff:MCEff;
    private _dropId:number = -1;

    public constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    }

    private addToStage(e:egret.Event) {
        if (this.propEff) {
            const mc = this.propEff.getMC();
            if (mc && !mc.isPlaying) {
                mc.play(-1);
            }
        }
    }

    public stop(){
        const mc = this.propEff ? this.propEff.getMC() : null;
        if (mc && mc.isPlaying) {
            mc.stop();
        }
    }

    public set dropId(value:number) {
        if (this._dropId != value) {
            if (value) {
                this.touchEnabled = false;
                let eff = new MCEff("item_appear_effect");
                eff.addEventListener(egret.Event.COMPLETE, this.showProp, this);
                this.addChild(eff);
            } else {
                // if (this.propEff) {
                //     this.propEff.dispose();
                //     this.propEff = null;
                // }
            }
        }
        this._dropId = value;
    }

    public  get dropId(){
        return this._dropId;
    }

    private showProp(e:egret.Event=null){
        if (e && e.target){
            e.target.removeEventListener(egret.Event.COMPLETE, this.showProp, this);
        }
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        let config:FightDropConfig = Config.DropData[this._dropId];
        this.propEff = new MCEff(config.resource, false);
        this.addChild(this.propEff);
        this.addToStage(null);

    }

    private onTouchTap(){
        this.touchEnabled = false;
        this.propEff.dispose();
        this.propEff = null;
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);

        let eff = new MCEff("item_disappear_effect");
        eff.addEventListener(egret.Event.COMPLETE, this.onUseProp, this);
        this.addChild(eff);
    }

    private onUseProp(e:egret.Event){
        if (e) {
            e.target.removeEventListener(egret.Event.COMPLETE, this.onUseProp, this);
        }
        let propId = this._dropId;
        switch (propId) {
            case 1:
            case 2:
            case 3:
                EventManager.inst.dispatch("use_prop", propId);
                break;

            // 获得转生次数+1
            case 4:
                Http.inst.send(CmdID.PROP_USE, {id:propId});
                break;

            // 小财神
            case 5:
                Http.inst.send(CmdID.PROP_USE, {id:propId});
                break;

            // 大财神
            case 6:
                Http.inst.send(CmdID.PROP_USE, {id:propId});
                break;

            case 7:
                Http.inst.send(CmdID.PROP_USE, {id:propId});
                break;

            case 8:
                Http.inst.send(CmdID.PROP_USE, {id:propId});
                break;
        }
        this.dispose();
    }

    public dispose(e:egret.Event = null){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
        this._dropId = 0;
        if (this.propEff) {
            this.propEff.dispose();
            this.propEff = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}