import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';
import ExplodeBlockClass from './explode_block.js';

export default class BreakBlockClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.setCurrentImage(this.addImage('break_block'));
        
        this.show=true;
        this.gravityFactor=0.2;
        this.canCollide=true;
        this.canStandOn=true;
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if ((interactSprite instanceof BallClass) || (interactSprite instanceof ExplodeBlockClass)) {
            this.getMap().addParticle(this.getMiddleX(),this.getMiddleY(),5,0.08,this.getGame().getImageList().get('particle_block'),10,800);
            this.getGame().getSoundList().play('crack');
            this.show=false;
        }
    }
}
