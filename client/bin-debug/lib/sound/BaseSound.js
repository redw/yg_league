/**
 * 声音
 * @author j
 * 2016/11/21
 */
var BaseSound = (function (_super) {
    __extends(BaseSound, _super);
    function BaseSound(path, type) {
        var _this = this;
        _super.call(this);
        this.playTime = 0;
        this.isStop = true;
        this.path = path;
        this.type = type;
        if (this.type == egret.Sound.MUSIC) {
            this.playTime = 0;
        }
        else if (this.type == egret.Sound.EFFECT) {
            this.playTime = 1;
        }
        if (RES.hasRes(path)) {
            RES.getResAsync(path, function (res) {
                _this.sound = res;
                _this.playExec();
            }, this);
        }
        else {
            RES.getResByUrl(path, function (res) {
                _this.sound = res;
                _this.playExec();
            }, this, RES.ResourceItem.TYPE_SOUND);
        }
    }
    var d = __define,c=BaseSound,p=c.prototype;
    p.play = function (playTime) {
        if (playTime != null) {
            this.playTime = playTime;
        }
        this.isStop = false;
        if (this.soundChannel) {
            if (this.type == egret.Sound.MUSIC) {
                this.volumeDown(this.soundChannel);
                this.soundChannel = null;
            }
            else if (this.type == egret.Sound.EFFECT) {
                this.soundChannel.stop();
                this.soundChannel = null;
            }
        }
        this.playExec();
    };
    p.stop = function () {
        this.isStop = true;
        if (this.soundChannel) {
            if (this.type == egret.Sound.MUSIC) {
                this.volumeDown(this.soundChannel);
                this.soundChannel = null;
            }
            else if (this.type == egret.Sound.EFFECT) {
                this.soundChannel.stop();
                this.soundChannel = null;
            }
        }
    };
    p.playExec = function () {
        if (this.isStop) {
            return;
        }
        if (this.sound) {
            this.sound.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSoundIOError, this);
            if (this.type == egret.Sound.MUSIC) {
                this.soundChannel = this.sound.play(0, this.playTime);
                this.volumeUp(this.soundChannel);
            }
            else if (this.type == egret.Sound.EFFECT) {
                this.soundChannel = this.sound.play(0, this.playTime);
            }
        }
    };
    p.onSoundIOError = function (e) {
        this.sound.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSoundIOError, this);
        console.log("声音解码错误");
    };
    p.volumeUp = function (channel) {
        var canChangeVolume = true;
        if ("isStopped" in channel) {
            canChangeVolume = !channel["isStopped"];
        }
        if (canChangeVolume) {
            channel.volume = 1;
        }
    };
    p.volumeDown = function (channel) {
        var canChangeVolume = true;
        if ("isStopped" in channel) {
            canChangeVolume = !channel["isStopped"];
        }
        if (canChangeVolume) {
            channel.volume = 0;
            channel.stop();
        }
    };
    return BaseSound;
}(egret.EventDispatcher));
egret.registerClass(BaseSound,'BaseSound');
//# sourceMappingURL=BaseSound.js.map