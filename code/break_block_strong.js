import SpriteClass from '../engine/sprite.js';
import ExplodeBlockClass from './explode_block.js';

export default class BreakBlockStrongClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        Object.seal(this);
    }
    
    initialize()
    {
        let imgIdx;
        
        imgIdx=this.addImage('break_block_strong');
        this.setCurrentImage(imgIdx);
        
        this.show=true;
        this.gravityFactor=0.2;
        this.gravityMinValue=2;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
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
