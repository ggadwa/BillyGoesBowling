import SpriteClass from '../../rpjs/engine/sprite.js';

export default class ShurikinClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // variables
            
        this.travelX=0;
        
        this.SHURIKIN_X_SPEED=12;
        this.SHURIKIN_Y_SPEED=15;
        
            // setup
            
        this.addImage('sprites/shurikin');
        this.setCurrentImage('sprites/shurikin');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new ShurikinClass(this.game,x,y,this.data));
    }
    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // if first call, then we need to setup
            // the travel
            
        if (this.travelX===0) this.travelX=(playerSprite.x<this.x)?-this.SHURIKIN_X_SPEED:this.SHURIKIN_X_SPEED;
        
        this.x+=this.travelX;
        this.y+=this.SHURIKIN_Y_SPEED;

        if (map.checkCollision(this)) {
            if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
            this.delete();
        }
    }
}
