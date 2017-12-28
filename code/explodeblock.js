import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';

export default class ExplodeBlockClass extends SpriteClass
{
    constructor()
    {
        super();
        
        this.COUNT_DOWN_TICK_WAIT=30;
        
        this.countDown=-1;
        this.countDownTick=0;
        this.countDownImageIdxs=[];
        
        Object.seal(this);
    }
    
    initialize(game)
    {
        let imgIdx;
        
        imgIdx=this.addImage(game.loadImage('../images/explode_block.png'));
        this.countDownImageIdxs[0]=this.addImage(game.loadImage('../images/explode_block_1.png'));
        this.countDownImageIdxs[1]=this.addImage(game.loadImage('../images/explode_block_2.png'));
        this.countDownImageIdxs[2]=this.addImage(game.loadImage('../images/explode_block_3.png'));
        
        this.setCurrentImage(imgIdx);
    }
    
    getGravityFactor()
    {
        return(0.1);
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (this.countDown!==-1) return;
        
            // start the countdown
            
        if (interactSprite instanceof BallClass) {
            this.countDown=2;
            this.countDownTick=this.COUNT_DOWN_TICK_WAIT;
            this.setCurrentImage(this.countDownImageIdxs[this.countDown]);
        }
    }
    
    runAI(game,timestamp)
    {
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
        
        this.setShow(false);
    }
}
