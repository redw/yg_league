/**
 * Created by Administrator on 12/19 0019.
 */
class NetMailCmd extends BaseCmd
{
    public execute()
    {
        UserMethod.inst.showAward(this.data);
        for(var i in this.data["thisMail"])
        {
            UserProxy.inst.mail[i] = this.data["thisMail"][i];
        }
    }

}

