/**
 * 奖励
 * @author j
 * 2016/1/22
 */
class BonusPanel extends BasePanel
{
    public imgLight: eui.Image;
    public awardName: eui.Label;
    public groupIcon: eui.Group;
    public imgIcon: AutoBitmap;

    public awardId: number;
    public cnt: number;

    public callback: Function;
    public thisObject: Object;

    public time: number = 3;
    public isClose: boolean = false;
    public heroId:number;

    public constructor()
    {
        super();

        this._modal = true;
        this._layer = PanelManager.TOP_LAYER;

        this.skinName = BounsPanelSkin;
        this.horizontalCenter = 0;
        this.verticalCenter = 0;
    }

    public initData(): void
    {
        this.awardId = this.data["awardId"];
        this.cnt = this.data["cnt"];
        this.heroId =this.data["hero"];
        this.callback = this.data["callback"];
        this.thisObject = this.data["thisObject"];

        var heroData:HeroVO;
        if(this.heroId)
        {
            heroData = UserProxy.inst.heroData.getHeroData(this.heroId);
        }
        var rewardData:RewardData = UserMethod.inst.rewardJs[this.awardId];

        if(this.awardId == BonusType.COIN_TIME)
        {
            this.imgIcon.source = rewardData.icon;
            this.awardName.text = rewardData.name + "x" +  MathUtil.easyNumber(this.cnt) + "小时";
        }
        else if(this.awardId == BonusType.HERO)
        {
            this.imgIcon.source = Global.getChaIcon(this.heroId);
            this.awardName.text = heroData.config.name;
        }
        else if(this.awardId == BonusType.HERO_CHIP)
        {
            this.imgIcon.source = Global.getChaChipIcon(this.heroId);

            this.awardName.text = heroData.config.name + "元神x" +  MathUtil.easyNumber(this.cnt);
        }
        else if(this.awardId == BonusType.WORD )
        {
            this.awardName.visible = false;
            this.imgIcon.source = "piece_" + this.cnt + "_png";
        }

        else
        {
            this.imgIcon.source = rewardData.icon;
            this.awardName.text = rewardData.name + "x" + MathUtil.easyNumber(this.cnt);
        }

        this.tweenLight(360);

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        TickerUtil.register(this.onTouch, this, 700);
    }

    public destory(): void
    {
        egret.Tween.removeTweens(this.imgLight);
        egret.Tween.removeTweens(this.groupIcon);

        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        TickerUtil.unregister(this.onInterval, this);
    }

    private onTouch(e: egret.TouchEvent): void
    {
        if (this.isClose)
        {
            return;
        }

        this.isClose = true;
        this.awardName.visible = false;

        egret.Tween.get(this.groupIcon).to({scaleX: 1.5, scaleY: 1.5}, 350, egret.Ease.elasticOut).call(function (): void
        {
            this.imgLight.visible = false;
            egret.Tween.removeTweens(this.imgLight);

            switch (this.awardId)
            {
                case BonusType.COIN :

                    egret.Tween.get(this.groupIcon).to({x: 340, y: 480, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);

                    break;

                case BonusType.GOLD:

                    egret.Tween.get(this.groupIcon).to({x: 64, y: 480, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);

                    break;
                case BonusType.JADE:
                    egret.Tween.get(this.groupIcon).to({x: 205, y: 480, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case BonusType.HERO:
                    this.hidePanel();
                    PanelManager.inst.showPanel("RoleDrawInfoPanel",{id:this.heroId,from:0});
                    MenuPanel.inst.checkDraw();
                    break;
                case BonusType.HERO_CHIP:
                case BonusType.HERO_DRAW:
                case BonusType.STAR_PILL:
                case BonusType.CIRCLE_TIMES:
                    egret.Tween.get(this.groupIcon).to({x: 126, y: 750, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case BonusType.WEAPON:
                case BonusType.METAL:
                case BonusType.WOOD:
                case BonusType.WATER:
                case BonusType.FIRE:
                case BonusType.SOIL:
                case BonusType.WEAPON_BOX:
                    egret.Tween.get(this.groupIcon).to({x: 280, y: 750, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case BonusType.WEAPON_FB:
                    egret.Tween.get(this.groupIcon).to({x: 203, y: 750, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case BonusType.PVP_COIN:
                    egret.Tween.get(this.groupIcon).to({x: 357, y: 750, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case  BonusType.WORD:
                    egret.Tween.get(this.groupIcon).to({x: 370, y: 120, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case BonusType.SOUL_1:
                    egret.Tween.get(this.groupIcon).to({x: 95, y: 130, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case BonusType.SOUL_2:
                    egret.Tween.get(this.groupIcon).to({x: 185, y: 130, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case BonusType.SOUL_3:
                    egret.Tween.get(this.groupIcon).to({x: 270, y: 130, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case BonusType.SOUL_4:
                    egret.Tween.get(this.groupIcon).to({x: 355, y: 130, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                case BonusType.ORE:
                    egret.Tween.get(this.groupIcon).to({x: 10, y: 10, alpha: 0.4,scaleX: 1, scaleY: 1}, 350).call(function (): void
                    {
                        this.hidePanel();

                    }, this);
                    break;
                    break;
            }

        }, this);
    }

    private onInterval(e: egret.Event): void
    {
        this.time = this.time - 1;

        if (this.time <= 0)
        {
            this.onTouch(null);
        }
    }

    private tweenLight(value: number): void
    {
        egret.Tween.get(this.imgLight).to({rotation: value}, 10000).call(function (): void
        {
            this.tweenLight(value);

        }, this);
    }

    private hidePanel(): void
    {
        PanelManager.inst.hidePanel("BonusPanel");

        if (this.callback != null)
        {
            this.callback.call(this.thisObject);
        }
    }
}