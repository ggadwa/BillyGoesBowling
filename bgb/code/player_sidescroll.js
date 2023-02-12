import SpriteClass from '../../rpjs/engine/sprite.js';
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
        this.WARP_TICK=40;
        this.WALK_FRAME_TICK=3;
        
        this.WALK_ANIMATION=['sprites/billy_walk_1','sprites/billy_walk_2','sprites/billy_walk_3','sprites/billy_walk_2'];
        
        // setup
        this.addImage('sprites/billy_walk_1');
        this.addImage('sprites/billy_walk_2');
        this.addImage('sprites/billy_walk_3');
        this.addImage('sprites/billy_jump_1');
        this.addImage('sprites/billy_fall_1');
        this.addImage('sprites/gravestone');
        
        this.setCurrentImage('sprites/billy_walk_1');
        this.flipX=false;
        
        this.show=true;
        
        this.walkMaxSpeed=12.0;
        this.walkAccel=2.1;
        this.walkDecel=2.5;
        this.airMaxSpeed=12.0;
        this.airAccel=2.5;
        this.airDecel=2.0;

        this.gravityFactor=0.25;
        this.gravityMinValue=8;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        // variables
        this.moveX=0;
        this.walking=false;
        this.walkAnimationFrame=0;
        this.walkAnimationFrameCount=-1;
        this.lastGroundY=0;
        
        this.invincibleCount=0;
        this.shieldCount=0;
        this.deathCount=0;
        this.warpCount=0;
        
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
        // add the ball sprite
        this.ballSprite=new BallClass(this.game,0,0,null);
        this.game.map.addSprite(this.ballSprite);
        // add the shield sprite
        this.shieldSprite=new ShieldClass(this.game,0,0,null);
        this.game.map.addSprite(this.shieldSprite);
    }
    
    hurtPlayer() {
        let health;
        
        if ((this.invincibleCount>0) || (this.shieldCount>0) || (this.warpCount>0) || (this.deathCount>0)) return;
        
        this.playSound('hurt');
        
        health=this.game.getData('player_health')-1;
        this.game.setData('player_health',health);
        if (health===0) {
            this.killPlayer();
            return;
        }
        
        this.invincibleCount=this.INVINCIBLE_TICK;
        this.flash=true;
    }
    
    killPlayer() {
        this.moveX=0;
        this.alpha=1.0;
        this.invincibleCount=0;
        this.shieldCount=0;
        this.flipX=false;
        this.flash=false;
        this.canCollide=false;
        
        this.stopAllGravity();
        
        this.game.map.getFirstSpriteOfType(BallClass).show=false;
        this.game.musicList.stop();
        this.playSound('funeral_march');
        
        this.game.setData('player_health',0);
        this.deathCount=this.DEATH_TICK;
    }
    
    warpOut() {
        this.warpCount=this.WARP_TICK;
        
        this.game.map.getFirstSpriteOfType(BallClass).show=false;
        
        this.stopAllGravity();
        
        this.playSound('teleport');
    }
    
    onCollideSprite(sprite) {
        if (
            (sprite instanceof DrainPipeSnakeClass) ||
            (sprite instanceof NinjaBunnyClass) ||
            (sprite instanceof ShurikinClass) ||
            (sprite instanceof RotoCarrotClass) ||
            (sprite instanceof BombClass) ||
            (sprite instanceof FishClass) ||
            (sprite instanceof ExecutionerClass) ||
            (sprite instanceof AxeClass) ||
            (sprite instanceof MrCPUClass) ||
            (sprite instanceof BoneyOneEyeClass) ||
            (sprite instanceof EyeClass) ||
            (sprite instanceof KingGhastlyClass)) {
                this.hurtPlayer();
                return;
        }
    }
    
    onStoodOnSprite(sprite) {
        if (sprite instanceof KingGhastlyClass) this.killPlayer(); // king ghastly instant kills players so you can't get around him by standing on top
    }
    
    processMessage(fromSprite,cmd,data) {
        switch (cmd) {
            case 'start_shield':
                this.shieldCount=this.shieldSprite.LIFE_TICK;
                this.sendMessage(this.shieldSprite,'start_shield',null);
                return;
            case 'warp_out':
                this.warpOut();
                return;
        }
    }
    
    run() {
        let goLeft, goRight;
        let map=this.game.map;
        
        // warping? 
        if (this.warpCount!==0) {
            this.setCurrentImage('sprites/billy_walk_1');
            this.resizeX=this.alpha=(this.warpCount-1)/this.WARP_TICK;
            this.warpCount--;
            if (this.warpCount===0) this.game.gotoMap('world_main');
            return;
        }
        
        // dead?
        if (this.deathCount!==0) {
            this.setCurrentImage('sprites/gravestone');
            this.deathCount--;
            if (this.deathCount===0) this.game.gotoMap('world_main');
            return;
        }
        
        // invincible
        if (this.invincibleCount!==0) {
            this.invincibleCount--;
            if (this.invincibleCount===0) this.flash=false;
        }
        
        // shield
        if (this.shieldCount!==0) {
            this.shieldCount--;
        }
        
        // walk left and right
        goLeft=this.game.input.isKeyDown("KeyA");
        goRight=this.game.input.isKeyDown("KeyD");
        
        // if we just started going left and right, reset walking
        // animation to frame 0
        if ((goLeft) || (goRight)) {
            if (!this.walking) {
                this.walkAnimationFrame=0;
                this.walkAnimationFrameCount=this.WALK_FRAME_TICK;
                this.walking=true;
            }
        }
        else {
            this.walking=false;
        }
        
        if (goLeft) {
            if (this.grounded) this.flipX=true;
            
            if (this.grounded) {
                if (this.moveX>-this.walkMaxSpeed) {
                    this.moveX-=this.walkAccel;
                    if (this.moveX<-this.walkMaxSpeed) this.moveX=-this.walkMaxSpeed;
                }
            }
            else {
                if (this.moveX>-this.airMaxSpeed) {
                    this.moveX-=this.airAccel;
                    if (this.moveX<-this.airMaxSpeed) this.moveX=-this.airMaxSpeed;
                }
            }
        }
        
        // walk right
        if (goRight) {
            if (this.grounded) this.flipX=false;
            
            if (this.grounded) {
                if (this.moveX<this.walkMaxSpeed) {
                    this.moveX+=this.walkAccel;
                    if (this.moveX>this.walkMaxSpeed) this.moveX=this.walkMaxSpeed;
                }
            }
            else {
                if (this.moveX<this.airMaxSpeed) {
                    this.moveX+=this.airAccel;
                    if (this.moveX>this.airMaxSpeed) this.moveX=this.airMaxSpeed;
                }
            }
        }
        
        // any deceleration -- we don't decelerate if walking but always decel in air
        if (((!this.walking) || (!this.grounded)) && (this.moveX!==0.0)) {
            if (this.moveX<0.0) {
                this.moveX+=(this.grounded?this.WALK_DECEL:this.AIR_DECEL);
                if (this.moveX>=0.0) this.moveX=0.0;
            }
            else {
                this.moveX-=(this.grounded?this.WALK_DECEL:this.AIR_DECEL);
                if (this.moveX<=0.0) this.moveX=0.0;
            }
        }
        
        // now move, turning off any collision with ball or shield
        this.ballSprite.canCollide=false;
        this.shieldSprite.canCollide=false;
        this.moveWithCollision(this.moveX,0);
        this.shieldSprite.canCollide=true;
        this.ballSprite.canCollide=true;
        
        this.clampX(0,(map.width-this.width));
        
        // jumping
        if ((this.game.input.isKeyDown("Space")) && (this.grounded)) {
            if (this.moveX<0.0) {
                this.moveX=-this.JUMP_START_SPEED;
            }
            if (this.moveX>0.0) {
                this.moveX=this.JUMP_START_SPEED;
            }
            this.addGravity(this.JUMP_HEIGHT,this.JUMP_GRAVITY_PAUSE);
        }
        
        this.runGravity();
        
        // determine the sprite image
        // if in air, determine jump/fall sprites
        if (!this.grounded) {
            this.setCurrentImage((this.getCurrentGravity()<0)?'sprites/billy_jump_1':'sprites/billy_fall_1');
        }
        // when walking, we just update the animation frame,
        // when not walking, we animate until we hit 0 and stop
        else {
            this.walkAnimationFrameCount--;
            if (this.walkAnimationFrameCount<0) {
                this.walkAnimationFrameCount=this.WALK_FRAME_TICK;

                if (this.walking) {
                    this.walkAnimationFrame=(this.walkAnimationFrame+1)%4;
                }
                else {
                    if (this.walkAnimationFrame!==0) this.walkAnimationFrame=(this.walkAnimationFrame+1)%4;
                }
            }
            this.setCurrentImage(this.WALK_ANIMATION[this.walkAnimationFrame]);
        }
        
        // remember the last ground because
        // we use that to tell the ball's location
        // for bowling   
        if (this.grounded) this.lastGroundY=this.y;
        
        // check for hitting liquid
        if (map.liquidY!==-1) {
            if (this.y>=map.liquidY) {
                this.killPlayer();
                return;
            }
        }
    }
}
