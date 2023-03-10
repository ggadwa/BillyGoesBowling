import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleDefsClass from './particle_defs.js';
import CloudBlockClass from './cloud_block.js';
import BlockClass from './block.js';
import BreakBlockClass from '../code/break_block.js';
import ExplodeBlockClass from '../code/explode_block.js';
import BallClass from './ball.js';

export default class KingGhastlyClass extends SpriteClass {

    static GHASTLY_SPEED=4;
    static JUMP_HEIGHT=-20;
    static BACKUP_TICK=60;
    static SINK_SPEED=2;

    constructor(game,x,y,data) {
        super(game,x,y,data);

        this.backupCount=-1;
        this.firstDrop=true;
        this.inAir=true;
        this.isDead=false;
        this.isFirstShow=true;
        this.skullParticle=null;
        
        // setup
        this.addImage('sprites/king_ghastly_1');
        this.addImage('sprites/king_ghastly_2');
        this.setCurrentImage('sprites/king_ghastly_1');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.08;
        this.gravityMinValue=3;
        this.gravityMaxValue=15;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
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
        this.skullParticle=this.addParticle2((this.x+(this.width/2)),(this.y-(this.height/2)),ParticleDefsClass.BOSS_KILL_PARTICLE);
        this.playSound('boss_dead');

        // update the state
        this.setGameData(('boss_'+this.getMapName()),true);
        this.setGameData(('boss_explode_'+this.getMapName()),true);
        this.setGameDataIfLess(('time_'+this.getMapName()),this.game.stopCompletionTimer());

        this.game.map.forceCameraSprite=this;
        
        this.shake=true;
        this.shakeSize=5;
        this.shakePeriodTick=0;

        // warp player out
        this.sendMessage(this.getPlayerSprite(),'warp_out',null);
    }
    
    onCollideSprite(sprite) {
        // certain types of blocks back up ghastly
        if ((sprite instanceof BreakBlockClass) || (sprite instanceof BlockClass)) this.backupCount=KingGhastlyClass.BACKUP_TICK;
        
        // smash any blocks
        this.smashBlocks();

        // try to jump
        if (this.grounded) this.addGravity(KingGhastlyClass.JUMP_HEIGHT,0);
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        // jump up if blocked by a tile
        if (this.grounded) this.addGravity(KingGhastlyClass.JUMP_HEIGHT,0);
    }

    onRun(tick) {
        // do nothing if we aren't shown
        if (!this.show) return;
        
        // dead, just sink 
        if (this.isDead) {
            this.y+=KingGhastlyClass.SINK_SPEED;
            this.alpha-=0.01;
            if (this.alpha<0.0) this.alpha=0.0;
            if (this.skullParticle!=null) {
                this.skullParticle.resetPosition((this.x+(this.width/2)),(this.y-(this.height/2)));
            }
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
            this.moveWithCollision(-KingGhastlyClass.GHASTLY_SPEED,0);
        }
        
        // always head towards the player
        // don't run this on first drop as ghastly falls through tiles and will
        // get instantly ejected from the map
        else {
            if (!this.firstDrop) this.moveWithCollision(KingGhastlyClass.GHASTLY_SPEED,0);
        }
        
        this.runGravity();
        
        // hit the liquid?
        if (this.isInLiquid()) {
            this.kill();
        }
    }
    
}
