import SpriteClass from '../../rpjs/engine/sprite.js';
import ParticleDefsClass from './particle_defs.js';

export default class SenseiClass extends SpriteClass {

    static MAX_WALK_SPEED=2.5;
    static ACCEL_SPEED=0.2;
    static FIREWORK_TICK=40;
    static FIREWORK_TICK_RANDOM_ADD=40;
    static FIREWORK_PARTICLES=[ParticleDefsClass.FIREWORK_1_PARTICLE,ParticleDefsClass.FIREWORK_2_PARTICLE,ParticleDefsClass.FIREWORK_3_PARTICLE];
    static TILE_IDX_GROUND_LEFT_END=1;
    static TILE_IDX_GROUND_RIGHT_END=3;
    static TILE_IDX_GIRDER_LEFT_END=10;
    static TILE_IDX_GIRDER_RIGHT_END=12;

    constructor(game,x,y,data) {
        super(game,x,y,data);

        this.walkSpeed=0.0;
        this.snakeHasPipe=true;
        this.invincibleCount=0;
        
        // setup
        this.addImage('sprites/sensei_1');
        this.setCurrentImage('sprites/sensei_1');
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.setCollideTileIndexIgnoreList([22,23,54]);
        
        this.flipX=true;
        this.fireworkTick=0;
        
        Object.seal(this);
    }
    
    runFireworks() {
        let cx,cy;
        
        this.fireworkTick--;
        if (this.fireworkTick>0) return;
        
        // fireworks
        cx=this.x+((100+this.randomScaled(150))*(this.randomBoolean()?-1:1));
        cy=this.y+((100+this.randomScaled(150))*(this.randomBoolean?-1:1));

        this.addParticle(cx,cy,SenseiClass.FIREWORK_PARTICLES[this.randomScaledInt(3)]);
        this.addParticle(cx,cy,ParticleDefsClass.FIREWORK_DEBRIS_PARTICLE);

        this.playSoundGlobal('firework');

        // next
        this.fireworkTick=SenseiClass.FIREWORK_TICK+this.randomScaledInt(SenseiClass.FIREWORK_TICK_RANDOM_ADD);
    }
    
    onStandOnTile(tileX,tileY,tileIdx) {
        // we call this because stand on tile just gives us the first tile we are standing on and this
        // gives us a more precise tile that we are centered on
        tileIdx=this.getTileUnderSprite();
        if (tileIdx===-1) return;
        
        // if we are on edge tiles, then turn around 
        if (((tileIdx===SenseiClass.TILE_IDX_GROUND_LEFT_END) || (tileIdx===SenseiClass.TILE_IDX_GIRDER_LEFT_END)) && (this.flipX)) {
            this.flipX=false;
            return;
        }
        
        if (((tileIdx===SenseiClass.TILE_IDX_GROUND_RIGHT_END) || (tileIdx===SenseiClass.TILE_IDX_GIRDER_RIGHT_END)) && (!this.flipX)) {
            this.flipX=true;
        }
    }
    
    onRun(tick) {
        let maxSpeed;
        
        this.runFireworks();
        
        // walk in direction until a collision
        maxSpeed=SenseiClass.MAX_WALK_SPEED;
        
        if (this.flipX) {
            this.walkSpeed-=SenseiClass.ACCEL_SPEED;
            if (this.walkSpeed<-maxSpeed) this.walkSpeed=-maxSpeed;
        }
        else {
            this.walkSpeed+=SenseiClass.ACCEL_SPEED;
            if (this.walkSpeed>maxSpeed) this.walkSpeed=maxSpeed;
        }
        
        // move sensei
        this.moveWithCollision(this.walkSpeed,0);
        this.runGravity();
        
        // image
        if (((tick/5)&0x1)===0) {
            this.setCurrentImage('sprites/sensei_1');
        }
        else {
            this.setCurrentImage('sprites/sensei_1');
        }
    }
    
}
