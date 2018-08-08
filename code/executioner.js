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
        this.JUMP_HEIGHT=-40;
        
            // variables
            
        this.executionerDirection=-1;
        this.lastLaunchXPosition=-1;
        this.launchXPositions=null;     // array of axe launch positions, loaded on startup
        this.isDropping=true;
        
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
        this.launchXPositions=this.data.get('axe_x_launch');
        this.lastLaunchXPosition=-1;
        this.isDropping=true;
    }
    
    fireAxe()
    {
        let n,ex,launchX,sx,sy;
        
            // only in one direction
            
        if (this.executionerDirection!==1) return;
        
            // are we at the next launch position
            
        ex=Math.trunc((this.x+Math.trunc(this.width*0.5))/this.game.map.MAP_TILE_SIZE);
        
        for (n=0;n!=this.launchXPositions.length;n++) {
            launchX=this.launchXPositions[n];
            
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
        let mx,bumpUp;
        
            // we have a special check for dropping
            // out of the sky, ignore everything until
            // we hit ground
            
        if (this.isDropping) {
            if (!this.grounded) return;
            
            this.isDropping=false;
        }
        
            // walk in direction until a collision
            // at certain sprites and tiles we bump up so
            // executioner can get out of holes he's digging
         
        mx=8*this.executionerDirection;
        this.x+=mx;

        if (map.checkCollision(this)) {

            this.x-=mx;

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

                if (bumpUp) {
                    this.motion.y=this.JUMP_HEIGHT;
                }
                else {
                    this.executionerDirection=-this.executionerDirection;       // if not bumping, turn around
                }
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
            
                    // check for hitting water
         
        if (this.standTileIdx===this.TILE_IDX_WATER_TOP) this.killExecutioner();
    }
    
}
