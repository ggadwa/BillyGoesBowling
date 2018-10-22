import SpriteClass from '../../rpjs/engine/sprite.js';
import BallClass from './ball.js';
import MrCPUClass from '../code/mr_cpu.js';
import KingGhastlyClass from './king_ghastly.js';

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
        
        this.show=true;
        this.gravityFactor=0.0;     // explode blocks don't fall
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
            
        if ((interactSprite instanceof BallClass) || (interactSprite instanceof ExplodeBlockClass) || (interactSprite instanceof MrCPUClass) || (interactSprite instanceof KingGhastlyClass)) {
            this.countDown=3;
            this.countDownTick=this.COUNT_DOWN_TICK_WAIT;
            this.setCurrentImage('sprites/explode_block_'+this.countDown);
            this.game.soundList.playAtSprite('bomb_tick',this,this.game.map.getSpritePlayer());
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
            this.game.soundList.playAtSprite('bomb_tick',this,this.game.map.getSpritePlayer());
            return;
        }

            // explode
            // look for any sprite that's directly surrounding this
            // within a single tile distance (which is 64, we just need to
            // get the collision rect within that area.)
        
        sprites=this.game.map.getSpritesWithinBox((this.x-16),(this.y-80),(this.x+80),(this.y+16),this,null);
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }
        
        cx=this.x+Math.trunc(this.width*0.5);
        cy=this.y-Math.trunc(this.height*0.5);

        this.game.map.addParticle(cx,cy,32,128,0.8,0.1,8,0.015,'particles/explode_red',10,550);
        this.game.map.addParticle(cx,cy,24,104,0.7,0.1,6,0.008,'particles/explode_orange',8,540);
        this.game.map.addParticle(cx,cy,16,64,0.6,0.1,4,0.005,'particles/explode_yellow',6,530);
        this.game.soundList.playAtSprite('explode',this,this.game.map.getSpritePlayer());
        
        this.delete();
    }
}
