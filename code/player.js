import ControllerClass from '../engine/controller.js';

export default class PlayerClass extends ControllerClass
{
    constructor()
    {
        super();
        
        this.leftImageIdx=0;
        this.rightImageIdx=0;
        
        Object.seal(this);
    }
    
    initialize(game,sprite)
    {
        this.leftImageIdx=sprite.addImage(game.loadImage('../images/billy_left.png'));
        this.rightImageIdx=sprite.addImage(game.loadImage('../images/billy_right.png'));
        
        sprite.setCurrentImage(this.rightImageIdx);
        sprite.setFacing(sprite.FACING_RIGHT);
    }
    
    getGravityFactor()
    {
        return(0.08);
    }
    
    run(game,sprite,timestamp)
    {
        let input=game.getInput();
        
        if (input.isLeft()) {
            sprite.moveWithCollision(game,-10,0);
            sprite.setCurrentImage(this.leftImageIdx);
            sprite.setFacing(sprite.FACING_LEFT);
        }
        
        if (input.isRight()) {
            sprite.moveWithCollision(game,10,0);
            sprite.setCurrentImage(this.rightImageIdx);
            sprite.setFacing(sprite.FACING_RIGHT);
        }
        
        sprite.clampX(0,(game.getMap().getWidth()-sprite.getWidth()));
        
        if ((input.isAction()) && (sprite.isGrounded())) sprite.addMotion(0,-35);
    }
}
