import SpriteClass from '../engine/sprite.js';
import CloudBlockClass from './cloud_block.js';
import BallClass from './ball.js';

export default class ExecutionerClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // variables
            
        this.executionerDirection=-1;
        this.snakeHasPipe=true;
        this.invincibleCount=0;
        
            // setup
        
        this.addImage('sprites/executioner_axe');
        this.setCurrentImage('sprites/executioner_axe');
        this.setEditorImage('sprites/executioner_axe');
        
        this.show=true;
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.show=false;            // start with it not shown, button starts it
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new ExecutionerClass(this.game,x,y,this.data));
    }
    
    /*
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof BallClass) {
            if (this.invincibleCount>0) return;
            
            if (this.snakeHasPipe) {
                this.snakeHasPipe=false;
                this.invincibleCount=30;
                this.setCurrentImage((this.snakeDirection===1)?'sprites/drain_pipe_snake_free_right':'sprites/drain_pipe_snake_free_left');
            }
            else {
                this.delete();
            }
        }
    }
    */
   
    runAI()
    {
        let map=this.game.map;
        let x;
        
            // walk in direction until a collision
         
        if (this.grounded) {
            x=8*this.executionerDirection;

            this.move(x,0);
            if (map.checkCollision(this)) {
                if (this.collideSprite!==null) this.collideSprite.interactWithSprite(this,null);
                this.move(-x,0);

                this.executionerDirection=-this.executionerDirection;
            }
        }
        
            // check for standing on a cloud or button
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof CloudBlockClass) {
                this.standSprite.interactWithSprite(this,null);
            }
        }
    }
    
}
