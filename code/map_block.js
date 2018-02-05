import SpriteClass from '../engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapBlockClass extends SpriteClass
{
    constructor(game)
    {
        super(game);
        
        this.setCurrentImage(this.addImage('world_map_block'));
        
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
