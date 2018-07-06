import SpriteClass from '../engine/sprite.js';

export default class RotoCarrotClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/roto_carrot');
        this.setCurrentImage('sprites/roto_carrot');
        this.setEditorImage('sprites/roto_carrot');
        
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
        return(new RotoCarrotClass(this.game,x,y,this.data));
    }
}
