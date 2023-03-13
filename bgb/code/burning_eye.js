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
        
    constructor(game,x,y,data) {
        super(game,x,y,data);

        this.speed=BurningEyeClass.EYE_SPEED+(Math.random()*BurningEyeClass.EYE_EXTRA_SPEED);
        
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
        this.y+=this.speed;
        this.checkCollision();
        
        if (this.isInLiquid()) {
            this.killEye();
        }
    }
}
