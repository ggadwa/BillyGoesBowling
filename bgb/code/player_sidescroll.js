import SpriteClass from '../../rpjs/engine/sprite.js';
import InputClass from '../../rpjs/engine/input.js';
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
import KangarangClass from '../code/kangarang.js';
import BoomerangClass from './boomerang.js';
import KingGhastlyClass from '../code/king_ghastly.js';

export default class PlayerSideScrollClass extends SpriteClass {

    static WALK_MAX_SPEED=6;
    static WALK_ACCEL=1.1;
    static WALK_DECEL=1.25;
    static AIR_MAX_SPEED=6;
    static AIR_ACCEL=1.25;
    static AIR_DECEL=1.0;
    static JUMP_START_SPEED=8;
    static JUMP_HEIGHT=-10;
    static JUMP_GRAVITY_PAUSE=8;
    static DEATH_TICK=200;
    static INVINCIBLE_TICK=120;
    static WARP_TICK=80;
    static WALK_FRAME_TICK=8;
    static MAX_HEALTH=4;
        
    static WALK_ANIMATION=['sprites/billy_walk_1','sprites/billy_walk_2','sprites/billy_walk_3','sprites/billy_walk_2'];   

    constructor(game,x,y,data) {
        super(game,x,y,data);

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

        this.gravityFactor=0.125;
        this.gravityMinValue=4;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideSpriteClassCollideIgnoreList([BallClass,ShieldClass]);
        this.setCollideSpriteClassStandOnIgnoreList([BallClass,ShieldClass]);
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    isPlayer() {
        return(true);
    }
    
    mapStartup() {
        this.health=PlayerSideScrollClass.MAX_HEALTH;
        // add the ball sprite
        this.ballSprite=new BallClass(this.game,0,0,null);
        this.addSprite(this.ballSprite);
        // add the shield sprite
        this.shieldSprite=new ShieldClass(this.game,0,0,null);
        this.addSprite(this.shieldSprite);
    }
    
    hurtPlayer() {
        if ((this.invincibleCount>0) || (this.shieldCount>0) || (this.warpCount>0) || (this.deathCount>0)) return;
        
        this.playSound('hurt');
        
        //this.health--;
        if (this.health===0) {
            this.killPlayer();
            return;
        }
        
        this.invincibleCount=PlayerSideScrollClass.INVINCIBLE_TICK;
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
        
        this.ballSprite.show=false;
        this.game.musicList.stop();
        this.playSound('funeral_march');
        
        this.health=0;
        this.deathCount=PlayerSideScrollClass.DEATH_TICK;
    }
    
    warpOut() {
        this.warpCount=PlayerSideScrollClass.WARP_TICK;
        
        this.ballSprite.show=false;
        
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
            (sprite instanceof KangarangClass)||
            (sprite instanceof BoomerangClass)) {
                this.hurtPlayer();
                return;
        }
        
        // ghastly insta-kills
        if (sprite instanceof KingGhastlyClass) {
            this.killPlayer();
        }
    }
    
    onStoodOnSprite(sprite) {
        // these sprites hurt player if they land on them
        if (
            (sprite instanceof NinjaBunnyClass) ||
            (sprite instanceof ExecutionerClass) ||
            (sprite instanceof MrCPUClass) ||
            (sprite instanceof BoneyOneEyeClass) ||
            (sprite instanceof KangarangClass)) {
                this.hurtPlayer();
                return;
        }
        
        // ghastly insta-kills
        if (sprite instanceof KingGhastlyClass) {
            this.killPlayer();
        }
    }
    
    onStandOnSprite(sprite) {
        // special case so you can't stand on ghastly to get around him
        // and falling into kangarang area is instant death
        if (
            (sprite instanceof KangarangClass) ||
            (sprite instanceof KingGhastlyClass)) {
                this.killPlayer();
                return;
        }
    }
    
    onMessage(fromSprite,cmd,data) {
        switch (cmd) {
            case 'start_shield':
                this.shieldCount=ShieldClass.LIFE_TICK;
                this.sendMessage(this.shieldSprite,'start_shield',null);
                return;
            case 'warp_out':
                this.warpOut();
                return;
        }
    }
    
    onRun(tick) {
        let walkLeft,walkRight,jump;
        
        // warping? 
        if (this.warpCount!==0) {
            this.setCurrentImage('sprites/billy_walk_1');
            this.resizeX=this.resizeY=this.alpha=(this.warpCount-1)/PlayerSideScrollClass.WARP_TICK;
            this.warpCount--;
            if (this.warpCount===0) this.game.gotoMap('world_main');
            return;
        }
        
        // dead?
        if (this.deathCount!==0) {
            this.setCurrentImage('sprites/gravestone');
            this.shake=true;
            this.shakeSize=3;
            this.shakePeriodTick=30;
            this.deathCount--;
            if (this.deathCount===0) this.game.gotoMap('world_main');
            return;
        }
        
        // invincible
        this.flash=false;
        
        if (this.invincibleCount!==0) {
            this.invincibleCount--;
            if (this.invincibleCount>0) {
                this.flash=true;
                this.flashRate=(this.invincibleCount>(PlayerSideScrollClass.INVINCIBLE_TICK/2))?5:2;
            }
        }
        
        // when shield is on, you can't move
        if (this.shieldCount!==0) {
            this.shieldCount--;
            walkLeft=false;
            walkRight=false;
            jump=false;
        }
        else {
            walkLeft=this.getInputStateIsNegative(InputClass.LEFT_STICK_X);
            walkRight=this.getInputStateIsPositive(InputClass.LEFT_STICK_X);
            jump=this.getInputStateBoolean(InputClass.BUTTON_A);
        }
        
        // if we just started going left and right, reset walking
        // animation to frame 0
        if ((walkLeft) || (walkRight)) {
            if (!this.walking) {
                this.walkAnimationFrame=0;
                this.walkAnimationFrameCount=PlayerSideScrollClass.WALK_FRAME_TICK;
                this.walking=true;
            }
        }
        else {
            this.walking=false;
        }
        
        if (walkLeft) {
            if (this.grounded) this.flipX=true;
            
            if (this.grounded) {
                if (this.moveX>-PlayerSideScrollClass.WALK_MAX_SPEED) {
                    this.moveX-=PlayerSideScrollClass.WALK_ACCEL;
                    if (this.moveX<-PlayerSideScrollClass.WALK_MAX_SPEED) this.moveX=-PlayerSideScrollClass.WALK_MAX_SPEED;
                }
            }
            else {
                if (this.moveX>-PlayerSideScrollClass.AIR_MAX_SPEED) {
                    this.moveX-=PlayerSideScrollClass.AIR_ACCEL;
                    if (this.moveX<-PlayerSideScrollClass.AIR_MAX_SPEED) this.moveX=-PlayerSideScrollClass.AIR_MAX_SPEED;
                }
            }
        }
        
        // walk right
        if (walkRight) {
            if (this.grounded) this.flipX=false;
            
            if (this.grounded) {
                if (this.moveX<PlayerSideScrollClass.WALK_MAX_SPEED) {
                    this.moveX+=PlayerSideScrollClass.WALK_ACCEL;
                    if (this.moveX>PlayerSideScrollClass.WALK_MAX_SPEED) this.moveX=PlayerSideScrollClass.WALK_MAX_SPEED;
                }
            }
            else {
                if (this.moveX<PlayerSideScrollClass.AIR_MAX_SPEED) {
                    this.moveX+=PlayerSideScrollClass.AIR_ACCEL;
                    if (this.moveX>PlayerSideScrollClass.AIR_MAX_SPEED) this.moveX=PlayerSideScrollClass.AIR_MAX_SPEED;
                }
            }
        }
        
        // any deceleration -- we don't decelerate if walking but always decel in air
        if (((!this.walking) || (!this.grounded)) && (this.moveX!==0.0)) {
            if (this.moveX<0.0) {
                this.moveX+=(this.grounded?PlayerSideScrollClass.WALK_DECEL:PlayerSideScrollClass.AIR_DECEL);
                if (this.moveX>=0.0) this.moveX=0.0;
            }
            else {
                this.moveX-=(this.grounded?PlayerSideScrollClass.WALK_DECEL:PlayerSideScrollClass.AIR_DECEL);
                if (this.moveX<=0.0) this.moveX=0.0;
            }
        }
        
        // now move, turning off any collision with ball or shield
        this.moveWithCollision(this.moveX,0);
        
        this.clampX(0,(this.getMapWidth()-this.width));
        
        // jumping
        if ((jump) && (this.grounded)) {
            if (this.moveX<0.0) {
                this.moveX=-PlayerSideScrollClass.JUMP_START_SPEED;
            }
            if (this.moveX>0.0) {
                this.moveX=PlayerSideScrollClass.JUMP_START_SPEED;
            }
            this.addGravity(PlayerSideScrollClass.JUMP_HEIGHT,PlayerSideScrollClass.JUMP_GRAVITY_PAUSE);
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
                this.walkAnimationFrameCount=PlayerSideScrollClass.WALK_FRAME_TICK;

                if (this.walking) {
                    this.walkAnimationFrame=(this.walkAnimationFrame+1)%4;
                }
                else {
                    if (this.walkAnimationFrame!==0) this.walkAnimationFrame=(this.walkAnimationFrame+1)%4;
                }
            }
            this.setCurrentImage(PlayerSideScrollClass.WALK_ANIMATION[this.walkAnimationFrame]);
        }
        
        // remember the last ground because
        // we use that to tell the ball's location
        // for bowling   
        if (this.grounded) this.lastGroundY=this.y;
        
        // check for hitting liquid
        if (this.isInLiquid()) {
            this.killPlayer();
            return;
        }
    }
}
