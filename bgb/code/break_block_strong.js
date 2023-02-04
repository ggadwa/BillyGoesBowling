import SpriteClass from '../../rpjs/engine/sprite.js';
import ExplodeBlockClass from './explode_block.js';
import AxeClass from './axe.js';
import MrCPUClass from './mr_cpu.js';
import EyeClass from './eye.js';

export default class BreakBlockStrongClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/break_block_strong');
        this.setCurrentImage('sprites/break_block_strong');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;     // break blocks don't fall
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new BreakBlockStrongClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        let cx,cy;
        
        if ((interactSprite instanceof ExplodeBlockClass) || (interactSprite instanceof AxeClass) || (interactSprite instanceof MrCPUClass) || (interactSprite instanceof EyeClass)) {
            cx=this.x+Math.trunc(this.width*0.5);
            cy=this.y-Math.trunc(this.height*0.5);
            this.game.map.addParticle(cx,cy,16,16,1.0,0.1,0.08,5,'particles/block',10,0.5,false,800);
            this.game.soundList.playAtSprite('crack',this,this.game.map.getSpritePlayer());
            this.delete();
        }
    }
}
