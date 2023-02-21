import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from './break_block_strong.js';
import ExplodeBlockClass from './explode_block.js';
import BoomerangClass from './boomerang.js';

export default class KangarangClass extends SpriteClass {
   
    static FIRE_TICK=100;
    static MAX_BOOMERANG=3;
    static BOOMERANG_SPAWN_DISTANCE=256;
    static BOOMERANGE_SIZE=64;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // variables
        this.fireWait=0;
        this.inAir=false;
        this.isFalling=false;
        this.isDead=false;
        this.isFirstShow=true;
        
        // setup
        this.addImage('sprites/kangarang');
        this.setCurrentImage('sprites/kangarang');
        
        this.show=false; // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideSpriteClassIgnoreList([BoomerangClass]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new KangarangClass(this.game,x,y,this.data));
    }
    
    mapStartup() {
        this.fireWait=KangarangClass.FIRE_TICK;
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
    }
    
    fireBoomerang() {
        let x,y;
        
        // wait until fire
        this.fireWait--;
        if (this.fireWait>0) return;
        
        this.fireWait=KangarangClass.FIRE_TICK;
        
        // don't fire but just wait again if too many boomerangs out
        if (this.countSpriteOfType(BoomerangClass)>KangarangClass.MAX_BOOMERANG) return;
        
        x=(this.x+(this.width/2))-(KangarangClass.BOOMERANGE_SIZE/2);
        y=(this.y-(this.height/2))+(KangarangClass.BOOMERANGE_SIZE/2);

        this.game.map.addSprite(new BoomerangClass(this.game,x,y,null));

        this.playSound('jump');
    }

    land() {
        this.shakeMap(10);
        this.playSound('thud');
        
        // clear the blocks that don't allow the player to cheat and knock down pile early
        this.sendMessageToAllSpritesOfType(BreakBlockStrongClass,'explode',null);
               
        // pop any clouds and explode any explosion blocks
        this.sendMessageToSpritesAroundSprite(0,0,0,32,CloudBlockClass,'pop',null);
        this.sendMessageToSpritesAroundSprite(0,0,0,32,ExplodeBlockClass,'explode',null);
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
    
    onRun(tick) {
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
        
        this.runGravity();
        
        // time to fire?
        this.fireBoomerang();

        // hit the liquid?
        if (this.isInLiquid()) {
            this.kill();
        }
    }
    
}
