import EntityClass from '../engine/entity.js';
import ExplodeBlockClass from './explode_block.js';

export default class BreakBlockStrongClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('break_block_strong');
        this.setCurrentImage('break_block_strong');
        this.setEditorImage('break_block_strong');
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof ExplodeBlockClass) {
            this.getMap().addParticle(this.getMiddleX(),this.getMiddleY(),16,16,1.0,0.1,0.08,5,this.getGame().getImageList().get('particle_block'),10,800);
            this.getGame().getSoundList().play('crack');
            this.delete();
        }
    }
}
