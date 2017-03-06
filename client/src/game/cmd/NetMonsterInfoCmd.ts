/**
 * Created by Administrator on 12/7 0007.
 */
class NetMonsterUpCmd extends BaseCmd
{
    public execute()
    {
        super.execute();
        if(this.data["allKindPiece"] || this.data["allKindPiece"] == 0)
        {
            UserProxy.inst.allKindPiece = this.data["allKindPiece"];
        }

        if(this.data["score"])
        {
            UserProxy.inst.score = this.data["score"];
        }

        for(var i in this.data["monsterList"])
        {
            UserProxy.inst.monsterList[i] = this.data["monsterList"][i];
        }
    }
}