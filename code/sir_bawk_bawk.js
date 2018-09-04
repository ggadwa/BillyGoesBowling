import SpriteClass from '../engine/sprite.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BallClass from './ball.js';
import PlayerSideScroll from './player_sidescroll.js';

export default class SirBawkBawkClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.SPEEDS=[20,15,18,13,18];
        this.JUMP_HEIGHT=-50;
        this.TILE_IDX_BUMP_1=17;
        this.TILE_IDX_BUMP_2=18;
        
            // variables
            
        this.speedIdx=(Date.now()%this.SPEEDS.length);  // start with random speed
        this.direction=1;
        this.isDropping=true;
        this.isDying=false;
        this.deathY=0;
        
            // setup
        
        this.addImage('sprites/bawk_bawk');
        this.setCurrentImage('sprites/bawk_bawk');
        this.setEditorImage('sprites/bawk_bawk');
        
        this.show=true;
        this.gravityFactor=0.15;
        this.gravityMinValue=1;
        this.gravityMaxValue=50;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.show=false;            // start with it not shown, button starts it
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new SirBawkBawkClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.isDropping=true;
        this.isDying=false;
    }
   
    killSirBawkBawk()
    {
        this.game.gotoMap('world_main');
    }
   
    runAI()
    {
        let map=this.game.map;
        let sprites,sprite,speed,mx;
        let playerSprite=map.getSpritePlayer();
        
            // we have a special check for dropping
            // out of the sky, ignore everything until
            // we hit ground
            
        if (this.isDropping) {
            if (!this.grounded) return;
            
            this.isDropping=false;
        }
        
            // if we are dying, just sink under liquid
            
        if (this.isDying) {
            console.log('dying='+this.y);
            this.y++;
            if (this.y>this.deathY) this.killSirBawkBawk();
            return;
        }
        
            // hit the liquid?
         
        if (this.y>=map.liquidY) {
            this.isDying=true;
            this.gravityFactor=0.0; // now falling through code
            this.deathY=this.y+Math.trunc(this.height*0.9);
            return;
        }
             
            // move
            // if we hit something, back off, and if it's
            // a wall, turn around
        
        speed=this.SPEEDS[this.speedIdx]*this.direction;
        this.x+=speed;
        
        if (map.checkCollision(this)) {
            this.x-=speed;
            if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
            
            if ((this.collideTileIdx===this.TILE_IDX_BUMP_1) || (this.collideTileIdx===this.TILE_IDX_BUMP_2)) {
                this.direction=-this.direction;
                this.motion.y=this.JUMP_HEIGHT;
                
                return;
            }
        }
        
            // standing on player hurts him and
            // change direction and jump backward
            
        if (this.standSprite===playerSprite) {
            this.standSprite.interactWithSprite(this,null);
            this.direction=-this.direction;
            this.motion.y=this.JUMP_HEIGHT;
            
            return;
        }

            // if grounded, then we need to smash
            // the blocks (only 4 wide) at the bottom of the chicken
            
        if (!(this.standSprite instanceof BreakBlockStrongClass)) return;

        mx=this.x+Math.trunc(this.width*0.4);
        sprites=map.getSpritesWithinBox((mx-120),(this.y+10),(mx+120),(this.y+20),this,BreakBlockStrongClass);
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }

            // jump back up
        
        this.motion.y=this.JUMP_HEIGHT;
        this.speedIdx++;
        if (this.speedIdx>=this.SPEEDS.length) this.speedIdx=0;
    }
    
}
