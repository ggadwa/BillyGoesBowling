import SpriteClass from '../engine/sprite.js';

export default class PlayerClass extends SpriteClass
{
    constructor()
    {
        super();
        
        this.leftImageIdx=0;
        this.rightImageIdx=0;
        
        Object.seal(this);
    }
    
    initialize(game)
    {
        this.leftImageIdx=this.addImage(game.loadImage('../images/billy_left.png'));
        this.rightImageIdx=this.addImage(game.loadImage('../images/billy_right.png'));
        
        this.setCurrentImage(this.rightImageIdx);
        this.setFacing(this.FACING_RIGHT);
    }
    
    getGravityFactor()
    {
        return(0.08);
    }
    
    runAI(game,timestamp)
    {
        let input=game.getInput();
        
        if (input.isLeft()) {
            this.moveWithCollision(game,-10,0);
            this.setCurrentImage(this.leftImageIdx);
            this.setFacing(this.FACING_LEFT);
        }
        
        if (input.isRight()) {
            this.moveWithCollision(game,10,0);
            this.setCurrentImage(this.rightImageIdx);
            this.setFacing(this.FACING_RIGHT);
        }
        
        this.clampX(0,(game.getMap().getWidth()-this.getWidth()));
        
        if ((input.isAction()) && (this.isGrounded())) this.addMotion(0,-35);
    }
}
