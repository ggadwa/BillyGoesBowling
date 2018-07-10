import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';

export default class DrainPipeSnakeClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // variables
            
        this.bunnyActive=false;
        this.bunnyPause=0;
        
            // setup
        
        this.addImage('sprites/drain_pipe_snake_cover');
        this.addImage('sprites/drain_pipe_snake_free');
        this.setCurrentImage('sprites/drain_pipe_snake_cover');
        this.setEditorImage('sprites/drain_pipe_snake_cover');
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new DrainPipeSnakeClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof BallClass) {
            this.delete();
        }
    }
    
    runAI()
    {
        let playerSprite=this.game.map.getSpritePlayer();
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
