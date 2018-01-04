import SpriteClass from '../engine/sprite.js';

export default class BlockClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.setCurrentImage(this.addImage('block'));
        
        this.show=true;
        this.gravityFactor=0.2;
        this.canCollide=true;
        this.canStandOn=true;
    }
}
