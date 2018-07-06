import SpriteClass from '../engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapCastleClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_castle');
        this.setCurrentImage('sprites/world_map_castle');
        this.setEditorImage('sprites/world_map_castle');
        
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
        return(new MapCastleClass(this.game,x,y,this.data));
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
