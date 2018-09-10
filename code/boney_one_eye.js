import SpriteClass from '../engine/sprite.js';
import GrayFilterClass from '../filters/gray.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BallClass from './ball.js';
import EyeClass from './eye.js';

export default class BoneyOneEyeClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.FIRE_TICK=40;
        
            // variables
            
        this.fireWait=0;
        this.isDropping=true;
        this.isDead=false;
        
            // setup
        
        this.addImage('sprites/boney_one_eye');
        this.setCurrentImage('sprites/boney_one_eye');
        this.setEditorImage('sprites/boney_one_eye');
        
        this.show=false;            // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new BoneyOneEyeClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.fireWait=this.FIRE_TICK;
        this.isDropping=true;
        this.isDead=false;
    }
    
    fireEye()
    {
        let x,y;
        
            // are we at the next launch position
            
        x=this.x+Math.trunc(this.width*0.6);
        y=this.y-Math.trunc(this.height*0.7);
        
        this.game.map.addSprite(new EyeClass(this.game,x,y,null));
    }
    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // we have a special check for dropping
            // out of the sky, ignore everything until
            // we hit ground
            
        if (this.isDropping) {
            if (!this.grounded) return;
            
            this.isDropping=false;
            map.shake(10);
        }
        
            // dead, do nothig
            
        if (this.isDead) {
            this.y+=1;
            return;
        }
        
            // hit the liquid?
         
        if (this.y>=map.liquidY) {
            playerSprite.warpOut();
            this.isDead=true;
            this.gravityFactor=0.0;
            this.drawFilter=new GrayFilterClass();
            this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),64,256,1.0,0.01,0.1,8,this.game.imageList.get('particles/skull'),30,2500);
        }
        
            // time to fire?
            
        this.fireWait--;
        if (this.fireWait===0) {
            this.fireWait=this.FIRE_TICK;
            this.fireEye();
        }
    }
    
}