import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import BombClass from './bomb.js';
import FishClass from './fish.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import ShurikinClass from './shurikin.js';
import CloudBlockClass from './cloud_block.js';
import DoorClass from './door.js';
import PinClass from './pin.js';
import TrophyClass from './trophy.js';

export default class NinjaBunnyClass extends SpriteClass {

    static BUNNY_JUMP_HEIGHT=-35;
    static BUNNY_AIR_SPEED=4;
    static BUNNY_PAUSE_TICK=90;
    static BUNNY_ACTIVATE_DISTANCE=800;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.bunnyActive=false;
        this.bunnyPause=0;
        this.bunnyJumpDirection=-1;
        this.bunnyShurikinOK=false;
        this.bunnyBounceBack=false;
        this.lastMotionY=0;
        
        this.currentShurikin=null;
        
        // setup
        this.addImage('sprites/ninja_bunny');
        this.addImage('sprites/ninja_bunny_jump');
        this.setCurrentImage('sprites/ninja_bunny');
        
        this.show=true;
        this.gravityFactor=0.18;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideSpriteClassCollideIgnoreList([ShurikinClass,CloudBlockClass,DoorClass,PinClass,TrophyClass]);
        this.setCollideSpriteClassStandOnIgnoreList([ShurikinClass,DoorClass,PinClass,TrophyClass]);
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    jumpTowardsSprite(sprite) {
        this.bunnyJumpDirection=Math.sign(sprite.x-this.x);
        if (this.getCurrentGravity()>=0) this.addGravity(NinjaBunnyClass.BUNNY_JUMP_HEIGHT,0);
        
        this.playSound('jump');
    }
    
    jumpAwayFromSprite(sprite) {
        this.jumpTowardsSprite(sprite);
        this.bunnyJumpDirection=-this.bunnyJumpDirection;
        
        this.playSound('jump');
    }
    
    kill() {
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),ParticleClass.AFTER_SPRITES_LAYER,64,96,0.6,0.001,24,24,0,0,'particles/smoke',8,0.1,false,600);
        this.playSound('monster_die');
        this.delete();
    }
    
    onCollideSprite(sprite) {
        // colliding with ball, shield, bomb, or fish hurts bunny
        // no shurikins because they will hit each other
        if (
            (sprite instanceof BallClass) ||
            (sprite instanceof ShieldClass) ||
            (sprite instanceof BombClass) ||
            (sprite instanceof FishClass)) {
                this.kill();
                return;
        }
        
        // colliding with player kills bunny
        if (sprite instanceof PlayerSideScrollClass) {
            this.kill();
            return;
        }
        
        // another other sprite turns the bunny around
        this.jumpAwayFromSprite(sprite);
    }
    
    onStandOnSprite(sprite) {
        // standing on player kills bunny
        if (sprite instanceof PlayerSideScrollClass) {
            this.kill();
            return;
        }
    }
    
    onStoodOnSprite(sprite) {
        this.bunnyPause=NinjaBunnyClass.BUNNY_PAUSE_TICK; // don't jump if stood on
    }
    
    fireShurikin() {
        this.currentShurikin=new ShurikinClass(this.game,(this.x+16),(this.y-(this.height*0.5)),null);
        this.addSprite(this.currentShurikin);
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        this.shake=false;
        
        // bunny is only active at
        // certain distance from player
        let dist=playerSprite.x-this.x;
        
        this.bunnyActive=(Math.abs(dist)<NinjaBunnyClass.BUNNY_ACTIVATE_DISTANCE);
        if (!this.bunnyActive) return;
        
        // only move if jumping, and ignore if we have a shurikin out
        if (!this.grounded) {
            this.moveWithCollision((NinjaBunnyClass.BUNNY_AIR_SPEED*this.bunnyJumpDirection),0);
        }
        
        // gravity
        this.runGravity();
        
        // image 
        this.setCurrentImage((this.getCurrentGravity()<0)?'sprites/ninja_bunny_jump':'sprites/ninja_bunny');
        
        // if we have started falling, than launch
        // one shurikin     
        if (this.grounded) {
            this.bunnyShurikinOK=true;
            this.lastMotionY=0;
        }
        else {
            if (this.bunnyShurikinOK) {
                if ((this.lastMotionY<0) && (this.getCurrentGravity()>=0)) {
                    this.fireShurikin();
                    this.bunnyShurikinOK=false;
                }
                this.lastMotionY=this.getCurrentGravity();
            }
        }
        
        // if on the ground, we can jump after a
        // slight pause
        if (!this.grounded) {
            this.bunnyPause=NinjaBunnyClass.BUNNY_PAUSE_TICK;
            return;
        }
        
        // shake if nearing time to jump
        if (this.bunnyPause>0) {
            this.bunnyPause--;
            if (this.bunnyPause<(NinjaBunnyClass.BUNNY_PAUSE_TICK/3)) {
                this.shake=true;
                this.shakeSize=2;
                this.shakePeriodTick=0;
            }
            return;
        }
        
        // we can jump, find the direction
        // towards player and jump that way
        this.jumpTowardsSprite(playerSprite);
    }
    
}
