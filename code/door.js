import EntityClass from '../engine/entity.js';
import PlayerSideScrollClass from './player_sidescroll.js';

export default class DoorClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('door');
        this.setCurrentImage('door');
        this.setEditorImage('door');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=false;
        this.canStandOn=false;
        
        this.background=true;           // a background sprite, draws in the same plane as the map
        
        Object.seal(this);
    }
    
    runAI()
    {
        let game=this.getGame();
        
            // are we colliding with player?
            
        if (!game.getMap().checkCollision(this)) return;
        if (this.collideSprite===null) return;
        if (!(this.collideSprite instanceof PlayerSideScrollClass)) return;
            
            // change UI
            
    }
    
}
