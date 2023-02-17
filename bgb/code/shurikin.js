import SpriteClass from '../../rpjs/engine/sprite.js';
import BallClass from './ball.js';
import NinjaBunnyClass from './ninja_bunny.js';

export default class ShurikinClass extends SpriteClass {

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.SHURIKIN_X_SPEED=12;
        this.SHURIKIN_Y_SPEED=15;
        
        // variables
        this.moveX=0;
        
        // setup
        this.addImage('sprites/shurikin');
        this.setCurrentImage('sprites/shurikin');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canStandOn=false;
        
        this.setCollideSpriteClassIgnoreList([NinjaBunnyClass]);
        this.setCollideTileIndexIgnoreList([22,23]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new ShurikinClass(this.game,x,y,this.data));
    }
    
    kill() {
        this.playSound('ball_break');
        this.addParticle((this.x+(this.width/2)),(this.y-(this.height/2)),8,2,1.0,0.1,2,0.02,'particles/ball',8,0.7,false,500);
        this.delete();
    }
    
    onCollideSprite(sprite) {
        this.sendMessage(sprite,'hurt',null);
        this.kill();
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.kill();
    }
        
    onRun(tick) {
        let playerSprite=this.getPlayerSprite();
        
        // if first call, then we need to setup the travel  
        if (this.moveX===0) {
            this.moveX=(playerSprite.x<this.x)?-this.SHURIKIN_X_SPEED:this.SHURIKIN_X_SPEED;
        }

        this.moveWithCollision(this.moveX,this.SHURIKIN_Y_SPEED);
    }
}
