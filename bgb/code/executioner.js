import SpriteClass from '../../rpjs/engine/sprite.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BallClass from './ball.js';
import AxeClass from './axe.js';

export default class ExecutionerClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.TILE_IDX_BUMP=18;
        this.ACCELERATION=1.0;
        this.MAX_SPEED=8;
        this.JUMP_HEIGHT=-40;
        this.AXE_COOL_DOWN_TICK=35;
        this.AXE_START_COOL_DOWN_TICK=45;
        this.AXE_Y_OFFSET=800;
        
        // variables
        this.executionerDirection=-1;
        this.executionerSpeed=0;
        this.executionerLeft=0;
        this.executionerRight=0;
        
        this.axeLaunchIndex=0;
        this.axeLaunchPositions=null;
        this.axeCoolDownCount=0;
        
        this.firstDrop=false;
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        this.imageToggle=true;
        
        // setup
        this.addImage('sprites/executioner_1');
        this.addImage('sprites/executioner_2');
        this.setCurrentImage('sprites/executioner_1');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideSpriteClassIgnoreList([AxeClass]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new ExecutionerClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
        this.executionerDirection=-1;
        this.executionerSpeed=0;
        
        this.executionerLeft=this.data.get('left');
        this.executionerRight=this.data.get('right');
        
        this.axeCoolDownCount=this.AXE_START_COOL_DOWN_TICK;
        this.axeLaunchIndex=0;
        this.axeLaunchPositions=this.data.get('axe');
        
        this.firstDrop=true;
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        this.imageToggle=true;
        
        this.game.startCompletionTimer();
    }
    
    fireAxe() {
        let sx;
        let playerSprite=this.getPlayerSprite();
        
        // are we in cool down?
        if (this.axeCoolDownCount>0) {
            this.axeCoolDownCount--;
            return;
        }
        
        // fire axe
        this.game.map.addSprite(new AxeClass(this.game,this.axeLaunchPositions[this.axeLaunchIndex],(playerSprite.y-this.AXE_Y_OFFSET),null));
                
        this.playSound('jump');
        
        this.axeLaunchIndex++;
        if (this.axeLaunchIndex>=this.axeLaunchPositions.length) this.axeLaunchIndex=0;
        this.axeCoolDownCount=this.AXE_COOL_DOWN_TICK;
    }
    
    land() {
        this.shakeMap(10);
        this.playSound('thud');
               
        // pop any clouds
        this.sendMessageToSpritesWithinBox((this.x-32),(this.y+10),((this.x+this.width)+32),(this.y+20),this,CloudBlockClass,'pop',null);
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
        // do nothing if we aren't shown
        if (!this.show) return;
        
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
                this.firstDrop=false;
                this.inAir=false;
                
                this.land();
            }
        }
        
        // dead, do nothig  
        if (this.isDead) {
            this.y+=4;
            return;
        }
        
        // always follow the player, but with
        // an acceleration
        if (this.firstDrop) {
            this.executionerSpeed=0;
        }
        else {
            this.executionerSpeed+=this.ACCELERATION;
        }
        if (this.executionerSpeed>this.MAX_SPEED) this.executionerSpeed=this.MAX_SPEED;
            
        if (this.grounded) {
            this.executionerSpeed=0;
            this.addGravity(this.JUMP_HEIGHT,0);

            this.imageToggle=!this.imageToggle;
            this.setCurrentImage(this.imageToggle?'sprites/executioner_1':'sprites/executioner_2');
        }

        // move
        this.moveWithCollision((this.executionerSpeed*this.executionerDirection),0);
        
        // turn around at edges
        if (this.x<=this.executionerLeft) {
            this.x=this.executionerLeft+1;
            this.executionerSpeed=0;
            this.executionerDirection=1;
        }
        if (this.x>=this.executionerRight) {
            this.x=this.executionerRight-1;
            this.executionerSpeed=0;
            this.executionerDirection=-1;
        }

        this.runGravity();
        
        // time to fire axe?
        this.fireAxe();
        
        // hit the liquid?
        if (this.isInLiquid()) {
            this.kill();
        }
    }
    
}
