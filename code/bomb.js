import SpriteClass from '../engine/sprite.js';

export default class BombClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // constants
            
        this.BOMB_SPEED=5;
        
            // setup
            
        this.addImage('sprites/bomb');
        this.setCurrentImage('sprites/bomb');
        
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
        return(new BonbClass(this.game,x,y,this.data));
    }
    
    runAI()
    {
        let map=this.game.map;
        let cx,cy;
        
        this.y+=this.BOMB_SPEED;

        if (map.checkCollision(this)) {
            if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
            
            cx=this.x+Math.trunc(this.width*0.5);
            cy=this.y+Math.trunc(this.height*0.5);
            this.game.map.addParticle(cx,cy,32,120,0.5,0.1,0,0,this.game.imageList.get('sprites/particle_explode_block'),1,500);
            
            this.delete();
        }
    }
}
