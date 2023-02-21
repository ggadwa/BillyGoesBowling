import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import KangarangClass from '../code/kangarang.js';
import SpringClass from '../code/spring.js';

export default class BoomerangClass extends SpriteClass {
        
    static BOOMERANG_ACCELERATION=0.25;
    static MAX_BOOMERANG_SPEED=3;
    
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // variables
        this.xAdd=0;
        this.yAdd=0;
        
        // setup
        this.addImage('sprites/boomerang');
        this.setCurrentImage('sprites/boomerang');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
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
        if (
            (sprite instanceof PlayerSideScrollClass) ||
            (sprite instanceof BallClass) ||
            (sprite instanceof ShieldClass)) {
                this.killBoomerang();
                return;
        }
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        // accelerate towards player
        this.xAdd+=((playerSprite.x<this.x)?-BoomerangClass.BOOMERANG_ACCELERATION:BoomerangClass.BOOMERANG_ACCELERATION);
        if (this.xAdd<-this.MAX_BOOMERANG_SPEED) this.xAdd=-this.MAX_BOOMERANG_SPEED;
        if (this.xAdd>this.MAX_BOOMERANG_SPEED) this.xAdd=this.MAX_BOOMERANG_SPEED;
        
        this.yAdd+=((playerSprite.y<this.y)?-BoomerangClass.BOOMERANG_ACCELERATION:BoomerangClass.BOOMERANG_ACCELERATION);
        if (this.yAdd<-this.MAX_BOOMERANG_SPEED) this.yAdd=-this.MAX_BOOMERANG_SPEED;
        if (this.yAdd>this.MAX_BOOMERANG_SPEED) this.yAdd=this.MAX_BOOMERANG_SPEED;

        // move
        this.x+=this.xAdd;
        this.y+=this.yAdd;
        
        // check collision
        this.checkCollision();
    }
}
