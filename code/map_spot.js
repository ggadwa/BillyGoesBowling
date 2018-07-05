import EntityClass from '../engine/entity.js';
import PlayerWorldClass from './player_world.js';

export default class MapSpotClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('world_map_spot');
        this.setCurrentImage('world_map_spot');
        this.setEditorImage('world_map_spot');
        
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
        let input=game.getInput();
        
            // are we colliding with player?
            
        if (!game.getMap().getSpritePlayer().collide(this)) return;
            
            // change UI
            
        game.setBanner(this.getData('title'),-1);
        
            // if action, than jump to make
            
        if (input.isAction()) {
            game.gotoMap(this.getData('map'));
        }
    }

}
