import SpriteClass from '../../rpjs/engine/sprite.js';
import RockClass from './rock.js';
import BallClass from './ball.js';

export default class EasterHeadClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.FIRE_TICK=100;
        this.FIRE_MIN_DISTANCE=64*3;
        this.FIRE_MAX_DISTANCE=64*15;
        
            // variables
            
        this.fireCount=this.FIRE_TICK+Math.trunc(Math.random()*25);   // random firing times
        
            // setup
        
        this.addImage('sprites/easter_head_left');
        this.addImage('sprites/easter_head_right');
        this.setCurrentImage('sprites/easter_head_left');
        this.setEditorImage('sprites/easter_head_left');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new EasterHeadClass(this.game,x,y,this.data));
    }
    
    throwRock()
    {
        let sx,sy,dist;
        let playerSprite=this.game.map.getSpritePlayer();
        
        dist=this.distanceToSprite(playerSprite);
        if ((dist<this.FIRE_MIN_DISTANCE) || (dist>this.FIRE_MAX_DISTANCE)) return;     // only fire if close, and stop firing if two close
        
        if (this.x>playerSprite.x) {
            sx=this.x-(32+10);
        }
        else {
            sx=(this.x+this.width)+10;
        }

        sy=(this.y-this.height)+16;

        this.game.map.addSprite(new RockClass(this.game,sx,sy,null));
        
        this.game.soundList.playAtSprite('pipe_break',this,playerSprite);       // use the same sound effect here
    }
    
    runAI()
    {
        let map=this.game.map;
        let playerSprite=map.getSpritePlayer();
        
            // always look at player
            
        this.setCurrentImage((this.x>playerSprite.x)?'sprites/easter_head_left':'sprites/easter_head_right');
        
            // time to fire?
            
        this.fireCount--;
        if (this.fireCount===0) {
            this.fireCount=this.FIRE_TICK;
            this.throwRock();
        }
    }
    
}
