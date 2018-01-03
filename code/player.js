import SpriteClass from '../engine/sprite.js';
import CloudBlockClass from './cloudBlock.js';

export default class PlayerClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.leftImageIdx=0;
        this.rightImageIdx=0;
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.leftImageIdx=this.addImage('billy_left');
        this.rightImageIdx=this.addImage('billy_right');
        
        this.setCurrentImage(this.rightImageIdx);
        this.setFacing(this.FACING_RIGHT);
    }
    
    getGravityFactor()
    {
        return(0.15);
    }
    
    runAI()
    {
        let game=this.getGame();
        let map=game.getMap();
        let input=game.getInput();
        
            // input
            
        if (input.isLeft()) {
            this.moveWithCollision(-12,0);
            this.setCurrentImage(this.leftImageIdx);
            this.setFacing(this.FACING_LEFT);
        }
        
        if (input.isRight()) {
            this.moveWithCollision(12,0);
            this.setCurrentImage(this.rightImageIdx);
            this.setFacing(this.FACING_RIGHT);
        }
        
        this.clampX(0,(map.getWidth()-this.getWidth()));
        
        if ((input.isAction()) && (this.isGrounded())) this.addMotion(0,-30);
        
            // check for standing on a cloud
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof CloudBlockClass) {
                this.standSprite.interactWithSprite(this,null);
            }
        }
    }
}
