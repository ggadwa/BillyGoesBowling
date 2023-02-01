import SpriteClass from '../../rpjs/engine/sprite.js';
import BreakBlockClass from '../code/break_block.js';
import CloudBlockClass from './cloud_block.js';

export default class RockClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
            // variables
            
        this.travelX=0;
        this.doubleBounceCheck=false;
        
            // setup
            
        this.addImage('sprites/rock');
        this.setCurrentImage('sprites/rock');
        
        this.show=true;
        this.gravityFactor=0.1;
        this.gravityMinValue=0.1;
        this.gravityMaxValue=5;
        this.canCollide=false;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new RockClass(this.game,x,y,this.data));
    }
    
    removeBall()
    {
        this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),8,8,1.0,0.1,2,0.03,'particles/rock',8,false,500);
        this.game.soundList.playAtSprite('ball_break',this,this.game.map.getSpritePlayer());       // use the same sound effect here
        this.delete();
    }
    
    bounceBall()
    {
        this.travelX=-this.travelX;
        this.game.soundList.playAtSprite('crack',this,this.game.map.getSpritePlayer());       // use the same sound effect here
    }
    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // if first call, then we need to setup
            // the travel
            
        if (this.travelX===0) this.travelX=(playerSprite.x<this.x)?-10:10;
        
            // move item
            
        this.x+=this.travelX;

            // colliding with anything but the player
            // or cloud/break block sprite changes direction
            
        if (map.checkCollision(this)) {
            if (this.collideSprite!==null) {
                if ((this.collideSprite instanceof CloudBlockClass) || (this.collideSprite instanceof BreakBlockClass)) {
                    this.collideSprite.interactWithSprite(this,null);
                    this.removeBall();
                    return;
                }
            }
            
            if (this.collideSprite===playerSprite) {
                this.collideSprite.interactWithSprite(this,null);
                this.removeBall();
                return;
            }
            
            this.x-=this.travelX;
            
                // if we already bounced the previous AI
                // run, then the rock is stuck and destroy it
                
            if (this.doubleBounceCheck) {
                this.removeBall();
                return;
            }
            
            this.bounceBall();
            
            this.doubleBounceCheck=true;
        }
        else {
            this.doubleBounceCheck=false;
        }
        
            // any grounding stops travel
            
        if (this.grounded) {
            if (this.standSprite!=null) this.standSprite.interactWithSprite(this,null);
            this.removeBall();
        }
    }
}
