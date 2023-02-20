import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import CloudBlockClass from './cloud_block.js';
import BlockClass from './block.js';
import BreakBlockClass from '../code/break_block.js';
import ExplodeBlockClass from '../code/explode_block.js';
import BallClass from './ball.js';

export default class KingGhastlyClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);

        this.GHASTLY_SPEED=8;
        this.JUMP_HEIGHT=-20;
        this.BACKUP_TICK=30;
        
        // variables
        this.backupCount=-1;
        this.firstDrop=true;
        this.inAir=true;
        this.isDead=false;
        this.isFirstShow=true;
        
        // setup
        this.addImage('sprites/king_ghastly_1');
        this.addImage('sprites/king_ghastly_2');
        this.setCurrentImage('sprites/king_ghastly_1');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new KingGhastlyClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
        this.firstDrop=true;
        this.inAir=true;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
    }
    
    smashBlocks() {
        this.sendMessageToSpritesAroundSprite(-32,-32,32,32,BreakBlockClass,'explode',null);
        this.sendMessageToSpritesAroundSprite(-32,-32,32,32,ExplodeBlockClass,'explode',null);
        
        this.shakeMap(4);
        this.playSound('thud');
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
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),ParticleClass.AFTER_SPRITES_LAYER,64,256,1.0,0.01,0.1,8,'particles/skull',30,0.0,false,2500);
        this.playSound('boss_dead');

        // update the state
        this.setGameData(('boss_'+this.getMapName()),true);
        this.setGameData(('boss_explode_'+this.getMapName()),true);
        this.setGameDataIfLess(('time_'+this.getMapName()),this.game.stopCompletionTimer());

        this.game.map.forceCameraSprite=this;

        // warp player out
        this.sendMessage(this.getPlayerSprite(),'warp_out',null);
    }
    
    onCollideSprite(sprite) {
        // certain types of blocks back up ghastly
        if ((sprite instanceof BreakBlockClass) || (sprite instanceof BlockClass)) this.backupCount=this.BACKUP_TICK;
        
        // smash any blocks
        this.smashBlocks();

        // try to jump
        if (this.grounded) this.addGravity(this.JUMP_HEIGHT,0);
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        // jump up if blocked by a tile
        if (this.grounded) this.addGravity(this.JUMP_HEIGHT,0);
    }

    onRun(tick) {
        // do nothing if we aren't shown
        if (!this.show) return;
        
        // dead, just sink 
        if (this.isDead) {
            this.y+=6;
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
                this.firstDrop=false;
                this.inAir=false;
                this.land();
            }
        }
        
        // image
        if (((tick/10)&0x1)===0) {
            this.setCurrentImage('sprites/king_ghastly_1');
        }
        else {
            this.setCurrentImage('sprites/king_ghastly_2');
        }
        
        // are we backing up?
        if (this.backupCount!==-1) {
            this.backupCount--;
            this.moveWithCollision(-this.GHASTLY_SPEED,0);
        }
        
        // always head towards the player
        // don't run this on first drop as ghastly falls through tiles and will
        // get instantly ejected from the map
        else {
            if (!this.firstDrop) this.moveWithCollision(this.GHASTLY_SPEED,0);
        }
        
        this.runGravity();
        
        // hit the liquid?
        if (this.isInLiquid()) {
            this.kill();
        }
    }
    
}
