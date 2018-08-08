import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';

export default class ExplodeBlockClass extends SpriteClass
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
        
        this.addImage('sprites/explode_block_0');
        this.addImage('sprites/explode_block_1');
        this.addImage('sprites/explode_block_2');
        this.addImage('sprites/explode_block_3');
        
        this.setCurrentImage('sprites/explode_block_0');
        this.setEditorImage('sprites/explode_block_0');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new ExplodeBlockClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (this.countDown!==-1) return;
        
            // start the countdown if ball or
            // another exploding block
            
        if ((interactSprite instanceof BallClass) || (interactSprite instanceof ExplodeBlockClass)) {
            this.countDown=2;
            this.countDownTick=this.COUNT_DOWN_TICK_WAIT;
            this.setCurrentImage('sprites/explode_block_'+this.countDown);
        }
    }
    
    runAI()
    {
        let cx,cy,sprites,sprite;
        
        if (this.countDown===-1) return;
        
            // wait for next countdown
            
        this.countDownTick--;
        if (this.countDownTick>0) return;
        
            // countdown has changed
            
        this.countDown--;
        this.countDownTick=this.COUNT_DOWN_TICK_WAIT;

        if (this.countDown>=0) {
            this.setCurrentImage('sprites/explode_block_'+this.countDown);
            return;
        }

            // explode
        
        sprites=this.game.map.getSurroundSprites(this,Math.trunc(this.width*0.5),-Math.trunc(this.height*0.5),this.game.map.MAP_TILE_SIZE);
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }
        
        cx=this.x+Math.trunc(this.width*0.5);
        cy=this.y-Math.trunc(this.height*0.5);

        this.game.map.addParticle(cx,cy,32,120,0.5,0.1,3,0.05,this.game.imageList.get('sprites/particle_explode_block'),15,500);
        this.game.soundList.play('explode');
        this.delete();
    }
}
