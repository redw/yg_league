/**
 * 外部工具
 * @author j
 * 2016/2/19
 */
var ExternalUtil = (function (_super) {
    __extends(ExternalUtil, _super);
    function ExternalUtil() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ExternalUtil,p=c.prototype;
    d(ExternalUtil, "inst"
        ,function () {
            if (ExternalUtil._instance == null) {
                ExternalUtil._instance = new ExternalUtil();
            }
            return ExternalUtil._instance;
        }
    );
    p.refresh = function () {
        window.location.reload();
    };
    p.copyUID = function () {
        prompt("复制用户ID", UserProxy.inst.uid + "");
    };
    p.joinChatRoom = function () {
        window["AWY_SDK"].joinChatRoom();
    };
    p.getToken = function () {
        return window["AWY_SDK"].token;
    };
    p.getVersion = function () {
        try {
            return window["game_version"];
        }
        catch (e) {
            return "1";
        }
    };
    p.getPlatform = function () {
        try {
            return window["platform"];
        }
        catch (e) {
            return "vutimes";
        }
    };
    p.getIsYYB = function () {
        return window["AWY_SDK"].getURLVar("channel") == "yyb";
    };
    p.getIsHT = function () {
        return window["AWY_SDK"].getURLVar("channel") == "hortor";
    };
    p.getIsHtForce = function () {
        return window["AWY_SDK"].getURLVar("isSubscribe") == "true";
    };
    p.weixinInit = function () {
        window["AWY_SDK"].config(Global.GAME_ID, function () {
            if (UserMethod.inst.shareHeroId) {
                ExternalUtil.inst.shareHero();
            }
            else {
                ExternalUtil.inst.shareCheck();
            }
        }, function () {
            ExternalUtil.inst.sendPayCmd();
        });
    };
    p.shareCheck = function () {
        if (UserProxy.inst.shareObj["dayShareCount"] < 3) {
            var leftTime = parseInt(Config.BaseData[36]["value"]) * 60 - (UserProxy.inst.server_time - UserProxy.inst.shareObj["lastShareTime"]);
            if (leftTime <= 0) {
                Http.inst.send(CmdID.GET_SHARE_PRIZE);
            }
            else {
                var time = TimeUtil.timeToString(leftTime, true);
                Alert.show(StringUtil.addWarp("分享频率太快啦\n距离下次分享领奖还有\n" + time, 32));
            }
        }
    };
    p.shareHero = function () {
        Http.inst.send(CmdID.SHARE_HERO_PRICE, { id: UserMethod.inst.shareHeroId });
        UserMethod.inst.shareHeroId = 0;
    };
    p.hortorInit = function () {
        window["AWY_SDK"].hortorInit(Global.GAME_ID, "ygxz", function () {
            ExternalUtil.inst.shareCheck();
        }, function () {
            ExternalUtil.inst.sendPayCmd();
        });
    };
    p.getServerInfo = function (callBack, callBackThisObj) {
        window["AWY_SDK"].getServerURL(function (serverURL) {
            Global.SERVER_ADDR = serverURL;
            if (Global.SERVER_ADDR) {
                if (callBack != null) {
                    callBack.call(callBackThisObj);
                }
            }
            else {
                alert("获取服务器信息失败，请重新登陆！");
            }
        });
    };
    p.logout = function () {
        if (this.getIsHT()) {
            window["AWY_SDK"].hortorLogout();
        }
        else {
            window["AWY_SDK"].logout();
        }
    };
    p.showFocus = function () {
        if (this.getIsHT()) {
            window["AWY_SDK"].hortorFocus();
        }
        else {
            window["AWY_SDK"].focus();
        }
    };
    p.showInvite = function () {
        window["AWY_SDK"].share();
    };
    p.showFriend = function () {
        window["AWY_SDK"].showFriend();
    };
    /**
     * 充值
     */
    p.pay = function (pid) {
        if (Global.PAY_ENABLED) {
            if (this.getIsHT()) {
                var htPid = this.checkHTPid(pid);
                window["AWY_SDK"].hortorPay({ product_id: htPid, uid: UserProxy.inst.uid, gameid: Global.GAME_ID });
            }
            else if (ExternalUtil.inst.getIsYYB()) {
                var yybPid = this.checkYYBPid(pid);
                window["AWY_SDK"].pay({ pid: yybPid });
            }
            else {
                window["AWY_SDK"].pay({ pid: pid });
            }
        }
        else {
            Alert.show("充值系统暂未开放！");
        }
    };
    p.goldAlert = function () {
        Notice.show("铜币不够！");
    };
    p.diamondAlert = function () {
        Notice.show("元宝不够！");
    };
    p.sendPayCmd = function () {
        Http.inst.send(CmdID.RMB_GET);
    };
    p.checkYYBPid = function (pid) {
        var yybId = 0;
        switch (pid) {
            case PidType.PID_2:
                yybId = 8946;
                break;
            case PidType.PID_6:
                yybId = 8947;
                break;
            case PidType.PID_30:
                yybId = 8948;
                break;
            case PidType.PID_50:
                yybId = 8949;
                break;
            case PidType.PID_98:
                yybId = 8950;
                break;
            case PidType.PID_198:
                yybId = 8951;
                break;
            case PidType.PID_648:
                yybId = 8952;
                break;
            case PidType.PID_MONTH:
                yybId = 8953;
                break;
            case PidType.PID_FOREVER:
                yybId = 8954;
                break;
            case PidType.PID_FUND:
                yybId = 8955;
                break;
        }
        return yybId;
    };
    p.checkHTPid = function (pid) {
        var htId = 0;
        switch (pid) {
            case PidType.PID_2:
                htId = 8982;
                break;
            case PidType.PID_6:
                htId = 8983;
                break;
            case PidType.PID_30:
                htId = 8984;
                break;
            case PidType.PID_50:
                htId = 8985;
                break;
            case PidType.PID_98:
                htId = 8986;
                break;
            case PidType.PID_198:
                htId = 8987;
                break;
            case PidType.PID_648:
                htId = 8988;
                break;
            case PidType.PID_MONTH:
                htId = 8989;
                break;
            case PidType.PID_FOREVER:
                htId = 8990;
                break;
            case PidType.PID_FUND:
                htId = 8991;
                break;
        }
        return htId;
    };
    return ExternalUtil;
}(egret.HashObject));
egret.registerClass(ExternalUtil,'ExternalUtil');
