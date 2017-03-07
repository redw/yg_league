/**
 * Copyright (c) 2015-2018, YG Technology Inc.
 * Created by fraser on 17/1/22 下午5:27 .
 * EMAIL: fraser@11h5.com
 * Description :
 */
var ShareType = (function (_super) {
    __extends(ShareType, _super);
    function ShareType() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ShareType,p=c.prototype;
    p.init = function () {
        var self = this;
        var arr = [];
        arr.push("poster_add_png", "poster_bg_png", "poster_img_json");
        PanelManager.inst.showPanel("LoadExtraPanel", {
            resArray: arr,
            showText: "加载海报配置",
            groupName: "post",
            thisObject: self,
            callback: self.share
        });
    };
    p.share = function () {
        if (PanelManager.inst.isShow("LoadExtraPanel")) {
            PanelManager.inst.hidePanel("LoadExtraPanel");
        }
        var self = this;
        window["AWY_SDK"].getGameInfo(function (gameInfo) {
            // 调用方式
            window["AWY_SDK"].getShareQRInfo(function (data) {
                var shareURL = "http://game.11h5.com";
                if (data != null && data["shareURL"] != null) {
                    shareURL = data["shareURL"];
                }
                var qrcodeURL = window["AWY_SDK"].setURLVar(shareURL, "fuid", UserProxy.inst.uid);
                qrcodeURL = window["AWY_SDK"].setURLVar(qrcodeURL);
                self.createHeadImg(function (headImg) {
                    //头像位置
                    headImg.x = 34;
                    headImg.y = 12;
                    headImg.width = 73;
                    headImg.height = 73;
                    //
                    this.showTopImg(new egret.Bitmap(RES.getRes("poster_bg_png")), qrcodeURL, new egret.Point(309, 628), headImg);
                }, self);
            }, { "rnd": 4 });
        });
    };
    // 获得二维码数据
    p.createQRCode = function (qrcodeURL, qrcodeWidth, qrcodeHeight, cb, cbThis) {
        window["AWY_SDK"].createQRCode(qrcodeURL, qrcodeWidth, qrcodeHeight, function (data) {
            if (cb) {
                cb.call(cbThis, data);
            }
        }, this);
    };
    //获取头像
    p.createHeadImg = function (cb, cbThis) {
        var self = this;
        window["AWY_SDK"].getHeadImg(function (data) {
            self.getTextureByBase64(data, function (t) {
                // 头像图片
                var headImg = new egret.Bitmap(t);
                //
                if (cb != null) {
                    cb.call(cbThis, headImg);
                }
            }, self);
        });
    };
    p.showTopImg = function (source, qrcodeURL, qrcodeImgPos, headImg) {
        var target = new egret.DisplayObjectContainer();
        target.addChild(source);
        target.addChild(headImg);
        var self = this;
        self.showExtreAdd(target);
        //
        this.createQRCode(qrcodeURL, 165, 165, function (data) {
            //
            this.getTextureByBase64(data, function (t) {
                // 二维码图片
                var qrcodeImg = new egret.Bitmap(t);
                qrcodeImg.x = qrcodeImgPos.x;
                qrcodeImg.y = qrcodeImgPos.y;
                target.addChild(qrcodeImg);
                var rt = new egret.RenderTexture();
                rt.drawToTexture(target, new egret.Rectangle(0, 0, target.width, target.height));
                window["AWY_SDK"].showTopImg({
                    src: rt.toDataURL("image/png"),
                    width: target.width,
                    height: target.height,
                    title: "长按保存图片进行分享<br/>邀请的新玩家将会成为您的挚友",
                    renew: 1
                });
                // Global.getStage().addChild(new eui.Image(rt));
            }, this);
        }, this);
    };
    p.showExtreAdd = function (target) {
        var ids = [
            129, 130, 126, 125, 106,
            121, 117, 128, 116, 118,
            111, 105, 102, 108, 122,
            110, 101, 115, 112, 120,
            127, 119, 103, 104, 107,
            124, 113, 109, 123, 114];
        var posArr = [
            new egret.Point(50, 98), new egret.Point(145, 55), new egret.Point(332, 102), new egret.Point(295, 236), new egret.Point(240, 137),
            new egret.Point(194, 198), new egret.Point(297, 206), new egret.Point(321, 432), new egret.Point(267, 260), new egret.Point(29, 233),
            new egret.Point(304, 320), new egret.Point(121, 143), new egret.Point(94, 212), new egret.Point(158, 152), new egret.Point(56, 317),
            new egret.Point(223, 243), new egret.Point(79, 276), new egret.Point(195, 335), new egret.Point(273, 442), new egret.Point(324, 505),
            new egret.Point(306, 524), new egret.Point(34, 464), new egret.Point(137, 396), new egret.Point(75, 407), new egret.Point(85, 459),
            new egret.Point(76, 517), new egret.Point(224, 452), new egret.Point(150, 454), new egret.Point(240, 532), new egret.Point(118, 536)];
        var count = 0;
        for (var i = 0; i < 30; i++) {
            var roleImg = new egret.Bitmap();
            var id = ids[i];
            var role = UserProxy.inst.heroData.getHeroData(id);
            if (role.level) {
                count++;
                roleImg.texture = RES.getRes("poster_" + id + "_png");
            }
            roleImg.x = posArr[i].x;
            roleImg.y = posArr[i].y;
            target.addChild(roleImg);
        }
        var bgAdd = new egret.Bitmap();
        bgAdd.texture = RES.getRes("poster_add_png");
        target.addChild(bgAdd);
        var label = new eui.Label();
        label.fontFamily = "微软雅黑";
        label.bold = true;
        label.size = 35;
        label.textColor = 0xFFD257;
        label.stroke = 2;
        label.x = 229;
        label.y = 12;
        label.strokeColor = 0x49240A;
        label.text = count + "";
        target.addChild(label);
    };
    return ShareType;
}(BaseShareType));
egret.registerClass(ShareType,'ShareType');
//# sourceMappingURL=ShareType.js.map