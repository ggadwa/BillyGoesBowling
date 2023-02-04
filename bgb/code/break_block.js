import SpriteClass from '../../rpjs/engine/sprite.js';
import BallClass from './ball.js';
import FishClass from './fish.js';
import ExplodeBlockClass from './explode_block.js';
import KingGhastlyClass from './king_ghastly.js';

export default class BreakBlockClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/break_block')
        this.setCurrentImage('sprites/break_block');
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=4;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new BreakBlockClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        let cx,cy;
        
        if ((interactSprite instanceof BallClass) || (interactSprite instanceof FishClass) || (interactSprite instanceof ExplodeBlockClass) || (interactSprite instanceof KingGhastlyClass)) {
            cx=this.x+Math.trunc(this.width*0.5);
            cy=this.y-Math.trunc(this.height*0.5);
            this.game.map.addParticle(cx,cy,16,16,1.0,0.1,5,0.08,'particles/block',10,0.5,false,800);
            this.game.soundList.playAtSprite('crack',this,this.game.map.getSpritePlayer());
            this.delete();
        }
    }
}
