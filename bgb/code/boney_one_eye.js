import SpriteClass from '../../rpjs/engine/sprite.js';
import GrayFilterClass from '../../rpjs/filters/gray.js';
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
        this.isDropping=true;
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
        
        this.grayDrawFilter=new GrayFilterClass();
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new BoneyOneEyeClass(this.game,x,y,this.data));
    }
    
    mapStartup()
    {
        this.fireWait=this.FIRE_TICK;
        this.isDropping=true;
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
        
        this.game.soundList.playAtSprite('jump',this,this.game.map.getSpritePlayer());
    }
    
    run()
    {
        let time, oldTime;
        let sprite,sprites;
        let map=this.game.map;
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
            this.isFalling=false;
            
            map.shake(10);
            this.game.soundList.play('thud');
        }
        
            // dead, do nothig
            
        if (this.isDead) {
            this.y+=4;
            return;
        }
        
            // hit the liquid?
         
        if (this.y>=map.liquidY) {
            playerSprite.warpOut();
            this.isDead=true;
            this.gravityFactor=0.0;
            this.drawFilter=this.grayDrawFilter;
            this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),64,256,1.0,0.01,0.1,8,'particles/skull',30,0.0,false,2500);
            this.game.soundList.play('boss_dead');
            
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
                map.shake(4);
                this.game.soundList.play('thud');
            }
        }
        
            // stand on clouds?  If so break all clouds
            // around him to fall into liquid
            
        if (this.standSprite!==null) {
            if (this.standSprite instanceof CloudBlockClass) {
                sprites=map.getSpritesWithinBox((this.x-32),(this.y-32),((this.x+this.width)+32),(this.y+64),this,CloudBlockClass);

                for (sprite of sprites) {
                    sprite.interactWithSprite(this,null);
                }
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
