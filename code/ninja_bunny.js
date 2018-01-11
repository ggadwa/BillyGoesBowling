import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';

export default class NinjaBunnyClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.bunnyActive=false;
        this.bunnyPause=0;
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.setCurrentImage(this.addImage('ninja_bunny'));
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof BallClass) {
            this.show=false;
        }
    }
    
    runAI()
    {
        let game=this.getGame();
        let map=game.getMap();
        let playerSprite=map.getSpritePlayer();
        
            // not shown, destroyed
            
        if (!this.show) return;
        
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
            
        if (!this.grounded) {
            this.bunnyPause=15;
            return;
        }
        
        if (this.bunnyPause>0) {
            this.bunnyPause--;
            return;
        }
        
        this.addMotion(0,-55);
    }
    
}
