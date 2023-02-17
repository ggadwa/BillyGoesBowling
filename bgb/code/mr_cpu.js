import SpriteClass from '../../rpjs/engine/sprite.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import ExplodeBlockClass from '../code/explode_block.js';
import BallClass from './ball.js';
import PlayerSideScroll from './player_sidescroll.js';

export default class MrCPUClass extends SpriteClass {

    constructor(game,x,y,data) {
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
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new MrCPUClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
        this.isDropping=true;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
    }
   
    onRun(tick) {
        let map=this.game.map;
        let speed,mx;
        let playerSprite=this.getPlayerSprite();
        
            // the first time we get called is
            // when we first appear, so play sound fx
            
        if (this.show) {
            if (this.isFirstShow) {
                this.isFirstShow=false;
                this.playSound('boss_appear');
            }
        }
        
            // we have a special check for dropping
            // out of the sky, ignore everything until
            // we hit ground
            
        if (this.isDropping) {
            if (!this.grounded) return;
            
            this.isDropping=false;
            this.shakeMap(10);
            this.playSound('thud');
        }
        
            // if we are dead, do nothing
            
        if (this.isDead) {
            this.y+=4;
            return;
        }
        
        // hit the liquid?
        if (this.isInLiquid()) {
            this.isDead=true;
            this.stopAllGravity();
            this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),64,256,1.0,0.01,0.1,8,'particles/skull',30,0.0,false,2500);
            this.playSound('boss_dead');
            
            // update the state
            this.setGameData(('boss_'+this.getMapName()),true);
            this.setGameData(('boss_explode_'+this.getMapName()),true);
            this.setGameDataIfLess(('time_'+this.getMapName()),this.game.stopCompletionTimer());
            
            map.forceCameraSprite=this;
            
            // warp player out
            this.sendMessage(this.getPlayerSprite(),'warp_out',null);
            return;
        }
             
            // move
            // if we hit something, back off, and if it's
            // a wall, turn around
        
        speed=this.SPEEDS[this.speedIdx]*this.direction;
        this.x+=speed;
        
        if (this.checkCollision()) {
            this.x-=speed;
            if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
            
            if ((this.collideTileIdx===this.TILE_IDX_BUMP_1) || (this.collideTileIdx===this.TILE_IDX_BUMP_2)) {
                this.direction=-this.direction;
                this.addGravity(this.JUMP_HEIGHT,0);
                
                return;
            }
        }
        
            // standing on player hurts him and
            // change direction and jump backward
            
        if (this.standSprite===playerSprite) {
            this.standSprite.interactWithSprite(this,null);
            this.direction=-this.direction;
            this.addGravity(this.JUMP_HEIGHT);
            
            return;
        }
        
            // activate any exploding blocks
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof ExplodeBlockClass) {
                this.sendMessageToSpritesWithinBox((this.x-32),(this.y-32),((this.x+this.width)+32),(this.y+64),this,ExplodeBlockClass,'explode',null);
            }
        }

            // if grounded, then we need to smash
            // the blocks (only 4 wide) at the bottom of the chicken
            
        if (!(this.standSprite instanceof BreakBlockStrongClass)) return;

        mx=this.x+Math.trunc(this.width*0.4);
        this.sendMessageToSpritesWithinBox((mx-120),(this.y+10),(mx+120),(this.y+20),this,BreakBlockStrongClass,'explode',null);
        
        this.shakeMap(4);
        this.playSound('thud');

            // jump back up
        
        this.addGravity(this.JUMP_HEIGHT);
        this.speedIdx++;
        if (this.speedIdx>=this.SPEEDS.length) this.speedIdx=0;
    }
    
}
