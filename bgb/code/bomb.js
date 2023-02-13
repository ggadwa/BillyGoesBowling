import SpriteClass from '../../rpjs/engine/sprite.js';
import BallClass from './ball.js';
import RotoCarrotClass from './roto_carrot.js';

export default class BombClass extends SpriteClass {
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // constants
        this.BOMB_SPEED=7;
        
        this.COLLIDE_CLASS_IGNORE=[RotoCarrotClass];
        
        // setup
        this.addImage('sprites/bomb');
        this.setCurrentImage('sprites/bomb');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canStandOn=false;
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new BonbClass(this.game,x,y,this.data));
    }
    
    explode() {
        let cx,cy;
        
        cx=this.x+Math.trunc(this.width*0.5);
        cy=this.y+Math.trunc(this.height*0.5);
        
        this.game.map.addParticle(cx,cy,35,200,0.8,0.01,8,0.02,'particles/explode_red',16,0.3,false,550);
        this.game.map.addParticle(cx,cy,25,140,0.7,0.01,6,0.01,'particles/explode_orange',8,0.25,false,540);
        this.game.map.addParticle(cx,cy,15,60,0.6,0.01,4,0.005,'particles/explode_yellow',2,0.2,false,530);
        this.playSound('explode');

        this.delete();
    }
    
    interactWithSprite(interactSprite,dataObj) {
        // ball explodes bomb 
        if (interactSprite instanceof BallClass) {
            this.explode();
        }
    }
    
    run() {
        this.y+=this.BOMB_SPEED;
        
        if (this.isInLiquid()) {
            this.explode();
            return;
        }

        if (this.checkCollision(this.COLLIDE_CLASS_IGNORE)) {
            if (this.collideSprite!=null) this.collideSprite.interactWithSprite(this,null);
            this.explode();
        }
    }
}
