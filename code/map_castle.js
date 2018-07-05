import EntityClass from '../engine/entity.js';
import PlayerWorldClass from './player_world.js';

export default class MapCastleClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('world_map_castle');
        this.setCurrentImage('world_map_castle');
        this.setEditorImage('world_map_castle');
        
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
            
        if (!game.getMap().getSpritePlayer().collide(this)) return;
            
            // change UI
            
        game.setBanner(this.getData('title'),this.getData('pin_count'));
    }
}
