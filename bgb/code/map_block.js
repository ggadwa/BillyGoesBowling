import SpriteClass from '../../rpjs/engine/sprite.js';
import PlayerWorldClass from './player_world.js';

export default class MapBlockClass extends SpriteClass
{
    constructor(game,x,y,data)
    {
        super(game,x,y,data);
        
        this.addImage('sprites/world_map_block');
        this.setCurrentImage('sprites/world_map_block');
        
        this.show=true;
        this.gravityFactor=0.0;
        this.gravityMinValue=0;
        this.gravityMaxValue=0;
        this.canCollide=true;
        this.canStandOn=false;
        
        this.layer=this.BACKGROUND_LAYER; // drawn in background

        Object.seal(this);
    }
}
