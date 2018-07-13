import SpriteClass from '../engine/sprite.js';
import ExplodeBlockClass from './explode_block.js';

export default class BreakBlockStrongClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/break_block_strong');
        this.setCurrentImage('sprites/break_block_strong');
        this.setEditorImage('sprites/break_block_strong');
        
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
        return(new BreakBlockStrongClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof ExplodeBlockClass) {
            this.game.map.addParticle(this.getMiddleX(),this.getMiddleY(),16,16,1.0,0.1,0.08,5,this.game.imageList.get('sprites/particle_block'),10,800);
            this.game.soundList.play('crack');
            this.delete();
        }
    }
}
