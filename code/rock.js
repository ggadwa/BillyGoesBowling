import SpriteClass from '../engine/sprite.js';

export default class RockClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // variables
            
        this.travelX=0;
        
            // setup
            
        this.addImage('sprites/rock');
        this.setCurrentImage('sprites/rock');
        
        this.show=true;
        this.gravityFactor=0.1;
        this.gravityMinValue=0.1;
        this.gravityMaxValue=5;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new RockClass(this.game,x,y,this.data));
    }
    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // if first call, then we need to setup
            // the travel
            
        if (this.travelX===0) this.travelX=(playerSprite.x<this.x)?-10:10;
        
        this.x+=this.travelX;

        if (map.checkCollision(this)) {
            if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
            this.delete();
        }
        
            // any grounding stops travel
            
        if (this.grounded) {
            if (this.standSprite!=null) this.standSprite.interactWithSprite(this,null);
            this.delete();
        }
    }
}
