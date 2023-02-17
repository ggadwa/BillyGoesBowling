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
        this.inAir=true;
        this.isDead=false;
        this.isFirstShow=true;
        
            // setup
        
        this.addImage('sprites/mr_cpu');
        this.setCurrentImage('sprites/mr_cpu');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new MrCPUClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
        this.inAir=true;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
    }

    land() {
        this.shakeMap(10);
        this.playSound('thud');
               
        // pop any clouds
        this.sendMessageToSpritesAroundSprite(0,0,0,32,CloudBlockClass,'pop',null);
    }
    
    kill() {
        this.isDead=true;
        this.gravityFactor=0.0;
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),64,256,1.0,0.01,0.1,8,'particles/skull',30,0.0,false,2500);
        this.playSound('boss_dead');

        // update the state
        this.setGameData(('boss_'+this.getMapName()),true);
        this.setGameData(('boss_explode_'+this.getMapName()),true);
        this.setGameDataIfLess(('time_'+this.getMapName()),this.game.stopCompletionTimer());

        this.game.map.forceCameraSprite=this;

        // warp player out
        this.sendMessage(this.getPlayerSprite(),'warp_out',null);
    }
   
    onRun(tick) {
        let map=this.game.map;
        let speed,mx;
        let playerSprite=this.getPlayerSprite();
        
        // do nothing if we aren't shown
        if (!this.show) return;   
        
        // dead, just sink 
        if (this.isDead) {
            this.y+=4;
            this.alpha-=0.05;
            if (this.alpha<0.0) this.alpha=0.0;
            return;
        }
        
        // the first time we get called is
        // when we first appear, so play sound fx
        if (this.isFirstShow) {
            this.isFirstShow=false;
            this.playSound('boss_appear');
        }

        // shake map when hitting ground
        if (!this.grounded) {
            this.inAir=true;
        }
        else {
            if (this.inAir) {
                this.inAir=false;
                this.land();
            }
        }
        
             
            // move
            // if we hit something, back off, and if it's
            // a wall, turn around
        
        speed=this.SPEEDS[this.speedIdx]*this.direction;
        //this.x+=speed;
        
        if (this.checkCollision()) {
            //this.x-=speed;
            //if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
            
            if ((this.collideTileIdx===this.TILE_IDX_BUMP_1) || (this.collideTileIdx===this.TILE_IDX_BUMP_2)) {
                //this.direction=-this.direction;
                //this.addGravity(this.JUMP_HEIGHT,0);
                
                //return;
            }
        }
        
        this.runGravity();
        
            // standing on player hurts him and
            // change direction and jump backward
            /*
        if (this.standSprite===playerSprite) {
            //this.standSprite.interactWithSprite(this,null);
            this.direction=-this.direction;
            this.addGravity(this.JUMP_HEIGHT);
            
            return;
        }
        
            // activate any exploding blocks
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof ExplodeBlockClass) {
                this.sendMessageToSpritesAroundSprite(-32,-32,32,32,ExplodeBlockClass,'explode',null);
            }
        }

            // if grounded, then we need to smash
            // the blocks at the bottom of the cpu
            
        if (!(this.standSprite instanceof BreakBlockStrongClass)) return;

        this.sendMessageToSpritesAroundSprite(-32,-32,32,32,BreakBlockStrongClass,'explode',null);
        
        this.shakeMap(4);
        this.playSound('thud');
*/
            // jump back up
        
        //this.addGravity(this.JUMP_HEIGHT);
        //this.speedIdx++;
        //if (this.speedIdx>=this.SPEEDS.length) this.speedIdx=0;
        
        // hit the liquid?
        if (this.isInLiquid()) {
            this.kill();
        }
    }
    
}
