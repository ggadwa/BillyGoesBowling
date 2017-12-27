import ControllerClass from '../engine/controller.js';
import BallClass from '../code/ball.js';

export default class BreakBlockClass extends ControllerClass
{
    constructor()
    {
        super();
        
        Object.seal(this);
    }
    
    initialize(game,sprite)
    {
        let imgIdx;
        
        imgIdx=sprite.addImage(game.loadImage('../images/break_block.png'));
        sprite.setCurrentImage(imgIdx);
    }
    
    getGravityFactor()
    {
        return(0.1);
    }
    
    interactWithSprite(sprite,interactSprite,dataObj)
    {
        if (interactSprite.getControllerName()==='BallClass') sprite.setShow(false);
    }
    
    run(game,sprite,timestamp)
    {
    }
}
