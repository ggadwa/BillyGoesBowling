import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import BallClass from './ball.js';
import MrCPUClass from '../code/mr_cpu.js';
import KingGhastlyClass from './king_ghastly.js';

export default class ExplodeBlockClass extends SpriteClass {

    static COUNT_DOWN_TICK_WAIT=5;
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.countDown=-1;
        this.countDownTick=0;
         
        // setup
        this.addImage('sprites/explode_block_0');
        this.addImage('sprites/explode_block_1');
        this.addImage('sprites/explode_block_2');
        this.addImage('sprites/explode_block_3');
        
        this.setCurrentImage('sprites/explode_block_0');
        
        this.show=true;
        this.gravityFactor=0.0; // explode blocks don't fall
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new ExplodeBlockClass(this.game,x,y,this.data));
    }
    
    startCountdown() {
        if (this.countDown===-1) {
            this.countDown=3;
            this.countDownTick=ExplodeBlockClass.COUNT_DOWN_TICK_WAIT;
            this.setCurrentImage('sprites/explode_block_'+this.countDown);
            this.playSound('bomb_tick');
        }
    }
    
    onCollideSprite(sprite) {
        // colliding with ball, cpu, or king ghastly starts countdown
        if (
                (sprite instanceof BallClass) ||
                (sprite instanceof MrCPUClass) ||
                (sprite instanceof KingGhastlyClass)) {
                    this.startCountdown();
                    return;
        }
    }
    
    onMessage(fromSprite,cmd,data) {
        if (cmd==='explode') {
            this.startCountdown();
        }
    }
    
    onRun(tick) {
        let cx,cy;
        
        if (this.countDown===-1) return;
        
        // wait for next countdown
        this.countDownTick--;
        if (this.countDownTick>0) return;
        
        // countdown has changed
        this.countDown--;
        this.countDownTick=ExplodeBlockClass.COUNT_DOWN_TICK_WAIT;

        if (this.countDown>=0) {
            this.setCurrentImage('sprites/explode_block_'+this.countDown);
            this.playSound('bomb_tick');
            return;
        }

        // explode
        // look for any sprite that's directly surrounding this
        // within a single tile distance (which is 64, we just need to
        // get the collision rect within that area.)
        this.sendMessageToSpritesAroundSprite(-32,-32,32,32,null,'explode',null);
        
        cx=this.x+Math.trunc(this.width*0.5);
        cy=this.y-Math.trunc(this.height*0.5);

        this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,35,200,0.8,0.01,8,0.02,'particles/explode_red',16,0.3,false,550);
        this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,25,140,0.7,0.01,6,0.01,'particles/explode_orange',8,0.25,false,540);
        this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,15,60,0.6,0.01,4,0.005,'particles/explode_yellow',2,0.2,false,530);
        this.playSound('explode');
        
        this.delete();
    }
}
