import SpriteClass from '../engine/sprite.js';
import BallClass from '../code/ball.js';
import CloudBlockClass from './cloud_block.js';

export default class PlayerWorldClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // setup
            
        this.addImage('sprites/billy_world');
        this.setCurrentImage('sprites/billy_world');
        this.setEditorImage('sprites/billy_world');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new PlayerWorldClass(this.game,x,y,this.data));
    }
    
    isPlayer()
    {
        return(true);
    }
    
    runAI()
    {
        let n,moveX,moveY;
        
            // movement
            
        moveX=0;
        moveY=0;
        
        if (this.game.input.isLeft()) moveX=-1;
        if (this.game.input.isRight()) moveX=1;
        if (this.game.input.isUp()) moveY=-1;
        if (this.game.input.isDown()) moveY=1;
        
        if ((moveX!==0) || (moveY!==0)) {
            for (n=0;n!==10;n++) {
                if (moveX!==0) this.moveWithCollision(moveX,0);
                if (moveY!==0) this.moveWithCollision(0,moveY);
            }
        }
        
        this.clampX(0,(this.game.map.width-this.width));
        this.clampY(0,(this.game.map.height-this.height));
    }
}
