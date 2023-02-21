import SpriteClass from '../../rpjs/engine/sprite.js';
import FishClass from './fish.js';
import BallClass from './ball.js';

export default class EasterHeadClass extends SpriteClass {

    static FIRE_TICK=100;
    static FIRE_RANDOM_TICK_OFFSET=25;
    static FIRE_MIN_DISTANCE=64*3;
    static FIRE_MAX_DISTANCE=64*15;
    static THROW_MARGIN_X=-16;
    static THROW_MARGIN_Y=45;
    static EYE_TICK=10;
    static SINK_MAX_DISTANCE=20;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.fireCount=EasterHeadClass.FIRE_TICK+Math.trunc(Math.random()*EasterHeadClass.FIRE_RANDOM_TICK_OFFSET); // random firing times
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
        
        this.setCollideSpriteClassIgnoreList([FishClass]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new EasterHeadClass(this.game,x,y,this.data));
    }
    
    throwFish() {
        let sx,sy,dist;
        let playerSprite=this.getPlayerSprite();
        
        // throw the fish
        dist=this.distanceToSprite(playerSprite);
        if ((dist<EasterHeadClass.FIRE_MIN_DISTANCE) || (dist>EasterHeadClass.FIRE_MAX_DISTANCE)) return; // only fire if close, and stop firing if two close
        
        sx=(this.x+(this.width/2))+EasterHeadClass.THROW_MARGIN_X;
        sy=(this.y-this.height)+EasterHeadClass.THROW_MARGIN_Y;

        this.game.map.addSprite(new FishClass(this.game,sx,sy,null));
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
            this.fireCount=EasterHeadClass.FIRE_TICK+Math.trunc(Math.random()*EasterHeadClass.FIRE_RANDOM_TICK_OFFSET); // random firing times;
            this.throwFish();
        }
    }
    
}
