import SpriteClass from '../engine/sprite.js';
import ExplodeBlockClass from './explodeblock.js';

export default class BreakBlockStrongClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        Object.seal(this);
    }
    
    initialize()
    {
        let imgIdx;
        
        imgIdx=this.addImage('../images/break_block_strong.png');
        this.setCurrentImage(imgIdx);
    }
    
    getGravityFactor()
    {
        return(0.2);
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof ExplodeBlockClass) {
            this.getMap().addParticle(this.getMiddleX(),this.getMiddleY(),5,0.08,'../images/particle_block.png',10,800);
            this.setShow(false);
        }
    }
}
