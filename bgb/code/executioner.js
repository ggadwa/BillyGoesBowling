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
        this.FIRE_AXE_DISTANCE=1000;
        this.AXE_COOL_DOWN_TICK=45;
        this.AXE_START_COOL_DOWN_TICK=90;
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
        
        this.game.startCompletionTimer();
    }
    
    fireAxe() {
        let sx,sy;
        let playerSprite=this.getPlayerSprite();
        
        // are we in cool down?
        if (this.axeCoolDownCount>0) {
            this.axeCoolDownCount--;
            return;
        }
        
        // fire axe
        sx=this.axeLaunchPositions[this.axeLaunchIndex]*this.game.map.MAP_TILE_SIZE;
        this.game.map.addSprite(new AxeClass(this.game,sx,(playerSprite.y-this.AXE_Y_OFFSET),null));
                
        this.playSound('jump');
        
        this.axeLaunchIndex++;
        if (this.axeLaunchIndex>this.axeLaunchPositions.length) this.axeLaunchIndex=0;
        this.axeCoolDownCount=this.AXE_COOL_DOWN_TICK;
        
        /*
            // time to switch to other list?
            
        if (this.launchPos.length===0) {
            this.launchPos=this.launchLeft?this.launchXPositionsRight.slice():this.launchXPositionsLeft.slice();
            this.launchLeft=!this.launchLeft;
        }
        
            // are we at the next launch position
            
        ex=Math.trunc((this.x+Math.trunc(this.width*0.5))/this.game.map.MAP_TILE_SIZE);
        
        for (n=0;n!=this.launchPos.length;n++) {
            launchX=this.launchPos[n];
            
            if (ex===launchX) {
                
                    // only fire one at a time
                    
                this.launchPos.splice(n,1);
                
                    // fire
                    
                sx=(launchX*this.game.map.MAP_TILE_SIZE)+Math.trunc(this.game.map.MAP_TILE_SIZE*0.5);
                sy=this.y-Math.trunc(this.height*0.5);

                this.game.map.addSprite(new AxeClass(this.game,sx,sy,null));
                
                this.playSound('jump');
                return;
            }
        }
            */
    }
    
    onRun(tick) {
        let time, oldTime;
        let map=this.game.map;
        
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
                map.shake(10);
                this.playSound('thud');
            }
        }
        
        // dead, do nothig  
        if (this.isDead) {
            this.y+=4;
            return;
        }
        
            // image
            
        if ((Math.trunc(this.game.timestamp/200)&0x1)===0) {
            this.setCurrentImage('sprites/executioner_1');
        }
        else {
            this.setCurrentImage('sprites/executioner_2');
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
            
            /*
        if ((playerSprite.x+Math.trunc(playerSprite.width*0.5))<(this.x+Math.trunc(this.width*0.5))) {
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
        */

        if (this.grounded) {
            this.executionerSpeed=0;
            this.addGravity(this.JUMP_HEIGHT,0);
        }

            // we need to bump up at collisions to get the
            // executioner can get out of holes he's digging
        
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

        
        /*
        if (this.checkCollision()) {
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
                if (bumpUp) this.addGravity(this.JUMP_HEIGHT,0);
            }
                 

        }
        */
        this.runGravity();
        
            // time to fire axe?

        this.fireAxe();
        
        // hit the liquid?
        if (this.isInLiquid()) {
            this.isDead=true;
            this.gravityFactor=0.0;
            this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),64,256,1.0,0.01,0.1,8,'particles/skull',30,0.0,false,2500);
            this.playSound('boss_dead');
            
            // update the state
            this.game.setData(('boss_'+map.name),true);
            this.game.setData(('boss_explode_'+map.name),true);
            this.game.setData(('time_'+map.name),1000000);
        
            // update the time
            time=this.game.stopCompletionTimer();
            oldTime=this.game.getData('time_'+map.name);
            if (time<oldTime) this.game.setData(('time_'+map.name),time);

            // save the data
            this.game.persistData();
            
            map.forceCameraSprite=this;
            
            // warp player out
            this.sendMessage(this.getPlayerSprite(),'warp_out',null);
        }
    }
    
}
