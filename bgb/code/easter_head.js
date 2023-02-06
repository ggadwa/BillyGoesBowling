import SpriteClass from '../../rpjs/engine/sprite.js';
import FishClass from './fish.js';
import BallClass from './ball.js';

export default class EasterHeadClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.FIRE_TICK=100;
        this.FIRE_RANDOM_TICK_OFFSET=25;
        this.FIRE_MIN_DISTANCE=64*3;
        this.FIRE_MAX_DISTANCE=64*15;
        this.THROW_MARGIN_X=-5;
        this.THROW_MARGIN_Y=32;
        this.FIRE_FRAME_TICK=300;
        this.SINK_MAX_DISTANCE=20;
        
        // variables
        this.fireCount=this.FIRE_TICK+Math.trunc(Math.random()*this.FIRE_RANDOM_TICK_OFFSET); // random firing times
        this.fireFrameStartTick=0;
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
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new EasterHeadClass(this.game,x,y,this.data));
    }
    
    throwFish() {
        let sx,sy,dist;
        let playerSprite=this.game.map.getSpritePlayer();
        
        // throw the fish
        dist=this.distanceToSprite(playerSprite);
        if ((dist<this.FIRE_MIN_DISTANCE) || (dist>this.FIRE_MAX_DISTANCE)) return; // only fire if close, and stop firing if two close
        
        if (this.x>playerSprite.x) {
            sx=this.x-(32+this.THROW_MARGIN_X);
        }
        else {
            sx=(this.x+this.width)+this.THROW_MARGIN_X;
        }
        sy=(this.y-this.height)+this.THROW_MARGIN_Y;

        this.game.map.addSprite(new FishClass(this.game,sx,sy,null));
        this.game.soundList.playAtSprite('pipe_break',this,playerSprite); // use the same sound effect here
        
        // show eyes
        this.fireFrameStartTick=this.game.timestamp;
    }
    
    run() {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
        // if player is standing on head, then sink
        if (playerSprite.standSprite===this) {
            this.sinkY++;
            if (this.sinkY>this.SINK_MAX_DISTANCE) this.sinkY=this.SINK_MAX_DISTANCE;
        }
        else {
            this.sinkY--;
            if (this.sinkY<0) this.sinkY=0;
        }
        
        this.y=this.originalY+this.sinkY;
        
        // get correct image
        this.flipX=playerSprite.x<this.x;
        
        if (this.fireFrameStartTick!==0) {
            if ((this.fireFrameStartTick+this.FIRE_FRAME_TICK)<this.game.timestamp) {
                this.fireFrameStartTick=0;
            }
            this.setCurrentImage('sprites/easter_head_fire');
        }
        else {
            this.setCurrentImage('sprites/easter_head');
        }
        
        // time to fire? 
        this.fireCount--;
        if (this.fireCount===0) {
            this.fireCount=this.FIRE_TICK+Math.trunc(Math.random()*this.FIRE_RANDOM_TICK_OFFSET); // random firing times;
            this.throwFish();
        }
    }
    
}
