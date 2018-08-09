import SpriteClass from '../engine/sprite.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BallClass from './ball.js';
import ExecutionersAxeClass from './executioners_axe.js';

export default class ExecutionerClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.TILE_IDX_BUMP=18;
        this.TILE_IDX_WATER_TOP=21;
        this.MAX_SPEED=8;
        this.JUMP_HEIGHT=-40;
        
            // variables
            
        this.executionerSpeed=0;
        this.lastLaunchXPosition=-1;
        this.launchXPositionsLeft=null;     // array of axe launch positions, loaded on startup
        this.launchXPositionsRight=null;
        this.isDropping=true;
        this.isDying=false;
        this.deathY=0;
        
            // setup
        
        this.addImage('sprites/executioner_axe');
        this.setCurrentImage('sprites/executioner_axe');
        this.setEditorImage('sprites/executioner_axe');
        
        this.show=true;
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.show=false;            // start with it not shown, button starts it
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new ExecutionerClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.launchXPositionsLeft=this.data.get('axe_x_launch_left');
        this.launchXPositionsRight=this.data.get('axe_x_launch_right');
        this.lastLaunchXPosition=-1;
        this.isDropping=true;
        this.isDying=false;
    }
    
    fireAxe()
    {
        let n,ex,launchX,sx,sy;
        let launchPos;
        
            // are we at the next launch position
            
        ex=Math.trunc((this.x+Math.trunc(this.width*0.5))/this.game.map.MAP_TILE_SIZE);
        
        launchPos=(this.executionerSpeed<0)?this.launchXPositionsLeft:this.launchXPositionsRight;
        
        for (n=0;n!=launchPos.length;n++) {
            launchX=launchPos[n];
            
            if ((ex===launchX) && (launchX!==this.lastLaunchXPosition)) {
                
                    // only fire one at a time
                    
                this.lastLaunchXPosition=launchX;
                
                    // fire
                    
                sx=(launchX*this.game.map.MAP_TILE_SIZE)+Math.trunc(this.game.map.MAP_TILE_SIZE*0.5);
                sy=this.y-Math.trunc(this.height*0.5);

                this.game.map.addSprite(new ExecutionersAxeClass(this.game,sx,sy,null));
                return;
            }
        }
    }
    
    killExecutioner()
    {
        this.game.gotoMap('world_main');
    }
   
    runAI()
    {
        let map=this.game.map;
        let speed,bumpUp;
        let playerSprite=map.getSpritePlayer();
        
            // we have a special check for dropping
            // out of the sky, ignore everything until
            // we hit ground
            
        if (this.isDropping) {
            if (!this.grounded) return;
            
            this.isDropping=false;
        }
        
            // if we are dying, just sink under water
            
        if (this.isDying) {
            this.y++;
            if (this.y>this.deathY) this.killExecutioner();
            return;
        }
        
            // always follow the player, but with
            // an acceleration
            
        if (playerSprite.x<this.x) {
            if (this.executionerSpeed>-this.MAX_SPEED) {
                this.executionerSpeed-=0.5;
            }
            else {
                this.executionerSpeed=-this.MAX_SPEED;
            }
        }
        else {
            if (this.executionerSpeed<this.MAX_SPEED) {
                this.executionerSpeed+=0.5;
            }
            else {
                this.executionerSpeed=this.MAX_SPEED;
            }
        }
        
            // we need to bump up at collisions to get the
            // executioner can get out of holes he's digging
        
        speed=Math.trunc(this.executionerSpeed);
        this.x+=speed;

        if (map.checkCollision(this)) {

            this.x-=speed;

                // run collisions

            bumpUp=false;

            if (this.collideSprite!==null) {
                if (this.collideSprite instanceof BreakBlockStrongClass) bumpUp=true;
                this.collideSprite.interactWithSprite(this,null);
             }

                // only check for bumping if we are in the air, otherwise
                // just complete the jump

            if (this.grounded) {
                bumpUp=bumpUp||(this.collideTileIdx===this.TILE_IDX_BUMP);
                if (bumpUp) this.motion.y=this.JUMP_HEIGHT;
            }
        }

            // time to fire axe?

        this.fireAxe();
        
            // check for standing on a cloud or button
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof CloudBlockClass) {
                this.standSprite.interactWithSprite(this,null);
            }
        }
        
            // hit the water?
         
        if (this.y>=map.getWaterLevel()) {
            this.isDying=true;
            this.gravityFactor=0.0; // now falling through code
            this.deathY=this.y+Math.trunc(this.height*0.9);
        }
    }
    
}
