import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';

export default class RotoCarrotClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
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
    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // always travel left to right
            
        this.x-=10;
        if (this.x<(-this.width)) this.x=map.rightEdge;
        
            // drop bomb if near player
            
        
    }
}
