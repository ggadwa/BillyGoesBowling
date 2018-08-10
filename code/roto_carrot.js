import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';
import BombClass from './bomb.js';

export default class RotoCarrotClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.CARROT_SPEED=16;
        
        this.addImage('sprites/roto_carrot');
        this.setCurrentImage('sprites/roto_carrot');
        this.setEditorImage('sprites/roto_carrot');
        
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
        return(new RotoCarrotClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof BallClass) {
            this.delete();
        }
    }
    
    dropBomb()
    {
        let sx,sy;
        
        sx=this.x+Math.trunc(this.width*0.5);
        sy=this.y+40;

        this.game.map.addSprite(new BombClass(this.game,sx,sy,null));
    }

    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // always travel left to right
            // check for collisions to hurt player
            // but always go through objects
            
        this.x-=this.CARROT_SPEED;
        if (this.x<(-this.width)) this.x=map.rightEdge;
        
        if (map.checkCollision(this)) {
            if (this.collideSprite!==null) this.collideSprite.interactWithSprite(this,null);
        }
        
            // drop bomb are specific intervals,
            // speed needs to be divisible for this to work
            
        if ((this.x%512)===0) this.dropBomb();
    }
}
