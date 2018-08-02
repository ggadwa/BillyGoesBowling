import SpriteClass from '../engine/sprite.js';
import BallClass from './ball.js';

export default class DrainPipeSnakeClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
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
                this.invincibleCount=30;
                this.setCurrentImage((this.snakeDirection===1)?'sprites/drain_pipe_snake_free_right':'sprites/drain_pipe_snake_free_left');
            }
            else {
                this.delete();
            }
        }
    }
    
    runAI()
    {
        let map=this.game.map;
        let x,tileIdx,switchDirection;
        
            // special count when invincible from
            // first ball hit
            
        if (this.invincibleCount>0) this.invincibleCount--;
        
            // walk in direction until a collision
            
        switchDirection=false;
        
        x=((this.snakeHasPipe?5:10)*this.snakeDirection);
        
        this.move(x,0);
        if (map.checkCollision(this)) {
            if (this.collideSprite!==null) this.collideSprite.interactWithSprite(this,null);
            this.move(-x,0);
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
