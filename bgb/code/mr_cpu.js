import SpriteClass from '../../rpjs/engine/sprite.js';
import GrayFilterClass from '../../rpjs/filters/gray.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import ExplodeBlockClass from '../code/explode_block.js';
import BallClass from './ball.js';
import PlayerSideScroll from './player_sidescroll.js';

export default class MrCPUClass extends SpriteClass
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
        this.isDead=false;
        this.isFirstShow=true;
        
            // setup
        
        this.addImage('sprites/mr_cpu');
        this.setCurrentImage('sprites/mr_cpu');
        
        this.show=false;            // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=1;
        this.gravityMaxValue=50;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.grayDrawFilter=new GrayFilterClass();
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new MrCPUClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.isDropping=true;
        this.isDead=false;
        this.isFirstShow=true;
    }
   
    runAI()
    {
        let map=this.game.map;
        let sprites,sprite,speed,mx;
        let playerSprite=map.getSpritePlayer();
        
            // the first time we get called is
            // when we first appear, so play sound fx
            
        if (this.show) {
            if (this.isFirstShow) {
                this.isFirstShow=false;
                this.game.soundList.play('boss_appear');
            }
        }
        
            // we have a special check for dropping
            // out of the sky, ignore everything until
            // we hit ground
            
        if (this.isDropping) {
            if (!this.grounded) return;
            
            this.isDropping=false;
            map.shake(10);
            this.game.soundList.play('thud');
        }
        
            // if we are dead, do nothing
            
        if (this.isDead) {
            this.y+=4;
            return;
        }
        
            // hit the liquid?
         
        if (this.y>=map.liquidY) {
            playerSprite.warpOut();
            this.isDead=true;
            this.gravityFactor=0.0;
            this.motion.y=0;
            this.drawFilter=this.grayDrawFilter;
            this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),64,256,1.0,0.01,0.1,8,'particles/skull',30,2500);
            this.game.soundList.play('boss_dead');
            
            this.game.setData(('boss_'+map.name),true);
            this.game.setData(('boss_explode_'+map.name),true);
            this.game.persistData();
            
            map.forceCameraSprite=this;
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
        
            // activate any exploding blocks
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof ExplodeBlockClass) {
                sprites=map.getSpritesWithinBox((this.x-32),(this.y-32),((this.x+this.width)+32),(this.y+64),this,ExplodeBlockClass);

                for (sprite of sprites) {
                    sprite.interactWithSprite(this,null);
                }
            }
        }

            // if grounded, then we need to smash
            // the blocks (only 4 wide) at the bottom of the chicken
            
        if (!(this.standSprite instanceof BreakBlockStrongClass)) return;

        mx=this.x+Math.trunc(this.width*0.4);
        sprites=map.getSpritesWithinBox((mx-120),(this.y+10),(mx+120),(this.y+20),this,BreakBlockStrongClass);
        
        for (sprite of sprites) {
            sprite.interactWithSprite(this,null);
        }
        
        map.shake(4);
        this.game.soundList.play('thud');

            // jump back up
        
        this.motion.y=this.JUMP_HEIGHT;
        this.speedIdx++;
        if (this.speedIdx>=this.SPEEDS.length) this.speedIdx=0;
    }
    
}
