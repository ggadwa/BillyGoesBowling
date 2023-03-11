import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleDefsClass from './particle_defs.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockClass from './break_block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import ExecutionerClass from './executioner.js';

export default class AxeClass extends SpriteClass {
        
    static AXE_SPEED=3;
    
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // setup
        this.addImage('sprites/axe');
        this.setCurrentImage('sprites/axe');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        this.canRiseBlock=false;

        this.setCollideSpriteClassCollideIgnoreList([ExecutionerClass]);
        this.setCollideSpriteClassStandOnIgnoreList([ExecutionerClass]);
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    kill() {
        this.playSound('crack');
        this.addParticle((this.x+(this.width/2)),(this.y-(this.height/4)),ParticleDefsClass.AXE_SHATTER_PARTICLE);
        this.delete();
    }
    
    onCollideSprite(sprite) {
        // pop clouds
        if (sprite instanceof CloudBlockClass) {
            this.sendMessageToSpritesAroundSprite(0,0,0,32,CloudBlockClass,'pop',null);
            return;
        }
        
        // break any break blocks but axes pass through
        if (sprite instanceof BreakBlockClass) {
            this.sendMessageToSpritesAroundSprite(0,0,0,32,BreakBlockClass,'explode',null);
            return;
        }
        
        // break any strong blocks
        if (sprite instanceof BreakBlockStrongClass) {
            this.sendMessageToSpritesAroundSprite(0,0,0,32,BreakBlockStrongClass,'explode',null);
            this.kill();
        }
        
        // hitting player kills it
        if (sprite instanceof PlayerSideScrollClass) {
            this.kill();
        }
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.kill();
    }
    
    onRun(tick) {
        this.y+=AxeClass.AXE_SPEED; // falls at constant rate
        this.checkCollision();
        
        if (this.isInLiquid()) {
            this.kill();
        }
    }
}
