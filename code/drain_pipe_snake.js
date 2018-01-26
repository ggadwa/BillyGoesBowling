import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';

export default class DrainPipeSnakeClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
            // variables
            
        this.bunnyActive=false;
        this.bunnyPause=0;
        
            // setup
            
        this.setCurrentImage(this.addImage('drain_pipe_snake_cover'));
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof BallClass) {
            this.delete();
        }
    }
    
    runAI()
    {
        let game=this.getGame();
        let map=game.getMap();
        let playerSprite=map.getSpritePlayer();
        let sx,sy,shurikinSprite;
        
            // distance from player
            
        let dist=playerSprite.x-this.x;
        
        if (!this.bunnyActive) {
            if (Math.abs(dist)<1000) {
                this.bunnyActive=true;
            }
            return;
        }
        
            // move towards player
        
        if (this.grounded) {    
            this.moveWithCollision(((dist<0)?-6:6),0);
        }
        else {
            this.moveWithCollision(((dist<0)?-8:8),0);
        }
        
            // jump whenever you are grounded
            // after a pause
           /* 
        if (!this.grounded) {
            this.bunnyPause=15;
            return;
        }
        
        if (this.bunnyPause>0) {
            this.bunnyPause--;
            
                // half way through pause, throw a shurikin
                
            if (this.bunnyPause===15) {

            }
            
            return;
        }
        
        this.addMotion(0,-55);
        */
    }
    
}
