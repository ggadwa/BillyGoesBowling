import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';

export default class ExplodeBlockClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.COUNT_DOWN_TICK_WAIT=5;
        
        this.countDown=-1;
        this.countDownTick=0;
        this.countDownImageIdxs=[];
        
        Object.seal(this);
    }
    
    initialize()
    {
        this.setCurrentImage(this.addImage('explode_block'));
        
        this.countDownImageIdxs[0]=this.addImage('explode_block_1');
        this.countDownImageIdxs[1]=this.addImage('explode_block_2');
        this.countDownImageIdxs[2]=this.addImage('explode_block_3');
    }
    
    getGravityFactor()
    {
        return(0.2);
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (this.countDown!==-1) return;
        
            // start the countdown if ball or
            // another exploding block
            
        if ((interactSprite instanceof BallClass) || (interactSprite instanceof ExplodeBlockClass)) {
            this.countDown=2;
            this.countDownTick=this.COUNT_DOWN_TICK_WAIT;
            this.setCurrentImage(this.countDownImageIdxs[this.countDown]);
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
            this.setCurrentImage(this.countDownImageIdxs[this.countDown]);
            return;
        }

            // explode
        
        sprites=map.getSurroundSprites(this,map.getGridPixelSize());
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }
        
        this.getMap().addParticle(this.getMiddleX(),this.getMiddleY(),5,0.09,this.getGame().getImageList().get('particle_explode_block'),15,800);
        this.setShow(false);
    }
}
