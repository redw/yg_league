/**
 * Created by Administrator on 2017/1/14.
 */
/** 使用道具 */
class NetUsePropCmd extends BaseCmd {
    public execute() {
        super.execute();
        UserMethod.inst.showAward(this.data);
        UserProxy.inst.circleObj["nowTimes"] = this.data["nowTimes"];
        UserProxy.inst.fightData.parseDrop(this.data["itemList"]);
        EventManager.inst.dispatch(ContextEvent.PROP_USE_RES);

    }
}