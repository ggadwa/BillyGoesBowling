import SpriteClass from '../engine/sprite.js';
import PlayerClass from './player.js';

export default class CloudBlockClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.countDown=-1;
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.setCurrentImage(this.addImage('cloud_block'));
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=true;
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (this.countDown!==-1) return;            // already doing something

        if (interactSprite instanceof PlayerClass) this.countDown=15;
    }
    
    runAI()
    {
        if (this.countDown===-1) return;
        
        this.countDown--;
        if (this.countDown>0) return;
        
            // disappear
            
        if (this.show) {
            this.show=false;
            this.countDown=40;
            return;
        }
        
            // reappear
            
        this.show=true;
        this.countDown=-1;
    }
}
