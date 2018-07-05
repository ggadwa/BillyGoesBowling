import EntityClass from '../engine/entity.js';

export default class BlockClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('block');
        this.setCurrentImage('block');
        this.setEditorImage('block');
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
}
