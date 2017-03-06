/**
 * Created by Administrator on 1/20 0020.
 */
class NetAcieveCmd extends BaseCmd
{
    public execute()
    {
        UserProxy.inst.achieveBit = this.data["achieveBit"];
        UserMethod.inst.showAward(this.data);
        TopPanel.inst.showPoint(4);
    }

}