import SpriteClass from '../../rpjs/engine/sprite.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import BombClass from './bomb.js';
import FishClass from './fish.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import ShurikinClass from './shurikin.js';

export default class NinjaBunnyClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.BUNNY_JUMP_HEIGHT=-25;
        this.BUNNY_AIR_SPEED=8;
        this.BUNNY_PAUSE_TICK=45;
        this.BUNNY_ACTIVATE_DISTANCE=800;
        
        // variables  
        this.bunnyActive=false;
        this.bunnyPause=0;
        this.bunnyJumpDirection=-1;
        this.bunnyShurikinOK=false;
        this.bunnyBounceBack=false;
        this.lastMotionY=0;
        
        // setup
        this.addImage('sprites/ninja_bunny');
        this.addImage('sprites/ninja_bunny_jump');
        this.setCurrentImage('sprites/ninja_bunny');
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new NinjaBunnyClass(this.game,x,y,this.data));
    }
    
    jumpTowardsSprite(sprite) {
        this.bunnyJumpDirection=Math.sign(sprite.x-this.x);
        if (this.getCurrentGravity()>=0) this.addGravity(this.BUNNY_JUMP_HEIGHT,0);
        
        this.playSound('jump');
    }
    
    jumpAwayFromSprite(sprite) {
        this.jumpTowardsSprite(sprite);
        this.bunnyJumpDirection=-this.bunnyJumpDirection;
        
        this.playSound('jump');
    }
    
    kill() {
        this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),64,96,0.6,0.001,24,0,'particles/smoke',8,0.1,false,600);
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
    
    fireShurikin(dist) {
        let sx,sy;
        
        sx=Math.trunc(this.width*0.8)*Math.sign(dist);
        sx=(this.x+Math.trunc(this.width*0.5))+sx;
        sy=this.y+40;

        this.game.map.addSprite(new ShurikinClass(this.game,sx,sy,null));
    }
    
    run() {
        let playerSprite=this.getPlayerSprite();
        
        // bunny is only active at
        // certain distance from player
        let dist=playerSprite.x-this.x;
        
        this.bunnyActive=(Math.abs(dist)<this.BUNNY_ACTIVATE_DISTANCE);
        if (!this.bunnyActive) return;
        
        // only move if jumping
        if (!this.grounded) {    
            this.moveWithCollision((this.BUNNY_AIR_SPEED*this.bunnyJumpDirection),0);
        }
        
        // gravity
        this.runGravity();
        
        // image 
        this.setCurrentImage((this.getCurrentGravity()<0)?'sprites/ninja_bunny_jump':'sprites/ninja_bunny');
        
        // if standing on top or colliding with
        // another sprite, then if the player we always
        // jump away, else if any other sprite, we jump
        // away if grounded
         /*
        checkSprite=null;
        
        if (this.standSprite!==null) checkSprite=this.standSprite;
        if (this.collideSprite!==null) checkSprite=this.collideSprite;
        
        if (checkSprite!==null) {
            checkSprite.interactWithSprite(this,null);
            if (checkSprite instanceof PlayerSideScrollClass) {
                this.jumpAwayFromSprite(checkSprite);
            }
        }
        */
            // if we have started falling, than launch
            // one shurikin
            
        if (this.grounded) {
            this.bunnyShurikinOK=true;
            this.lastMotionY=0;
        }
        else {
            if (this.bunnyShurikinOK) {
                if ((this.lastMotionY<0) && (this.getCurrentGravity()>=0)) {
                    this.fireShurikin(dist);
                    this.bunnyShurikinOK=false;
                }
                this.lastMotionY=this.getCurrentGravity();
            }
        }
        
            // if on the ground, we can jump after a
            // slight pause
            
        if (!this.grounded) {
            this.bunnyPause=this.BUNNY_PAUSE_TICK;
            return;
        }
        
        if (this.bunnyPause>0) {
            this.bunnyPause--;
            return;
        }
        
            // we can jump, find the direction
            // towards player and jump that way
            
        this.jumpTowardsSprite(playerSprite);
    }
    
}
