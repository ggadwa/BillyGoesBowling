import EntityClass from '../engine/entity.js';
import BallClass from './ball.js';
import ExplodeBlockClass from './explode_block.js';

export default class BreakBlockClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('break_block')
        this.setCurrentImage('break_block');
        this.setEditorImage('break_block');
        
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
        if ((interactSprite instanceof BallClass) || (interactSprite instanceof ExplodeBlockClass)) {
            this.getMap().addParticle(this.getMiddleX(),this.getMiddleY(),16,16,1.0,0.1,5,0.08,this.getGame().getImageList().get('particle_block'),10,800);
            this.getGame().getSoundList().play('crack');
            this.delete();
        }
    }
}
