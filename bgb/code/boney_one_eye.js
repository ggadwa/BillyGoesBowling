import MapClass from '../../rpjs/engine/map.js';
import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleDefsClass from './particle_defs.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import EyeClass from './eye.js';

export default class BoneyOneEyeClass extends SpriteClass {
        
    static FIRE_TICK=95;
    static FIRE_TICK_RANDOM_ADD=20;
    static LAST_FIRE_Y=2700;
    static SINK_SPEED=2;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.fireWait=0;
        this.inAir=false;
        this.isFalling=false;
        this.isDead=false;
        this.isFirstShow=true;
        this.skullParticle=null;
        
        // setup
        this.addImage('sprites/boney_one_eye');
        this.setCurrentImage('sprites/boney_one_eye');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.08;
        this.gravityMinValue=3;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideSpriteClassCollideIgnoreList([EyeClass]);
        
        Object.seal(this);
    }
    
    onMapStart() {
        this.fireWait=BoneyOneEyeClass.FIRE_TICK+this.randomScaledInt(BoneyOneEyeClass.FIRE_TICK_RANDOM_ADD);
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
    }
    
    fireEye() {
        let x,y;
        
        this.fireWait--;
        if (this.fireWait>0) return;
        
        this.fireWait=BoneyOneEyeClass.FIRE_TICK+this.randomScaledInt(BoneyOneEyeClass.FIRE_TICK_RANDOM_ADD);

        // pick the eye side closest to player
        if (this.flipX) {
            x=this.x+Math.trunc(this.width*0.25);
        }
        else {
            x=this.x+Math.trunc(this.width*0.6);
        }
        y=this.y-Math.trunc(this.height*0.45);

        this.addSprite(EyeClass,x,y,null);

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
        this.skullParticle=this.addParticle((this.x+(this.width/2)),(this.y-(this.height/2)),ParticleDefsClass.BOSS_KILL_PARTICLE);
        this.playSound('boss_dead');

        // update the state
        this.setCurrentSaveSlotData(('boss_'+this.getMapName()),true);
        this.setCurrentSaveSlotData(('boss_explode_'+this.getMapName()),true);
        this.setCurrentSaveSlotDataIfLess(('time_'+this.getMapName()),this.game.stopCompletionTimer());

        this.setCamera(this,MapClass.CAMERA_TYPE_OVERHEAD);
        
        this.shake=true;
        this.shakeSize=5;
        this.shakePeriodTick=0;

        // warp player out
        this.sendMessage(this.getPlayerSprite(),'warp_out',null);
    }
    
    onRun(tick) {
        // do nothing if we aren't shown
        if (!this.show) return;
        
        // dead, just sink 
        if (this.isDead) {
            this.y+=BoneyOneEyeClass.SINK_SPEED;
            this.alpha-=0.01;
            if (this.alpha<0.0) this.alpha=0.0;
            if (this.skullParticle!=null) {
                this.skullParticle.resetPosition((this.x+(this.width/2)),(this.y-(this.height/2)));
            }
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
        // after we clear the last blocks, stop firing eyes
        // so we don't trap the player
        if (this.y<BoneyOneEyeClass.LAST_FIRE_Y) this.fireEye();

        // hit the liquid?
        if (this.isInLiquid()) {
            this.kill();
        }
    }
    
}
