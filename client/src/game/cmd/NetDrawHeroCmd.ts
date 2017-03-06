/**
 * Created by Administrator on 12/16 0016.
 */
class NetDrawHeroCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.drawTimes = this.data["drawObj"]["drawTimes"];
        UserProxy.inst.lastFreeTime = this.data["drawObj"]["lastFreeTime"];
        UserProxy.inst.ticket = this.data["drawObj"]["ticket"];
        UserProxy.inst.diamond = this.data["diamond"];
        EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
    }
}