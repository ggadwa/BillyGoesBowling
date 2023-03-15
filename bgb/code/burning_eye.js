import SpriteClass from '../../rpjs/engine/sprite.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import ParticleDefsClass from './particle_defs.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import BreakBlockClass from '../code/break_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';

export default class BurningEyeClass extends SpriteClass {

    static EYE_SPEED=2;
    static EYE_EXTRA_SPEED=3;
    static FLAME_TICK=10;
        
    constructor(game,x,y,data) {
        super(game,x,y,data);

        this.speed=BurningEyeClass.EYE_SPEED+(Math.random()*BurningEyeClass.EYE_EXTRA_SPEED);
        this.burnFlameIdx=0;
        
        // setup
        this.addImage('sprites/eye');
        this.setCurrentImage('sprites/eye');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.setCollideSpriteClassCollideIgnoreList([BurningEyeClass]);
        this.setCollideTileIndexIgnoreList([22,23,54]);
        
        Object.seal(this);
    }
    
    killEye() {
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),ParticleDefsClass.MONSTER_KILL_SMOKE_PARTICLE);
        this.playSound('pop');
        this.delete();
    }
    
    onCollideSprite(sprite) {
        // colliding with ball or shield kills eye
        if (
            (sprite instanceof BallClass) ||
            (sprite instanceof ShieldClass)) {
                this.killEye();
                return;
        }
        // if a regular or strong block, break them around the eye
        if (sprite instanceof BreakBlockClass) {
            this.sendMessageToSpritesAroundSprite(-32,-32,32,32,BreakBlockClass,'explode',null);
            this.killEye();
            return;
        }
        
        if (sprite instanceof BreakBlockStrongClass) {
            this.sendMessageToSpritesAroundSprite(-32,-32,32,32,BreakBlockStrongClass,'explode',null);
            this.killEye();
            return;
        }
        
        // eye dies when hitting player
        if (sprite instanceof PlayerSideScrollClass) {
            this.killEye();
            return;
        }
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.killEye();
    }
    
    onRun(tick) {
        let mx,my;
        
        this.y+=this.speed;
        this.checkCollision();
        
        if (this.isInLiquid()) {
            this.killEye();
        }
        
        if ((tick%BurningEyeClass.FLAME_TICK)===0) {
            mx=this.x+Math.trunc(this.width*0.5);
            my=this.y-Math.trunc(this.height*0.5);
            
            switch (this.burnFlameIdx) {
                case 0:
                    this.addParticle(mx,my,ParticleDefsClass.JET_RED_PARTICLE);
                    break;
                case 1:
                    this.addParticle(mx,my,ParticleDefsClass.JET_ORANGE_PARTICLE);
                    break;
                case 2:
                    this.addParticle(mx,my,ParticleDefsClass.JET_YELLOW_PARTICLE);
                    break;
            }
            
            this.burnFlameIdx++;
            if (this.burnFlameIdx===3) this.burnFlameIdx=0;
        }
    }
}
