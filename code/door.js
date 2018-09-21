import SpriteClass from '../engine/sprite.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class DoorClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/door');
        this.setCurrentImage('sprites/door');
        this.setEditorImage('sprites/door');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.background=true;           // a background sprite, draws in the same plane as the map
        
        Object.seal(this);
    }
    
    duplicate(x,y)
    {
        return(new DoorClass(this.game,x,y,this.data));
    }
    
    runAI()
    {
        let door;
        let playerSprite=this.game.map.getSpritePlayer();
        
            // select jumps to other door
            
        if (!this.game.input.isSelect()) return;
        
            // are we colliding with player?
            
        if (!playerSprite.collide(this)) return;
        
        door=this.game.map.getFirstSpriteWithData('name',this.getData('goto'));
        playerSprite.x=door.x;
        playerSprite.y=door.y;
        
        this.game.input.clearSelect();
        this.game.map.resetOffsetY();
    }
    
}
