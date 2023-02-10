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
        
        this.invincibleCount=-1;
        this.shieldCount=-1;
        this.deathCount=-1;
        this.warpCount=-1;
        
        this.flashDrawFilter=new FlashFilterClass();
        this.warpDrawFilter=new WarpFilterClass();
        
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
        
        this.game.soundList.play('hurt');
        
        health=this.game.getData('player_health')-1;
        this.game.setData('player_health',health);
        if (health===0) {
            this.killPlayer();
            return;
        }
        
        this.invincibleCount=this.INVINCIBLE_TICK;
    }
    
    killPlayer() {
        this.moveX=0;
        this.gravityFactor=0;
        this.gravityMoveY=0;
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
    
    collide() {
        if (this.collideSprite instanceof KingGhastlyClass) {
            if (this.standSprite===this.collideSprite) {
                this.killPlayer(); // king ghastly is a special sprite that kills instantly if you stand on him, so you can get around him
            }
            else {
                this.hurtPlayer();
            }
            return;
        }
        if (this.collideSprite instanceof DrainPipeSnakeClass) {
            this.sendMessage(this.collideSprite,'break_pipe',null); // pipe snakes break their pipes when hurting player
            this.hurtPlayer();
            return;
        }
        if (this.collideSprite instanceof NinjaBunnyClass) {
            this.sendMessage(this.collideSprite,'kill',null); // ninja bunnies die hitting player
            this.hurtPlayer();
            return;
        }
        if ((this.collideSprite instanceof ShurikinClass) || (this.collideSprite instanceof RotoCarrotClass) || (this.collideSprite instanceof BombClass) || (this.collideSprite instanceof FishClass) || (this.collideSprite instanceof MrCPUClass) || (this.collideSprite instanceof EyeClass) || (this.collideSprite instanceof AxeClass)) {
            this.hurtPlayer();
            return;
        }
        if ((this.collideSprite instanceof ExecutionerClass) || (this.collideSprite instanceof BoneyOneEyeClass)) {
            if (this.standSprite!==this.collideSprite) this.hurtPlayer(); // ok to stand on these sprites
            return;
        }
    }
    
    processMessage(fromSprite,cmd,data) {
        switch (cmd) {
            case 'start_shield':
                this.shieldCount=this.shieldSprite.LIFE_TICK;
                this.sendMessage(this.shieldSprite,'start_shield',null);
                return;
            case 'hurt':
                this.hurtPlayer();
                return;
        }
    }
    
    warpOut() {
        this.warpCount=this.WARP_TICK;
        
        this.game.map.getFirstSpriteOfType(BallClass).show=false;
        
        this.gravityFactor=0.0; // make sure we don't fall when warping
        this.gravityMoveY=0;
        
        this.game.soundList.play('teleport');
    }
    
    run() {
        let goLeft, goRight;
        let map=this.game.map;
        
        this.drawFilter=null;
        
        // warping? 
        if (this.warpCount!==-1) {
            this.setCurrentImage('sprites/billy_walk_1');
            this.drawFilter=this.warpDrawFilter;
            this.drawFilterAnimationFactor=1.0-(this.warpCount/this.WARP_TICK);
            this.warpCount--;
            if (this.warpCount<=0) this.game.gotoMap('world_main');
            return;
        }
        
        // dead?
        if (this.deathCount!==-1) {
            this.setCurrentImage('sprites/gravestone');
            this.deathCount--;
            if (this.deathCount<=0) this.game.gotoMap('world_main');
            return;
        }
        
        // invincible
        if (this.invincibleCount!==-1) {
            this.drawFilter=this.flashDrawFilter;
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
        
        // check for colliding with things that can hurt you
        if (this.collideSprite!=null) {
            this.collide();
        }

        // jumping
        if ((this.game.input.isKeyDown("Space")) && (this.grounded)) {
            if (this.moveX<0.0) {
                this.moveX=-this.JUMP_START_SPEED;
            }
            if (this.moveX>0.0) {
                this.moveX=this.JUMP_START_SPEED;
            }
            this.gravityMoveY+=this.JUMP_HEIGHT;
            this.gravityPauseTick=this.JUMP_GRAVITY_PAUSE;
        }
        
        this.runGravity();
        
        // determine the sprite image
        // if in air, determine jump/fall sprites
        if (!this.grounded) {
            this.setCurrentImage((this.gravityMoveY<0)?'sprites/billy_jump_1':'sprites/billy_fall_1');
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
        
        // check for standing on a cloud or button
        if (this.standSprite!==null) {
            if ((this.standSprite instanceof CloudBlockClass) || (this.standSprite instanceof ButtonClass) || (this.standSprite instanceof SpringClass)) {
                this.standSprite.interactWithSprite(this,null);
            }
        }
        
        // check for hitting liquid
        if (map.liquidY!==-1) {
            if (this.y>=map.liquidY) {
                this.killPlayer();
                return;
            }
        }
    }
}
