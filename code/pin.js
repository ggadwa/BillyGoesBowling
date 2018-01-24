import SpriteClass from '../engine/sprite.js';

export default class PinClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.setCurrentImage(this.addImage('pin'));
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
    }
}
