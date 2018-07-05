import EntityClass from '../engine/entity.js';

export default class RotoCarrotClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('roto_carrot');
        this.setCurrentImage('roto_carrot');
        this.setEditorImage('roto_carrot');
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
}
