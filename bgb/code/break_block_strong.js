import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import ExplodeBlockClass from './explode_block.js';
import AxeClass from './axe.js';
import MrCPUClass from './mr_cpu.js';
import EyeClass from './eye.js';

export default class BreakBlockStrongClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.addImage('sprites/break_block_strong');
        this.setCurrentImage('sprites/break_block_strong');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0; // break blocks don't fall
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    breakBlock() {
        let cx,cy;
        
        cx=this.x+Math.trunc(this.width*0.5);
        cy=this.y-Math.trunc(this.height*0.5);
        this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,16,16,1.0,0.1,0.08,0.08,5,5,'particles/block',10,0.5,false,800);
        this.playSound('crack');
        this.delete();
    }

    onCollideSprite(sprite) {
        // colliding with axe, mr cpu, or boney's eye breaks block
        if (
            (sprite instanceof AxeClass) ||
            (sprite instanceof MrCPUClass) ||
            (sprite instanceof EyeClass)) {
                this.breakBlock();
                return;
        }
    }

    onMessage(fromSprite,cmd,data) {
        if (cmd==='explode') {
            this.breakBlock();
        }
    }
}
