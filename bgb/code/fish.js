import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import BallClass from './ball.js';
import EasterHeadClass from './easter_head.js';

export default class FishClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.FISH_SPEED=12;
        this.FISH_INITIAL_ARC=-10;
        this.MAX_BOUNCE=4;
        this.BOUNCE_FACTOR=1.5;
        this.FISH_BOUNCE_ARC=-5;
        
        // variables
        this.moveX=0;
        this.bounceCount=0;
        
        // setup
        this.addImage('sprites/fish');
        this.setCurrentImage('sprites/fish');
        
        this.show=true;
        this.gravityFactor=0.1;
        this.gravityMinValue=0.5;
        this.gravityMaxValue=9;
        this.canStandOn=true;
        
        this.setCollideSpriteClassIgnoreList([EasterHeadClass]);
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new FishClass(this.game,x,y,this.data));
    }
    
    kill() {
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),ParticleClass.AFTER_SPRITES_LAYER,8,8,1.0,0.1,2,0.03,'particles/fish',8,0.5,false,500);
        this.playSound('ball_break');
        this.delete();
    }
    
    onCollideSprite(sprite) {
        this.sendMessage(sprite,'hurt',null);
        this.kill();
    }
    
    onStandOnSprite(sprite) {
        this.sendMessage(sprite,'hurt',null);
        this.kill();
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.bounceCount++;
        if (this.bounceCount>this.MAX_BOUNCE) {
            this.kill();
            return;
        }
            
        this.moveX=-this.moveX;
        this.playSound('crack');
    }
    
    onStandOnTile(tileX,tileY,tileIdx) {
        this.bounceCount++;
        if (this.bounceCount>this.MAX_BOUNCE) {
            this.kill();
            return;
        }
        
        this.addGravity(this.FISH_BOUNCE_ARC,0);
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        // if first call, then we need to setup the fish
        if (this.moveX===0) {
            this.moveX=(playerSprite.x<this.x)?-this.FISH_SPEED:this.FISH_SPEED;
            this.addGravity(this.FISH_INITIAL_ARC,0);
            this.flipX=(this.moveX<0);
            this.bounceCount=0;
        }
        
        // move fish
        this.moveWithCollision(this.moveX,0);
        this.runGravity();
    }
}
