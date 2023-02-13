import SpriteClass from '../../rpjs/engine/sprite.js';

export default class PlatformClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // constants
            
        this.PLATFORM_SPEED=10;
        this.PLATFORM_PAUSE_TICK=10;
        
            // variables
            
        this.xAdd=this.PLATFORM_SPEED;
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
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new PlatformClass(this.game,x,y,this.data));
    }
    
    run()
    {
        let playerSprite=this.getPlayerSprite();
        
            // are we paused?
            
        if (this.pauseCount>0) {
            this.pauseCount--;
            return;
        }
        
            // move platform
            
        this.x+=this.xAdd;
        
        if (this.checkCollision(this)) {
            this.xAdd=-this.xAdd;
            this.x+=this.xAdd;
            this.pauseCount=this.PLATFORM_PAUSE_TICK;
            return;
        }
        
            // move player if standing
            // on it
            
        if (playerSprite.standSprite===this) {
            playerSprite.moveWithCollision(this.xAdd,0);
        }
    }
}
