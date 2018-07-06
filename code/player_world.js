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
    
    runAI()
    {
        let n,moveX,moveY;
        let game=this.getGame();
        let map=game.getMap();
        let input=game.getInput();
        
            // movement
            
        moveX=0;
        moveY=0;
        
        if (input.isLeft()) moveX=-1;
        if (input.isRight()) moveX=1;
        if (input.isUp()) moveY=-1;
        if (input.isDown()) moveY=1;
        
        if ((moveX!==0) || (moveY!==0)) {
            for (n=0;n!==10;n++) {
                if (moveX!==0) this.moveWithCollision(moveX,0);
                if (moveY!==0) this.moveWithCollision(0,moveY);
            }
        }
        
        this.clampX(0,(map.width-this.width));
        this.clampY(0,(map.height-this.height));
    }
}
