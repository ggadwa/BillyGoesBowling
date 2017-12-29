import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';
import ExplodeBlockClass from './explodeblock.js';

export default class BreakBlockClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.setCurrentImage(this.addImage('../images/break_block.png'));
    }
    
    getGravityFactor()
    {
        return(0.2);
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if ((interactSprite instanceof BallClass) || (interactSprite instanceof ExplodeBlockClass)) {
            this.getMap().addParticle(this.getMiddleX(),this.getMiddleY(),5,0.08,'../images/particle_block.png',10,800);
            this.setShow(false);
        }
    }
}
