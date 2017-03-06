/**
 * Created by fraser on 2016/11/16.
 */
var ShareUtil;
(function (ShareUtil) {
    function share(bgImgRes, headImgPos, qrcodeImgPos) {
        // 调用方式
        window["AWY_SDK"].getShareQRInfo(function (data) {
            var url = window["AWY_SDK"].setURLVar(data["shareURL"], "fuid", UserProxy.inst.uid);
            RES.getResAsync(bgImgRes, function (data) {
                ShareUtil.showTopImg(bgImgRes, new egret.Bitmap(data), url, headImgPos, qrcodeImgPos);
            }, this);
        }, { "rnd": 4 });
    }
    ShareUtil.share = share;
    function getTextureByBase64(data, callback) {
        var img = new Image();
        img.src = data;
        img.onload = function () {
            var texture = new egret.Texture();
            var bitmapdata = new egret.BitmapData(img);
            texture._setBitmapData(bitmapdata);
            callback(texture);
        };
    }
    ShareUtil.getTextureByBase64 = getTextureByBase64;
    /**
     * 在网页顶层显示图片与标题（可选）
     * @param source        源显示对象
     * @param qrcodeURL     二维码地址
     * @param headImgPos    头像坐标位置
     * @param qrcodeImgPos  二维码坐标位置
     */
    var _shareTargets = new Dictionary();
    function showTopImg(bgImgRes, source, codeURL, headImgPos, codeImgPos) {
        function _addExtre() {
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
        }
        function __showTopImg() {
            var rt = new egret.RenderTexture();
            rt.drawToTexture(target, new egret.Rectangle(0, 0, target.width, target.height));
            window["AWY_SDK"].showTopImg({
                src: rt.toDataURL("image/png"),
                width: target.width,
                height: target.height,
                title: "长按保存图片进行分享",
                renew: 1
            });
            // Global.getStage().addChild(new eui.Image(rt));
        }
        var target = _shareTargets.getValue(bgImgRes);
        target.addChild(source);
        //
        window["AWY_SDK"].createQRCode(codeURL, 165, 165, function (data) {
            getTextureByBase64(data, function (p) {
                // 二维码图片
                window["AWY_SDK"].getHeadImg(function (data) {
                    getTextureByBase64(data, function (t) {
                        // 头像图片
                        var headImg = new egret.Bitmap(t);
                        headImg.x = headImgPos.x;
                        headImg.width = 73;
                        headImg.height = 73;
                        headImg.y = headImgPos.y;
                        target.addChildAt(headImg, 1);
                        //
                        _addExtre();
                        var qrcodeImg = new egret.Bitmap(p);
                        qrcodeImg.x = codeImgPos.x;
                        qrcodeImg.y = codeImgPos.y;
                        target.addChildAt(qrcodeImg, 100);
                        _shareTargets.add(bgImgRes, target);
                        __showTopImg();
                    });
                });
            });
        });
    }
    ShareUtil.showTopImg = showTopImg;
})(ShareUtil || (ShareUtil = {}));
