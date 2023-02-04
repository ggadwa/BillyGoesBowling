import SpriteClass from '../../rpjs/engine/sprite.js';
import FlashFilterClass from '../../rpjs/filters/flash.js';
import BallClass from './ball.js';
import SpringClass from './spring.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class DrainPipeSnakeClass extends SpriteClass {
        
    constructor(game,x,y,data) {
        super(game,x,y,data);
        
        this.INVINCIBLE_TICK=20;
        this.TILE_IDX_GROUND_LEFT_END=1;
        this.TILE_IDX_GROUND_RIGHT_END=3;
        this.TILE_IDX_GIRDER_LEFT_END=10;
        this.TILE_IDX_GIRDER_RIGHT_END=12;
        
        // variables
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
        
        this.flashDrawFilter=new FlashFilterClass();
        
        Object.seal(this);
    }
    
    duplicate(x,y) {
        return(new DrainPipeSnakeClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj) {
        if (interactSprite instanceof BallClass) {
            if (this.invincibleCount>0) return;
            
            if (this.snakeHasPipe) {
                this.snakeHasPipe=false;
                this.invincibleCount=this.INVINCIBLE_TICK;
                this.drawFilter=this.flashDrawFilter;
                this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),16,16,1.0,0.1,5,0.05,'particles/pipe',10,0.5,false,800);
                this.game.soundList.playAtSprite('pipe_break',this,this.game.map.getSpritePlayer());
            }
            else {
                this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),64,96,0.6,0.001,24,0,'particles/smoke',8,0.1,false,600);
                this.game.soundList.playAtSprite('monster_die',this,this.game.map.getSpritePlayer());
                this.delete();
            }
        }
    }
    
    runAI() {
        let map=this.game.map;
        let mx,tileIdx,switchDirection;
        
        // special count when invincible from
        // first ball hit  
        if (this.invincibleCount>0) {
            this.drawFilterAnimationFactor=1.0-(this.invincibleCount/this.INVINCIBLE_TICK);
            this.invincibleCount--;
            if (this.invincibleCount===0) this.drawFilter=null;
        }
        
        // walk in direction until a collision
        switchDirection=false;
        
        mx=((this.snakeHasPipe?5:10)*(this.flipX?-1:1));
        
        this.x+=mx;
        if (map.checkCollision(this)) {
            if (this.collideSprite!==null) this.collideSprite.interactWithSprite(this,null);
            this.x-=mx;
            switchDirection=true;
        }
        
        // if we are on edge tiles, then
        // turn around 
        tileIdx=map.getTileUnderSprite(this);
        if (((tileIdx===this.TILE_IDX_GROUND_LEFT_END) || (tileIdx===this.TILE_IDX_GIRDER_LEFT_END)) && (this.flipX)) switchDirection=true;
        if (((tileIdx===this.TILE_IDX_GROUND_RIGHT_END) || (tileIdx===this.TILE_IDX_GIRDER_RIGHT_END)) && (!this.flipX)) switchDirection=true;
        
        // check for standing on a cloud or button
        if (this.standSprite!==null) {
            if ((this.standSprite instanceof SpringClass) || (this.standSprite instanceof PlayerSideScrollClass)) {
                this.standSprite.interactWithSprite(this,null);
            }
        }
        
        // switch direction
        if (switchDirection) {
            this.flipX=!this.flipX;
        }
        
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
