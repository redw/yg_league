class BaseTicker extends egret.DisplayObjectContainer {


    /**
     * @param interval      触发间隔
     * @param refreshRate   刷新频率
     * */
    public constructor(interval:number = 1000, refreshRate:number = 50) {
        super();
        this._interval = interval;
    }

    public updateInterval(value:number):void{
        this._interval = value ;
    }

    protected _status:boolean;
    protected _interval:number = 1000;
    protected _refreshRate:number = 50;
    
    private _tag1:number = 0;
    private _tag2:number = 0;
    //
    private _idddd:number = -1;

    public start():void 
    {
        if (!this._status) 
        {
            this.stop() ;
            //
            this._status = true;
            this._passTime = 0 ;
            this._tag1 = egret.getTimer();
            this._idddd = egret.setTimeout(this.onTicker, this, this._refreshRate);
        }
    }

    public stop():void 
    {
        this._status = false;
        //
        if(this._idddd != -1)
        {
            egret.clearTimeout(this._idddd) ;
            this._idddd = -1 ;
        }
    }

    private _passTime:number = 0;

    private onTicker():void 
    {
        if (this._status) 
        {
            this._idddd = egret.setTimeout(this.onTicker, this, this._refreshRate);
            //
            
            this._tag2 = egret.getTimer();
            this._passTime += this._refreshRate;
            if (this._passTime >= this._interval) 
            { // 到达触发点
                this._passTime -= this._interval;
                
                var range: number = this._tag2 - this._tag1 - this._interval;
                this._tag1 = egret.getTimer();
                this.onTimer(range);
            }
        }
    }
    

    public onTimer(range?:number):void 
    {
        //
    }
    
    get passTime():number
    {
        return this._passTime;
    }
    

}