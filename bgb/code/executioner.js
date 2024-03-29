import MapClass from '../../rpjs/engine/map.js';
import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleDefsClass from './particle_defs.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockClass from './break_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BallClass from './ball.js';
import AxeClass from './axe.js';

export default class ExecutionerClass extends SpriteClass {

    static ACCELERATION=0.5;
    static MAX_SPEED=5;
    static JUMP_HEIGHT=-20;
    static AXE_COOL_DOWN_TICK=70;
    static AXE_START_COOL_DOWN_TICK=90;
    static AXE_Y_OFFSET=800;
    static SINK_SPEED=2;
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.executionerDirection=-1;
        this.executionerSpeed=0;
        
        this.axeLaunchIndex=0;
        this.axeLaunchPositions=null;
        this.axeCoolDownCount=0;
        
        this.firstDrop=false;
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        this.skullParticle=null;
        
        // setup
        this.addImage('sprites/executioner_1');
        this.setCurrentImage('sprites/executioner_1');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.08;
        this.gravityMinValue=3;
        this.gravityMaxValue=14;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideSpriteClassCollideIgnoreList([AxeClass]);
        this.setCollideSpriteClassStandOnIgnoreList([AxeClass]);
        
        Object.seal(this);
    }
    
    onMapStart() {
        this.executionerDirection=-1;
        this.executionerSpeed=0;
        
        this.axeCoolDownCount=ExecutionerClass.AXE_START_COOL_DOWN_TICK;
        this.axeLaunchIndex=0;
        this.axeLaunchPositions=this.data.get('axe');
        
        this.firstDrop=true;
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
    }
    
    fireAxe() {
        let playerSprite=this.getPlayerSprite();
        
        // are we in cool down?
        if (this.axeCoolDownCount>0) {
            this.axeCoolDownCount--;
            return;
        }
        
        // fire axe
        this.game.map.addSprite(AxeClass,this.axeLaunchPositions[this.axeLaunchIndex],(playerSprite.y-ExecutionerClass.AXE_Y_OFFSET),null);
                
        this.playSound('jump');
        
        this.axeLaunchIndex++;
        if (this.axeLaunchIndex>=this.axeLaunchPositions.length) this.axeLaunchIndex=0;
        this.axeCoolDownCount=ExecutionerClass.AXE_COOL_DOWN_TICK;
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.executionerSpeed=0;
        this.executionerDirection=-this.executionerDirection;
    }
    
    land() {
        this.shakeMap(10);
        this.playSound('thud');
               
        // pop any clouds
        this.sendMessageToSpritesAroundSprite(0,0,0,32,CloudBlockClass,'pop',null);
        
        // break any break boxes
        this.sendMessageToSpritesAroundSprite(0,0,0,32,BreakBlockClass,'explode',null);
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
            this.y+=ExecutionerClass.SINK_SPEED;
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
                this.firstDrop=false;
                this.inAir=false;
                
                this.land();
            }
        }
        
        // always follow the player, but with
        // an acceleration
        if (this.firstDrop) {
            this.executionerSpeed=0;
        }
        else {
            this.executionerSpeed+=ExecutionerClass.ACCELERATION;
        }
        if (this.executionerSpeed>ExecutionerClass.MAX_SPEED) this.executionerSpeed=ExecutionerClass.MAX_SPEED;
            
        // jump unless the ground we are on is a cloud, then don't jump so we fall through
        if ((this.grounded) && (!(this.standSprite instanceof CloudBlockClass))) {
            this.executionerSpeed=0;
            this.addGravity(ExecutionerClass.JUMP_HEIGHT,0);

            this.flipX=!this.flipX;
        }

        // move
        this.moveWithCollision((this.executionerSpeed*this.executionerDirection),0);
        this.runGravity();
        
        // time to fire axe?
        this.fireAxe();
        
        // hit the liquid?
        if (this.isInLiquid()) {
            this.kill();
        }
    }
    
}
