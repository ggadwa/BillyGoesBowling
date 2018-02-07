import SpriteClass from '../engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapCastleClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.setCurrentImage(this.addImage('world_map_castle'));
        
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
            
        game.setBanner(this.getUserData().title);
    }
}
