// /**
// * BASE64转Texture
// * @param data
// * @param callback
// */
//public getTextureByBase64(data:string, callback):void
//{
//	var img:HTMLImageElement = new Image();
//	img.src = data;
//	img.onload = function()
//	{
//		var texture = new egret.Texture();
//		var bitmapdata = new egret.BitmapData(img);
//		texture._setBitmapData(bitmapdata);
//		callback(texture);
//	}
//}
//
//
// /**
// * 在网页顶层显示图片与标题（可选）
// * @param source        源显示对象
// * @param qrcodeURL     二维码地址
// * @param headImgPos    头像坐标位置
// * @param qrcodeImgPos  二维码坐标位置
// */
//private _shareTarget:egret.DisplayObjectContainer;
//public showTopImg(source:egret.DisplayObject, qrcodeURL:string, headImgPos:egret.Point, qrcodeImgPos:egret.Point):void
//{
//	function __showTopImg()
//	{
//		var rt:egret.RenderTexture = new egret.RenderTexture();
//		rt.drawToTexture(ExternalController.inst._shareTarget, new egret.Rectangle(0, 0, ExternalController.inst._shareTarget.width, ExternalController.inst._shareTarget.height));
//		window["AWY_SDK"].showTopImg({
//			src: rt.toDataURL("image/png"),
//			width: ExternalController.inst._shareTarget.width,
//			height: ExternalController.inst._shareTarget.height,
//			title: "长按保存图片进行分享"
//		});
//	}
//
//	if (ExternalController.inst._shareTarget)
//	{
//		__showTopImg();
//	}
//	else
//	{
//		var target:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
//		target.addChild(source);
//		window["AWY_SDK"].createQRCode(qrcodeURL, 96, 96, function(data)
//		{
//			ExternalController.inst.getTextureByBase64(data, function(t)
//			{
//				var qrcodeImg:egret.Bitmap = new egret.Bitmap(t);
//				qrcodeImg.x = qrcodeImgPos.x;
//				qrcodeImg.y = qrcodeImgPos.y;
//				target.addChild(qrcodeImg);
//				window["AWY_SDK"].getHeadImg(function(data)
//				{
//					ExternalController.inst.getTextureByBase64(data, function(t)
//					{
//						var headImg:egret.Bitmap = new egret.Bitmap(t);
//						headImg.x = headImgPos.x;
//						headImg.y = headImgPos.y;
//						target.addChild(headImg);
//						ExternalController.inst._shareTarget = target;
//						__showTopImg();
//					});
//				});
//			})
//		});
//	}
//}
//
//// 调用方式
//window["AWY_SDK"].getGameInfo(function(data)
//{
//	// 获取游戏入口地址并加上fuid
//	var url:String = window["AWY_SDK"].setURLVar(data["entry_url"], "fuid", UserProxy.inst.uid);
//	var bg:egret.Bitmap = new egret.Bitmap(RES.getRes("bg_login_png"));
//	ExternalController.inst.showTopImg(bg, url, new egret.Point(64, 64), new egret.Point(210, 400));
//});