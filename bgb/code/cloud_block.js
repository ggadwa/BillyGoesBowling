import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import ShurikinClass from './shurikin.js';
import BombClass from './bomb.js';
import FishClass from './fish.js';

export default class CloudBlockClass extends SpriteClass {
        
    static POP_TICK=40;
    static REAPPEAR_TICK=80;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.countDown=-1;
        
        // setup
        this.addImage('sprites/cloud_block');
        this.setCurrentImage('sprites/cloud_block');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=true;
        this.canRiseBlock=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new CloudBlockClass(this.game,x,y,this.data));
    }
    
    pop() {
        this.show=false;
        this.countDown=CloudBlockClass.REAPPEAR_TICK;
        this.playSound('pop');
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),ParticleClass.AFTER_SPRITES_LAYER,64,96,0.6,0.001,24,0,'particles/smoke',8,0.1,false,500);
    }
    
    onCollideSprite(sprite) {
        // colliding with ball, shurikin, bomb, or fish instantly pops cloud
        if (
                (sprite instanceof BallClass) ||
                (sprite instanceof ShurikinClass) ||
                (sprite instanceof BombClass) ||
                (sprite instanceof FishClass)) {
                   this.pop();
                   return;
        }
    }
    
    onStoodOnSprite(sprite) {
        // if stood on and not alredy counting down, start pop countdown
        if (this.countDown===-1) this.countDown=CloudBlockClass.POP_TICK;
    }
    
    onMessage(fromSprite,cmd,data) {
        if (cmd==='pop') {
            this.pop();
        }
    }

    onRun(tick) {
        // run collision checks without moving
        this.checkCollision();
        
        // nothing to do
        if (this.countDown===-1) return;
        
        // otherwise run the pop
        this.countDown--;
        if (this.countDown>0) return;
        
        // disappear
        if (this.show) {
            this.pop();
            return;
        }
        
        // reappear
        this.show=true;
        this.countDown=-1;
    }
}
