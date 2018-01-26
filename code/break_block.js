import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';
import ExplodeBlockClass from './explode_block.js';

export default class BreakBlockClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.setCurrentImage(this.addImage('break_block'));
        
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
