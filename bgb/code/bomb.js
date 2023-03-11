import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleDefsClass from './particle_defs.js';
import BallClass from './ball.js';
import RotoCarrotClass from './roto_carrot.js';

export default class BombClass extends SpriteClass {
        
    static BOMB_SPEED=3.5;
    static BOMB_SPEED_RANDOM_ADD=0.5;

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
        
        this.setCollideSpriteClassCollideIgnoreList([RotoCarrotClass]);
        
        this.speed=BombClass.BOMB_SPEED+(Math.random()*BombClass.BOMB_SPEED_RANDOM_ADD);
        
        Object.seal(this);
    }
    
    explode() {
        let cx,cy;
        
        cx=this.x+Math.trunc(this.width*0.5);
        cy=this.y+Math.trunc(this.height*0.5);
        
        this.addParticle(cx,cy,ParticleDefsClass.EXPLODE_SMOKE_PARTICLE);
        this.addParticle(cx,cy,ParticleDefsClass.EXPLODE_RED_PARTICLE);
        this.addParticle(cx,cy,ParticleDefsClass.EXPLODE_ORANGE_PARTICLE);
        this.addParticle(cx,cy,ParticleDefsClass.EXPLODE_YELLOW_PARTICLE);
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
        this.y+=this.speed; // bomb falls at steady rate
        
        if (this.isInLiquid()) {
            this.explode();
            return;
        }

        this.checkCollision();
    }
}
