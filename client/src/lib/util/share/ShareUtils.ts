/**
 * Created by fraser on 2016/11/16.
 */

module ShareUtils {

    //0、常规分享
    export var shareType: number = 0;
    export var SHARE_TIME: number = 5400000; // 分享间隔时长

    export var defaultShareDescription: string = "";
    export var defaultShareTitle: string = "";

    //
    export function share(/*dogId: number, type: number = 1*/): void
    {
        if(ExternalUtil.inst.getIsHT())
        {
            new ShareFKType().init();
        }
        else
        {
            new ShareType().init();
        }


        /*if (type == 1) {
            new ShareType1().share(dogId);
        }
        else if (type == 2) {
            new ShareType2().share(dogId);
        }
        else if (type == 3) {
            new ShareType3().share(dogId);
        }
        else if (type == 4) {
            new ShareType4().share();
        }
        else if (type == 5) {
            new ShareType5().share();
        }*/
    }

    /*export function showShare(val: string = null): void {
        if (val != null) {
            AWY_SDKUtil.shareDesc(val);
        }
        else if (ShareUtil.defaultShareDescription != null && ShareUtil.defaultShareDescription != "") {
            AWY_SDKUtil.shareDesc(ShareUtil.defaultShareDescription);
        }

        //
        if (ShareUtil.shareType == ShareType.DEFAULT) {
            var iii: number = VUEngine.getServerTime() - UP.inst.inviteInfo.lastShareTime;
            //
            if (iii >= ShareUtil.SHARE_TIME) {
                try {
                    if (!VUEngine.SHARE) {
                        ShareUtil.rewardShare();// 分享关闭 ，直接给奖励
                    }
                    else {
                        AWY_SDKUtil.showShare();// 邀请处理
                    }
                }
                catch (e) {
                    ShareUtil.rewardShare();
                }
            }
            else {
                Alert.show(StringUtils.addWarp("每一个半小时能领取一次分享奖励哦，所以不要频繁分享，" +
                    "会打扰到朋友圈朋友哦，请珍惜这来之不易的友谊！", 32));
            }
        } else {
            try {
                if (!VUEngine.SHARE) {// 分享关闭 ，直接给奖励
                    ShareUtil.rewardShare();
                }
                else {
                    AWY_SDKUtil.showShare();// 邀请处理
                }
            }
            catch (e) {
                ShareUtil.rewardShare();
            }
        }
    }*/

// 分享奖励
    /*export function rewardShare(): void {
        if (ShareUtil.shareType != ShareType.DEFAULT) {
            EM.inst.dispatch(CE.SHARE_COMPLETE);
        }
        else {  // 类型为0的情况需要走倒计时
            var passTime: number = VUEngine.getServerTime() - UP.inst.inviteInfo.lastShareTime;
            // 2*60*60*1000
            if (passTime >= ShareUtil.SHARE_TIME) {
                NetService.send(CMD.shareAward);
            }
            else {
                Alert.show(StringUtils.addWarp("每一个半小时能领取一次分享奖励哦，所以不要频繁分享，" +
                    "会打扰到朋友圈朋友哦，请珍惜这来之不易的友谊！", 32));
            }
            //
            try {
                eval('$(\"#share\").remove()');
            }
            catch (e) {

            }
        }
    }*/
}
