import SpriteClass from '../engine/sprite.js';
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
import ExecutionersAxeClass from './executioners_axe.js';

export default class PlayerSideScrollClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // constants
            
        this.JUMP_HEIGHT=-40;
        
            // setup
            
        this.addImage('sprites/billy_left');
        this.addImage('sprites/billy_right');
        this.addImage('sprites/gravestone');
        
        this.setCurrentImage('sprites/billy_right');
        this.setEditorImage('sprites/billy_right');
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=25;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.lastGroundY=0;
        
        this.invincibleCount=-1;
        this.deathCount=-1;
        
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
        this.game.map.addSprite(new BallClass(this.game,0,0,null));
    }
    
    hurtPlayer()
    {
        let health;
        
        if (this.invincibleCount>0) return;
        
        health=this.game.getData('player_health')-1;
        this.game.setData('player_health',health);
        if (health===0) {
            this.killPlayer();
            return;
        }
        
        this.invincibleCount=60;
        this.alpha=0.25;
    }
    
    killPlayer()
    {
        this.setCurrentImage('sprites/gravestone');
        this.motion.x=0;
        this.motion.y=0;
        this.gravityFactor=0;
        this.alpha=1.0;
        this.invincibleCount=-1;
        
        this.game.setData('player_health',0);
        this.deathCount=60;
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if ((interactSprite instanceof DrainPipeSnakeClass) || (interactSprite instanceof NinjaBunnyClass) || (interactSprite instanceof ShurikinClass) || (interactSprite instanceof RotoCarrotClass) || (interactSprite instanceof BombClass) || (interactSprite instanceof RockClass)) {
            this.hurtPlayer();
            return;
        }
        if (interactSprite instanceof ExecutionerClass) {
            if (this.standSprite!==interactSprite) this.hurtPlayer();       // ok to stand on these sprites
            return;
        }
        if (interactSprite instanceof ExecutionersAxeClass) {
            this.hurtPlayer();
            return;
        }
    }
    
    runAI()
    {
        let map=this.game.map;
        
            // dead?

        if (this.deathCount!==-1) {
            this.deathCount--;
            if (this.deathCount<=0) this.game.gotoMap('world_main');
            return;
        }
        
            // invincible
         
        if (this.invincibleCount!==-1) {
            this.invincibleCount--;
            if (this.invincibleCount<=0) {
                this.invincibleCount=-1;
                this.alpha=1.0;
            }
        }
        
            // input
            
        if (this.game.input.isLeft()) {
            this.moveWithCollision(-12,0);
            this.setCurrentImage('sprites/billy_left');
            this.data.set('facing_direction',-1);
        }
        
        if (this.game.input.isRight()) {
            this.moveWithCollision(12,0);
            this.setCurrentImage('sprites/billy_right');
            this.data.set('facing_direction',1);
        }
        
        this.clampX(0,(map.width-this.width));
        
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
