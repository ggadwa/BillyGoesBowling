import SpriteClass from '../../rpjs/engine/sprite.js';
import BallClass from './ball.js';
import EasterHeadClass from './easter_head.js';

export default class FishClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.FISH_SPEED=12;
        this.FISH_INITIAL_ARC=10;
        
        this.COLLIDE_CLASS_IGNORE=[EasterHeadClass];
        
        // variables
        this.travelX=0;
        this.travelY=0;
        this.doubleBounceCheck=false;
        
        // setup
        this.addImage('sprites/fish');
        this.setCurrentImage('sprites/fish');
        
        this.show=true;
        this.gravityFactor=0.1;
        this.gravityMinValue=0.2;
        this.gravityMaxValue=12;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new FishClass(this.game,x,y,this.data));
    }
    
    removeFish() {
        this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),8,8,1.0,0.1,2,0.03,'particles/fish',8,0.5,false,500);
        this.playSound('ball_break');
        this.delete();
    }
    
    bounceFish() {
        this.travelX=-this.travelX;
        this.playSound('crack');
    }
    
    interactWithSprite(interactSprite,dataObj) {
        // ball destroys fish 
        if (interactSprite instanceof BallClass) {
            this.removeFish();
        }
    }
    
    run() {
        let map=this.game.map;
        let playerSprite=this.getPlayerSprite();
        
        // if first call, then we need to setup the travel
        if (this.travelX===0) {
            this.travelX=(playerSprite.x<this.x)?-this.FISH_SPEED:this.FISH_SPEED;
            this.travelY=this.FISH_INITIAL_ARC;
        }
        
        // move item
        this.x+=this.travelX;
        this.y-=this.travelY;
        
        if (this.travelY>0) this.travelY--;
        
        this.flipX=(this.travelX<0);

        // colliding with anything but the player
        // or cloud/break block sprite changes direction
        if (this.checkCollision(this.COLLIDE_CLASS_IGNORE)) {
            if (this.collideSprite!==null) {
                this.sendMessage(this.collideSprite,'hurt',null);
                this.removeFish();
            }
            
            this.x-=this.travelX;
            
            // if we already bounced the previous AI
            // run, then the fish is stuck and destroy it
            if (this.doubleBounceCheck) {
                this.removeFish();
                return;
            }
            
            this.bounceFish();
            
            this.doubleBounceCheck=true;
        }
        else {
            this.doubleBounceCheck=false;
        }
        
        // any grounding stops travel
        if (this.grounded) {
            if (this.standSprite!=null) this.standSprite.interactWithSprite(this,null);
            this.removeFish();
        }
    }
}
