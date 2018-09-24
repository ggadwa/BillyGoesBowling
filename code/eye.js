import SpriteClass from '../engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BoneyOneEyeClass from '../code/boney_one_eye.js';

export default class EyeClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
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
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new EyeClass(this.game,x,y,this.data));
    }
    
    killEye()
    {
        this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),64,96,0.6,0.001,24,0,this.game.imageList.get('particles/smoke'),8,600);
        this.delete();
    }
    
    runAI()
    {
        let x,y,f;
        let sprite,sprites;
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
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
            
        if (map.checkCollision(this)) {
            
            if (this.collideSprite!=null) {
                if (this.collideSprite instanceof BoneyOneEyeClass) return;         // never hits firing skull
                
                this.collideSprite.interactWithSprite(this,null);
            
                if (this.collideSprite instanceof BreakBlockStrongClass) {
                    sprites=map.getSpritesWithinBox((this.x-10),((this.y-this.height)-10),((this.x+this.width)+10),(this.y+10),this,BreakBlockStrongClass);
        
                    for (sprite of sprites) {
                        sprite.interactWithSprite(this,null);
                    }
                }
             }

            this.killEye();
        }
    }
}
