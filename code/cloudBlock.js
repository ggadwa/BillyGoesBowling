import SpriteClass from '../engine/sprite.js';
import PlayerClass from './player.js';

export default class cloudBlockClass extends SpriteClass
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
    }
    
    getGravityFactor()
    {
        return(0.0);
    }
    
    canCollide()
    {
        return(false);
    }
    
    canStandOn()
    {
        return(true);
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
            
        if (this.getShow()) {
            this.setShow(false);
            this.countDown=40;
            return;
        }
        
            // reappear
            
        this.setShow(true);
        this.countDown=-1;
    }
}
