import SpriteClass from '../engine/sprite.js';

export default class PlatformClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.xAdd=0;
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.setCurrentImage(this.addImage('platform'));
        
        this.xAdd=10;
        
        this.show=true;
        this.gravityFactor=0.0;
        this.canCollide=true;
        this.canStandOn=true;
    }
    
    runAI()
    {
        let game=this.getGame();
        let map=game.getMap();
        let playerSprite=map.getSpritePlayer();
        
            // move platform
            
        this.move(this.xAdd,0);
        
        if (map.checkCollision(this)) {
            this.xAdd=-this.xAdd;
            this.move(this.xAdd,0);
            return;
        }
        
            // move player if standing
            // on it
            
        if (playerSprite.standSprite===this) {
            playerSprite.moveWithCollision(this.xAdd,0);
        }
    }
}
