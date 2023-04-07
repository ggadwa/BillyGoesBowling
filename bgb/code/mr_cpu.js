import MapClass from '../../rpjs/engine/map.js';
import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleDefsClass from './particle_defs.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import ExplodeBlockClass from '../code/explode_block.js';
import BallClass from './ball.js';
import PlayerSideScroll from './player_sidescroll.js';

export default class MrCPUClass extends SpriteClass {

    static CPU_MODE_FALL=0;
    static CPU_MODE_WALK=1;
    static CPU_MODE_JETPACK=2;
        
    static MAX_SPEED=4;
    static MIN_WALK_TICK=50;
    static RANDOM_WALK_TICK=40;
        
    static JETPACK_FLY_SPEED=-5;
    static JETPACK_MOVE_SPEED=2.5;
    static JET_TICK=80;
    
    static SINK_SPEED=2;
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.mode=MrCPUClass.CPU_MODE_FALL;
        this.walkCount=0;
        this.jetCount=0;
        this.moveX=0;
        
        this.isDead=false;
        this.isFirstShow=true;
        this.skullParticle=null;
        
        // setup
        this.addImage('sprites/mr_cpu_1');
        this.addImage('sprites/mr_cpu_2');
        this.setCurrentImage('sprites/mr_cpu_1');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.12;
        this.gravityMinValue=4;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    onMapStart() {
        this.mode=MrCPUClass.CPU_MODE_FALL;
        
        this.isDead=false;
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
    }

    land() {
        this.shakeMap(10);
        this.playSound('thud');
               
        // pop any clouds
        this.sendMessageToSpritesAroundSprite(0,0,0,32,CloudBlockClass,'pop',null);
        
        // break any strong blocks on sides
        this.sendMessageToSpritesAroundSprite(0,0,0,-64,BreakBlockStrongClass,'explode',null);
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
        let mx;
        let playerSprite=this.getPlayerSprite();
        
        // do nothing if we aren't shown
        if (!this.show) return;   
        
        // dead, just sink 
        if (this.isDead) {
            this.y+=MrCPUClass.SINK_SPEED;
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
        
        // hit the liquid?
        if (this.isInLiquid()) {
            this.kill();
        }

        // falling mode, not much to do but land
        if (this.mode===MrCPUClass.CPU_MODE_FALL) {
            this.setCurrentImage('sprites/mr_cpu_1');
            this.flipX=false;
            
            this.checkCollision();
            this.runGravity();
            
            if (this.grounded) {
                this.mode=MrCPUClass.CPU_MODE_WALK;
                this.walkCount=MrCPUClass.MIN_WALK_TICK+Math.trunc(MrCPUClass.RANDOM_WALK_TICK*Math.random());
                this.moveX=((playerSprite.x<this.x)?-MrCPUClass.MAX_SPEED:MrCPUClass.MAX_SPEED);
                this.land();
            }
            
            return;
        }
        
        // walk mode, walk towards player
        if (this.mode===MrCPUClass.CPU_MODE_WALK) {
            this.setCurrentImage('sprites/mr_cpu_2');
            this.flipX=(((tick/10)&0x1)===0);
            
            this.moveWithCollision(this.moveX,0);
            this.runGravity();
            
            this.walkCount--;
            if (this.walkCount===0) {
                if (!this.grounded) {
                    this.walkCount=Math.trunc(MrCPUClass.RANDOM_WALK_TICK*Math.random()); // much shorter time walking
                }
                else {
                    this.mode=MrCPUClass.CPU_MODE_JETPACK;
                    this.jetCount=MrCPUClass.JET_TICK;
                    this.moveX=MrCPUClass.JETPACK_MOVE_SPEED*((Math.random()<0.5)?-1:1);
                    this.playSound('jet');
                }
            }
            
            return;
        }
        
        // jetpack mode
        this.setCurrentImage('sprites/mr_cpu_1');
        this.flipX=false;
        
        if (this.jetCount===MrCPUClass.JET_TICK) {
            this.addGravity(MrCPUClass.JETPACK_FLY_SPEED,MrCPUClass.JET_TICK);
            this.sendMessageToSpritesAroundSprite(0,0,0,32,BreakBlockStrongClass,'explode',null); // jet start breaks blocks
            this.sendMessageToSpritesAroundSprite(0,0,0,32,ExplodeBlockClass,'explode',null);
        }
        else {
            this.sendMessageToSpritesAroundSprite(0,-32,0,-this.height,BreakBlockStrongClass,'explode',null); // when jetting, break blocks above head
            this.sendMessageToSpritesAroundSprite(0,-32,0,-this.height,ExplodeBlockClass,'explode',null);
        }
        
        this.moveWithCollision(this.moveX,0);
        this.runGravity();
        
        mx=this.x+Math.trunc(this.width*Math.random());
        switch (tick%4) {
            case 0:
                this.addParticle(mx,this.y,ParticleDefsClass.JET_RED_PARTICLE);
                break;
            case 1:
                this.addParticle(mx,this.y,ParticleDefsClass.JET_ORANGE_PARTICLE);
                break;
            case 2:
                this.addParticle(mx,this.y,ParticleDefsClass.JET_YELLOW_PARTICLE);
                break;
        }
        
        this.jetCount--;
        if (this.jetCount===0) {
            this.mode=MrCPUClass.CPU_MODE_FALL;
        }
    }
    
}
