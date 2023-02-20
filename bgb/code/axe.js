import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import ExecutionerClass from './executioner.js';

export default class AxeClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.SPEED=6;
        
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

        this.setCollideSpriteClassIgnoreList([ExecutionerClass]);
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new AxeClass(this.game,x,y,this.data));
    }
    
    kill() {
        this.playSound('crack');
        this.addParticle((this.x+(this.width/2)),(this.y-(this.height/4)),ParticleClass.AFTER_SPRITES_LAYER,50,10,1.0,0.1,8,0.05,'particles/ball',24,0.5,false,300);
        this.delete();
    }
    
    onCollideSprite(sprite) {
        // pop clouds
        if (sprite instanceof CloudBlockClass) {
            this.sendMessageToSpritesAroundSprite(0,0,0,32,CloudBlockClass,'pop',null);
            return;
        }
        
        // break any strong blocks
        if (sprite instanceof BreakBlockStrongClass) {
            this.sendMessageToSpritesAroundSprite(0,0,0,32,BreakBlockStrongClass,'explode',null);
            this.kill();
        }
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.kill();
    }
    
    onRun(tick) {
        this.y+=this.SPEED; // constant speed
        this.checkCollision();
        
        if (this.isInLiquid()) {
            this.kill();
        }
    }
}
