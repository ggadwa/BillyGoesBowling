import SpriteClass from '../engine/sprite.js';
import BallClass from '../code/ball.js';
import CloudBlockClass from './cloud_block.js';

export default class PlayerWorldClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
            // setup
            
        this.setCurrentImage(this.addImage('billy_world'));
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    runAI()
    {
        let game=this.getGame();
        let map=game.getMap();
        let input=game.getInput();
        
            // input
            
        if (input.isLeft()) this.moveWithCollision(-12,0);
        if (input.isRight()) this.moveWithCollision(12,0);
        if (input.isUp())this.moveWithCollision(0,-12);
        if (input.isDown()) this.moveWithCollision(0,12);
        
        this.clampX(0,(map.width-this.width));
        this.clampY(0,(map.height-this.height));
        
        //if ((input.isAction()) && (this.grounded)) this.addMotion(0,-35);
    }
}
