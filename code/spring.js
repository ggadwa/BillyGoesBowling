import SpriteClass from '../engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class SpringClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.SPRING_HEIGHT=-80;
        
            // setup
            
        this.addImage('sprites/spring_close');
        this.setCurrentImage('sprites/spring_close');
        this.setEditorImage('sprites/spring_close');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=true;
        this.canRiseBlock=true;
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new SpringClass(this.game,x,y,this.data));
    }
    
    interactWithSprite(interactSprite,dataObj)
    {
            // is player standing on spring?
            
        if (!(interactSprite instanceof PlayerSideScrollClass)) return;
        if (interactSprite.standSprite!==this) return;
        
            // jump up
            
        interactSprite.motion.y=this.SPRING_HEIGHT;
        this.game.soundList.play('boing');
    }
    
    runAI()
    {
        // reset image here
    }
}
