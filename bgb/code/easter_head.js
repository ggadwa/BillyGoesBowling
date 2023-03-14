import SpriteClass from '../../rpjs/engine/sprite.js';
import FishClass from './fish.js';
import BallClass from './ball.js';

export default class EasterHeadClass extends SpriteClass {

    static FIRE_TICK=200;
    static FIRE_RANDOM_TICK_ADD=100;
    static FIRE_MIN_DISTANCE=64*3;
    static FIRE_MAX_DISTANCE=64*15;
    static THROW_MARGIN_X=-16;
    static THROW_MARGIN_Y=45;
    static EYE_TICK=20;
    static SINK_MAX_DISTANCE=20;
    static MAX_CONCURRENT_FISH=3;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.fireCount=EasterHeadClass.FIRE_TICK+Math.trunc(Math.random()*EasterHeadClass.FIRE_RANDOM_TICK_ADD); // random firing times
        this.eyeCount=0;
        this.sinkY=0;
        this.originalY=y;
        
        // setup
        this.addImage('sprites/easter_head');
        this.addImage('sprites/easter_head_fire');
        this.setCurrentImage('sprites/easter_head');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.layer=this.UNDER_MAP_TILES_LAYER; // so it can sink below map tiles
        
        this.setCollideSpriteClassCollideIgnoreList([FishClass]);
        
        Object.seal(this);
    }
    
    throwFish() {
        let sx,sy,dist;
        let playerSprite=this.getPlayerSprite();
        
        // do not throw if already too many fish, but make a short timer
        if (this.countSpriteOfType(FishClass)>=EasterHeadClass.MAX_CONCURRENT_FISH) {
            this.fireCount=Math.trunc(Math.random()*EasterHeadClass.FIRE_RANDOM_TICK_ADD);
            return;
        }
        
        // reset for next throw
        this.fireCount=EasterHeadClass.FIRE_TICK+Math.trunc(Math.random()*EasterHeadClass.FIRE_RANDOM_TICK_ADD); // random firing times;
        
        // do not fire if too far away, but cut the fire time in half
        dist=this.distanceToSprite(playerSprite);
        if (dist>EasterHeadClass.FIRE_MAX_DISTANCE) {
            this.fireCount=Math.trunc(this.fireCount*0.5);
            return;
        }
        
        // if too close, do not fire, but fire tick is reduced by 1/4
        if (dist<EasterHeadClass.FIRE_MIN_DISTANCE) {
            this.fireCount=Math.trunc(this.fireCount*0.75);
            return;
        } 
        
        // throw the fish
        sx=(this.x+(this.width/2))+EasterHeadClass.THROW_MARGIN_X;
        sy=(this.y-this.height)+EasterHeadClass.THROW_MARGIN_Y;

        this.game.map.addSprite(FishClass,sx,sy,null);
        this.playSound('pipe_break');
        
        // show eyes
        this.eyeCount=EasterHeadClass.EYE_TICK;
    }
    
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        // if player is standing on head, then sink
        if (playerSprite.standSprite===this) {
            this.sinkY++;
            if (this.sinkY>EasterHeadClass.SINK_MAX_DISTANCE) this.sinkY=EasterHeadClass.SINK_MAX_DISTANCE;
        }
        else {
            this.sinkY--;
            if (this.sinkY<0) this.sinkY=0;
        }
        
        this.y=this.originalY+this.sinkY;
        
        // get correct image
        this.flipX=playerSprite.x<this.x;
        
        if (this.eyeCount!==0) {
            this.eyeCount--;
            this.setCurrentImage('sprites/easter_head_fire');
        }
        else {
            this.setCurrentImage('sprites/easter_head');
        }
        
        // time to fire? 
        this.fireCount--;
        if (this.fireCount===0) {
            this.throwFish();
        }
    }
    
}
