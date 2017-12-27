import ControllerClass from '../engine/controller.js';

export default class ExplodeBlockClass extends ControllerClass
{
    constructor()
    {
        super();
        
        this.COUNT_DOWN_TICK_WAIT=20;
        
        this.countDown=-1;
        this.countDownTick=0;
        this.countDownImageIdxs=[];
        
        Object.seal(this);
    }
    
    initialize(game,sprite)
    {
        let imgIdx;
        
        imgIdx=sprite.addImage(game.loadImage('../images/explode_block.png'));
        this.countDownImageIdxs[0]=sprite.addImage(game.loadImage('../images/explode_block_1.png'));
        this.countDownImageIdxs[1]=sprite.addImage(game.loadImage('../images/explode_block_2.png'));
        this.countDownImageIdxs[2]=sprite.addImage(game.loadImage('../images/explode_block_3.png'));
        
        sprite.setCurrentImage(imgIdx);
    }
    
    getGravityFactor()
    {
        return(0.1);
    }
    
    interactWithSprite(sprite,interactSprite,dataObj)
    {
        if (this.countDown!==-1) return;
        
            // start the countdown
            
        if (interactSprite.getControllerName()==='BallClass') {
            this.countDown=2;
            this.countDownTick=this.COUNT_DOWN_TICK_WAIT;
            sprite.setCurrentImage(this.countDownImageIdxs[2]);
        }
    }
    
    run(game,sprite,timestamp)
    {
        if (this.countDown===-1) return;
        
            // wait for next countdown
            
        this.countDownTick--;
        if (this.countDownTick>0) return;
        
            // countdown has changed
            
        this.countDown--;

        if (this.countDown!==-1) {
            this.countDownTick=this.COUNT_DOWN_TICK_WAIT;
            sprite.setCurrentImage(this.countDownImageIdxs[this.countDown]);
            return;
        }

            // explode
        
        sprite.setShow(false);
    }
}
