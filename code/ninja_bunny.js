import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import ShurikinClass from './shurikin.js';

export default class NinjaBunnyClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.BUNNY_JUMP_HEIGHT=-55;
        this.BUNNY_AIR_SPEED=8;
        this.BUNNY_PAUSE_TICK=35;
        this.BUNNY_ACTIVATE_DISTANCE=1000;
        
            // variables
            
        this.bunnyActive=false;
        this.bunnyPause=0;
        this.bunnyJumpDirection=-1;
        this.bunnyShurikinOK=false;
        this.lastMotionY=0;
        
            // setup
            
        this.addImage('sprites/ninja_bunny');
        this.setCurrentImage('sprites/ninja_bunny');
        this.setEditorImage('sprites/ninja_bunny');
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new NinjaBunnyClass(this.game,x,y,this.data));
    }
    
    jumpTowardsSprite(sprite)
    {
        this.bunnyJumpDirection=Math.sign(sprite.x-this.x);
        if (this.motion.y>=0) this.motion.y+=this.BUNNY_JUMP_HEIGHT;
    }
    
    jumpAwayFromSprite(sprite)
    {
        this.jumpTowardsSprite(sprite);
        this.bunnyJumpDirection=-this.bunnyJumpDirection;
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
            // ball destroys bunny
            
        if (interactSprite instanceof BallClass) {
            this.delete();
        }
        
            // hitting the player makes the
            // bunny jump backwards
            
        if (interactSprite instanceof PlayerSideScrollClass) this.jumpAwayFromSprite(interactSprite);
    }
    
    fireShurikin(dist)
    {
        let sx,sy;
        
        sx=Math.trunc(this.width*0.8)*Math.sign(dist);
        sx=(this.x+Math.trunc(this.width*0.5))+sx;
        sy=this.y+40;

        this.game.map.addSprite(new ShurikinClass(this.game,sx,sy,null));
    }
    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        let checkSprite;
        
            // distance from player
            
        let dist=playerSprite.x-this.x;
        
        if (!this.bunnyActive) {
            if (Math.abs(dist)<this.BUNNY_ACTIVATE_DISTANCE) {
                this.bunnyActive=true;
            }
            return;
        }
        
            // only move if jumping
        
        if (!this.grounded) {    
            this.moveWithCollision((this.BUNNY_AIR_SPEED*this.bunnyJumpDirection),0);
        }
        
            // if standing on top or colliding with
            // another sprite, then we jump immediately
            // away from it
         
        checkSprite=null;
        
        if (this.standSprite!==null) checkSprite=this.standSprite;
        if (this.collideSprite!==null) checkSprite=this.collideSprite;
        
        if (checkSprite!==null) {
            checkSprite.interactWithSprite(this,null);
            if (checkSprite instanceof PlayerSideScrollClass) {
                this.jumpAwayFromSprite(checkSprite);
            }
            else {
                this.jumpTowardsSprite(checkSprite);
            }
        }
        
            // if we have started falling, than launch
            // one shurikin
            
        if (this.grounded) {
            this.bunnyShurikinOK=true;
            this.lastMotionY=0;
        }
        else {
            if (this.bunnyShurikinOK) {
                if ((this.lastMotionY<0) && (this.motion.y>=0)) {
                    this.fireShurikin(dist);
                    this.bunnyShurikinOK=false;
                }
                this.lastMotionY=this.motion.y;
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
