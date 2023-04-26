import SpriteClass from '../../rpjs/engine/sprite.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import BombClass from './bomb.js';
import FishClass from './fish.js';
import ShurikinClass from './shurikin.js';

export default class PlatformClass extends SpriteClass
{
    static PLATFORM_SPEED=5;
    static PLATFORM_PAUSE_TICK=60; 

    constructor(game,x,y,data)
    {
        super(game,x,y,data);
            
        this.xAdd=PlatformClass.PLATFORM_SPEED;
        this.pauseCount=0;
        
            // setup
            
        this.addImage('sprites/platform');
        this.setCurrentImage('sprites/platform');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;

        this.setCollideSpriteClassCollideIgnoreList([BallClass,ShieldClass,ShurikinClass,FishClass,BombClass]);
        this.setCollideTileIndexIgnoreList([22,23,54]);
        
        Object.seal(this);
    }
    
    turnAround() {
        this.xAdd=-this.xAdd;
        this.x+=this.xAdd;
        this.pauseCount=PlatformClass.PLATFORM_PAUSE_TICK;
        this.playSound('slam');
    }

    onCollideSprite(sprite) {
        this.turnAround();
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.turnAround();
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        // are we paused?
        if (this.pauseCount>0) {
            this.pauseCount--;
            return;
        }
        
        // move platform
        this.x+=this.xAdd;
        this.checkCollision();
        
        // move player if standing on it
        if (playerSprite.standSprite===this) {
            playerSprite.moveWithCollision(this.xAdd,0);
        }
    }
}
