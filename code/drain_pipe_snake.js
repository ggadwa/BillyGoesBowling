import SpriteClass from '../engine/sprite.js';
import FlashFilterClass from '../filters/flash.js';
import BallClass from './ball.js';

export default class DrainPipeSnakeClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.INVINCIBLE_TICK=20;
        
            // variables
            
        this.snakeDirection=1;
        this.snakeHasPipe=true;
        this.invincibleCount=0;
        
            // setup
        
        this.addImage('sprites/drain_pipe_snake_cover_left');
        this.addImage('sprites/drain_pipe_snake_cover_right');
        this.addImage('sprites/drain_pipe_snake_free_left');
        this.addImage('sprites/drain_pipe_snake_free_right');
        this.setCurrentImage('sprites/drain_pipe_snake_cover_right');
        this.setEditorImage('sprites/drain_pipe_snake_cover_right');
        
        this.show=true;
        this.gravityFactor=0.12;
        this.gravityMinValue=3;
        this.gravityMaxValue=20;
        this.canCollide=true;
        this.canStandOn=true;
        
        this.flashDrawFilter=new FlashFilterClass();
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new DrainPipeSnakeClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
        if (interactSprite instanceof BallClass) {
            if (this.invincibleCount>0) return;
            
            if (this.snakeHasPipe) {
                this.snakeHasPipe=false;
                this.invincibleCount=this.INVINCIBLE_TICK;
                this.drawFilter=this.flashDrawFilter;
                this.setCurrentImage((this.snakeDirection===1)?'sprites/drain_pipe_snake_free_right':'sprites/drain_pipe_snake_free_left');
                this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.5)),16,16,1.0,0.1,5,0.08,this.game.imageList.get('particles/pipe'),10,800);
            }
            else {
                this.game.map.addParticle((this.x+Math.trunc(this.width*0.5)),(this.y-Math.trunc(this.height*0.25)),64,128,0.8,0.01,0,0,this.game.imageList.get('particles/skull'),1,500);
                this.delete();
            }
        }
    }
    
    runAI()
    {
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
        
        mx=((this.snakeHasPipe?5:10)*this.snakeDirection);
        
        this.x+=mx;
        if (map.checkCollision(this)) {
            if (this.collideSprite!==null) this.collideSprite.interactWithSprite(this,null);
            this.x-=mx;
            switchDirection=true;
        }
        
            // if we are on edge tiles, then
            // turn around (1,3 are edge ground tiles)
            
        tileIdx=map.getTileUnderSprite(this);
        if ((tileIdx===1) || (tileIdx===3)) switchDirection=true;
        
            // switch direction
            
        if (switchDirection) {
            this.snakeDirection=-this.snakeDirection;
            if (this.snakeHasPipe) {
                this.setCurrentImage((this.snakeDirection===1)?'sprites/drain_pipe_snake_cover_right':'sprites/drain_pipe_snake_cover_left');
            }
            else {
                this.setCurrentImage((this.snakeDirection===1)?'sprites/drain_pipe_snake_free_right':'sprites/drain_pipe_snake_free_left');
            }
        }
    }
    
}
