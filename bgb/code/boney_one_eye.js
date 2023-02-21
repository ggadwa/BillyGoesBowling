import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import EyeClass from './eye.js';

export default class BoneyOneEyeClass extends SpriteClass {
        
    static FIRE_TICK=55;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.fireWait=0;
        this.inAir=false;
        this.isFalling=false;
        this.isDead=false;
        this.isFirstShow=true;
        
        // setup
        this.addImage('sprites/boney_one_eye');
        this.setCurrentImage('sprites/boney_one_eye');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideSpriteClassIgnoreList([EyeClass]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new BoneyOneEyeClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
        this.fireWait=BoneyOneEyeClass.FIRE_TICK;
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
    }
    
    fireEye() {
        let x,y;
        
        this.fireWait--;
        if (this.fireWait>0) return;
        
        this.fireWait=BoneyOneEyeClass.FIRE_TICK;

        // pick the eye side closest to player
        if (this.flipX) {
            x=this.x+Math.trunc(this.width*0.25);
        }
        else {
            x=this.x+Math.trunc(this.width*0.6);
        }
        y=this.y-Math.trunc(this.height*0.45);

        this.game.map.addSprite(new EyeClass(this.game,x,y,null));

        this.playSound('jump');
    }

    land() {
        this.shakeMap(10);
        this.playSound('thud');
               
        // pop any clouds
        this.sendMessageToSpritesAroundSprite(0,0,0,32,CloudBlockClass,'pop',null);
    }
    
    kill() {
        this.isDead=true;
        this.gravityFactor=0.0;
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),ParticleClass.AFTER_SPRITES_LAYER,64,256,1.0,0.01,0.1,8,'particles/skull',30,0.0,false,2500);
        this.playSound('boss_dead');

        // update the state
        this.setGameData(('boss_'+this.getMapName()),true);
        this.setGameData(('boss_explode_'+this.getMapName()),true);
        this.setGameDataIfLess(('time_'+this.getMapName()),this.game.stopCompletionTimer());

        this.game.map.forceCameraSprite=this;

        // warp player out
        this.sendMessage(this.getPlayerSprite(),'warp_out',null);
    }
    
    onRun(tick) {
        // do nothing if we aren't shown
        if (!this.show) return;
        
        // dead, just sink 
        if (this.isDead) {
            this.y+=4;
            this.alpha-=0.05;
            if (this.alpha<0.0) this.alpha=0.0;
            return;
        }
        
        // the first time we get called is
        // when we first appear, so play sound fx
        if (this.isFirstShow) {
            this.isFirstShow=false;
            this.playSound('boss_appear');
        }

        // shake map when hitting ground
        if (!this.grounded) {
            this.inAir=true;
        }
        else {
            if (this.inAir) {
                this.inAir=false;
                this.land();
            }
        }
        
        this.runGravity();
        
        // always face player
        this.flipX=(this.getPlayerSprite().x<this.x);
        
        // time to fire?
        this.fireEye();

        // hit the liquid?
        if (this.isInLiquid()) {
            this.kill();
        }
    }
    
}
