import SpriteClass from '../engine/sprite.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BallClass from './ball.js';

export default class SirBawkBawkClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.SPEED=20;
        this.JUMP_HEIGHT=-50;
        
            // variables
            
        this.direction=0;
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
        let sprites,sprite,speed;
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
            this.y++;
            if (this.y>this.deathY) this.killSirBawkBawk();
            return;
        }
             
            // move
        
        speed=this.SPEED*this.direction;
        this.x+=speed;

        if (map.checkCollision(this)) {
            this.x-=speed;
            if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
        }

            // if grounded, then we need to smash
            // the blocks on the ground
            
        if (!(this.standSprite instanceof BreakBlockStrongClass)) return;

        sprites=map.getSurroundSprites(this,Math.trunc(this.width*0.5),0,Math.trunc(this.game.map.MAP_TILE_SIZE*1.5));
        
        for (sprite of sprites) {
            if (sprite instanceof BreakBlockStrongClass) sprite.interactWithSprite(this,null);
        }

            // jump back up
            
        this.motion.y=this.JUMP_HEIGHT;
        this.direction=(playerSprite.x<this.x)?-1:1;

        /*
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

        
            // check for standing on a cloud or button
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof CloudBlockClass) {
                this.standSprite.interactWithSprite(this,null);
            }
        }
        */
            // hit the liquid?
         
        if (this.y>=map.liquidY) {
            this.isDying=true;
            this.gravityFactor=0.0; // now falling through code
            this.deathY=this.y+Math.trunc(this.height*0.9);
        }
    }
    
}
