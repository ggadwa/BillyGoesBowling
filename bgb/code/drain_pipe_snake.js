import SpriteClass from '../../rpjs/engine/sprite.js';
import BallClass from './ball.js';
import ShieldClass from './shield.js';
import ShurikinClass from './shurikin.js';
import BombClass from './bomb.js';
import FishClass from './fish.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class DrainPipeSnakeClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.MAX_WALK_SPEED=5.0;
        this.ACCEL_SPEED=1.0;
        this.INVINCIBLE_TICK=60;
        this.TILE_IDX_GROUND_LEFT_END=1;
        this.TILE_IDX_GROUND_RIGHT_END=3;
        this.TILE_IDX_GIRDER_LEFT_END=10;
        this.TILE_IDX_GIRDER_RIGHT_END=12;
        
        // variables
        this.walkSpeed=0.0;
        this.snakeHasPipe=true;
        this.invincibleCount=0;
        
        // setup
        this.addImage('sprites/snake_1');
        this.addImage('sprites/snake_2');
        this.addImage('sprites/snake_pipe_1');
        this.addImage('sprites/snake_pipe_2');
        this.setCurrentImage('sprites/snake_pipe_1');
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.flipX=(Math.random()>0.5); // start with random direction
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new DrainPipeSnakeClass(this.game,x,y,this.data));
    }
    
    breakPipe() {
        this.snakeHasPipe=false;
        this.invincibleCount=this.INVINCIBLE_TICK;
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),16,16,1.0,0.1,5,0.05,'particles/pipe',10,0.5,false,800);
        this.playSound('pipe_break'); 
    }
    
    kill() {
        this.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),64,96,0.6,0.001,24,0,'particles/smoke',8,0.1,false,600);
        this.playSound('monster_die');
        this.delete();
    }
    
    onCollideSprite(sprite) {
        // colliding with ball, shield, shurikin, bomb, or fish hurts snake
        if (
                (sprite instanceof BallClass) ||
                (sprite instanceof ShieldClass) ||
                (sprite instanceof ShurikinClass) ||
                (sprite instanceof BombClass) ||
                (sprite instanceof FishClass)) {
                    if (this.invincibleCount>0) return;

                    if (this.snakeHasPipe) {
                        this.breakPipe();
                    }
                    else {
                        this.kill();
                    }
                   return;
        }
        
        // colliding with player breaks pipe and turns snake around
        if (sprite instanceof PlayerSideScrollClass) {
            if (this.snakeHasPipe) this.breakPipe();
            this.flipX=!this.flipX;
            this.walkSpeed=0.0;
            return;
        }
        
        // colliding with any other sprite turns snake around
        this.flipX=!this.flipX;
        this.walkSpeed=0.0;
    }
    
    onCollideTile(tileX,tileY,tileIdx) {
        // colliding with tiles turns snake around immediately
        this.flipX=!this.flipX;
        this.walkSpeed=0.0;
    }
    
    onStandOnTile(tileX,tileY,tileIdx) {
        // we call this because stand on tile just gives us the first tile we are standing on and this
        // gives us a more precise tile that we are centered on
        tileIdx=this.getTileUnderSprite();
        if (tileIdx===-1) return;
        
        // if we are on edge tiles, then turn around 
        if (((tileIdx===this.TILE_IDX_GROUND_LEFT_END) || (tileIdx===this.TILE_IDX_GIRDER_LEFT_END)) && (this.flipX)) {
            this.flipX=false;
            return;
        }
        
        if (((tileIdx===this.TILE_IDX_GROUND_RIGHT_END) || (tileIdx===this.TILE_IDX_GIRDER_RIGHT_END)) && (!this.flipX)) {
            this.flipX=true;
        }
    }
    
    run() {
        let maxSpeed;
        
        // invincible from broken pipe
        this.flash=false;
        
        if (this.invincibleCount>0) {
            this.invincibleCount--;
            if (this.invincibleCount>0) {
                this.flash=true;
                this.flashRate=(this.invincibleCount>(this.INVINCIBLE_TICK/2))?5:2;
            }
        }
        
        // walk in direction until a collision
        maxSpeed=this.MAX_WALK_SPEED;
        if (!this.snakeHasPipe) maxSpeed*=2.0;
        
        if (this.flipX) {
            this.walkSpeed-=this.ACCEL_SPEED;
            if (this.walkSpeed<-maxSpeed) this.walkSpeed=-maxSpeed;
        }
        else {
            this.walkSpeed+=this.ACCEL_SPEED;
            if (this.walkSpeed>maxSpeed) this.walkSpeed=maxSpeed;
        }
        
        // move the snake
        this.moveWithCollision(this.walkSpeed,0);
        this.runGravity();
        
        // image
        if (this.snakeHasPipe) {
            if ((Math.trunc(this.game.timestamp/200)&0x1)===0) {
                this.setCurrentImage('sprites/snake_pipe_1');
            }
            else {
                this.setCurrentImage('sprites/snake_pipe_2');
            }
        }
        else {
            if ((Math.trunc(this.game.timestamp/100)&0x1)===0) {
                this.setCurrentImage('sprites/snake_1');
            }
            else {
                this.setCurrentImage('sprites/snake_2');
            }
        }
    }
    
}
