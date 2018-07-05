import EntityClass from '../engine/entity.js';
import PlayerWorldClass from './player_world.js';

export default class MapBlockClass extends EntityClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('world_map_block');
        this.setCurrentImage('world_map_block');
        this.setEditorImage('world_map_block');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=false;
        
        this.background=true;           // a background sprite, draws in the same plane as the map

        Object.seal(this);
    }
}
