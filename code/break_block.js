import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';
import RockClass from './rock.js';
import ExplodeBlockClass from './explode_block.js';

export default class BreakBlockClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/break_block')
        this.setCurrentImage('sprites/break_block');
        this.setEditorImage('sprites/break_block');
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
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
        
        if ((interactSprite instanceof BallClass) || (interactSprite instanceof RockClass) || (interactSprite instanceof ExplodeBlockClass)) {
            cx=this.x+Math.trunc(this.width*0.5);
            cy=this.y-Math.trunc(this.height*0.5);
            this.game.map.addParticle(cx,cy,16,16,1.0,0.1,5,0.08,this.game.imageList.get('particles/block'),10,800);
            this.game.soundList.play('crack');
            this.delete();
        }
    }
}
