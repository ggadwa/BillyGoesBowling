import SpriteClass from '../engine/sprite.js';
import BallClass from '../code/ball.js';

export default class BreakBlockClass extends SpriteClass
{
    constructor()
    {
        super();
        
        Object.seal(this);
    }
    
    initialize(game)
    {
        let imgIdx;
        
        imgIdx=this.addImage(game.loadImage('../images/break_block.png'));
        this.setCurrentImage(imgIdx);
    }
    
    getGravityFactor()
    {
        return(0.1);
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof BallClass) this.setShow(false);
    }
    
    runAI(game,timestamp)
    {
    }
}
