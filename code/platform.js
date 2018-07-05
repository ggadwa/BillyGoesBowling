import EntityClass from '../engine/entity.js';

export default class PlatformClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // variables
            
        this.xAdd=10;
        
            // setup
            
        this.addImage('platform');
        this.setCurrentImage('platform');
        this.setEditorImage('platform');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
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
