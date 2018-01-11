import SpriteClass from '../engine/sprite.js';
import CloudBlockClass from './cloud_block.js';

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
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
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
        
        this.clampX(0,(map.width-this.width));
        
        if ((input.isAction()) && (this.grounded)) this.addMotion(0,-35);
        
            // check for standing on a cloud
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof CloudBlockClass) {
                this.standSprite.interactWithSprite(this,null);
            }
        }
    }
}
