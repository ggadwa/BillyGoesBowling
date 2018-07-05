import EntityClass from '../engine/entity.js';
import BallClass from './ball.js';

export default class ExplodeBlockClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // statics
            
        this.COUNT_DOWN_TICK_WAIT=5;
        
            // variables
            
        this.countDown=-1;
        this.countDownTick=0;
         
            // setup
        
        this.addImage('explode_block_0');
        this.addImage('explode_block_1');
        this.addImage('explode_block_2');
        this.addImage('explode_block_3');
        
        this.setCurrentImage('explode_block_0');
        this.setEditorImage('explode_block_0');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (this.countDown!==-1) return;
        
            // start the countdown if ball or
            // another exploding block
            
        if ((interactSprite instanceof BallClass) || (interactSprite instanceof ExplodeBlockClass)) {
            this.countDown=2;
            this.countDownTick=this.COUNT_DOWN_TICK_WAIT;
            this.setCurrentImage('explode_block_'+this.countDown);
        }
    }
    
    runAI()
    {
        let map=this.getGame().getMap();
        let sprites,sprite;
        
        if (this.countDown===-1) return;
        
            // wait for next countdown
            
        this.countDownTick--;
        if (this.countDownTick>0) return;
        
            // countdown has changed
            
        this.countDown--;
        this.countDownTick=this.COUNT_DOWN_TICK_WAIT;

        if (this.countDown>=0) {
            this.setCurrentImage('explode_block_'+this.countDown);
            return;
        }

            // explode
        
        sprites=map.getSurroundSprites(this,map.getGridPixelSize());
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }
        
        this.getMap().addParticle(this.getMiddleX(),this.getMiddleY(),32,120,0.5,0.1,3,0.05,this.getGame().getImageList().get('particle_explode_block'),15,500);
        this.getGame().getSoundList().play('explode');
        this.delete();
    }
}
