/**
 * 外部工具
 * @author j
 * 2016/2/19
 */
class ExternalUtil extends egret.HashObject
{
    private static _instance:ExternalUtil;

    static get inst():ExternalUtil
    {
        if (ExternalUtil._instance == null)
        {
            ExternalUtil._instance = new ExternalUtil();
        }
        return ExternalUtil._instance;
    }

    public refresh():void
    {
        window.location.reload();
    }

    public copyUID():void
    {
        prompt("复制用户ID", UserProxy.inst.uid + "");
    }

    public joinChatRoom():void
    {
        window["AWY_SDK"].joinChatRoom();
    }

    public getToken():string
    {
        return window["AWY_SDK"].token;
    }

    public getVersion():string
    {
        try
        {
            return window["game_version"];
        }
        catch (e)
        {
            return "1";
        }
    }

    public getPlatform():string
    {
        try
        {
            return window["platform"];
        }
        catch (e)
        {
            return "vutimes";
        }
    }

    public getIsYYB():boolean
    {
        return window["AWY_SDK"].getURLVar("channel") == "yyb";
    }

    public getIsHT():boolean
    {
        return window["AWY_SDK"].getURLVar("channel") == "hortor";
    }

    public getIsHtForce():boolean
    {
        return window["AWY_SDK"].getURLVar("isSubscribe") == "true";
    }

    public weixinInit():void
    {
        window["AWY_SDK"].config(Global.GAME_ID, function()
        {
            if(UserMethod.inst.shareHeroId)
            {
                ExternalUtil.inst.shareHero();
            }
            else
            {
                ExternalUtil.inst.shareCheck();
            }

        }, function()
        {
            ExternalUtil.inst.sendPayCmd();
        });
    }

    public shareCheck():void
    {
        if (UserProxy.inst.shareObj["dayShareCount"] < 3)
        {
            var leftTime:number = parseInt(Config.BaseData[36]["value"])*60 - (UserProxy.inst.server_time - UserProxy.inst.shareObj["lastShareTime"]);
            if (leftTime <= 0)
            {
                Http.inst.send(CmdID.GET_SHARE_PRIZE);
            }
            else
            {
                var time:string = TimeUtil.timeToString(leftTime,true);
                Alert.show(StringUtil.addWarp("分享频率太快啦\n距离下次分享领奖还有\n" + time, 32));
            }
        }
    }

    public shareHero():void
    {
        Http.inst.send(CmdID.SHARE_HERO_PRICE,{id:UserMethod.inst.shareHeroId});
        UserMethod.inst.shareHeroId = 0;
    }

    public hortorInit():void
    {
        window["AWY_SDK"].hortorInit(Global.GAME_ID,"ygxz" ,function()
        {
            ExternalUtil.inst.shareCheck();

        }, function()
        {
            ExternalUtil.inst.sendPayCmd();
        });
    }

    public getServerInfo(callBack:Function, callBackThisObj:any):void
    {
        window["AWY_SDK"].getServerURL(function(serverURL:string)
        {
            Global.SERVER_ADDR = serverURL;

            if (Global.SERVER_ADDR)
            {
                if (callBack != null)
                {
                    callBack.call(callBackThisObj);
                }
            }
            else
            {
                alert("获取服务器信息失败，请重新登陆！");
            }
        });
    }

    public logout():void
    {
        if(this.getIsHT())
        {
            window["AWY_SDK"].hortorLogout();
        }
        else
        {
            window["AWY_SDK"].logout();
        }
    }

    public showFocus():void
    {
        if(this.getIsHT())
        {
            window["AWY_SDK"].hortorFocus();
        }
        else
        {
            window["AWY_SDK"].focus();
        }

    }

    public showInvite():void
    {
        window["AWY_SDK"].share();
    }

    public showFriend():void
    {
        window["AWY_SDK"].showFriend();
    }

    /**
     * 充值
     */
    public pay(pid:number):void
    {
        if (Global.PAY_ENABLED)
        {
            if(this.getIsHT())
            {
                var htPid:number = this.checkHTPid(pid);
                window["AWY_SDK"].hortorPay({product_id: htPid,uid:UserProxy.inst.uid,gameid:Global.GAME_ID});
            }
            else if(ExternalUtil.inst.getIsYYB())
            {
                var yybPid:number = this.checkYYBPid(pid);
                window["AWY_SDK"].pay({pid:yybPid});
            }
            else
            {
                window["AWY_SDK"].pay({pid: pid});
            }

        }
        else
        {
            Alert.show("充值系统暂未开放！");
        }
    }

    public goldAlert():void
    {
        Notice.show("铜币不够！");
    }

    public diamondAlert():void
    {
        Notice.show("元宝不够！");
    }

    public sendPayCmd():void
    {
        Http.inst.send(CmdID.RMB_GET);
    }

    public checkYYBPid(pid:number):number
    {
        var yybId:number = 0;
        switch (pid)
        {
            case PidType.PID_2:yybId = 8946;break;
            case PidType.PID_6:yybId = 8947; break;
            case PidType.PID_30:yybId = 8948; break;
            case PidType.PID_50:yybId = 8949; break;
            case PidType.PID_98:yybId = 8950; break;
            case PidType.PID_198:yybId = 8951; break;
            case PidType.PID_648:yybId = 8952; break;
            case PidType.PID_MONTH:yybId = 8953; break;
            case PidType.PID_FOREVER:yybId = 8954; break;
            case PidType.PID_FUND:yybId = 8955; break;
        }
        return yybId;
    }

    public checkHTPid(pid:number):number
    {
        var htId:number = 0;
        switch (pid)
        {
            case PidType.PID_2:htId = 8982;break;
            case PidType.PID_6:htId = 8983; break;
            case PidType.PID_30:htId = 8984; break;
            case PidType.PID_50:htId = 8985; break;
            case PidType.PID_98:htId = 8986; break;
            case PidType.PID_198:htId = 8987; break;
            case PidType.PID_648:htId = 8988; break;
            case PidType.PID_MONTH:htId = 8989; break;
            case PidType.PID_FOREVER:htId = 8990; break;
            case PidType.PID_FUND:htId = 8991; break;
        }
        return htId;
    }


}