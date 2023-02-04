import SpriteClass from '../../rpjs/engine/sprite.js';
import WarpFilterClass from '../../rpjs/filters/warp.js';
import FlashFilterClass from '../../rpjs/filters/flash.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import CloudBlockClass from './cloud_block.js';
import ButtonClass from './button.js';
import SpringClass from './spring.js';
import DrainPipeSnakeClass from './drain_pipe_snake.js';
import NinjaBunnyClass from './ninja_bunny.js';
import ShurikinClass from './shurikin.js';
import RotoCarrotClass from './roto_carrot.js';
import BombClass from './bomb.js';
import FishClass from './fish.js';
import ExecutionerClass from './executioner.js';
import AxeClass from './axe.js';
import MrCPUClass from './mr_cpu.js';
import BoneyOneEyeClass from '../code/boney_one_eye.js';
import EyeClass from './eye.js';
import KingGhastlyClass from '../code/king_ghastly.js';

export default class PlayerSideScrollClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.WALK_MAX_SPEED=12;
        this.WALK_ACCEL=2.1;
        this.WALK_DECEL=2.5;
        this.JUMP_START_SPEED=16;
        this.AIR_MAX_SPEED=12;
        this.AIR_ACCEL=2.5;
        this.AIR_DECEL=2.0;
        this.JUMP_HEIGHT=-20;
        this.JUMP_GRAVITY_PAUSE=4;
        this.DEATH_TICK=100;
        this.INVINCIBLE_TICK=60;
        this.WARP_TICK=80;
        
        this.WALK_ANIMATION=['sprites/billy_walk_1','sprites/billy_walk_2','sprites/billy_walk_3','sprites/billy_walk_2'];
        
        // setup
        this.addImage('sprites/billy_walk_1');
        this.addImage('sprites/billy_walk_2');
        this.addImage('sprites/billy_walk_3');
        this.addImage('sprites/billy_jump_1');
        this.addImage('sprites/billy_shield');
        this.addImage('sprites/gravestone');
        
        this.setCurrentImage('sprites/billy_walk_1');
        this.flipX=false;
        
        this.show=true;
        this.gravityFactor=0.25;
        this.gravityMinValue=8;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        // variables
        this.moveX=0.0;
        this.moveY=0;
        
        this.lastGroundY=0;
        
        this.invincibleCount=-1;
        this.shieldCount=-1;
        this.deathCount=-1;
        this.warpCount=-1;
        
        this.flashDrawFilter=new FlashFilterClass();
        this.warpDrawFilter=new WarpFilterClass();
        
        this.startTimestamp=0;
        this.endTimestamp=0;
        
        this.ballSprite=null;
        this.shieldSprite=null;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new PlayerSideScrollClass(this.game,x,y,this.data));
    }
    
    isPlayer() {
        return(true);
    }
    
    mapStartup() {
        // the timing
        this.startTimestamp=this.endTimestamp=this.game.timestamp;

        // add the ball and shield sprite
        this.ballSprite=new BallClass(this.game,0,0,null);
        this.game.map.addSprite(this.ballSprite);
        
        this.shieldSprite=new ShieldClass(this.game,0,0,null);
        this.game.map.addSprite(this.shieldSprite);
    }
    
    getPlayTimeAsString() {
        return(''+((this.endTimestamp-this.startTimestamp)/1000).toFixed(2));
    }
    
    hurtPlayer() {
        let health;
        
        if ((this.invincibleCount>0) || (this.shieldCount>0) || (this.warpCount>0) || (this.deathCount>0)) return;
        
        this.game.soundList.play('hurt');
        
        health=this.game.getData('player_health')-1;
        this.game.setData('player_health',health);
        if (health===0) {
            this.killPlayer();
            return;
        }
        
        this.invincibleCount=this.INVINCIBLE_TICK;
        this.drawFilter=this.flashDrawFilter;
    }
    
    killPlayer() {
        this.setCurrentImage('sprites/gravestone');
        this.motion.x=0;
        this.motion.y=0;
        this.gravityFactor=0;
        this.alpha=1.0;
        this.invincibleCount=-1;
        this.shieldCount=-1;
        this.drawFilter=null;
        this.flipX=false;
        
        this.game.map.getFirstSpriteOfType(BallClass).show=false;
        this.game.musicList.stop();
        this.game.soundList.play('funeral_march');
        
        this.game.setData('player_health',0);
        this.deathCount=this.DEATH_TICK;
    }
    
    interactWithSprite(interactSprite,dataObj) {
        
        // interactions that hurt you
        if (interactSprite instanceof KingGhastlyClass) {
            if (interactSprite.standSprite===this) {
                this.killPlayer();    // king ghastly is a special sprite that kills instantly if you stand on him, so you can get around him
            }
            else {
                this.hurtPlayer();
            }
            return;
        }
        if ((interactSprite instanceof DrainPipeSnakeClass) || (interactSprite instanceof NinjaBunnyClass) || (interactSprite instanceof ShurikinClass) || (interactSprite instanceof RotoCarrotClass) || (interactSprite instanceof BombClass) || (interactSprite instanceof FishClass) || (interactSprite instanceof MrCPUClass) || (interactSprite instanceof EyeClass)) {
            this.hurtPlayer();
            return;
        }
        if ((interactSprite instanceof ExecutionerClass) || (interactSprite instanceof BoneyOneEyeClass)) {
            if (this.standSprite!==interactSprite) this.hurtPlayer(); // ok to stand on these sprites
            return;
        }
        if (interactSprite instanceof AxeClass) {
            this.hurtPlayer();
            return;
        }
        
        // the ball interaction turns on the shield
        if (interactSprite instanceof BallClass) {
            this.shieldCount=this.shieldSprite.LIFE_TICK;
            this.shieldSprite.interactWithSprite(this,null);
        }
    }
    
    warpOut() {
        this.warpCount=this.WARP_TICK;
        this.drawFilter=this.warpDrawFilter;
        
        this.game.map.getFirstSpriteOfType(BallClass).show=false;
        
        this.gravityFactor=0.0; // make sure we don't fall when warping
        this.motion.y=0;
        
        this.game.soundList.play('teleport');
    }
    
    runAI() {
        let walking,walkAnimationFrame,didCollide;
        let map=this.game.map;
        
        // warping? 
        if (this.warpCount!==-1) {
            this.drawFilterAnimationFactor=1.0-(this.warpCount/this.WARP_TICK);
            this.warpCount--;
            if (this.warpCount<=0) this.game.gotoMap('world_main');
            return;
        }
        
        // dead?
        if (this.deathCount!==-1) {
            this.deathCount--;
            if (this.deathCount<=0) this.game.gotoMap('world_main');
            return;
        }
        
        // only update the end timestamp if we aren't
        // dead or warping
        this.endTimestamp=this.game.timestamp;
        
        // invincible
        if (this.invincibleCount!==-1) {
            this.drawFilterAnimationFactor=1.0-(this.invincibleCount/this.INVINCIBLE_TICK);
            this.invincibleCount--;
            if (this.invincibleCount<=0) {
                this.invincibleCount=-1;
                this.drawFilter=null;
            }
        }
        
        // shield
        if (this.shieldCount!==-1) {
            this.shieldCount--;
            if (this.shieldCount<=0) {
                this.shieldCount=-1;
            }
        }
        
        // walking input
        walking=false;
  
        if (this.game.input.isKeyDown("KeyA")) {
            this.flipX=true;
            if (this.grounded) {
                if (this.moveX>-this.WALK_MAX_SPEED) { // can go up but not over when moving
                    this.moveX-=this.WALK_ACCEL;
                    if (this.moveX<-this.WALK_MAX_SPEED) this.moveX=-this.WALK_MAX_SPEED;
                }
                walking=true;
            }
            else {
                if (this.moveX>-this.AIR_MAX_SPEED) {
                    this.moveX-=this.AIR_ACCEL;
                    if (this.moveX<-this.AIR_MAX_SPEED) this.moveX=-this.AIR_MAX_SPEED;
                }
            }
        }
        if (this.game.input.isKeyDown("KeyD")) {
            this.flipX=false;
            if (this.grounded) {
                if (this.moveX<this.WALK_MAX_SPEED) {
                    this.moveX+=this.WALK_ACCEL;
                    if (this.moveX>this.WALK_MAX_SPEED) this.moveX=this.WALK_MAX_SPEED;
                }
                walking=true;
            }
            else {
                if (this.moveX<this.AIR_MAX_SPEED) {
                    this.moveX+=this.AIR_ACCEL;
                    if (this.moveX>this.AIR_MAX_SPEED) this.moveX=this.AIR_MAX_SPEED;
                }
            }
            
        }
        
        // automatically decelerate in air
        if (((!walking) || (!this.grounded)) && (this.moveX!==0.0)) {
            if (this.moveX<0.0) {
                this.moveX+=(this.grounded?this.WALK_DECEL:this.AIR_DECEL);
                if (this.moveX>=0.0) this.moveX=0.0;
            }
            else {
                this.moveX-=(this.grounded?this.WALK_DECEL:this.AIR_DECEL);
                if (this.moveX<=0.0) this.moveX=0.0;
            }
        }
        
        
        if (this.moveX!==0.0) {
            this.shieldSprite.canCollide=false;
            didCollide=this.moveWithCollision(this.moveX,0);
            if (didCollide) this.motion.y=0.0;
            this.shieldSprite.canCollide=true;
        }
            walkAnimationFrame=Math.trunc(this.game.timestamp/150)%4;
            this.setCurrentImage(this.WALK_ANIMATION[walkAnimationFrame]);
            this.drawFilter=null;

            
            //if (this.motion.y<5) console.info(this.motion.y+'>'+this.gravityAdd);
        
        /*
        
        if (this.game.input.isKeyDown("KeyA")) {
            moveX=-(this.grounded?this.WALK_SPEED:this.WALK_AIR_SPEED);
            this.data.set('facing_direction',-1);
            walking=true;
        }
        if (this.game.input.isKeyDown("KeyD")) {
            moveX=this.grounded?this.WALK_SPEED:this.WALK_AIR_SPEED;
            walking=true;
        }
        
        if (this.shieldCount!==-1) moveX=0;
        
        if (moveX!==0) {
            this.shieldSprite.canCollide=false;
            this.moveWithCollision(moveX,0);
            this.shieldSprite.canCollide=true;
            walkAnimationFrame=Math.trunc(this.game.timestamp/150)%4;
            this.setCurrentImage(this.WALK_ANIMATION_RIGHT[walkAnimationFrame]);
        }
        
        */
        
        if ((!walking) || (!this.grounded)) {
            this.setCurrentImage((this.motion.y<0)?'sprites/billy_jump_1':'sprites/billy_walk_1');
        }
        
        this.clampX(0,(map.width-this.width));
        
        // jumping
        if ((this.game.input.isKeyDown("Space")) && (this.grounded)) {
            if (this.moveX<0.0) {
                this.moveX=-this.JUMP_START_SPEED;
            }
            if (this.moveX>0.0) {
                this.moveX=this.JUMP_START_SPEED;
            }
            this.motion.y+=this.JUMP_HEIGHT;
            this.gravityPauseTick=this.JUMP_GRAVITY_PAUSE;
        }
        
        // remember the last ground because
        // we use that to tell the ball's location
        // for bowling   
        if (this.grounded) this.lastGroundY=this.y;
        
        // interact with any colliding sprite
        if (this.collideSprite!==null) {
            this.collideSprite.interactWithSprite(this,null);
        }
        
        // check for standing on a cloud or button
        if (this.standSprite!==null) {
            if ((this.standSprite instanceof CloudBlockClass) || (this.standSprite instanceof ButtonClass) || (this.standSprite instanceof SpringClass)) {
                this.standSprite.interactWithSprite(this,null);
            }
        }
        
        // check for hitting liquid
        if (map.liquidY!==-1) {
            if (this.y>=map.liquidY) this.killPlayer();
        }
    }
}
