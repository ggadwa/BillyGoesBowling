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
        this.canCollide=true;
        this.canStandOn=true;
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof ExplodeBlockClass) {
            this.getMap().addParticle(this.getMiddleX(),this.getMiddleY(),5,0.08,this.getGame().getImageList().get('particle_block'),10,800);
            this.getGame().getSoundList().play('crack');
            this.show=false;
        }
    }
}
