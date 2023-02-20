import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleClass from '../../rpjs/engine/particle.js';
import BallClass from './ball.js';
import RotoCarrotClass from './roto_carrot.js';

export default class BombClass extends SpriteClass {
        
    static BOMB_SPEED=7;

    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        // setup
        this.addImage('sprites/bomb');
        this.setCurrentImage('sprites/bomb');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canStandOn=false;
        
        this.setCollideSpriteClassIgnoreList([RotoCarrotClass]);
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new BonbClass(this.game,x,y,this.data));
    }
    
    explode() {
        let cx,cy;
        
        cx=this.x+Math.trunc(this.width*0.5);
        cy=this.y+Math.trunc(this.height*0.5);
        
        this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,35,200,0.8,0.01,8,0.02,'particles/explode_red',16,0.3,false,550);
        this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,25,140,0.7,0.01,6,0.01,'particles/explode_orange',8,0.25,false,540);
        this.addParticle(cx,cy,ParticleClass.AFTER_SPRITES_LAYER,15,60,0.6,0.01,4,0.005,'particles/explode_yellow',2,0.2,false,530);
        this.playSound('explode');

        this.delete();
    }
    
    onCollideSprite(sprite) {
        this.explode(); // colliding with any sprite explodes bomb
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        this.explode(); // colliding with any tile explodes bomb
    }
    
    onRun(tick) {
        this.y+=this.BOMB_SPEED; // bomb falls at steady rate
        
        if (this.isInLiquid()) {
            this.explode();
            return;
        }

        this.checkCollision();
    }
}
