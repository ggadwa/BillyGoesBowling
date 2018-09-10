import SpriteClass from '../engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';

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
    
    runAI()
    {
        let x,y,f;
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

            // any tile or player collision destroys eye
            
        if (map.checkCollision(this)) {
            
            if (this.collideSprite!=null) {
                this.collideSprite.interactWithSprite(this,null);
                if (this.collideSprite instanceof PlayerSideScrollClass) {
                    this.delete();
                    return;
                }
            }
            
            if (this.collideTileIdx!==-1) {
                this.delete();
                return;
            }
        }
    }
}
