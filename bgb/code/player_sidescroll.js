import SpriteClass from '../../rpjs/engine/sprite.js';
import WarpFilterClass from '../../rpjs/filters/warp.js';
import FlashFilterClass from '../../rpjs/filters/flash.js';
import BallClass from './ball.js';
import CloudBlockClass from './cloud_block.js';
import ButtonClass from './button.js';
import SpringClass from './spring.js';
import DrainPipeSnakeClass from './drain_pipe_snake.js';
import NinjaBunnyClass from './ninja_bunny.js';
import ShurikinClass from './shurikin.js';
import RotoCarrotClass from './roto_carrot.js';
import BombClass from './bomb.js';
import RockClass from './rock.js';
import ExecutionerClass from './executioner.js';
import AxeClass from './axe.js';
import MrCPUClass from './mr_cpu.js';
import BoneyOneEyeClass from '../code/boney_one_eye.js';
import EyeClass from './eye.js';
import KingGhastlyClass from '../code/king_ghastly.js';

export default class PlayerSideScrollClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // constants
            
        this.JUMP_HEIGHT=-40;
        this.DEATH_TICK=100;
        this.INVINCIBLE_TICK=60;
        this.WARP_TICK=80;
        
        this.WALK_ANIMATION_LEFT=['sprites/billy_left_1','sprites/billy_left_2','sprites/billy_left_3','sprites/billy_left_2'];
        this.WALK_ANIMATION_RIGHT=['sprites/billy_right_1','sprites/billy_right_2','sprites/billy_right_3','sprites/billy_right_2'];
        
            // setup
            
        this.addImage('sprites/billy_left_1');
        this.addImage('sprites/billy_left_2');
        this.addImage('sprites/billy_left_3');
        this.addImage('sprites/billy_left_jump');
        this.addImage('sprites/billy_right_1');
        this.addImage('sprites/billy_right_2');
        this.addImage('sprites/billy_right_3');
        this.addImage('sprites/billy_right_jump');
        this.addImage('sprites/gravestone');
        
        this.setCurrentImage('sprites/billy_right_1');
        
        this.show=true;
        this.gravityFactor=0.14;
        this.gravityMinValue=3;
        this.gravityMaxValue=25;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.lastGroundY=0;
        
        this.invincibleCount=-1;
        this.deathCount=-1;
        this.warpCount=-1;
        
        this.flashDrawFilter=new FlashFilterClass();
        this.warpDrawFilter=new WarpFilterClass();
        
        this.startTimestamp=0;
        this.endTimestamp=0;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new PlayerSideScrollClass(this.game,x,y,this.data));
    }
    
    isPlayer()
    {
        return(true);
    }
    
    mapStartup()
    {
            // the timing
            
        this.startTimestamp=this.endTimestamp=this.game.timestamp;

            // add the ball sprite
            
        this.game.map.addSprite(new BallClass(this.game,0,0,null));
    }
    
    getPlayTimeAsString()
    {
        return(''+((this.endTimestamp-this.startTimestamp)/1000).toFixed(2));
    }
    
    hurtPlayer()
    {
        let health;
        
        if ((this.invincibleCount>0) || (this.warpCount>0) || (this.deathCount>0)) return;
        
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
    
    killPlayer()
    {
        this.setCurrentImage('sprites/gravestone');
        this.motion.x=0;
        this.motion.y=0;
        this.gravityFactor=0;
        this.alpha=1.0;
        this.invincibleCount=-1;
        this.drawFilter=null;
        
        this.game.map.getFirstSpriteOfType(BallClass).show=false;
        this.game.musicList.stop();
        this.game.soundList.play('funeral_march');
        
        this.game.setData('player_health',0);
        this.deathCount=this.DEATH_TICK;
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof KingGhastlyClass) {
            if (interactSprite.standSprite===this) {
                this.killPlayer();    // king ghastly is a special sprite that kills instantly if you stand on him, so you can get around him
            }
            else {
                this.hurtPlayer();
            }
            return;
        }
        if ((interactSprite instanceof DrainPipeSnakeClass) || (interactSprite instanceof NinjaBunnyClass) || (interactSprite instanceof ShurikinClass) || (interactSprite instanceof RotoCarrotClass) || (interactSprite instanceof BombClass) || (interactSprite instanceof RockClass) || (interactSprite instanceof MrCPUClass) || (interactSprite instanceof EyeClass)) {
            this.hurtPlayer();
            return;
        }
        if ((interactSprite instanceof ExecutionerClass) || (interactSprite instanceof BoneyOneEyeClass)) {
            if (this.standSprite!==interactSprite) this.hurtPlayer();       // ok to stand on these sprites
            return;
        }
        if (interactSprite instanceof AxeClass) {
            this.hurtPlayer();
            return;
        }
    }
    
    warpOut()
    {
        this.warpCount=this.WARP_TICK;
        this.drawFilter=this.warpDrawFilter;
        
        this.game.map.getFirstSpriteOfType(BallClass).show=false;
        
        this.gravityFactor=0.0;     // make sure we don't fall when warping
        this.motion.y=0;
        
        this.game.soundList.play('teleport');
    }
    
    runAI()
    {
        let walking,walkAnimationFrame;
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
        
            // walking input
            
        walking=false;
        walkAnimationFrame=Math.trunc(this.game.timestamp/150)%4;
        
        if (this.game.input.isLeft()) {
            this.moveWithCollision(-12,0);
            this.setCurrentImage(this.WALK_ANIMATION_LEFT[walkAnimationFrame]);
            this.data.set('facing_direction',-1);
            walking=true;
        }
        
        if (this.game.input.isRight()) {
            this.moveWithCollision(12,0);
            this.setCurrentImage(this.WALK_ANIMATION_RIGHT[walkAnimationFrame]);
            this.data.set('facing_direction',1);
            walking=true;
        }
        
        if ((!walking) || (!this.grounded)) {
            if (this.data.get('facing_direction')===-1) {
                this.setCurrentImage((this.motion.y<0)?'sprites/billy_left_jump':'sprites/billy_left_1');
            }
            else {
                this.setCurrentImage((this.motion.y<0)?'sprites/billy_right_jump':'sprites/billy_right_1');
            }
        }
        
        this.clampX(0,(map.width-this.width));
        
            // jumping
            
        if ((this.game.input.isAction()) && (this.grounded)) this.motion.y+=this.JUMP_HEIGHT;
        
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
