/**
 * Created by fraser on 2016/11/16.
 */
var ShareUtils;
(function (ShareUtils) {
    //0、常规分享
    ShareUtils.shareType = 0;
    ShareUtils.SHARE_TIME = 5400000; // 分享间隔时长
    ShareUtils.defaultShareDescription = "";
    ShareUtils.defaultShareTitle = "";
    //
    function share() {
        if (ExternalUtil.inst.getIsHT()) {
            new ShareFKType().init();
        }
        else {
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
    ShareUtils.share = share;
})(ShareUtils || (ShareUtils = {}));
//# sourceMappingURL=ShareUtils.js.map