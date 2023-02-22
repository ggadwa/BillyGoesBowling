import SpriteClass from '../../rpjs/engine/sprite.js';

export default class PlatformClass extends SpriteClass
{
    static PLATFORM_SPEED=10;
    static PLATFORM_PAUSE_TICK=10; 

    constructor(game,x,y,data)
    {
        super(game,x,y,data);
            
        this.xAdd=PlatformClass.PLATFORM_SPEED;
        this.pauseCount=0;
        
            // setup
            
        this.addImage('sprites/platform');
        this.setCurrentImage('sprites/platform');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new PlatformClass(this.game,x,y,this.data));
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
            // are we paused?
            
        if (this.pauseCount>0) {
            this.pauseCount--;
            return;
        }
        
            // move platform
            
        this.x+=this.xAdd;
        
        if (this.checkCollision()) {
            this.xAdd=-this.xAdd;
            this.x+=this.xAdd;
            this.pauseCount=PlatformClass.PLATFORM_PAUSE_TICK;
            return;
        }
        
            // move player if standing
            // on it
            
        if (playerSprite.standSprite===this) {
            playerSprite.moveWithCollision(this.xAdd,0);
        }
    }
}
