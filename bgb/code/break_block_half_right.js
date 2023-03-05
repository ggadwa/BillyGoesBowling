import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import BallClass from './ball.js';
import ShurikinClass from './shurikin.js';
import BombClass from './bomb.js';
import FishClass from './fish.js';
import ExplodeBlockClass from './explode_block.js';

export default class BreakBlockHalfRightClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/break_block_half_right')
        this.setCurrentImage('sprites/break_block_half_right');
        
        this.show=true;
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=12;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    breakBlock() {
        let cx,cy;
        
        cx=this.x+Math.trunc(this.width*0.5);
        cy=this.y-Math.trunc(this.height*0.5);
        this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,16,16,1.0,0.1,5,0.08,'particles/block',10,0.5,false,800);
        this.playSound('crack');
        this.delete();
    }
    
    onCollideSprite(sprite) {
        // can only be broken from right side
        // colliding with ball, shurikin, bomb, or fish breaks block
        if (
                (sprite instanceof BallClass) ||
                (sprite instanceof ShurikinClass) ||
                (sprite instanceof BombClass) ||
                (sprite instanceof FishClass)) {
                    if (sprite.x>(this.x+(this.width/2))) this.breakBlock();
                    return;
        }
    }
    
    onMessage(fromSprite,cmd,data) {
        if (cmd==='explode') {
            this.breakBlock();
        }
    }
    
    onRun(tick) {
        this.runGravity();
    }
}
