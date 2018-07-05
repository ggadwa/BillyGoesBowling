import EntityClass from '../engine/entity.js';
import BallClass from '../code/ball.js';
import CloudBlockClass from './cloud_block.js';

export default class PlayerSideScrollClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // setup
            
        this.addImage('billy_left');
        this.addImage('billy_right');
        
        this.setCurrentImage('billy_right');
        this.setEditorImage('billy_right');
        this.setFacing(this.FACING_RIGHT);
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
            // add in the ball
            // the ball automatically sets it's position so we don't
            // need to set one here
            
        this.getGame().getMap().addSprite(new BallClass(this.getGame()));
        
        Object.seal(this);
    }
    
    runAI()
    {
        let game=this.getGame();
        let map=game.getMap();
        let input=game.getInput();
        
            // input
            
        if (input.isLeft()) {
            this.moveWithCollision(-12,0);
            this.setCurrentImage('billy_left');
            this.setFacing(this.FACING_LEFT);
        }
        
        if (input.isRight()) {
            this.moveWithCollision(12,0);
            this.setCurrentImage('billy_right');
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
