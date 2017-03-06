/**
 * 协议基类
 * @author j
 * 2016/2/22
 */
class BaseCmd extends egret.HashObject
{
    public data:any;

    public constructor(data?:any)
    {
        super();
        this.data = data;
    }

    public execute():void
    {
        if(this.data["achievementObj"])
        {
            UserProxy.inst.achievementObj = this.data["achievementObj"];
            TopPanel.inst.showPoint(4);
        }
        if(this.data["taskObj"])
        {
            UserProxy.inst.taskObj = this.data["taskObj"];
            TopPanel.inst.showPoint(4);
        }
    }
}