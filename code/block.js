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
        this.setCurrentImage(this.addImage('../images/block.png'));
    }
    
    getGravityFactor()
    {
        return(0.2);
    }
}
