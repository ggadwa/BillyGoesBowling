import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BoneyOneEyeClass from '../code/boney_one_eye.js';

export default class BoomerangClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants  
        this.EYE_SPEED=15;
        
        // variables
        this.needReset=true;
        this.xAdd=0;
        this.yAdd=0;
        
        // setup
        this.addImage('sprites/eye');
        this.setCurrentImage('sprites/eye');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.setCollideSpriteClassIgnoreList([BoneyOneEyeClass]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new BoomerangClass(this.game,x,y,this.data));
    }
    
    killEye() {
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),ParticleClass.AFTER_SPRITES_LAYER,64,96,0.6,0.001,24,0,'particles/smoke',8,0.1,false,600);
        this.playSound('pop');
        this.delete();
    }
    
    onRun(tick) {
        let x,y,f;
        let playerSprite=this.getPlayerSprite();
        
            // if first call, then aim at player
            
        if (this.needReset) {
            
            this.needReset=false;
            
                // get the distance to player and normalize
                
            x=playerSprite.x-this.x;
            y=playerSprite.y-this.y;
            
            f=Math.sqrt((x*x)+(y*y));
            if (f!==0.0) f=1.0/f;
        
            x*=f;
            y*=f;

            this.xAdd=x*this.EYE_SPEED;
            this.yAdd=y*this.EYE_SPEED;
        }
        
        this.x+=this.xAdd;
        this.y+=this.yAdd;

            // destroy eye on any collision, and if
            // it's a strong break block, break a couple around it
            
        if (this.checkCollision()) {
            
            if (this.collideSprite!=null) {
                if (this.collideSprite instanceof BreakBlockStrongClass) {
                    this.sendMessageToSpritesAroundSprite(-32,-32,32,32,BreakBlockStrongClass,'explode',null);
                }
            }

            this.killEye();
        }
    }
}