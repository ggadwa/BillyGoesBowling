import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';
import DrainPipeSnakeClass from '../code/drain_pipe_snake.js';

export default class SpringClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.SPRING_HEIGHT=-80;
        this.OPEN_TICK=10;
        
            // setup
            
        this.addImage('sprites/spring_close');
        this.addImage('sprites/spring_open');
        this.setCurrentImage('sprites/spring_close');
        this.setEditorImage('sprites/spring_close');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        this.canRiseBlock=true;
        
        this.openCount=-1;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new SpringClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
            // is player standing on spring?
            
        if (!((interactSprite instanceof PlayerSideScrollClass) || (interactSprite instanceof DrainPipeSnakeClass))) return;
        if (interactSprite.standSprite!==this) return;
        
            // jump up
            
        interactSprite.motion.y=this.SPRING_HEIGHT;
        this.game.soundList.playAtSprite('boing',this,this.game.map.getSpritePlayer());
        
        this.openCount=this.OPEN_TICK;
        this.setCurrentImage('sprites/spring_open');
    }
    
    runAI()
    {
        if (this.openCount===-1) return;
        
        this.openCount--;
        if (this.openCount===0) this.setCurrentImage('sprites/spring_close');
    }
}
