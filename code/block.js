import SpriteClass from '../engine/sprite.js';

export default class BlockClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/block');
        this.setCurrentImage('sprites/block');
        this.setEditorImage('sprites/block');
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new BlockClass(this.game,x,y,this.data));
    }
}
