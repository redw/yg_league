/**
 * Created by Administrator on 1/13 0013.
 */
class NetCircleCmd extends BaseCmd
{
    public execute()
    {
        super.execute();

        UserProxy.inst.gold = this.data["gold"];
        if ("diamond" in this.data)
        {
            UserProxy.inst.diamond = this.data["diamond"];
            EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        }

        UserProxy.inst.curArea = this.data["curArea"];
        UserProxy.inst.circleObj = this.data["circleObj"];
        UserProxy.inst.heroData.parse(this.data["heroList"]);
        UserProxy.inst.makeMoney = this.data["makeMoney"];
        UserProxy.inst.clearTaskCD();
        UserProxy.inst.setTask();

        PanelManager.inst.hidePanel("CirclePanel");
        PanelManager.inst.showPanel("CircleSuccessPanel",UserProxy.inst.circleObj["medal"]);
        EventManager.inst.dispatch(ContextEvent.FORCE_TO_STAGE);
        PanelManager.inst.hidePanel("MenuPanel");
        PanelManager.inst.showPanel("MenuPanel");
        TopPanel.inst.showPoint(6);
        TopPanel.inst.showPoint(9);


    }
}

class NetCircleGoBackCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        UserProxy.inst.curArea = this.data["curArea"];

        if ("diamond" in this.data)
        {
            UserProxy.inst.diamond = this.data["diamond"];
            EventManager.inst.dispatch(ContextEvent.REFRESH_BASE);
        }
        UserProxy.inst.wheelTimes = this.data["wheelTimes"];
        UserProxy.inst.circleObj["lastCircleArea"] = this.data["lastCircleArea"];
        PanelManager.inst.hidePanel("CircleGoPanel");
        EventManager.inst.dispatch(ContextEvent.FORCE_TO_STAGE);
        PanelManager.inst.showPanel("CircleGoSuccessPanel");

        TopPanel.inst.showPoint(6);
        TopPanel.inst.showPoint(9);
    }
}