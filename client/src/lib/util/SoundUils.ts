/**
 *
 * @author 
 *
 */
module SoundUtils
{
    var _sound:egret.Sound;
    var _soundChannel:egret.SoundChannel;
    
    export function startLoad(): void 
    {
        //创建 URLLoader 对象
        var loader: egret.URLLoader = new egret.URLLoader();
        //设置加载方式为声音
        loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        //添加加载完成侦听
        loader.addEventListener(egret.Event.COMPLETE,function(event: egret.Event): void {
            loader.removeEventListener(egret.Event.COMPLETE,arguments.callee,this);
            _sound = event.currentTarget.data;
        },this);
        
        var url: string = "resource/audio/music.mp3";
        var request: egret.URLRequest = new egret.URLRequest(url);
        //开始加载
        loader.load(request);

    }
    
    export function setSwitch(open: boolean):void
    {
        if(open)
        {
            _soundChannel = _sound.play(0,-1);
        }
        else
        {
            if(_soundChannel)
            {
                _soundChannel.stop();
                _soundChannel = null;
                
            }
            
        }
    }
    
}
