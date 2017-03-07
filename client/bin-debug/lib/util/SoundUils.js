/**
 *
 * @author
 *
 */
var SoundUtils;
(function (SoundUtils) {
    var _sound;
    var _soundChannel;
    function startLoad() {
        //创建 URLLoader 对象
        var loader = new egret.URLLoader();
        //设置加载方式为声音
        loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        //添加加载完成侦听
        loader.addEventListener(egret.Event.COMPLETE, function (event) {
            loader.removeEventListener(egret.Event.COMPLETE, arguments.callee, this);
            _sound = event.currentTarget.data;
        }, this);
        var url = "resource/audio/music.mp3";
        var request = new egret.URLRequest(url);
        //开始加载
        loader.load(request);
    }
    SoundUtils.startLoad = startLoad;
    function setSwitch(open) {
        if (open) {
            _soundChannel = _sound.play(0, -1);
        }
        else {
            if (_soundChannel) {
                _soundChannel.stop();
                _soundChannel = null;
            }
        }
    }
    SoundUtils.setSwitch = setSwitch;
})(SoundUtils || (SoundUtils = {}));
//# sourceMappingURL=SoundUils.js.map