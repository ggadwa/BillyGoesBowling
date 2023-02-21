import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BallClass from './ball.js';
import AxeClass from './axe.js';

export default class ExecutionerClass extends SpriteClass {

    static ACCELERATION=1.0;
    static MAX_SPEED=7;
    static JUMP_HEIGHT=-40;
    static AXE_COOL_DOWN_TICK=35;
    static AXE_START_COOL_DOWN_TICK=45;
    static AXE_Y_OFFSET=800;
        
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
        
        // setup
        this.addImage('sprites/executioner_1');
        this.setCurrentImage('sprites/executioner_1');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideSpriteClassIgnoreList([AxeClass]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new ExecutionerClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
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
        let sx;
        let playerSprite=this.getPlayerSprite();
        
        // are we in cool down?
        if (this.axeCoolDownCount>0) {
            this.axeCoolDownCount--;
            return;
        }
        
        // fire axe
        this.game.map.addSprite(new AxeClass(this.game,this.axeLaunchPositions[this.axeLaunchIndex],(playerSprite.y-ExecutionerClass.AXE_Y_OFFSET),null));
                
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
