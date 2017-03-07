/**
 * Created by Administrator on 12/7 0007.
 */
var NetMonsterUpCmd = (function (_super) {
    __extends(NetMonsterUpCmd, _super);
    function NetMonsterUpCmd() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetMonsterUpCmd,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        if (this.data["allKindPiece"] || this.data["allKindPiece"] == 0) {
            UserProxy.inst.allKindPiece = this.data["allKindPiece"];
        }
        if (this.data["score"]) {
            UserProxy.inst.score = this.data["score"];
        }
        for (var i in this.data["monsterList"]) {
            UserProxy.inst.monsterList[i] = this.data["monsterList"][i];
        }
    };
    return NetMonsterUpCmd;
}(BaseCmd));
egret.registerClass(NetMonsterUpCmd,'NetMonsterUpCmd');
//# sourceMappingURL=NetMonsterInfoCmd.js.map