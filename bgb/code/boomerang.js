import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import KangarangClass from '../code/kangarang.js';
import SpringClass from '../code/spring.js';

export default class BoomerangClass extends SpriteClass {
        
    static BOOMERANG_ACCELERATION_MIN=0.2;
    static BOOMERANG_ACCELERATION_ADD=0.5;
    static MAX_BOOMERANG_SPEED_MIN=2;
    static MAX_BOOMERANG_SPEED_ADD=3;
    
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // variables
        this.needReset=true;
        this.acceleration=0;
        this.speed=0;
        this.xAdd=0;
        this.yAdd=0;
        
        // setup
        this.addImage('sprites/boomerang');
        this.setCurrentImage('sprites/boomerang');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=false;
        
        this.setCollideSpriteClassIgnoreList([KangarangClass,SpringClass]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new BoomerangClass(this.game,x,y,this.data));
    }
    
    killBoomerang() {
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),ParticleClass.AFTER_SPRITES_LAYER,64,96,0.6,0.001,24,0,'particles/smoke',8,0.1,false,600);
        this.playSound('pop');
        this.delete();
    }
    
    onCollideSprite(sprite) {
        // boomerangs kill each other so they don't stack up
        if (
            (sprite instanceof PlayerSideScrollClass) ||
            (sprite instanceof BallClass) ||
            (sprite instanceof ShieldClass) ||
            (sprite instanceof BoomerangClass)) {
                this.killBoomerang();
                return;
        }
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        // first time, get random flight variables so they don't bunch up
        if (this.needReset) {
            this.needReset=false;
            
            this.acceleration=BoomerangClass.BOOMERANG_ACCELERATION_MIN+(Math.random()*BoomerangClass.BOOMERANG_ACCELERATION_ADD);
            this.speed=BoomerangClass.MAX_BOOMERANG_SPEED_MIN+(Math.random()*BoomerangClass.MAX_BOOMERANG_SPEED_ADD);
        }
        
        // accelerate towards player
        this.xAdd+=((playerSprite.x<this.x)?-this.acceleration:this.acceleration);
        if (this.xAdd<-this.speed) this.xAdd=-this.speed;
        if (this.xAdd>this.speed) this.xAdd=this.speed;
        
        this.yAdd+=((playerSprite.y<this.y)?-this.acceleration:this.acceleration);
        if (this.yAdd<-this.speed) this.yAdd=-this.speed;
        if (this.yAdd>this.speed) this.yAdd=this.speed;

        // move
        this.x+=this.xAdd;
        this.y+=this.yAdd;
        
        // check collision
        this.checkCollision();
    }
}
