import SpriteClass from '../../rpjs/engine/sprite.js';
import CloudBlockClass from './cloud_block.js';
import BreakBlockStrongClass from '../code/break_block_strong.js';
import BallClass from './ball.js';
import EyeClass from './eye.js';

export default class BoneyOneEyeClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.FIRE_TICK=55;
        
            // variables
            
        this.fireWait=0;
        this.inAir=false;
        this.isFalling=false;
        this.isDead=false;
        this.isFirstShow=true;
        
            // setup
        
        this.addImage('sprites/boney_one_eye');
        this.setCurrentImage('sprites/boney_one_eye');
        
        this.show=false;            // start with it not shown, button starts it
        this.gravityFactor=0.15;
        this.gravityMinValue=3;
        this.gravityMaxValue=30;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new BoneyOneEyeClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.fireWait=this.FIRE_TICK;
        this.inAir=false;
        this.isDead=false;
        this.isFirstShow=true;
        
        this.game.startCompletionTimer();
    }
    
    fireEye()
    {
        let x,y;
        
            // are we at the next launch position
            
        x=this.x+Math.trunc(this.width*0.6);
        y=this.y-Math.trunc(this.height*0.5);
        
        this.game.map.addSprite(new EyeClass(this.game,x,y,null));
        
        this.playSound('jump');
    }
    
    onRun(tick) {
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
                this.inAir=false;
                this.shakeMap(10);
                this.playSound('thud');
            }
        }
        
            // dead, do nothig
            
        if (this.isDead) {
            this.y+=4;
            return;
        }
        
            // hit the liquid?
        if (this.isInLiquid()) {
            this.isDead=true;
            this.gravityFactor=0.0;
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
        
            // special check if we are falling
            // after breaking blocks
            
        if (!this.isFalling) {
            this.isFalling=!this.grounded;
        }
        else {
            if (this.grounded) {
                this.isFalling=false;
                this.shakeMap(4);
                this.playSound('thud');
            }
        }
        
            // stand on clouds?  If so break all clouds
            // around him to fall into liquid
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof CloudBlockClass) {
                this.sendMessageToSpritesWithinBox((this.x-32),(this.y-32),((this.x+this.width)+32),(this.y+64),this,CloudBlockClass,'pop',null);
            }
        }
        
            // time to fire?
            
        this.fireWait--;
        if (this.fireWait===0) {
            this.fireWait=this.FIRE_TICK;
            this.fireEye();
        }
    }
    
}
